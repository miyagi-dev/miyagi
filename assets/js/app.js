function updateIframe(content, iframe, src) {
  iframe.remove();
  iframe.src = src;
  content.insertBefore(iframe, content.lastElementChild);
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".ComponentLibrary-content");
  const iframe = document.querySelector(".ComponentLibrary-frame");
  const links = Array.from(document.querySelectorAll(".ComponentLibrary-link"));
  const toggles = Array.from(
    document.querySelectorAll(".ComponentLibrary-toggle")
  );

  history.pushState(null, null, document.location.href);

  toggles.forEach(toggle => {
    toggle.addEventListener("click", e => {
      e.preventDefault();

      const el = e.target;
      const expanded =
        el.getAttribute("aria-expanded") === "true" ? false : true;
      const target = document.getElementById(el.getAttribute("aria-controls"));

      el.setAttribute("aria-expanded", expanded);

      if (expanded) {
        target.removeAttribute("hidden");
      } else {
        target.setAttribute("hidden", true);
      }
    });
  });

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

      updateIframe(content, iframe, src);
      history.pushState(null, null, src.replace("?component=", "?show="));
    });
  });

  window.addEventListener("popstate", () => {
    if (document.location.search !== "") {
      updateIframe(
        content,
        iframe,
        document.location.href.replace("?show=", "?component=")
      );
    } else {
      updateIframe(content, iframe, `${document.location.href}?component=all`);
    }
  });
});
