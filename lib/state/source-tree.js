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
	const exclude = [];

	const { ignores } = global.config.components;
	for (const ignore of ignores) {
		exclude.push(new RegExp(ignore));
	}

	const { files } = global.config;
	const tree = dirTree(
		path.join(process.cwd(), global.config.components.folder),
		{
			attributes: ["type"],
			extensions: new RegExp(
				`.(md|${files.css.extension}|${files.js.extension}|${
					files.mocks.extension[0]
				}|${files.mocks.extension[1]}|${
					files.schema.extension
				}|${helpers.getSingleFileExtension(files.templates.extension)})$`
			),
			exclude,
		}
	);

	if (!tree) {
		log(
			"error",
			config.messages.srcFolderNotFound.replace(
				"{{directory}}",
				global.config.components.folder
			)
		);
	}

	return tree || {};
}

module.exports = {
	getSourceTree,
};
