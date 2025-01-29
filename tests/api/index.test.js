import {
	describe,
	test,
	expect,
	beforeAll,
	afterAll,
	beforeEach,
	afterEach,
} from "vitest";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import defaultConfig from "../../lib/default-config.js";

import {
	getMockData,
	getHtml,
	createBuild,
	createMockData,
	createComponent,
	lintComponents,
	lintComponent,
} from "../../api/index.js";

const RESPONSES = {
	card: [
		{
			type: "mocks",
			variant: "invalid mocks",
			data: [
				{
					instancePath: "",
					keyword: "additionalProperties",
					message: "must NOT have additional properties",
					params: {
						additionalProperty: "additionalProperty",
					},
					schemaPath: "#/additionalProperties",
				},
				{
					instancePath: "/content",
					keyword: "type",
					message: "must be string",
					params: {
						type: "string",
					},
					schemaPath: "#/properties/content/type",
				},
			],
		},
	],
	icon: [
		{
			data: [
				{
					message:
						"Error: schema is invalid: data/properties/content/type must be equal to one of the allowed values, data/properties/content/type must be array, data/properties/content/type must match a schema in anyOf",
				},
			],
			type: "schema",
		},
	],
	image: [
		{
			data: [
				{
					message:
						"Error: schema is invalid: data/properties/src/type must be equal to one of the allowed values, data/properties/src/type must be array, data/properties/src/type must match a schema in anyOf",
				},
			],
			type: "schema",
		},
	],
};

beforeAll(() => (process.env.MIYAGI_JS_API = true));
afterAll(() => (process.env.MIYAGI_JS_API = false));

describe("getMockData", () => {
	describe("without passing a component name", () => {
		test("returns success: false", async () => {
			expect(await getMockData()).toStrictEqual({
				success: false,
				message:
					'Please pass a component to `getMockData` ({ component: "name" }).',
			});
		});
	});

	describe("using non-existent component", () => {
		test("returns success: false", async () => {
			expect(await getMockData({ component: "non-existent" })).toStrictEqual({
				success: false,
				message: 'Component "non-existent" does not exist.',
			});
		});
	});

	describe("using non-existent variant", () => {
		test("returns success: false", async () => {
			expect(
				await getMockData({ component: "button", variant: "non-existent" }),
			).toStrictEqual({
				success: false,
				message:
					'No mock data found for component "button", variant "non-existent".',
			});
		});
	});

	describe("without a variant", () => {
		test("returns the correct resolved default mock data", async () => {
			expect(await getMockData({ component: "button" })).toStrictEqual({
				success: true,
				data: {
					label: "Button label",
				},
			});
		});
	});

	describe("with a variant", () => {
		test("returns the correct resolved variant mock data", async () => {
			expect(
				await getMockData({ component: "button", variant: "variant" }),
			).toStrictEqual({
				success: true,
				data: {
					label: "Button label variant",
				},
			});
		});
	});
});

describe("getHtml", () => {
	describe("without passing a component name", () => {
		test("returns success: false", async () => {
			expect(await getHtml()).toStrictEqual({
				success: false,
				message:
					'Please pass a component to `getHtml` ({ component: "name" }).',
			});
		});
	});

	describe("using non-existent component", () => {
		test("returns success: false", async () => {
			expect(await getHtml({ component: "non-existent" })).toStrictEqual({
				success: false,
				message: 'Component "non-existent" does not exist.',
			});
		});
	});

	describe("using non-existent variant", () => {
		test("returns success: false", async () => {
			expect(
				await getHtml({ component: "button", variant: "non-existent" }),
			).toStrictEqual({
				success: false,
				message:
					'No mock data found for component "button", variant "non-existent".',
			});
		});
	});

	describe("without a variant", () => {
		test("returns the correct HTML", async () => {
			expect(await getHtml({ component: "button" })).toStrictEqual({
				success: true,
				data: "<button>Button label</button>\n",
			});
		});
	});

	describe("with a variant", () => {
		test("returns the correct HTML", async () => {
			expect(
				await getHtml({ component: "button", variant: "variant" }),
			).toStrictEqual({
				success: true,
				data: "<button>Button label variant</button>\n",
			});
		});
	});
});

