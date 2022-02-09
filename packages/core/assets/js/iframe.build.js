import "./_prism.js";
import "./_tests.js";
import "./_iframe-links.js";
import {
  goto as gotoIsTriggered,
  search as searchIsTriggered,
} from "./_is-triggered.js";

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

document.addEventListener("keyup", (e) => {
  const { path, originalTarget, target, key } = e;
  const el = path ? path[0] : originalTarget || target;

  if (searchIsTriggered(el, key)) {
    parent.window.dispatchEvent(new CustomEvent("searchTriggered"));
  } else if (gotoIsTriggered(el, key)) {
    parent.window.dispatchEvent(new CustomEvent("gotoTriggered"));
  }
});
