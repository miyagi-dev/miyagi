export default document.addEventListener("DOMContentLoaded", () => {
  if (parent.window) {
    Array.from(document.querySelectorAll(".HeadmanComponent-file")).forEach(
      (link) => {
        link.addEventListener("click", (e) => {
          history.replaceState(null, null, e.target.href); // see http://www.webdeveasy.com/back-button-behavior-on-a-page-with-an-iframe/

          parent.window.dispatchEvent(
            new CustomEvent("pageChanged", {
              detail: encodeURI(e.target.getAttribute("href")),
            })
          );
        });
      }
    );
  }
});
