import express from "express";
import request from "supertest";
import deepMerge from "deepmerge";
import config from "../../../lib/miyagi-config.js";
import setStatic from "../../../lib/init/static.js";
jest.mock("../../../lib/__dirname.js", () => `${process.cwd()}/lib`);

let app;
let server;

beforeEach((done) => {
  app = express();
  server = app.listen(0, done);
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  server.close();
});

describe("lib/init/static", () => {
  describe("GET app assets", () => {
    describe("GET /js/socket.io.min.js", () => {
      test("returns 200", (done) => {
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            assets: {
              css: [],
              js: [],
            },
          })
        );

        setStatic(app);
        request(app)
          .get(`/${config.projectName}/js/socket.io.min.js`)
          .expect(200, done);
      });
    });

    describe("GET /js/axe.min.js", () => {
      test("returns 200", (done) => {
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            assets: {
              css: [],
              js: [],
            },
          })
        );

        setStatic(app);
        request(app)
          .get(`/${config.projectName}/js/axe.min.js`)
          .expect(200, done);
      });
    });

    describe("GET other requests", () => {
      test("return 404", (done) => {
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            assets: {
              css: [],
              js: [],
            },
          })
        );

        setStatic(app);
        request(app).get("/gulpfile.js").expect(404, done);
      });
    });
  });

  describe("with arrays in config.assets.css/js", () => {
    describe("GET entries from user css", () => {
      test("returns 200", (done) => {
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            assets: {
              css: ["tests/mock-data/user/css/index.css"],
              js: [{ src: "tests/mock-data/user/js/index.js" }],
            },
          })
        );

        setStatic(app);
        request(app)
          .get("/tests/mock-data/user/css/index.css")
          .expect(200, done);
      });
    });

    describe("GET entries from user js", () => {
      test("returns 200", (done) => {
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            assets: {
              css: ["tests/mock-data/user/css/index.css"],
              js: [{ src: "tests/mock-data/user/js/index.js" }],
            },
          })
        );

        setStatic(app);
        request(app).get("/tests/mock-data/user/js/index.js").expect(200, done);
      });
    });
  });
});
