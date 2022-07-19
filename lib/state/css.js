const fs = require("fs");
const css = require("css");
const deepMerge = require("deepmerge");
const path = require("path");
const log = require("../logger");
const { messages } = require("../config.json");

module.exports = function getCSS(app) {
	const { assets } = app.get("config");

	if (assets?.customProperties?.files) {
		const promises = [];

		let cssObject = {};

		assets.customProperties.files.forEach((file) => {
			promises.push(
				new Promise((resolve) => {
					fs.readFile(
						path.join(assets.root, file),
						{ encoding: "utf8" },
						(err, response) => {
							if (err) {
								resolve({});
								log(
									"warn",
									messages.customPropertyFileNotFound.replace(
										"{{filePath}}",
										file
									)
								);
							} else {
								resolve(css.parse(response));
							}
						}
					);
				})
			);
		});

		return Promise.all(promises).then((objects) => {
			objects.forEach((obj) => {
				cssObject = deepMerge(cssObject, obj);
			});

			return cssObject;
		});
	}

	return Promise.resolve(null);
};
