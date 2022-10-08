/**
 * Module for getting a source tree of the project
 *
 * @module stateSourcetree
 */

const dirTree = require("directory-tree");
const path = require("path");
const config = require("../config.json");
const log = require("../logger.js");
const helpers = require("../helpers.js");

/**
 * @returns {object} the source tree object
 */
function getSourceTree() {
	const tree = {};
	const { files } = global.config;

	[
		{
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
		},
		{
			type: "docs",
			dir: global.config.docs.folder,
			extensions: /\.md/,
			configStr: "docs.folder",
		},
	].forEach(({ type, extensions, dir, configStr }) => {
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
					config.messages.srcFolderNotFound
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
