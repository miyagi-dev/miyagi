import en from "./en.js";

export const t = function (key) {
	const translations = {
		en,
	};

	let object = translations[global.config?.ui?.lang];

	if (!object) {
		object = translations.en;
	}

	return key.split(".").reduce((o, i) => o[i], object);
};

export const available = ["en"];
