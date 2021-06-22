import "./_prism.js";
import "./_tests.js";
import "./_iframe-links.js";
import Tabs from "./_tabs.js";

if (
  location.href.indexOf("/component-") >= 0 &&
  location.href.indexOf("-embedded.html") >= 0 &&
  window.self === window.top
) {
  window.location = location.href.replace("-embedded.html", ".html");
}

document.addEventListener("DOMContentLoaded", function () {
  const tabs = Array.from(document.querySelectorAll(".MiyagiTabs"));
  const styleguide = document.querySelector(".MiyagiStyleguide");

  if (tabs.length > 0) {
    tabs.forEach((tab) => new Tabs(tab));
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
