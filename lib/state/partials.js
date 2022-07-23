/**
 * Module for getting all partials
 *
 * @module statePartials
 */

const path = require("path");
const { getFiles } = require("./helpers.js");
const helpers = require("../helpers.js");

/**
 * @param {object} dir - the directory in which to look for files
 * @returns {Promise} gets resolved with an array of path strings
 */
function getFilePaths(dir) {
	return new Promise((resolve) => {
		resolve(
			getFiles(
				dir === "" ? "/" : dir,
				global.config.components.ignores,
				function (res) {
					const { name, extension } = global.config.files.templates;
					if (path.basename(res).endsWith(`.${extension}`)) {
						const basename = path.basename(res, `.${extension}`);

						if (basename === helpers.getResolvedFileName(name, basename)) {
							return helpers.getShortPathFromFullPath(res);
						}

						return null;
					}

					return null;
				}
			)
		);
	});
}

module.exports = {
	getPartials: function () {
		return new Promise((resolve) => {
			const partials = {};

			getFilePaths(global.config.components.folder)
				.then((paths) => {
					if (paths) {
						for (const shortPath of paths) {
							// ignore files that live directly in the srcFolder
							if (shortPath !== path.basename(shortPath)) {
								partials[shortPath] = path.join(
									process.cwd(),
									`${global.config.components.folder}/${shortPath}`
								);
							}
						}
					}

					resolve(partials);
				})
				.catch((err) => console.error(err));
		});
	},
};
