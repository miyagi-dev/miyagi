import fs from "fs";
import path from "path";

import * as helpers from "../../helpers.js";
import { t } from "../../i18n/index.js";
import { extendTemplateData } from "../../render/helpers.js";
import { overwriteRenderKey } from "../resolve.js";

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<{ messages, data }>} the resolved value from the mock data object
 */
export const resolveTpls = async function (entry) {
	const messages = [];

	if (entry) {
		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry instanceof Map ||
			entry === null
		) {
			return {
				messages,
				data: entry,
			};
		}

		if (entry instanceof Array) {
			const o = [];

			for (const ent of entry) {
				const json = await resolve(ent);
				const result = await resolveTpls(json.data);

				o.push(result.data);

				for (const msg of [...json.messages, ...result.messages]) {
					if (msg) {
						messages.push(msg);
					}
				}
			}

			return {
				messages,
				data: o,
			};
		}

		const o = { ...entry };

		for (const key of Object.keys(o)) {
			const tpl = await resolve(o[key]);
			const tpls = await resolveTpls(tpl.data);

			for (const msg of [...tpl.messages, ...tpls.messages]) {
				if (msg) {
					messages.push(msg);
				}
			}

			o[key] = tpls.data;
		}

		return {
			messages,
			data: o,
		};
	}

	return {
		messages,
		data: entry,
	};
};

/**
 * @param {object|Array|string|boolean} entry
 * @returns {Promise<{ messages, data }>}
 */
async function resolve(entry) {
	const messages = [];

	if (entry !== null) {
		if (Array.isArray(entry)) {
			const arr = [];

			for (const ent of entry) {
				const result = await resolve(ent);

				arr.push(result.data);

				for (const msg of messages) {
					if (msg) {
						messages.push();
					}
				}
			}

			return {
				messages,
				data: arr,
			};
		}

		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry instanceof Map
		) {
			return {
				messages,
				data: entry,
			};
		}

		let entries = { ...entry };

		for (const [key, val] of Object.entries(entries)) {
			if (key !== "$tpl") {
				const result = await resolve(val);

				entries[key] = result.data;
			}
		}

		const result = await render(entries);

		return {
			messages: [...messages, ...result.messages],
			data: result.data,
		};
	}

	return {
		messages,
		data: entry,
	};
}

/**
 * @param {object|Array|string|boolean} entry
 * @returns {Promise<{ messages, data }>}
 */
async function render(entry) {
	const messages = [];

	if (entry.$tpl) {
		let data = { ...entry };
		delete data.$tpl;
		let filePath;
		let shortPath;
		let component;

		if (entry.$tpl.startsWith("@")) {
			const namespace = entry.$tpl.split("/")[0];
			const resolvedNamespace = global.config.namespaces[namespace];

			if (!resolvedNamespace) {
				return {
					messages: [
						{
							type: "warn",
							text: `Could not resolve namespace ${namespace}`,
						},
					],
					data: null,
				};
			}

			shortPath = helpers.getShortPathFromFullPath(
				path.join(
					process.cwd(),
					entry.$tpl.replace(namespace, resolvedNamespace),
				),
			);
		} else {
			shortPath = entry.$tpl;
		}

		component = global.state.routes.find(
			({ alias }) => alias === shortPath || `/${alias}` === shortPath,
		);

		if (!component) {
			messages.push({
				type: "error",
				text: t("templateDoesNotExist").replace("{{template}}", entry.$tpl),
			});

			return {
				messages,
				data: null,
			};
		}

		try {
			fs.statSync(component.paths.tpl.full);

			data = await extendTemplateData(global.config, data, component);

			return new Promise((resolve1) => {
				global.app.render(component.paths.tpl.full, data ?? {}, (err, html) => {
					if (err) {
						messages.push({
							type: "warn",
							text: t("renderingTemplateFailed").replace(
								"{{filePath}}",
								component.paths.tpl.short,
							),
						});
					}

					resolve1({
						messages,
						data: html,
					});
				});
			});
		} catch (err) {
			if (err.code === "ENOENT") {
				messages.push({
					type: "error",
					text: t("templateDoesNotExist").replace("{{template}}", filePath),
					verbose: err,
				});
				return {
					messages,
					data: null,
				};
			}
		}
	} else {
		return {
			messages,
			data: overwriteRenderKey(entry),
		};
	}
}
