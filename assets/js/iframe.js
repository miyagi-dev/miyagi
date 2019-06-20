import "./_socket.js";
import "./_tests.js";
import "/axe.js";

document.addEventListener("DOMContentLoaded", () => {
  Array.from(
    document.querySelectorAll(".ComponentLibraryComponent-file")
  ).forEach(link => {
    link.addEventListener("click", e => {
      if (parent.window && parent.window.onPageChanged) {
        parent.window.onPageChanged(encodeURI(e.target.getAttribute("href")));
      }
    });
  });
});
