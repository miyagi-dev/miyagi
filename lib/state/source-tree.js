/**
 * Module for getting a source tree of the project
 * @module stateSourcetree
 */

import dirTree from "directory-tree";
import path from "path";
import { t } from "../i18n/index.js";
import log from "../logger.js";
import * as helpers from "../helpers.js";

/**
 * @returns {object} the source tree object
 */
export const getSourceTree = function () {
	const tree = {};
	const { files } = global.config;
	const sources = [];

	if (global.config.components?.folder) {
		sources.push({
			type: "components",
			dir: global.config.components.folder,
			extensions: new RegExp(
				`.(md|${files.css.extension}|${files.js.extension}|${
					files.mocks.extension[0]
				}|${files.mocks.extension[1]}|${
					files.schema.extension
				}|${helpers.getSingleFileExtension(files.templates.extension)})$`,
			),
			configStr: "components.folder",
		});
	}

	if (global.config.docs?.folder) {
		sources.push({
			type: "docs",
			dir: global.config.docs.folder,
			extensions: /\.md/,
			configStr: "docs.folder",
		});
	}

	sources.forEach(({ type, extensions, dir, configStr }) => {
		if (dir) {
			const exclude = [];

			const { ignores = [] } = global.config[type];
			for (const ignore of ignores) {
				exclude.push(new RegExp(ignore.replaceAll(/\./g, "\\.")));
			}

			const subTree = dirTree(path.join(process.cwd(), dir), {
				attributes: ["type"],
				extensions,
				exclude,
			});

			if (!subTree) {
				log(
					"warn",
					t("srcFolderNotFound")
						.replaceAll("{{directory}}", `./${dir}`)
						.replaceAll("{{type}}", type)
						.replaceAll("{{config}}", configStr),
				);
			}

			tree[type] = subTree;
		}
	});

	return tree || {};
};
