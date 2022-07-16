const deepMerge = require("deepmerge");
const path = require("path");
const express = require("express");
const request = require("supertest");
const setRouter = require("../../../lib/init/router.js");
const render = require("../../../lib/render");
const config = require("../../../lib/config.json");

const component = "components/component/index.hbs";

let app;
let server;

beforeEach((done) => {
	app = express();
	server = app.listen(0, done);

	const fileContents = {};
	const componentJsonFullPath = path.join(
		process.cwd(),
		`srcFolder/${component}`
	);
	fileContents[componentJsonFullPath.replace("index.hbs", "mocks.json")] = {
		$variants: [{ $name: "someVariation" }],
	};
	fileContents[componentJsonFullPath] = "";
	app.set("state", {
		partials: {
			"components/component/index.hbs": component,
		},
		fileContents,
	});
	app.set(
		"config",
		deepMerge(config.defaultUserConfig, {
			files: {
				templates: {
					extension: "hbs",
				},
			},
			components: {
				folder: "srcFolder",
			},
		})
	);

	setRouter(app);
});

afterEach(() => {
	jest.resetModules();
	jest.resetAllMocks();
	server.close();
});

describe("lib/init/router()", () => {
	describe("GET /", () => {
		test("calls renderMainIndex()", (done) => {
			render.renderMainIndex = jest.fn((done) => done());

			request(app)
				.get("/")
				.expect(() => {
					return expect(render.renderMainIndex).toHaveBeenCalled();
				})
				.end(done);
		});
	});

	describe("GET /component?file=all", () => {
		test("calls renderIframeIndex()", (done) => {
			render.renderIframeIndex = jest.fn((done) => done());

			request(app)
				.get("/component")
				.query("file=all")
				.expect(() => {
					return expect(render.renderIframeIndex).toHaveBeenCalled();
				})
				.end(done);
		});
	});

	describe("GET /component?file=", () => {
		describe("with valid file value", () => {
			describe("without a variation value", () => {
				test("calls renderIframeComponent()", (done) => {
					render.renderIframeComponent = jest.fn((done) => done());

					request(app)
						.get("/component")
						.query(`file=${path.dirname(component)}`)
						.expect(() => {
							return expect(render.renderIframeComponent).toHaveBeenCalled();
						})
						.end(done);
				});
			});

			describe("with a valid variation value", () => {
				test("calls renderIframeVariation()", (done) => {
					render.renderIframeVariation = jest.fn((done) => done());

					request(app)
						.get("/component")
						.query(`file=${path.dirname(component)}`)
						.query(`variation=someVariation`)
						.expect(() => {
							return expect(render.renderIframeVariation).toHaveBeenCalled();
						})
						.end(done);
				});
			});

			describe("with an invalid variation value", () => {
				test("redirects to /component?file=all", (done) => {
					request(app)
						.get("/component")
						.query(`file=${path.dirname(component)}`)
						.query(`variation=invalidVariation`)
						.expect(302)
						.end(done);
				});
			});
		});

		describe("with invalid file value", () => {
			test("redirects to /component?file=all", (done) => {
				request(app)
					.get("/component")
					.query(`file=invalidComponent`)
					.expect(302)
					.end(done);
			});
		});
	});

	describe("GET /show?file=", () => {
		describe("with file=all", () => {
			test("calls renderMainIndex()", (done) => {
				render.renderMainIndex = jest.fn((done) => done());

				request(app)
					.get("/show")
					.query(`file=all`)
					.expect(() => {
						return expect(render.renderMainIndex).toHaveBeenCalled();
					})
					.end(done);
			});
		});

		describe("with valid file value", () => {
			describe("without a variation value", () => {
				test("calls renderMainComponent()", (done) => {
					render.renderMainComponent = jest.fn((done) => done());

					request(app)
						.get("/show")
						.query(`file=${path.dirname(component)}`)
						.expect(() => {
							return expect(render.renderMainComponent).toHaveBeenCalled();
						})
						.end(done);
				});
			});

			describe("with a valid variation value", () => {
				test("calls renderMainComponent()", (done) => {
					render.renderMainComponent = jest.fn((done) => done());

					request(app)
						.get("/show")
						.query(`file=${path.dirname(component)}`)
						.query(`variation=someVariation`)
						.expect(() => {
							return expect(render.renderMainComponent).toHaveBeenCalled();
						})
						.end(done);
				});
			});

			describe("with an invalid variation value", () => {
				test("redirects to index", (done) => {
					request(app)
						.get("/show")
						.query(`file=${path.dirname(component)}`)
						.query(`variation=invalidVariation`)
						.expect(302)
						.end(done);
				});
			});
		});

		describe("with invalid file value", () => {
			test("redirects to index index", (done) => {
				request(app)
					.get("/show")
					.query(`file=invalidComponent`)
					.expect(302)
					.end(done);
			});
		});
	});

	describe("GET /somethingInvalid", () => {
		test("returns 404", (done) => {
			request(app).get("/somethingInvalid").expect(404).end(done);
		});
	});
});
