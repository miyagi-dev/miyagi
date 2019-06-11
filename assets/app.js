function updateIframe(iframe, src) {
  iframe.remove();
  iframe.src = src;
  document.querySelector(".Content").appendChild(iframe);
}

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("iframe");
  const links = Array.from(document.querySelectorAll(".Nav a"));

  history.pushState(null, null, document.location.href);

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const src = e.target.getAttribute("href");
      const current = links.filter(link =>
        link.getAttribute("aria-current")
      )[0];

      if (current) {
        current.removeAttribute("aria-current");
      }

      e.target.setAttribute("aria-current", "page");

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
