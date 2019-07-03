const express = require("express");
const request = require("supertest");
const setRouter = require("../../src/setRouter.js");
const render = require("../../src/render/index.js");

const component = "components/component/component.hbs";

describe("setRouter()", () => {
  const app = express();

  app.set("state", {
    partials: {
      "components/component/component.hbs": "components/component/component.hbs"
    },
    data: {
      "components/component/component.hbs": {
        variations: [
          {
            name: "someVariation",
            data: {}
          }
        ]
      }
    }
  });
  app.set("config", {
    extension: "hbs"
  });

  setRouter(app);

  describe("GET /", () => {
    test("calls renderMain()", done => {
      render.renderMain = jest.fn(done => done());

      request(app)
        .get("/")
        .expect(() => {
          return expect(render.renderMain).toHaveBeenCalled();
        })
        .end(done);
    });
  });

  describe("GET /component?file=all", () => {
    test("calls renderComponentOverview()", done => {
      render.renderComponentOverview = jest.fn(done => done());

      request(app)
        .get("/component")
        .query("file=all")
        .expect(() => {
          return expect(render.renderComponentOverview).toHaveBeenCalled();
        })
        .end(done);
    });
  });

  describe("GET /component?file=", () => {
    describe("with valid file value", () => {
      describe("without a variation value", () => {
        test("calls renderComponentVariations()", done => {
          render.renderComponentVariations = jest.fn(done => done());

          request(app)
            .get("/component")
            .query(`file=${component}`)
            .expect(() => {
              return expect(
                render.renderComponentVariations
              ).toHaveBeenCalled();
            })
            .end(done);
        });
      });

      describe("with a valid variation value", () => {
        test("calls renderComponent()", done => {
          render.renderComponent = jest.fn(done => done());

          request(app)
            .get("/component")
            .query(`file=${component}`)
            .query(`variation=someVariation`)
            .expect(() => {
              return expect(render.renderComponent).toHaveBeenCalled();
            })
            .end(done);
        });
      });

      describe("with an invalid variation value", () => {
        test("calls renderComponentNotFound()", done => {
          render.renderComponentNotFound = jest.fn(done => done());

          request(app)
            .get("/component")
            .query(`file=${component}`)
            .query(`variation=invalidVariation`)
            .expect(() => {
              return expect(render.renderComponentNotFound).toHaveBeenCalled();
            })
            .end(done);
        });
      });
    });

    describe("with invalid file value", () => {
      test("calls renderComponentNotFound()", done => {
        render.renderComponentNotFound = jest.fn(done => done());

        request(app)
          .get("/component")
          .query(`file=invalidComponent`)
          .expect(() => {
            return expect(render.renderComponentNotFound).toHaveBeenCalled();
          })
          .end(done);
      });
    });
  });

  describe("GET /show?file=", () => {
    describe("with file=all", () => {
      test("calls renderMain()", done => {
        render.renderMain = jest.fn(done => done());

        request(app)
          .get("/show")
          .query(`file=all`)
          .expect(() => {
            return expect(render.renderMain).toHaveBeenCalled();
          })
          .end(done);
      });
    });

    describe("with valid file value", () => {
      describe("without a variation value", () => {
        test("calls renderMainWithComponent()", done => {
          render.renderMainWithComponent = jest.fn(done => done());

          request(app)
            .get("/show")
            .query(`file=${component}`)
            .expect(() => {
              return expect(render.renderMainWithComponent).toHaveBeenCalled();
            })
            .end(done);
        });
      });

      describe("with a valid variation value", () => {
        test("calls renderMainWithComponent()", done => {
          render.renderMainWithComponent = jest.fn(done => done());

          request(app)
            .get("/show")
            .query(`file=${component}`)
            .query(`variation=someVariation`)
            .expect(() => {
              return expect(render.renderMainWithComponent).toHaveBeenCalled();
            })
            .end(done);
        });
      });

      describe("with aan invalid variation value", () => {
        test("calls renderMainWith404()", done => {
          render.renderMainWith404 = jest.fn(done => done());

          request(app)
            .get("/show")
            .query(`file=${component}`)
            .query(`variation=invalidVariation`)
            .expect(() => {
              return expect(render.renderMainWith404).toHaveBeenCalled();
            })
            .end(done);
        });
      });
    });

    describe("with invalid file value", () => {
      test("calls renderMainWith404()", done => {
        render.renderMainWith404 = jest.fn(done => done());

        request(app)
          .get("/show")
          .query(`file=invalidComponent`)
          .expect(() => {
            return expect(render.renderMainWith404).toHaveBeenCalled();
          })
          .end(done);
      });
    });
  });

  describe("GET /somethingInvalid", () => {
    test("redirects to /", done => {
      render.renderMainWith404 = jest.fn(done => done());

      request(app)
        .get("/somethingInvalid")
        .expect(302)
        .expect("Location", "/")
        .end(done);
    });
  });
});
