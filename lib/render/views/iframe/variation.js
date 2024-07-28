import path from "path";
import config from "../../../default-config.js";
import { t } from "../../../i18n/index.js";
import * as helpers from "../../../helpers.js";
import validateMocks from "../../../validator/mocks.js";
import { getVariationData } from "../../../mocks/index.js";
import { getThemeMode } from "../../helpers.js";
import { getDataForRenderFunction } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} [object.res] - the express response object
 * @param {object} object.component
 * @param {string} [object.variation] - the variation name
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 * @returns {Promise} gets resolved when the variation has been rendered
 */
export default async function renderIframeVariation({
	res,
	component,
	variation,
	cb,
	cookies,
}) {
	const data = await getVariationData(component, decodeURI(variation));
	const rawComponentData = (data && data.raw) ?? null;
	const componentData = (data && data.extended) ?? null;
	const themeMode = getThemeMode(cookies);
	const validatedMocks = validateMocks(component, [
		{
			data: componentData,
			name: variation,
		},
	]);

	let standaloneUrl;

	if (global.config.isBuild) {
		standaloneUrl = `component-${helpers.normalizeString(
			path.dirname(component.paths.tpl.short),
		)}-variation-${helpers.normalizeString(variation)}.html`;
	} else {
		standaloneUrl = `/component?file=${path.dirname(
			component.paths.tpl.short,
		)}&variation=${encodeURIComponent(variation)}`;
	}

	const mockValidation = validatedMocks
		? {
				valid: validatedMocks.length === 0,
				copy: t(
					`validator.mocks.${validatedMocks.length === 0 ? "valid" : "invalid"}`,
				),
			}
		: null;
	const fileContents = {
		mocks: {
			type: global.config.files.mocks.extension[0],
		},
	};

	return new Promise((resolve) => {
		global.app.render(
			component.paths.tpl.full,
			getDataForRenderFunction(componentData),
			async (result) => {
				if (res) {
					await res.render(
						"iframe_component_variation.twig",
						{
							html: result,
							standaloneUrl,
							miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
							prod: process.env.NODE_ENV === "production",
							projectName: config.projectName,
							isBuild: global.config.isBuild,
							theme: themeMode
								? Object.assign(global.config.ui.theme, { mode: themeMode })
								: global.config.ui.theme,
							mockData: JSON.stringify(rawComponentData),
							mockDataResolved: JSON.stringify(componentData),
							variation,
							normalizedVariation: helpers.normalizeString(variation),
							mockValidation,
							mocks: fileContents.mocks,
							uiTextDirection: global.config.ui.textDirection,
						},
						(html) => {
							if (res.send) {
								res.send(html);
							}

							if (cb) {
								cb(null, html);
							}
						},
					);

					resolve();
				} else {
					resolve(result);
				}
			},
		);
	});
}
