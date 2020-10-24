import "./_socket.js";
import Tests from "./_tests.js";

if (
  location.href.indexOf("/component?") >= 0 &&
  location.href.indexOf("&embedded=true") >= 0 &&
  window.self === window.top
) {
  window.location = location.href.replace("&embedded=true", "");
}

document.addEventListener("DOMContentLoaded", function () {
  const links = Array.from(document.querySelectorAll(".MiyagiComponent-file"));
  const tabs = Array.from(document.querySelectorAll(".MiyagiTabs"));
  const tests = parent.document.querySelector(".Miyagi-tests");
  const styleguide = document.querySelector(".MiyagiStyleguide");

  if (tests) {
    Tests(tests);
  }

  if (links.length > 0) {
    import("./_iframe-links.js").then((module) => {
      module.default(links);
    });
  }

  if (tabs.length > 0) {
    import("./_tabs.js").then((Tabs) => {
      tabs.forEach((tab) => new Tabs.default(tab));
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
});
