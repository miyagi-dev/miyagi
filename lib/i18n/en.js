export default {
	buildStarting: "Creating miyagi build…",
	buildDone: "Build done! Wrote {{count}} directories and files.",
	commandNotFound: "Please run `miyagi --help` for all available commands.",
	componentCouldNotBeRendered: "Component couldn't be rendered.",
	customPropertyFileNotFound:
		"Couldn't find file {{filePath}}. Is the 'assets.customProperties.files' in your configuration set correctly?",
	dataGenerator: {
		dataFileExists: "The mock file {{fileName}} exists already.",
		done: "Done!",
		noComponentFolderDefined: "No directory has been defined.",
		noSchemaFile: "miyagi can't find or parse the schema file {{fileName}}.",
		schemaFileCantBeParsed: "The schema file {{fileName}} can't be parsed.",
		starting: "Creating mock file {{fileName}}…",
	},
	jsonFileHasInvalidFormat:
		"It seems like the file {{filePath}} has an invalid format as miyagi was not able to parse it.",
	checkShellForFurtherErrors:
		"Please also check the messages printed by miyagi in your shell as there might be more information.",
	fileNotFound:
		"Couldn't find file {{filePath}}. Is the 'components.folder' in your configuration set correctly?",
	fileNotFoundLinkIncorrect:
		"Couldn't find mock data '{{filePath}}' referenced in {{component}}. Please check that it's linked correctly.",
	generator: {
		starting: "Creating component…",
		done: "Done!",
		noComponentNameDefined:
			"Please specify a component name like this: miyagi new directoryName/componentName",
		fileAlreadyExists: "The file {{name}} already exists.",
		component: {
			done: "Finished creating component {{component}}.",
		},
	},
	linter: {
		all: {
			start: "Validating schema files and mock data for all components…",
			valid: "All schema and mock data is valid!",
			schema: {
				invalid: {
					one: "1 schema file is invalid!",
					other: "{{amount}} schema files are invalid!",
				},
			},
			mocks: {
				invalid: {
					one: "1 mock data file is invalid!",
					other: "{{amount}} mock data files are invalid!",
				},
			},
		},
		component: {
			start: "Validating schema file and mock data for {{component}}…",
			valid: "Schema file and mock data is valid!",
		},
	},
	manifestNotFound: "Manifest file {{manifest}} not found or unparseable.",
	missingExtension:
		"Please specify the file extension of your template files in your config file (key: 'files.templates.extension', type: String) or as a cli argument (--files.templates.extension=<extension>).",
	noDataSetForVariation:
		'No mock data defined for variation "{{variation}}" in {{file}}.',
	noNameSetForVariation: "No name defined for variation {{i}} in {{file}}.",
	portInUse: "Port {{port}} already in use, trying to find a free port…",
	referencedMockFileNotFound: "Couldn't find referenced mock file.",
	renderingTemplateFailed:
		"Rendering {{filePath}} failed. Please check that it is linked correctly and that its content is correct syntax.",
	scanningFiles: "Scanning and analyzing files…",
	validator: {
		mocks: {
			valid: "Mock data matches schema.",
			invalid: "Mock data does not match schema file.",
			noSchemaFound:
				"No schema file found or the schema file could not be parsed as valid JSON.",
		},
	},
	serverStarted: "Running miyagi server at http://localhost:{{port}}",
	serverStarting: "Starting miyagi server in {{node_env}} mode…",
	settingEngineFailed:
		"Setting the template engine failed. Are you sure the engine defined in your config file is correct?",
	srcFolderNotFound:
		"The specified {{type}} directory '{{directory}}' does not seem to exist. You can specify this in your config file (key: '{{config}}', type: String) or as a cli argument (--{{config}}=<String>). If you do not have any {{type}}, you can also set the value to null.",
	templateDoesNotExist: "The template '{{template}}' can't be found.",
	updatingDone: "Updating done!",
	updatingConfiguration: "Updating configuration…",
	updatingConfigurationDone: "Reloading browser window!",
	updatingStarted: "A file has been changed, miyagi is updating the state.",
	userConfigUnparseable:
		"miyagi wasn't able to find or parse your config file. If you created a .miyagi.js or .miyagi.mjs, please check if its syntax is correct.",
	variationNotFound: 'Variation "{{variation}}" not found in {{fileName}}.',
	watchingFilesFailed: "Watching files failed.",
	wrongFileType: "{{fileName}} does not have the correct file type.",
};
