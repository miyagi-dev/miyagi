const fs = require("fs");
const path = require("path");

const helpers = require("../helpers");

/**
 * @param {Array} menu
 * @param {boolean} isBuild
 * @returns {Array}
 */
module.exports = function getComponents(menu, isBuild) {
	if (!menu) return [];

	const components = [];

	const partials = Object.keys(global.state.partials || []);

	(function iterate(arr) {
		arr.forEach((entry) => {
			if (entry.shortPath && entry.normalizedShortPath) {
				const componentName = path.basename(entry.shortPath);
				const assetNames = {
					css: `${componentName}.miyagi.css`,
					js: `${componentName}.miyagi.js`,
				};

				components.push({
					shortPath: entry.shortPath,
					value: isBuild ? entry.normalizedShortPath : entry.shortPath,
					assets: {
						css: fs.existsSync(path.join(entry.fullPath, assetNames.css))
							? path.join(entry.shortPath, assetNames.css)
							: false,
						js: fs.existsSync(path.join(entry.fullPath, assetNames.js))
							? path.join(entry.shortPath, assetNames.js)
							: false,
					},
				});

				addToRoutes(
					{
						name: componentName,
						shortPath: entry.shortPath,
						fullPath: entry.fullPath,
					},
					partials
				);
			}

			if (entry.children && entry.children.length > 0) {
				iterate(entry.children);
			}
		});
	})(menu);

	return components;
};

/**
 * @param {object} item
 * @param {string} item.name
 * @param {string} item.shortPath
 * @param {string} item.fullPath
 * @param {Array} partials
 */
function addToRoutes({ name, shortPath, fullPath }, partials = []) {
	if (!global.state.routes.includes(shortPath)) {
		const fileName = `${path.basename(shortPath)}.${
			global.config.files.templates.extension
		}`;

		const tplShortPath = path.join(shortPath, fileName);
		const schemaFileName = `${global.config.files.schema.name}.${global.config.files.schema.extension}`;

		const component = {
			name,
			route: {
				default: global.config.isBuild
					? `component-${helpers.normalizeString(shortPath)}.html`
					: `/component?file=${shortPath}`,
				embedded: global.config.isBuild
					? `component-${helpers.normalizeString(shortPath)}-embedded.html`
					: `/component?file=${shortPath}&embedded=true`,
			},
			alias: path.relative("components", shortPath),
			paths: {
				dir: {
					full: fullPath,
					short: shortPath,
				},
				mocks: {
					full(fileType) {
						return path.join(
							fullPath,
							`${global.config.files.mocks.name}.${fileType}`
						);
					},
					short(fileType) {
						return path.join(
							shortPath,
							`${global.config.files.mocks.name}.${fileType}`
						);
					},
				},
				schema: {
					full: path.join(fullPath, schemaFileName),
					short: path.join(shortPath, schemaFileName),
				},
				docs: {
					full: path.join(fullPath, "README.md"),
					short: path.join(shortPath, "README.md"),
				},
			},
			type: "components",
		};

		if (partials.includes(path.relative("components", tplShortPath))) {
			component.paths.tpl = {
				short: tplShortPath,
				full: path.join(fullPath, fileName),
			};
		}

		global.state.routes.push(component);
	}
}
