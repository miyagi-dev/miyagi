const en = require("./en");

module.exports.t = function (key) {
	const translations = {
		en,
	};

	let object = translations[global.config?.ui?.lang];

	if (!object) {
		object = translations.en;
	}

	return key.split(".").reduce((o, i) => o[i], object);
};

module.exports.available = ["en"];
