import navigationPlugin from "@11ty/eleventy-navigation";
import EleventyNavigation from "@11ty/eleventy-navigation";
import syntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import path from "node:path";
import fs from "node:fs";

export default function (eleventyConfig) {
	const input = "../docs";
	const output = "./_site";

	eleventyConfig.addPassthroughCopy("css/pico.conditional.min.css");
	eleventyConfig.addPassthroughCopy("css/prism-light.css");
	eleventyConfig.addPassthroughCopy("css/prism-dark.css");
	eleventyConfig.addPassthroughCopy("css/base.css");

	// PLUGINS
	eleventyConfig.addPlugin(navigationPlugin);
	eleventyConfig.addPlugin(syntaxHighlightPlugin);
	eleventyConfig.addPlugin(EleventyNavigation);

	eleventyConfig.addGlobalData(
		"version",
		JSON.parse(fs.readFileSync("../package.json")).version,
	);

	return {
		dir: {
			input,
			output,
			data: path.relative("../docs", path.join(import.meta.dirname, "_data")),
			includes: path.relative(
				"../docs",
				path.join(import.meta.dirname, "_includes"),
			),
		},
	};
}
