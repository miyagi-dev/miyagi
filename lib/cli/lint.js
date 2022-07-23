const path = require("path");
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
	global.app = await init(config);

	if (component) {
		await validateComponentMockData({
			component: path.relative(config.components.folder, component),
		});
	} else {
		await validateAllMockData();
	}
};

/**
 * @param {boolean} exitProcess
 */
async function validateAllMockData(exitProcess = true) {
	log("info", messages.linter.all.start);

	const promises = [];
	const components = Object.keys(global.state.partials).map((partial) =>
		getDirectoryPathFromFullTemplateFilePath(partial)
	);

	components.forEach(async (component) => {
		promises.push(
			new Promise((resolve, reject) => {
				validateComponentMockData({
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
				if (exitProcess) {
					process.exit(0);
				}
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
 * @param {string} obj.component
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
			messages.linter.component.start.replace("{{component}}", component)
		);
	}

	const data = await getComponentData(
		getTemplateFilePathFromDirectoryPath(component)
	);

	const results = validateMockData(
		getTemplateFilePathFromDirectoryPath(component),
		data
	);

	if (results.length === 0) {
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
			process.exit(0);
		} else {
			return {
				valid: false,
				type: results[0].type,
			};
		}
	}
}