describe("createBuild", () => {
	test("creates static HTML files and logs a success message", async () => {
		// Removing the build directory in case it exists
		// to make sure we have a clean state
		rmSync(defaultConfig.defaultUserConfig.build.folder, {
			recursive: true,
			force: true,
		});

		expect(await createBuild()).toStrictEqual({
			success: true,
			message: "Build done! Wrote 77 directories and files.",
		});

		[
			"component-all-embedded.html",
			"component-all.html",
			"component-anchor-embedded.html",
			"component-anchor-variation-default-embedded.html",
			"component-anchor-variation-default.html",
			"design-tokens-colors.html",
			"design-tokens-sizes.html",
			"design-tokens-typography.html",
			"iframe-design-tokens-colors-embedded.html",
			"iframe-design-tokens-colors.html",
			"iframe-design-tokens-sizes-embedded.html",
			"iframe-design-tokens-sizes.html",
			"iframe-design-tokens-typography-embedded.html",
			"iframe-design-tokens-typography.html",
			"index.html",
			"show-anchor-variation-default.html",
			"show-anchor.html",
		].forEach((fileName) =>
			expect(
				existsSync(
					path.join(defaultConfig.defaultUserConfig.build.folder, fileName),
				),
			).toBe(true),
		);

		// Just cleaning up
		rmSync(defaultConfig.defaultUserConfig.build.folder, {
			recursive: true,
		});
	});
});

describe("createMockData", () => {
	const componentsPath = path.join(
		import.meta.dirname,
		"..",
		"_setup",
		"components",
	);

	describe("with valid component and existing valid schema", () => {
		test("creates a mock file and returns success: true", async () => {
			const component = "teaser";

			// Removing the build directory in case it exists
			// to make sure we have a clean state
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});

			expect(await createMockData({ component })).toStrictEqual({
				success: true,
			});

			// Just cleaning up
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});
		});
	});

	describe("without component", () => {
		test("returns success: false", async () => {
			expect(await createMockData({})).toStrictEqual({
				success: false,
				message: "No directory has been defined.",
			});
		});
	});

	describe("with invalid component", () => {
		test("returns success: false", async () => {
			const component = "non-existent";

			// Removing the build directory in case it exists
			// to make sure we have a clean state
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});

			expect(await createMockData({ component })).toStrictEqual({
				success: false,
				message:
					"miyagi can't find or parse the schema file tests/_setup/components/non-existent/schema.json.",
			});

			// Just cleaning up
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});
		});
	});

	describe("with valid component, but non-existent schema", () => {
		test("returns success: false", async () => {
			const component = "anchor";

			// Removing the build directory in case it exists
			// to make sure we have a clean state
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});

			expect(await createMockData({ component })).toStrictEqual({
				success: false,
				message:
					"miyagi can't find or parse the schema file tests/_setup/components/anchor/schema.json.",
			});

			// Just cleaning up
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});
		});
	});

	describe("with valid component, but invalid schema", () => {
		test("returns success: true", async () => {
			const component = "image";

			// Removing the build directory in case it exists
			// to make sure we have a clean state
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});

			expect(await createMockData({ component })).toStrictEqual({
				success: true,
			});

			// Just cleaning up
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});
		});
	});

	describe("with valid component, but unparseable schema", () => {
		test("returns success: true", async () => {
			const component = "video";

			// Removing the build directory in case it exists
			// to make sure we have a clean state
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});

			expect(await createMockData({ component })).toStrictEqual({
				success: false,
				message:
					"miyagi can't find or parse the schema file tests/_setup/components/video/schema.json.",
			});

			// Just cleaning up
			rmSync(path.join(componentsPath, component, "mocks.json"), {
				force: true,
			});
		});
	});

	describe("with valid component, but the mock file exists already", () => {
		test("returns success: false", async () => {
			expect(await createMockData({ component: "button" })).toStrictEqual({
				success: false,
				message:
					"The mock file tests/_setup/components/button/mocks.json exists already.",
			});
		});
	});
});

