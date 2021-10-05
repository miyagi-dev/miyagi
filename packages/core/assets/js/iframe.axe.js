/* globals axe */

axe.run(document.body.children, function (err, results) {
  window.dispatchEvent(
    new CustomEvent("axe:done", { detail: { err, results } })
  );
});
