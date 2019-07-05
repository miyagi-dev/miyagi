const setStaticFiles = require("../../src/setStaticFiles.js");
const config = require("../mocks/config.json");
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

describe("setStaticFiles()", () => {
  const nodeEnv = process.env.NODE_ENV;

  describe("GET app assets", () => {
    test("returns the correct assets based on NODE_ENV", () => {
      app.set("config", {
        cssFiles: [],
        jsFiles: []
      });

      process.env.NODE_ENV = "production";
      setStaticFiles(app);

      request(app)
        .get(`/${config.projectName}/css/prod.css`)
        .expect(200)
        .end(() => {
          process.env.NODE_ENV = nodeEnv;
        });
    });

    describe("GET /js/socket.io.slim.js", () => {
      test("returns 200", () => {
        app.set("config", {
          cssFiles: [],
          jsFiles: []
        });

        setStaticFiles(app);
        request(app)
          .get(`/${config.projectName}/js/socket.io.slim.js`)
          .expect(200);
      });
    });

    describe("GET /js/axe.min.js", () => {
      test("returns 200", () => {
        app.set("config", {
          cssFiles: [],
          jsFiles: []
        });

        setStaticFiles(app);
        request(app)
          .get(`/${config.projectName}/js/axe.min.js`)
          .expect(200);
      });
    });

    describe("GET other requests", () => {
      test("return 404", () => {
        app.set("config", {
          cssFiles: [],
          jsFiles: []
        });

        setStaticFiles(app);
        request(app)
          .get("/gulpfile.js")
          .expect(404);
      });
    });
  });

  describe("with arrays in config.cssFiles/jsFiles", () => {
    describe("GET entries from user cssFiles", () => {
      test("return 200", () => {
        app.set("config", {
          cssFiles: ["tests/mocks/user/css/index.css"],
          jsFiles: ["tests/mocks/user/js/index.js"]
        });

        setStaticFiles(app);
        request(app)
          .get("/tests/mocks/user/css/index.css")
          .expect(200);
      });
    });

    describe("GET entries from user jsFiles", () => {
      test("return 200", () => {
        app.set("config", {
          cssFiles: ["tests/mocks/user/css/index.css"],
          jsFiles: ["tests/mocks/user/js/index.js"]
        });

        setStaticFiles(app);
        request(app)
          .get("/tests/mocks/user/js/index.js")
          .expect(200);
      });
    });
  });

  describe("with objects in config.cssFiles/jsFiles", () => {
    describe("GET entries from user cssFiles", () => {
      test("return 200", () => {
        app.set("config", {
          cssFiles: {
            test: ["tests/mocks/user/css/index.css"]
          },
          jsFiles: {
            test: ["tests/mocks/user/js/index.js"]
          }
        });

        setStaticFiles(app);
        request(app)
          .get("/tests/mocks/user/css/index.css")
          .expect(200);
      });
    });

    describe("GET entries from user jsFiles", () => {
      test("return 200", () => {
        app.set("config", {
          cssFiles: {
            test: ["tests/mocks/user/css/index.css"]
          },
          jsFiles: {
            test: ["tests/mocks/user/js/index.js"]
          }
        });

        setStaticFiles(app);

        request(app)
          .get("/tests/mocks/user/js/index.js")
          .expect(200);
      });
    });
  });
});
