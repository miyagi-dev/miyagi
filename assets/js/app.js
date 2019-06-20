function updateIframe(content, iframe, src) {
  iframe.remove();
  iframe.src = src;
  content.insertBefore(iframe, content.lastElementChild);
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".ComponentLibrary-content");
  const iframe = document.querySelector(".ComponentLibrary-frame");
  const links = Array.from(document.querySelectorAll(".ComponentLibrary-link"));
  const menu = document.querySelector(".ComponentLibrary-menu");
  const toggles = Array.from(
    document.querySelectorAll(".ComponentLibrary-toggle")
  );

  history.pushState(null, null, document.location.href);

  document
    .querySelector(".ComponentLibrary-toggleMobileMenu")
    .addEventListener("click", e => {
      e.preventDefault();

      const toggle = e.target;
      let newValue;

      if (toggle.getAttribute("aria-expanded") === "true") {
        newValue = false;
      } else {
        newValue = true;
      }
      toggle.setAttribute("aria-expanded", newValue);
    });

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

      if (window.innerWidth <= 512) {
        document
          .querySelector(".ComponentLibrary-toggleMobileMenu")
          .setAttribute("aria-expanded", false);
      }
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
