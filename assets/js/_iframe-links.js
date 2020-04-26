export default document.addEventListener("DOMContentLoaded", () => {
  if (parent.window) {
    const linkClass = "HeadmanComponent-file";

    Array.from(document.querySelectorAll(`.${linkClass}`)).forEach((link) => {
      link.addEventListener("click", (e) => {
        const el = e.target.closest(`.${linkClass}`);

        history.replaceState(null, null, el.href); // see http://www.webdeveasy.com/back-button-behavior-on-a-page-with-an-iframe/

        parent.window.dispatchEvent(
          new CustomEvent("pageChanged", {
            detail: encodeURI(el.getAttribute("href")),
          })
        );
      });
    });
  }
});
