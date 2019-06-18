function updateIframe(content, iframe, src) {
  iframe.remove();
  iframe.src = src;
  content.insertBefore(iframe, content.lastElementChild);
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".ComponentLibraryContent");
  const iframe = document.getElementById("iframe");
  const links = Array.from(document.querySelectorAll(".ComponentLibraryNav a"));
  const toggles = Array.from(
    document.querySelectorAll(".ComponentLibraryNav-toggle")
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
      history.pushState(null, null, src.replace("?pattern=", "?show="));
    });
  });

  window.addEventListener("popstate", () => {
    if (document.location.search !== "") {
      updateIframe(
        content,
        iframe,
        document.location.href.replace("?show=", "?pattern=")
      );
    } else {
      updateIframe(content, iframe, `${document.location.href}?pattern=all`);
    }
  });
});
