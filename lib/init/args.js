/**
 * Module for printing and parsing CLI arguments
 * @module initArgs
 */

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export default yargs(hideBin(process.argv))
	.command("start", "Starts the miyagi server", {
		verbose: {
			description:
				"Logging additional information — helpful mainly in case of errors.",
			type: "boolean",
		},
	})
	.command("build", "Creates a static build of all your components", {
		folder: {
			description: "The folder where your static build files will be saved",
			type: "string",
		},
	})
	.command(
		"new",
		"Creates a new component folder (including template, mock, documentation, css and js files)",
		{
			skip: {
				description:
					"files that will not be created\n(comma separated list of css, docs, js, mocks, tpl)",
				type: "string",
			},
			only: {
				description:
					"tells miyagi to only created the passes file types\n(comma separated list of tpl, docs, data, css, js)",
				type: "string",
			},
		},
	)
	.command(
		"mocks",
		"Creates a mock data file with dummy content based on the schema file",
	)
	.command(
		"lint",
		"Validates if the component's mock data matches its JSON schema",
	)
	.help()
	.alias("help", "h")
	.alias("verbose", "v")
	.demandCommand()
	.epilogue(
		"Please check https://docs.miyagi.dev/configuration/options/ for all options",
	);
