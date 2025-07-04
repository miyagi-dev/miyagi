import navigationPlugin from "@11ty/eleventy-navigation";
import syntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import { IdAttributePlugin } from "@11ty/eleventy";
import jsdom from "jsdom";
import path from "node:path";
import fs from "node:fs";

const { JSDOM } = jsdom;

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
	eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addGlobalData(
		"version",
		JSON.parse(fs.readFileSync("../package.json")).version,
	);

	eleventyConfig.addTransform("toc", function (content) {
		if (this.page.fileSlug !== "options") return content;

		const { document } = new JSDOM(content).window;
		const headings = Array.from(
			document.querySelectorAll("h2, h3, h4, h5, h6"),
		).map((heading) => {
			return {
				el: heading,
				id: heading.id,
				text: heading.textContent,
				level: heading.tagName.slice(-1),
				children: [],
			};
		});

		const arr = {
			children: [],
		};

		let prev;
		let parent;

		function goUp(prev, levels) {
			let current = prev;
			for (let i = 0; i < levels; i++) {
				if (!current.parent) return arr;

				current = current.parent;
			}

			return current;
		}

		headings.forEach((heading, i) => {
			if (!prev) {
				arr.children.push({
					...heading,
					parent: arr,
				});
				prev = { ...heading, parent: arr };
				parent = arr;
				return;
			}

			if (prev.level < heading.level) {
				parent = prev;
			} else if (prev.level === heading.level) {
				parent = prev.parent;
			} else if (prev.level > heading.level) {
				parent = goUp(prev, prev.level - heading.level).parent;
			}

			const o = {
				...heading,
				parent,
			};

			parent.children.push(o);
			prev = o;
		});

		const toc = document.createElement("ul");
		toc.classList.add("TOC");

		(function iterate(children, list) {
			children.forEach((child) => {
				const li = document.createElement("li");
				const a = document.createElement("a");
				a.textContent = child.text;
				a.href = `#${child.id}`;
				li.appendChild(a);
				list.appendChild(li);

				if (child.children.length > 0) {
					const ul = document.createElement("ul");
					li.appendChild(ul);
					iterate(child.children, ul);
				}
			});
		})(arr.children, toc);

		document.querySelector("h1")?.after(toc);

		return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
	});

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
