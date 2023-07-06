/* globals axe */

{
  const iframe = document.querySelector(".MiyagiComponentView-iframe");

  if (iframe) {
    iframe.contentWindow.addEventListener("load", () => {
      iframe.contentWindow.axe.run(
        iframe.contentWindow.document.body,
        function (err, results) {
          window.dispatchEvent(
            new CustomEvent("axe:done", { detail: { err, results } })
          );
        }
      );
    });
  } else {
    axe.run(document.body.children, function (err, results) {
      window.dispatchEvent(
        new CustomEvent("axe:done", { detail: { err, results } })
      );
    });
  }
}
