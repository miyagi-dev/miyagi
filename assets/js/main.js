const classes = {
  list: "Headman-list",
  listItem: "Headman-listItem",
  content: "Headman-content",
  iframe: "Headman-frame",
  toggle: "Headman-toggle",
  toggleMenu: "Headman-toggleMobileMenu",
  link: "Headman-link"
};
const paths = {
  embedded: "/component?",
  container: "/show?"
};
let links;
let toggles;

window.onPageChanged = function(query) {
  const target = setActiveStateInNav(query);

  closeOtherOpenedMenus(target);
  openParentMenus(target);
  history.pushState(
    null,
    query,
    query.replace(paths.embedded, paths.container)
  );
};

function updateIframe(content, iframe, src) {
  iframe.remove();
  iframe.src = src;
  content.insertBefore(iframe, content.lastElementChild);
}

function closeOtherOpenedMenus(target) {
  toggles
    .filter(toggle => toggle.getAttribute("aria-expanded") === "true")
    .forEach(toggle => {
      if (!toggle.closest(`.${classes.listItem}`).contains(target)) {
        toggle.setAttribute("aria-expanded", false);
      }
    });
}

function openParentMenus(target) {
  (function openParent(el) {
    const list = el.closest(`.${classes.list}`);
    if (list) {
      let link = list.previousElementSibling;

      if (link) {
        while (link && !link.classList.contains(classes.link)) {
          link = link.previousElementSibling;
        }

        if (link) {
          const toggle = link.previousElementSibling;

          if (toggle && toggle.getAttribute("aria-expanded") === "false") {
            toggle.setAttribute("aria-expanded", true);

            if (toggle.closest(`.${classes.listItem}`)) {
              openParent(toggle.closest(`.${classes.listItem}`));
            }
          }
        }
      }
    }
  })(target);
}

function setActiveStateInNav(query) {
  const embeddedParam = "&embedded=true";
  const target = links.filter(
    link =>
      link
        .getAttribute("href")
        .replace(embeddedParam, "")
        .indexOf(
          query
            .replace(paths.container, paths.embedded)
            .replace(embeddedParam, "")
        ) >= 0
  )[0];
  const current = links.filter(link => link.getAttribute("aria-current"))[0];
  const prevEl = target.previousElementSibling;
  const toggle =
    prevEl && prevEl.classList.contains(classes.toggle) ? prevEl : null;

  if (current) {
    current.removeAttribute("aria-current");
  }

  target.setAttribute("aria-current", "page");

  if (toggle) {
    toggle.setAttribute("aria-expanded", true);
  }

  return target;
}

function onToggleMenuClick(toggle) {
  let newValue;

  if (toggle.getAttribute("aria-expanded") === "true") {
    newValue = false;
  } else {
    newValue = true;
  }
  toggle.setAttribute("aria-expanded", newValue);
}

function onToggleClick(toggle) {
  toggle.setAttribute(
    "aria-expanded",
    toggle.getAttribute("aria-expanded") === "true" ? false : true
  );
}

function onLinkClick(link, content, iframe) {
  const src = link.getAttribute("href");

  setActiveStateInNav(src);
  updateIframe(content, iframe, src);

  history.pushState(null, src, src.replace(paths.embedded, paths.container));

  if (window.innerWidth <= 512) {
    document
      .querySelector(`.${classes.toggleMenu}`)
      .setAttribute("aria-expanded", false);
  }
}

function onPopState(content, iframe) {
  if (document.location.search !== "") {
    updateIframe(
      content,
      iframe,
      document.location.href.replace(paths.container, paths.embedded)
    );
  } else {
    updateIframe(content, iframe, `${paths.embedded}file=all&embedded=true`);
  }

  const target = setActiveStateInNav(
    document.location.href
      .replace(location.origin, "")
      .replace(paths.container, paths.embedded)
  );

  closeOtherOpenedMenus(target);
  openParentMenus(target);
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(`.${classes.content}`);
  const iframe = document.querySelector(`.${classes.iframe}`);
  const toggleMenu = document.querySelector(`.${classes.toggleMenu}`);

  links = Array.from(document.querySelectorAll(`.${classes.link}`));
  toggles = Array.from(document.querySelectorAll(`.${classes.toggle}`));

  if (toggleMenu) {
    toggleMenu.addEventListener("click", e => {
      e.preventDefault();

      onToggleMenuClick(e.target);
    });
  }

  toggles.forEach(toggle => {
    toggle.addEventListener("click", e => {
      e.preventDefault();

      onToggleClick(e.target);
    });
  });

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      onLinkClick(e.target, content, iframe);
    });
  });

  window.addEventListener("popstate", () => onPopState(content, iframe));
});
