import PATH from "path";

import * as helpers from "../helpers.js";

export const getMenu = (sourceTree) => {
	if (!sourceTree) return null;

	return getMenuItem(sourceTree, {});
};

/**
 * @param {object} sourceItem
 * @param {string} sourceItem.name
 * @param {string} sourceItem.type
 * @param {string} sourceItem.path
 * @param {Array} sourceItem.children
 * @param {object} item
 * @returns {object}
 */
function getMenuItem({ name, type, path, children }, item) {
	const shortPath = PATH.relative(
		process.cwd(),
		type === "file"
			? PATH.join(PATH.dirname(path), PATH.basename(path, PATH.extname(path)))
			: path,
	);

	item.topLevel = shortPath == global.config.docs.folder;
	item.id = shortPath;
	item.shortPath = shortPath;
	item.name = type === "file" ? PATH.basename(name, PATH.extname(name)) : name;
	item.type = type;
	item.section = "docs";
	item.route = {
		default: global.config.isBuild
			? `component-${helpers.normalizeString(shortPath)}.html`
			: `/component?file=${shortPath}`,
		embedded: global.config.isBuild
			? `component-${helpers.normalizeString(shortPath)}-embedded.html`
			: `/component?file=${shortPath}&embedded=true`,
	};

	/**
	 * if the current item in the tree is a directory, we check if any of
	 * its children is a README.md or index.md. In that case, we want
	 * this directory to be linked, not the file.
	 */
	if (item.type === "directory") {
		if (children) {
			const indexFile = children.find(
				(child) => child.name === "README.md" || child.name === "index.md",
			);

			item.isLink = !!indexFile;

			if (indexFile) {
				item.file = indexFile.path;
			}

			if (item.isLink) {
				addToRoutes(item);
			}
		}
	} else {
		item.isLink = true;
		item.shortPath = shortPath;
		item.file = path;

		addToRoutes(item);
	}

	if (children) {
		item.children = [];

		children.forEach((child) => {
			const fileName = PATH.basename(child.path);

			if (
				child.type === "directory" ||
				!["README.md", "index.md"].includes(fileName)
			) {
				item.children.push(getMenuItem(child, {}));
			}
		});
	}

	return item;
}

/**
 * @param {object} item
 * @param {string} item.name
 * @param {string} item.shortPath
 * @param {string} item.file
 * @param {string} item.route
 */
function addToRoutes({ name, shortPath, file, route }) {
	if (!global.state.routes.includes(shortPath)) {
		global.state.routes.push({
			name,
			route,
			paths: {
				dir: {
					full: file,
					short: shortPath,
				},
			},
			type: "docs",
		});
	}
}
