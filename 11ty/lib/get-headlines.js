import fs from "node:fs";
import path from "node:path";

import MD from "./markdown.js";

export default function getHeadlines(inputPath) {
	const headlines = {
		h1: [],
		h2: [],
	};
	const fileContent = fs.readFileSync(
		path.join(process.cwd(), inputPath),
		"utf8",
	);
	const tokens = MD.parse(fileContent, {});

	Object.keys(headlines).forEach((headlineTag) => {
		const openingTokens = tokens.filter(
			(token) => token.tag === headlineTag && token.type === "heading_open",
		);

		openingTokens.forEach((openingToken) => {
			const openingTag = tokens.indexOf(openingToken);
			const id = openingToken.attrs.find((attr) => attr[0] === "id");

			headlines[headlineTag].push({
				content: tokens[openingTag + 1].children
					.filter((child) => ["text", "code_inline"].includes(child.type))
					.map((entry) => entry.content)
					.join(""),
				id: id ? id[1] : null,
			});
		});
	});

	return headlines;
}
