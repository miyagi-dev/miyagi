const setStaticFiles = require("../../src/setStaticFiles.js");
const config = require("../mocks/config.json");
const express = require("express");
const request = require("supertest");

describe("setStaticFiles()", () => {
  const nodeEnv = process.env.NODE_ENV;
  const app = express();

  describe("GET app assets", () => {
    app.set("config", {
      cssFiles: [],
      jsFiles: []
    });

    setStaticFiles(app);

    test("returns the correct assets based on NODE_ENV", done => {
      process.env.NODE_ENV = "production";
      setStaticFiles(app);

      request(app)
        .get(`/${config.projectName}/css/prod.css`)
        .expect(200, () => {
          process.env.NODE_ENV = nodeEnv;
          done();
        });
    });

    describe("GET /js/socket.io.slim.js", () => {
      test("returns 200", done => {
        request(app)
          .get(`/${config.projectName}/js/socket.io.slim.js`)
          .expect(200, done);
      });
    });

    describe("GET /js/axe.min.js", () => {
      test("returns 200", done => {
        request(app)
          .get(`/${config.projectName}/js/axe.min.js`)
          .expect(200, done);
      });
    });

    describe("GET other requests", () => {
      test("return 404", done => {
        request(app)
          .get("/gulpfile.js")
          .expect(404, done);
      });
    });
  });

  describe("with arrays in config.cssFiles/jsFiles", () => {
    app.set("config", {
      cssFiles: ["tests/mocks/user/css/index.css"],
      jsFiles: ["tests/mocks/user/js/index.js"]
    });

    setStaticFiles(app);

    describe("GET entries from user cssFiles", () => {
      test("return 200", done => {
        request(app)
          .get("/tests/mocks/user/css/index.css")
          .expect(200, done);
      });
    });

    describe("GET entries from user jsFiles", () => {
      test("return 200", done => {
        request(app)
          .get("/tests/mocks/user/js/index.js")
          .expect(200, done);
      });
    });
  });

  describe("with objects in config.cssFiles/jsFiles", () => {
    app.set("config", {
      cssFiles: {
        test: ["tests/mocks/user/css/index.css"]
      },
      jsFiles: {
        test: ["tests/mocks/user/js/index.js"]
      }
    });

    setStaticFiles(app);

    describe("GET entries from user cssFiles", () => {
      test("return 200", done => {
        request(app)
          .get("/tests/mocks/user/css/index.css")
          .expect(200, done);
      });
    });

    describe("GET entries from user jsFiles", () => {
      test("return 200", done => {
        request(app)
          .get("/tests/mocks/user/js/index.js")
          .expect(200, done);
      });
    });
  });
});
