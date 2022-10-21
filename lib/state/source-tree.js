/**
 * Module for getting a source tree of the project
 *
 * @module stateSourcetree
 */

const dirTree = require("directory-tree");
const path = require("path");
const { t } = require("../i18n");
const log = require("../logger.js");
const helpers = require("../helpers.js");

/**
 * @returns {object} the source tree object
 */
function getSourceTree() {
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
				}|${helpers.getSingleFileExtension(files.templates.extension)})$`
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
						.replaceAll("{{config}}", configStr)
				);
			}

			tree[type] = subTree;
		}
	});

	return tree || {};
}

module.exports = {
	getSourceTree,
};
