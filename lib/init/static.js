/**
 * Module for registering static files
 *
 * @module initStatic
 */

const path = require("path");
const express = require("express");
const config = require("../config.json");

function registerUserAssetFolder() {
	const { assets } = global.config;

	if (assets && assets.folder) {
		for (const folder of assets.folder) {
			global.app.use(
				path.join("/", folder),
				express.static(path.join(assets.root, folder))
			);
		}
	}
}

function registerThemeFavicon() {
	if (global.config.ui && global.config.ui.theme) {
		const file = global.config.ui.theme.favicon;

		if (file) {
			global.app.use(`/favicon.ico`, express.static(path.resolve(file)));
		}
	}
}

function registerThemeLogo() {
	const files = [
		global.config.ui.theme.light.logo,
		global.config.ui.theme.dark.logo,
	];

	files.forEach((file) => {
		if (file) {
			global.app.use(
				path.join("/", path.dirname(file)),
				express.static(path.resolve(path.dirname(file)))
			);
		}
	});
}

/**
 * @param {("css"|"js")} files - the type of user assets that should be registered
 */
function registerUserFiles(files) {
	const { assets } = global.config;

	if (assets) {
		for (const file of assets[files]) {
			const asset = files === "js" ? file.src : file;

			global.app.use(
				path.join("/", path.dirname(asset)),
				express.static(path.join(assets.root, path.dirname(asset)))
			);
		}
	}
}

function registerCustomPropertyFiles() {
	const { assets } = global.config;

	if (assets?.customProperties?.files) {
		for (const file of assets.customProperties.files) {
			global.app.use(
				path.join("/", path.dirname(path.join(assets.root, file))),
				express.static(path.dirname(path.join(assets.root, file)))
			);
		}
	}
}

/**
 * @param {string} nodeModule - node module path basename
 */
function registerNodeModule(nodeModule) {
	global.app.use(
		`/${config.projectName}/js`,
		express.static(path.resolve(`node_modules/${nodeModule}`))
	);
}

function registerAssetFolder() {
	const assetFolder =
		config.folders.assets[
			process.env.MIYAGI_DEVELOPMENT ? "development" : "production"
		];

	global.app.use(
		`/${config.projectName}`,
		express.static(path.join(__dirname, `../../${assetFolder}`))
	);
}

function registerUserComponentAssets() {
	global.app.use(express.static(global.config.components.folder));
}

module.exports = function initStatic() {
	registerThemeFavicon();
	registerThemeLogo();
	registerUserAssetFolder();
	registerUserFiles("css");
	registerUserFiles("js");
	registerUserComponentAssets();
	registerCustomPropertyFiles();
	registerNodeModule("socket.io/client-dist");
	registerNodeModule("axe-core");
	registerAssetFolder();
};
