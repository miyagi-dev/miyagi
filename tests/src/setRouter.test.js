const express = require("express");
const request = require("supertest");
const setRouter = require("../../src/setRouter.js");
const render = require("../../src/render/index.js");

const component = "components/component/component.hbs";

render.renderMain = jest.fn(done => done());
render.renderMainWithComponent = jest.fn(done => done());
render.renderComponent = jest.fn(done => done());
render.renderComponentVariations = jest.fn(done => done());

describe("setRouter()", () => {
  const app = express();

  app.set("state", {
    partials: {
      "components/component/component.hbs": "components/component/component.hbs"
    }
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

  describe("GET /?component=all", () => {
    test("calls renderComponentOverview()", done => {
      render.renderComponentOverview = jest.fn(done => done());

      request(app)
        .get("/")
        .query("component=all")
        .expect(() => {
          return expect(render.renderComponentOverview).toHaveBeenCalled();
        })
        .end(done);
    });
  });

  describe("GET /?component=", () => {
    describe("with valid component value", () => {
      describe("without a variation value", () => {
        test("calls renderComponentVariations()", done => {
          render.renderComponentVariations = jest.fn(done => done());

          request(app)
            .get("/")
            .query(`component=${component}`)
            .expect(() => {
              return expect(
                render.renderComponentVariations
              ).toHaveBeenCalled();
            })
            .end(done);
        });
      });

      describe("with a variation value", () => {
        test("calls renderComponent()", done => {
          render.renderComponent = jest.fn(done => done());

          request(app)
            .get("/")
            .query(`component=${component}`)
            .query(`variation=someVariation`)
            .expect(() => {
              return expect(render.renderComponent).toHaveBeenCalled();
            })
            .end(done);
        });
      });
    });

    describe("with invalid component value", () => {
      test("calls renderMain()", done => {
        render.renderMain = jest.fn(done => done());

        request(app)
          .get("/")
          .query(`component=invalidComponent`)
          .expect(() => {
            return expect(render.renderMain).toHaveBeenCalled();
          })
          .end(done);
      });
    });
  });

  describe("GET /?show=", () => {
    describe("with valid show value", () => {
      test("calls renderMainWithComponent()", done => {
        render.renderMainWithComponent = jest.fn(done => done());

        request(app)
          .get("/")
          .query(`show=${component}`)
          .expect(() => {
            return expect(render.renderMainWithComponent).toHaveBeenCalled();
          })
          .end(done);
      });
    });

    describe("with invalid show value", () => {
      test("calls renderMain()", done => {
        render.renderMain = jest.fn(done => done());

        request(app)
          .get("/")
          .query(`show=invalidComponent`)
          .expect(() => {
            return expect(render.renderMain).toHaveBeenCalled();
          })
          .end(done);
      });
    });
  });
});
