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
 * @param {object} app - the express instance
 * @returns {object} the source tree object
 */
function getSourceTree(app) {
	const exclude = [];

	const { ignores } = app.get("config").components;
	for (const ignore of ignores) {
		exclude.push(new RegExp(ignore));
	}

	const { files } = app.get("config");
	const tree = dirTree(
		path.join(process.cwd(), app.get("config").components.folder),
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
				app.get("config").components.folder
			)
		);
	}

	return tree || {};
}

module.exports = {
	getSourceTree,
};
