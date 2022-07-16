import "./_socket.js";
import Tests from "./_tests.js";
import {
  goto as gotoIsTriggered,
  search as searchIsTriggered,
} from "./_is-triggered.js";

if (
  window.location.pathname.startsWith("/component?") &&
  window.location.href.indexOf("&embedded=true") >= 0 &&
  window.self === window.top
) {
  window.location = new URL(window.location).replace("&embedded=true", "");
}

document.addEventListener("DOMContentLoaded", function () {
  const links = Array.from(document.querySelectorAll(".MiyagiComponent-file"));
  const tests = parent.document.querySelector(".Tests");
  const styleguide = document.querySelector(".MiyagiStyleguide");

  if (tests) {
    Tests(tests);
  }

  if (links.length > 0) {
    import("./_iframe-links.js")
      .then((module) => {
        module.default(links);
      })
      .catch((err) => console.error(err));
  }

  if (document.querySelector(".Miyagi-code")) {
    import("./_prism.js");
  }

  if (styleguide) {
    import("./styleguide/index.js")
      .then((Styleguide) => new Styleguide.default(styleguide))
      .catch((err) => console.error(err));
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
