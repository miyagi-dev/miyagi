import path from "node:path";

import getHeadlines from "../lib/get-headlines.js";

export default {
	layout() {
		return "layout.liquid";
	},
	eleventyNavigation(data) {
		const dirName = path.dirname(data.page.filePathStem);

		return {
			key: data.page.fileSlug,
			title: data.title,
			parent: dirName.length > 1 ? dirName.slice(1) : null,
			order: data.eleventyNavigation.order,
		};
	},
	title(data) {
		if (data.title) return data.title;

		const headlines = getHeadlines(data.page.inputPath);
		if (headlines.h1[0]) return headlines.h1[0].content;

		return data.page.fileSlug || data.project_name;
	},
};
