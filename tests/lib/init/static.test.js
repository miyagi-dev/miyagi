const setStatic = require("../../../lib/init/static.js");
const config = require("../../mocks/config.json");
const express = require("express");
const request = require("supertest");

let app;
let server;

beforeEach(done => {
  app = express();
  server = app.listen(0, done);
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  server.close();
});

describe("lib/init/static", () => {
  const nodeEnv = process.env.NODE_ENV;

  describe("GET app assets", () => {
    test("returns the correct assets based on NODE_ENV", () => {
      app.set("config", {
        cssFiles: [],
        jsFiles: []
      });

      process.env.NODE_ENV = "production";
      setStatic(app);

      request(app)
        .get(`/${config.projectName}/css/prod.css`)
        .expect(200)
        .end(() => {
          process.env.NODE_ENV = nodeEnv;
        });
    });

    describe("GET /js/socket.io.slim.js", () => {
      test("returns 200", done => {
        app.set("config", {
          cssFiles: [],
          jsFiles: []
        });

        setStatic(app);
        request(app)
          .get(`/${config.projectName}/js/socket.io.slim.js`)
          .expect(200, done);
      });
    });

    describe("GET /js/axe.min.js", () => {
      test("returns 200", done => {
        app.set("config", {
          cssFiles: [],
          jsFiles: []
        });

        setStatic(app);
        request(app)
          .get(`/${config.projectName}/js/axe.min.js`)
          .expect(200, done);
      });
    });

    describe("GET other requests", () => {
      test("return 404", done => {
        app.set("config", {
          cssFiles: [],
          jsFiles: []
        });

        setStatic(app);
        request(app)
          .get("/gulpfile.js")
          .expect(404, done);
      });
    });
  });

  describe("with arrays in config.cssFiles/jsFiles", () => {
    describe("GET entries from user cssFiles", () => {
      test("returns 200", done => {
        app.set("config", {
          cssFiles: ["tests/mocks/user/css/index.css"],
          jsFiles: ["tests/mocks/user/js/index.js"]
        });

        setStatic(app);
        request(app)
          .get("/tests/mocks/user/css/index.css")
          .expect(200, done);
      });
    });

    describe("GET entries from user jsFiles", () => {
      test("returns 200", done => {
        app.set("config", {
          cssFiles: ["tests/mocks/user/css/index.css"],
          jsFiles: ["tests/mocks/user/js/index.js"]
        });

        setStatic(app);
        request(app)
          .get("/tests/mocks/user/js/index.js")
          .expect(200, done);
      });
    });
  });
});
