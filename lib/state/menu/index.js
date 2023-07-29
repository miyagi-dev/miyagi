/**
 * Module for creating a menu object
 *
 * @module stateMenu
 */

const path = require("path");
const getSourceStructure = require("./structure.js");
const helpers = require("../../helpers.js");
const { getMenu: getDocsMenu } = require("../docs");

/**
 * @param {object} directory - file tree object
 * @returns {Array} file tree object of the component file in the given directory
 */
function getComponentFiles(directory) {
	return directory.children.filter((child) => {
		const baseName =
			global.config.files.templates.name === "<component>"
				? child.name.replace(`.${global.config.files.templates.extension}`, "")
				: global.config.files.templates.name;

		if (helpers.docFileIsIndexFile(child.path)) return true;

		if (helpers.fileIsTemplateFile(child.name)) {
			if (
				global.config.files.templates.name === "<component>" &&
				directory.name === baseName
			)
				return true;

			if (global.config.files.templates.name === baseName) return true;
		}

		return false;
	});
}

/**
 * @param {object} directory - file tree object
 * @returns {boolean} returns true if the given directory has a component file with the same name
 */
function hasComponentFileWithCorrectNameAsChild(directory) {
	return (
		directory.children &&
		directory.children.length &&
		getComponentFiles(directory).length > 0
	);
}

/**
 * @param {object} directory - file tree object
 * @returns {object} adapted file tree object
 */
function getDataForLinkedDirectory(directory) {
	const shortPath = path.join(
		"components",
		helpers.getShortPathFromFullPath(directory.path)
	);
	const normalizedShortPath = helpers.normalizeString(shortPath);
	const name = directory.name.replaceAll("-", " ");

	return {
		type: directory.type,
		name,
		fullPath: directory.path,
		shortPath,
		normalizedShortPath,
		url: global.config.isBuild
			? `/component-${normalizedShortPath}-embedded.html`
			: `/component?file=${shortPath}&embedded=true`,
		variations:
			directory.variations.map((variation) => {
				const normalizedName = helpers.normalizeString(variation.name);

				return {
					...variation,
					normalizedName,
					parentShortPath: shortPath,
					url: global.config.isBuild
						? `component-${normalizedShortPath}-variation-${normalizedName}-embedded.html`
						: `/component?file=${shortPath}&variation=${encodeURIComponent(
								variation.name
						  )}&embedded=true`,
				};
			}) || [],
		index: directory.index,
		id: normalizedShortPath,
	};
}

/**
 * @param {object} file
 * @returns {object}
 */
function getDataForDocumentationFile(file) {
	const shortPath = path.join(
		"components",
		helpers.getShortPathFromFullPath(file.path).replace(".md", "")
	);
	const normalizedShortPath = helpers.normalizeString(shortPath);

	return {
		type: file.type,
		name: path
			.basename(file.name, ".md")
			.replaceAll("-", " ")
			.replaceAll("_", " "),
		fullPath: file.path,
		shortPath,
		normalizedShortPath,
		url: global.config.isBuild
			? `/component-${normalizedShortPath}-embedded.html`
			: `/component?file=${shortPath}&embedded=true`,
		index: file.index,
		id: normalizedShortPath,
	};
}

/**
 * @param {object} directory - file tree object
 * @returns {object} adapted file tree object
 */
function getDataForDirectory(directory) {
	const shortPath = path.join(
		"components",
		path.relative(
			path.join(process.cwd(), global.config.components.folder),
			directory.path
		)
	);

	return {
		topLevel: true,
		type: directory.type,
		name: directory.name.replaceAll("-", " "),
		fullPath: directory.path,
		shortPath,
		index: directory.index,
		id: helpers.normalizeString(shortPath),
	};
}

/**
 * @param {object} directory - file tree object
 * @returns {object} adapted file tree object
 */
function restructureDirectory(directory) {
	let item;

	if (hasComponentFileWithCorrectNameAsChild(directory)) {
		item = getDataForLinkedDirectory(directory);
	} else {
		item = getDataForDirectory(directory);
	}

	return item;
}

/**
 * @param {object} item - file tree object
 * @returns {boolean} returns true if the given file tree object has children
 */
function hasChildren(item) {
	return item.children && item.children.length > 0;
}

/**
 * @param {object} sourceTree
 * @returns {object[]} array with adapted menu items
 */
function getMenu(sourceTree) {
	const srcStructure = getSourceStructure();
	const arr = [];
	let componentsMenu;

	(function restructure(structure, array) {
		for (const item of structure) {
			if (item.type === "directory") {
				const restructured = restructureDirectory(item);

				if (hasChildren(item)) {
					restructured.children = [];
					restructure(item.children, restructured.children);

					if (restructured.children.length === 0) {
						delete restructured.children;
					}

					if (restructured.children) {
						restructured.children.sort(function (a, b) {
							const nameA = a.name.toLowerCase();
							const nameB = b.name.toLowerCase();

							if (nameA < nameB) return -1;
							if (nameA > nameB) return 1;

							return 0;
						});
					}
				}
				array.push(restructured);
			} else if (
				helpers.fileIsDocumentationFile(item.path) &&
				!item.path.endsWith("index.md") &&
				!item.path.endsWith("README.md") &&
				path.basename(item.path, ".md") !==
					path.dirname(item.path).split("/")[
						path.dirname(item.path).split("/").length - 1
					]
			) {
				array.push(getDataForDocumentationFile(item));
			}
		}
	})(srcStructure, arr);

	if (arr.length > 0) {
		componentsMenu = {
			topLevel: true,
			name: "components",
			type: "directory",
			shortPath: "components",
			file: null,
			children: arr,
			id: "components",
		};
	}

	const docsMenu = getDocsMenu(sourceTree.docs);
	const designTokensMenu = getDesignTokensMenu();

	if (!docsMenu && !designTokensMenu && componentsMenu)
		return componentsMenu.children;

	const menus = [];
	if (designTokensMenu) menus.push(designTokensMenu);
	if (componentsMenu) menus.push(componentsMenu);
	if (docsMenu) menus.push(docsMenu);

	return menus;
}

function getDesignTokensMenu() {
	if (global.config.assets.customProperties.files.length === 0) return null;

	return {
		topLevel: true,
		name: "Design Tokens",
		id: "design-tokens",
		type: "directory",
		shortPath: "design-tokens",
		children: [
			{
				section: "design-tokens",
				type: "file",
				name: "colors",
				url: global.config.isBuild
					? "iframe-design-tokens-colors.html"
					: "/iframe/design-tokens/colors",
			},
			{
				section: "design-tokens",
				type: "file",
				name: "sizes",
				url: global.config.isBuild
					? "iframe-design-tokens-sizes.html"
					: "/iframe/design-tokens/sizes",
			},
			{
				section: "design-tokens",
				type: "file",
				name: "typography",
				url: global.config.isBuild
					? "iframe-design-tokens-typography.html"
					: "/iframe/design-tokens/typography",
			},
		],
	};
}

module.exports = {
	getMenu,
};
