require("../../../assets/js/iframe.js");

describe("assets/js/iframe.js", () => {
  describe("is embedded", () => {
    describe("clicking on a link", () => {
      const link = document.createElement("a");
      link.classList.add("HeadmanComponent-file");
      link.setAttribute("href", "the target");
      document.body.appendChild(link);

      test("calls history.replaceState", () => {
        parent.window.onPageChanged = () => {};
        const spy = jest.spyOn(history, "replaceState");
        document.dispatchEvent(new Event("DOMContentLoaded"));

        link.dispatchEvent(new Event("click"));

        expect(spy).toHaveBeenCalledWith(
          null,
          null,
          `${location.origin}/the%20target`
        );

        parent.window.onPageChanged = null;
      });

      test("calls parent.window.onPageChanged", () => {
        parent.window.onPageChanged = () => {};
        const spy = jest.spyOn(parent.window, "onPageChanged");
        document.dispatchEvent(new Event("DOMContentLoaded"));

        link.dispatchEvent(new Event("click"));

        expect(spy).toHaveBeenCalledWith(encodeURI("the target"));

        parent.window.onPageChanged = null;
      });
    });
  });

  describe("is not embedded", () => {
    test("", () => {
      const link = document.createElement("a");
      link.classList.add("HeadmanComponent-file");
      document.body.appendChild(link);
      document.dispatchEvent(new Event("DOMContentLoaded"));

      link.dispatchEvent(new Event("click"));
    });
  });
});
