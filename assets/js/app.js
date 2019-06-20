let links;

window.onPageChanged = function(query) {
  const target = setActiveStateInNav(query, true);
  closeOtherOpenedMenus(target);
  openParentMenus(target);
  history.pushState(null, null, query.replace("?component=", "?show="));
};

function updateIframe(content, iframe, src) {
  iframe.remove();
  iframe.src = src;
  content.insertBefore(iframe, content.lastElementChild);
}

function closeOtherOpenedMenus(target) {
  Array.from(
    document.querySelectorAll('.ComponentLibrary-toggle[aria-expanded="true"]')
  ).forEach(toggle => {
    if (!toggle.closest(".ComponentLibrary-listItem").contains(target)) {
      toggle.setAttribute("aria-expanded", false);
    }
  });
}

function openParentMenus(target) {
  (function openParent(el) {
    const list = el.closest(".ComponentLibrary-list");

    if (list) {
      const link = list.previousElementSibling;

      if (link) {
        const toggle = link.previousElementSibling;

        if (toggle && toggle.getAttribute("aria-expanded") === "false") {
          toggle.setAttribute("aria-expanded", true);

          if (toggle.closest(".ComponentLibrary-listItem")) {
            openParent(toggle.closest(".ComponentLibrary-listItem"));
          }
        }
      }
    }
  })(target);
}

function setActiveStateInNav(query) {
  const target = links.filter(link => link.getAttribute("href") === query)[0];
  const current = links.filter(link => link.getAttribute("aria-current"))[0];
  const prevEl = target.previousElementSibling;
  const toggle =
    prevEl && prevEl.classList.contains("ComponentLibrary-toggle")
      ? prevEl
      : null;

  if (current) {
    current.removeAttribute("aria-current");
  }

  target.setAttribute("aria-current", "page");

  if (toggle) {
    toggle.setAttribute("aria-expanded", true);
  }

  return target;
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".ComponentLibrary-content");
  const iframe = document.querySelector(".ComponentLibrary-frame");
  const toggles = Array.from(
    document.querySelectorAll(".ComponentLibrary-toggle")
  );

  links = Array.from(document.querySelectorAll(".ComponentLibrary-link"));

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
      const target = setActiveStateInNav(src);
      closeOtherOpenedMenus(target);
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
