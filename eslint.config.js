import globals from "globals";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	{
		files: ["api/**", "bin/**", "lib/**", "index.js"],
		languageOptions: {
			sourceType: "module",
			globals: {
				...globals.node,
				global: true,
			},
		},
		plugins: {
			jsdoc,
		},
		rules: {
			...js.configs.recommended.rules,
			...jsdoc.configs["flat/recommended"].rules,
			"jsdoc/require-jsdoc": [
				"warn",
				{
					require: {
						MethodDefinition: true,
					},
				},
			],
			"jsdoc/require-param-description": "off",
			"jsdoc/require-returns-description": "off",
		},
	},

	// Component libary files
	{
		files: ["frontend/**"],
		ignores: [
			"frontend/assets/js/_prism.js",
			"frontend/assets/js/styleguide/color-converter.js",
		],
		languageOptions: {
			sourceType: "module",
			globals: {
				...globals.browser,
			},
		},
	},
];
