import "./_socket.js";
import Tests from "./_tests.js";
import searchIsTriggered from "./_search-is-triggered.js";

if (
  location.href.indexOf("/component?") >= 0 &&
  location.href.indexOf("&embedded=true") >= 0 &&
  window.self === window.top
) {
  window.location = location.href.replace("&embedded=true", "");
}

document.addEventListener("DOMContentLoaded", function () {
  const links = Array.from(document.querySelectorAll(".MiyagiComponent-file"));
  const tests = parent.document.querySelector(".Tests");
  const styleguide = document.querySelector(".MiyagiStyleguide");

  if (tests) {
    Tests(tests);
  }

  if (links.length > 0) {
    import("./_iframe-links.js").then((module) => {
      module.default(links);
    });
  }

  if (document.querySelector(".Miyagi-code")) {
    import("./_prism.js");
  }

  if (styleguide) {
    import("./styleguide/index.js").then(
      (Styleguide) => new Styleguide.default(styleguide)
    );
  }

  if (document.querySelector(".js-openMockData")) {
    import("./_mock-data.js");
  }
});

window.addEventListener("keyup", ({ target, key }) => {
  if (searchIsTriggered(target, key)) {
    parent.window.dispatchEvent(new CustomEvent("searchTriggered"));
  }
});
