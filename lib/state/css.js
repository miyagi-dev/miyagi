const fs = require("fs");
const css = require("css");
const deepMerge = require("deepmerge");
const path = require("path");
const log = require("../logger");
const { t } = require("../i18n");

module.exports = function getCSS() {
	const { assets } = global.config;

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
									t("customPropertyFileNotFound").replace("{{filePath}}", file)
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
