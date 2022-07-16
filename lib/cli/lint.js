const init = require("./app");
const getConfig = require("../config");
const log = require("../logger");
const { getComponentData } = require("../mocks");
const {
	getDirectoryPathFromFullTemplateFilePath,
	getTemplateFilePathFromDirectoryPath,
} = require("../helpers");
const validateMockData = require("../validator/mocks");
const { messages } = require("../config.json");

/**
 * @param {Array} args
 */
module.exports = async function lint(args) {
	process.env.NODE_ENV = "development";

	const component = args._.slice(1)[0];
	const config = getConfig(args);
	const app = await init(config);

	if (component) {
		await validateComponentMockData({ app, component });
	} else {
		await validateAllMockData(app);
	}
};

/**
 * @param {object} app
 */
async function validateAllMockData(app) {
	log("info", messages.linter.all.start);

	const promises = [];
	const components = Object.keys(app.get("state").partials).map((partial) =>
		getDirectoryPathFromFullTemplateFilePath(app, partial)
	);

	components.forEach(async (component) => {
		promises.push(
			new Promise((resolve, reject) => {
				validateComponentMockData({
					app,
					component,
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
				log("success", messages.linter.all.valid);
				process.exit(0);
			}

			if (schemaInvalidResults.length > 0) {
				log(
					"error",
					schemaInvalidResults.length === 1
						? messages.linter.all.schema.invalid.one
						: messages.linter.all.schema.invalid.other.replace(
								"{{amount}}",
								schemaInvalidResults.length
						  )
				);
			}

			if (mockInvalidResults.length > 0) {
				log(
					"error",
					mockInvalidResults.length === 1
						? messages.linter.all.mocks.invalid.one
						: messages.linter.all.mocks.invalid.other.replace(
								"{{amount}}",
								mockInvalidResults.length
						  )
				);
			}

			process.exit(1);
		})
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
}

/**
 * @param {object} obj
 * @param {object} obj.app
 * @param {string} obj.component
 * @param {boolean} [obj.silent]
 * @param {boolean} [obj.exitProcess]
 * @returns {boolean}
 */
async function validateComponentMockData({
	app,
	component,
	silent,
	exitProcess = true,
}) {
	if (!silent) {
		log(
			"info",
			messages.linter.component.start.replace("{{component}}", component)
		);
	}

	const data = await getComponentData(
		app,
		getTemplateFilePathFromDirectoryPath(app, component)
	);
	const results = validateMockData(
		app,
		getTemplateFilePathFromDirectoryPath(app, component),
		data
	);

	if (typeof results === "string") {
		if (exitProcess) {
			process.exit(1);
		} else {
			return {
				valid: false,
				type: "schema",
			};
		}
	} else if (Array.isArray(results)) {
		if (!results.includes(false)) {
			if (!silent) {
				log("success", messages.linter.component.valid);
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
				process.exit(1);
			} else {
				return {
					valid: false,
					type: "mocks",
				};
			}
		}
	} else {
		if (exitProcess) {
			process.exit(1);
		} else {
			return null;
		}
	}
}
