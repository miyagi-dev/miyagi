import "./_socket.js";
import "./_tests.js";

document.addEventListener("DOMContentLoaded", () => {
  Array.from(document.querySelectorAll(".HeadmanComponent-file")).forEach(
    link => {
      link.addEventListener("click", e => {
        if (parent.window && parent.window.onPageChanged) {
          history.replaceState(null, null, e.target.href); // see http://www.webdeveasy.com/back-button-behavior-on-a-page-with-an-iframe/
          parent.window.onPageChanged(encodeURI(e.target.getAttribute("href")));
        }
      });
    }
  );
});

if (
  location.href.indexOf("/component?") >= 0 &&
  location.href.indexOf("&embedded=true") >= 0
) {
  if (window.self === window.top) {
    window.location = location.href.replace("&embedded=true", "");
  }
}
