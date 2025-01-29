import { describe, test, expect, beforeAll, afterAll } from "vitest";
import path from "node:path";
import { getComponentData } from "../../../lib/mocks/index.js";
import validateMockData from "../../../lib/validator/mocks.js";
import init from "../../../lib/index.js";

beforeAll(() => (process.env.MIYAGI_JS_API = true));
afterAll(() => (process.env.MIYAGI_JS_API = false));

describe("validateMockData", () => {
	describe("with missing schema", () => {
		test("returns null", async () => {
			const component = await getComponentsObject("anchor");

			expect(
				await validateMockData(component, await getComponentData(component)),
			).toStrictEqual(null);
		});
	});

	describe("with an invalid schema", () => {
		test("returns an array with all errors", async () => {
			const component = await getComponentsObject("icon");

			expect(
				await validateMockData(component, await getComponentData(component)),
			).toStrictEqual([
				{
					type: "schema",
					data: [
						{
							message:
								"Error: schema is invalid: data/properties/content/type must be equal to one of the allowed values, data/properties/content/type must be array, data/properties/content/type must match a schema in anyOf",
						},
					],
				},
			]);
		});
	});

	describe("with mocks that do not match the schema", () => {
		test("returns an array with all errors", async () => {
			const component = await getComponentsObject("card");

			expect(
				await validateMockData(component, await getComponentData(component)),
			).toStrictEqual([
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
			]);
		});
	});

	describe("with valid schema and valid mocks", () => {
		test("returns an empty array", async () => {
			const component = await getComponentsObject("button");

			expect(
				await validateMockData(component, await getComponentData(component)),
			).toStrictEqual([]);
		});
	});
});

async function getComponentsObject(component) {
	global.app = await init("api");

	return global.state.routes.find(
		(route) => route.paths.dir.short === component,
	);
}
