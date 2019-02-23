function updateIframe(iframe, src) {
  iframe.remove();
  iframe.src = src;
  document.querySelector(".Page-content").appendChild(iframe);
}

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("iframe");
  history.pushState(null, null, document.location.href);

  Array.from(document.querySelectorAll(".Page-nav a")).forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const src = e.target.getAttribute("href");

      updateIframe(iframe, src);
      history.pushState(null, null, src.replace("?pattern=", "?show="));
    });
  });

  window.addEventListener("popstate", () => {
    if (document.location.search !== "") {
      updateIframe(
        iframe,
        document.location.href.replace("?show=", "?pattern=")
      );
    } else {
      updateIframe(iframe, `${document.location.href}?pattern=all`);
    }
  });
});
