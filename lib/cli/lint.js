const path = require("path");
const init = require("./app");
const getConfig = require("../config");
const log = require("../logger");
const { getComponentData } = require("../mocks");
const validateMockData = require("../validator/mocks");
const { t } = require("../i18n");

/**
 * @param {Array} args
 */
module.exports = async function lint(args) {
	process.env.NODE_ENV = "development";

	const componentArg = args._.slice(1)[0];
	const config = getConfig(args);
	global.app = await init(config);

	if (componentArg) {
		const component = global.state.routes.find(
			({ alias }) =>
				alias === path.relative(config.components.folder, componentArg)
		);

		if (component) {
			await validateComponentMockData({
				component,
			});
		} else {
			log("error", `The component ${componentArg} does not seem to exist.`);
			process.exit(1);
		}
	} else {
		await validateAllMockData();
	}
};

/**
 * @param {boolean} exitProcess
 */
async function validateAllMockData(exitProcess = true) {
	log("info", t("linter.all.start"));

	const promises = [];

	global.state.routes.forEach((route) => {
		if (route.type === "components") {
			promises.push(
				new Promise((resolve, reject) => {
					validateComponentMockData({
						component: route,
						silent: true,
						exitProcess: false,
					})
						.then((result) => resolve(result))
						.catch((err) => {
							console.error(err);
							reject();
						});
				})
			);
		}
	});

	Promise.all(promises)
		.then((results) => {
			const mockInvalidResults = results.filter(
				(result) => result?.valid === false && result.type === "mocks"
			);
			const schemaInvalidResults = results.filter(
				(result) => result?.valid === false && result.type === "schema"
			);

			if (
				mockInvalidResults.length === 0 &&
				schemaInvalidResults.length === 0
			) {
				log("success", t("linter.all.valid"));
				if (exitProcess) {
					process.exit(0);
				}
			}

			if (schemaInvalidResults.length > 0) {
				log(
					"error",
					schemaInvalidResults.length === 1
						? t("linter.all.schema.invalid.one")
						: t("linter.all.schema.invalid.other").replace(
								"{{amount}}",
								schemaInvalidResults.length
						  )
				);
			}

			if (mockInvalidResults.length > 0) {
				log(
					"error",
					mockInvalidResults.length === 1
						? t("linter.all.mocks.invalid.one")
						: t("linter.all.mocks.invalid.other").replace(
								"{{amount}}",
								mockInvalidResults.length
						  )
				);
			}

			if (exitProcess) {
				process.exit(1);
			}
		})
		.catch((err) => {
			console.error(err);
			if (exitProcess) {
				process.exit(1);
			}
		});
}

/**
 * @param {object} obj
 * @param {object} obj.component
 * @param {boolean} [obj.silent]
 * @param {boolean} [obj.exitProcess]
 * @returns {boolean}
 */
async function validateComponentMockData({
	component,
	silent,
	exitProcess = true,
}) {
	if (!silent) {
		log(
			"info",
			t("linter.component.start").replace(
				"{{component}}",
				component.paths.dir.short
			)
		);
	}

	const data = await getComponentData(component);

	if (data) {
		const results = validateMockData(component, data);

		if (results.length === 0) {
			if (!silent) {
				log("success", t("linter.component.valid"));
			}

			if (exitProcess) {
				process.exit(0);
			} else {
				return {
					valid: true,
				};
			}
		} else {
			if (exitProcess) {
				process.exit(0);
			} else {
				return {
					valid: false,
					type: results[0].type,
				};
			}
		}
	}

	return null;
}
