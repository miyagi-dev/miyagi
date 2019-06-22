import "./_socket.js";
import "./_tests.js";

document.addEventListener("DOMContentLoaded", () => {
  Array.from(document.querySelectorAll(".RoundupComponent-file")).forEach(
    link => {
      link.addEventListener("click", e => {
        if (parent.window && parent.window.onPageChanged) {
          parent.window.onPageChanged(encodeURI(e.target.getAttribute("href")));
        }
      });
    }
  );
});
