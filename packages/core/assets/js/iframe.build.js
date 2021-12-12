import "./_prism.js";
import "./_tests.js";
import "./_iframe-links.js";
import searchIsTriggered from "./_search-is-triggered.js";

if (
  location.href.indexOf("/component-") >= 0 &&
  location.href.indexOf("-embedded.html") >= 0 &&
  window.self === window.top
) {
  window.location = location.href.replace("-embedded.html", ".html");
}

document.addEventListener("DOMContentLoaded", function () {
  const styleguide = document.querySelector(".MiyagiStyleguide");

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
