/**
 * Module for saving all relevant data
 *
 * @module state
 */

const { getPartials } = require("./partials.js");
const { getFileContents } = require("./file-contents.js");
const getCSS = require("./css");
const { getMenu } = require("./menu");
const getComponents = require("./components");
const { getSourceTree } = require("./source-tree.js");
const initStatic = require("../init/static");

/**
 * @param {object} methods - object with keys defining what should be set
 * @param {object} state - the state object
 * @returns {Promise} gets resolved after the state has been updated
 */
function setSourceTreeAndMenu(methods, state) {
	return new Promise((resolve) => {
		if (methods.sourceTree) {
			state.sourceTree = getSourceTree();
		}

		global.state = state;

		if (methods.menu) {
			state.menu = getMenu();
			state.components = getComponents(state.menu, global.config.isBuild);
			resolve();
		} else {
			resolve();
		}
	});
}

module.exports = async function setState(methods) {
	const promises = [];
	const state = global.state || {};

	if (methods.fileContents) {
		if (typeof methods.fileContents === "object") {
			state.fileContents = methods.fileContents;

			promises.push(
				new Promise((resolve, reject) => {
					setSourceTreeAndMenu(methods, state)
						.then(resolve)
						.catch((err) => {
							console.error(err);
							reject();
						});
				})
			);
		} else {
			promises.push(
				new Promise((resolve, reject) => {
					getFileContents()
						.then((data) => {
							state.fileContents = data;

							setSourceTreeAndMenu(methods, state)
								.then(resolve)
								.catch((err) => {
									console.error(err);
									reject();
								});
						})
						.catch((err) => {
							console.error(err);
							reject();
						});
				})
			);
		}
	} else {
		promises.push(
			new Promise((resolve, reject) => {
				setSourceTreeAndMenu(methods, state).then(resolve).catch(reject);
			})
		);
	}

	if (methods.partials) {
		promises.push(
			new Promise((resolve, reject) => {
				getPartials()
					.then((result) => {
						state.partials = result;
						resolve();
					})
					.catch(reject);
			})
		);
	}

	if (methods.css) {
		promises.push(
			new Promise((resolve, reject) => {
				getCSS()
					.then((result) => {
						state.css = result;
						resolve();
					})
					.catch(reject);
			})
		);
	}

	return Promise.all(promises)
		.then(() => {
			global.state = state;
			initStatic();
			return state;
		})
		.catch(() => {});
};
