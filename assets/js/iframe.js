import "./_socket.js";

if (
  location.href.indexOf("/component?") >= 0 &&
  location.href.indexOf("&embedded=true") >= 0 &&
  window.self === window.top
) {
  window.location = location.href.replace("&embedded=true", "");
}

document.addEventListener("DOMContentLoaded", function() {
  const links = Array.from(document.querySelectorAll(`.HeadmanComponent-file`));
  const tests = parent.document.querySelector(".Headman-tests");

  if (tests) {
    import("./_tests.js").then((module) => {
      module.default(tests);
    });
  }

  if (links.length > 0) {
    import("./_iframe-links.js").then((module) => {
      module.default(links);
    });
  }

  if (document.querySelector(".Headman-code")) {
    import("./_prism.js");
  }
});
