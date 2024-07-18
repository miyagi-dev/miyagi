const css = require("css");
const deepMerge = require("deepmerge");
const log = require("../logger");
const { t } = require("../i18n");

module.exports = function getCSS(fileContents) {
	const { assets } = global.config;
	let cssObject = {};

	if (assets?.customProperties?.files.length > 0) {
		if (assets.customProperties.files.length > 1) {
			cssObject = deepMerge.all(
				assets.customProperties.files.map((file) => {
					const fileContent = fileContents[file];

					if (fileContent) {
						return css.parse(fileContent);
					}

					log(
						"warn",
						t("customPropertyFileNotFound").replace("{{filePath}}", file),
					);
					return {};
				}),
			);
		} else {
			const fileContent = fileContents[assets.customProperties.files[0]];

			if (fileContent) {
				return css.parse(fileContents[assets.customProperties.files[0]]);
			}

			log(
				"warn",
				t("customPropertyFileNotFound").replace(
					"{{filePath}}",
					assets.customProperties.files[0],
				),
			);
			return {};
		}
	}

	return cssObject;
};
