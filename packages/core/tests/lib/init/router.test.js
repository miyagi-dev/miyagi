import deepMerge from "deepmerge";
import path from "path";
import express from "express";
import request from "supertest";
import setRouter from "../../../lib/init/router.js";
import render from "../../../lib/render/index.js";
import config from "../../../lib/miyagi-config.js";

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
        test("calls renderIframe404()", (done) => {
          render.renderIframe404 = jest.fn((done) => done());

          request(app)
            .get("/component")
            .query(`file=${path.dirname(component)}`)
            .query(`variation=invalidVariation`)
            .expect(() => {
              return expect(render.renderIframe404).toHaveBeenCalled();
            })
            .end(done);
        });
      });
    });

    describe("with invalid file value", () => {
      test("calls renderIframe404()", (done) => {
        render.renderIframe404 = jest.fn((done) => done());

        request(app)
          .get("/component")
          .query(`file=invalidComponent`)
          .expect(() => {
            return expect(render.renderIframe404).toHaveBeenCalled();
          })
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
        test("calls renderMain404()", (done) => {
          render.renderMain404 = jest.fn((done) => done());

          request(app)
            .get("/show")
            .query(`file=${path.dirname(component)}`)
            .query(`variation=invalidVariation`)
            .expect(() => {
              return expect(render.renderMain404).toHaveBeenCalled();
            })
            .end(done);
        });
      });
    });

    describe("with invalid file value", () => {
      test("calls renderMain404()", (done) => {
        render.renderMain404 = jest.fn((done) => done());

        request(app)
          .get("/show")
          .query(`file=invalidComponent`)
          .expect(() => {
            return expect(render.renderMain404).toHaveBeenCalled();
          })
          .end(done);
      });
    });
  });

  describe("GET /somethingInvalid", () => {
    test("redirects to /", (done) => {
      render.renderMain404 = jest.fn((done) => done());

      request(app)
        .get("/somethingInvalid")
        .expect(302)
        .expect("Location", "/")
        .end(done);
    });
  });
});