describe("createComponent", () => {
	const componentName = "test";
	const componentPath = path.join(
		import.meta.dirname,
		"..",
		"_setup",
		"components",
		componentName,
	);

	beforeEach(() => {
		// Removing the directory in case it exists
		// to make sure we have a clean state
		rmSync(componentPath, {
			recursive: true,
			force: true,
		});
	});

	afterEach(() => {
		// Just cleaning up
		rmSync(componentPath, {
			recursive: true,
		});
	});

	describe("without the `only` param", () => {
		test("writes all component files", async () => {
			expect(await createComponent({ component: componentName })).toStrictEqual(
				{
					success: true,
					message: `Finished creating component ${path.relative(process.cwd(), componentPath)}.`,
				},
			);
			[
				"index.css",
				"index.js",
				"mocks.json",
				"README.md",
				"schema.json",
				"test.twig",
			].forEach((fileName) =>
				expect(existsSync(path.join(componentPath, fileName))).toBe(true),
			);
		});
	});

	describe("with the `only` param", () => {
		test("only writes the given files for the given component (ignoring invalid file values)", async () => {
			expect(
				await createComponent({
					component: componentName,
					only: ["tpl", "docs", "schema", "invalid"],
				}),
			).toStrictEqual({
				success: true,
				message: `Finished creating component ${path.relative(process.cwd(), componentPath)}.`,
			});
			["README.md", "schema.json", "test.twig"].forEach((fileName) =>
				expect(existsSync(path.join(componentPath, fileName))).toBe(true),
			);
			["index.css", "index.js", "mocks.json"].forEach((fileName) =>
				expect(existsSync(path.join(componentPath, fileName))).toBe(false),
			);
		});
	});

	describe("with the `skip` param", () => {
		test("only writes the files for the given component that are not in the `skip` param (ignoring invalid file values)", async () => {
			expect(
				await createComponent({
					component: componentName,
					skip: ["tpl", "docs", "schema", "invalid"],
				}),
			).toStrictEqual({
				success: true,
				message: `Finished creating component ${path.relative(process.cwd(), componentPath)}.`,
			});
			["README.md", "schema.json", "test.twig"].forEach((fileName) =>
				expect(existsSync(path.join(componentPath, fileName))).toBe(false),
			);
			["index.css", "index.js", "mocks.json"].forEach((fileName) =>
				expect(existsSync(path.join(componentPath, fileName))).toBe(true),
			);
		});
	});

	describe("with the `only` and the `skip` param", () => {
		test("only writes the files for the given component provided in the `only` param and ignores the `skip` param", async () => {
			expect(
				await createComponent({
					component: componentName,
					only: ["tpl", "docs", "schema"],
					skip: ["tpl"],
				}),
			).toStrictEqual({
				success: true,
				message: `Finished creating component ${path.relative(process.cwd(), componentPath)}.`,
			});
			["README.md", "schema.json", "test.twig"].forEach((fileName) =>
				expect(existsSync(path.join(componentPath, fileName))).toBe(true),
			);
			["index.css", "index.js", "mocks.json"].forEach((fileName) =>
				expect(existsSync(path.join(componentPath, fileName))).toBe(false),
			);
		});
	});
});

describe("lintComponents", () => {
	test("validates the mock data of all components against their schema files and returns an array with all errors", async () => {
		expect(await lintComponents()).toStrictEqual({
			success: false,
			data: [
				// Mocks that do not match the schema
				{
					component: "card",
					errors: RESPONSES.card,
				},
				// Invalid schema file, mock file exists
				{
					component: "icon",
					errors: RESPONSES.icon,
				},
				// Invalid schema file, no mock file exists
				{
					component: "image",
					errors: RESPONSES.image,
				},
			],
		});
	});
});

describe("lintComponent", () => {
	describe("with invalid component", () => {
		test("returns an empty array indicating that there are no errors", async () => {
			expect(await lintComponent({ component: "non-existent" })).toStrictEqual({
				message: "The component non-existent does not seem to exist.",
				success: false,
			});
		});
	});

	describe("without schema and mocks", () => {
		test("returns success:true and null", async () => {
			expect(await lintComponent({ component: "anchor" })).toStrictEqual({
				success: true,
				data: null,
			});
		});
	});

	describe("with valid schema and mocks", () => {
		test("returns success: true and an empty array indicating that there are no errors", async () => {
			expect(await lintComponent({ component: "button" })).toStrictEqual({
				success: true,
				data: [],
			});
		});
	});

	describe("with mocks that do not match the schema", () => {
		test("returns success:false an array with all errors", async () => {
			expect(await lintComponent({ component: "card" })).toStrictEqual({
				success: false,
				data: RESPONSES.card,
			});
		});
	});

	describe("with invalid schema file while mock file exists", () => {
		test("returns success:false and an array with all errors", async () => {
			expect(await lintComponent({ component: "icon" })).toStrictEqual({
				success: false,
				data: RESPONSES.icon,
			});
		});
	});

	describe("with invalid schema file while no mock file exists", () => {
		test("returns success:false and an array with all errors", async () => {
			expect(await lintComponent({ component: "image" })).toStrictEqual({
				success: false,
				data: RESPONSES.image,
			});
		});
	});
});
