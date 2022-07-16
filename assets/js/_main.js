import "./_goto.js";
import "./_search.js";
import ThemeConfigSwitcher from "./config-switcher/theme.js";
import TextDirectionConfigSwitcher from "./config-switcher/text-direction.js";

class Main {
  constructor() {
    this.classes = {
      content: "Content",
      iframe: "Frame",
      frameWrapper: "FrameWrapper",
      toggleMenu: "Nav-toggleMobileMenu",
      menu: {
        directory: "Menu-component",
        link: "Menu-link",
        list: "Menu-list",
        listContainer: "Menu-listContainer",
        listItem: "Menu-listItem",
        toggleComponent: "Menu-toggle",
      },
    };

    this.elements = {
      content: document.querySelector(`.${this.classes.content}`),
      frameWrapper: document.querySelector(`.${this.classes.frameWrapper}`),
      iframe: document.querySelector(`.${this.classes.iframe}`),
      toggleMenu: document.querySelector(`.${this.classes.toggleMenu}`),
      links: Array.from(
        document.querySelectorAll(`.${this.classes.menu.link}`)
      ),
      directories: Array.from(
        document.querySelectorAll(
          `.${this.classes.menu.directory}:not(${this.classes.menu.link})`
        )
      ),
      componentToggles: Array.from(
        document.querySelectorAll(`.${this.classes.menu.toggleComponent}`)
      ),
    };

    this.addToggleMenuClickListener();
    this.addDirectoriesClickListener();
    this.addComponentTogglesClickListener();
    this.addLinksClickListener();
    this.addPopStateLisener();
    this.addPageChangedListener();

    new ThemeConfigSwitcher(document.querySelector(".js-ThemeSwitcher"));
    new TextDirectionConfigSwitcher(
      document.querySelector(".js-TextDirectionSwitcher")
    );
  }

  static toggleExpandedAttribute(toggle) {
    toggle.setAttribute(
      "aria-expanded",
      toggle.getAttribute("aria-expanded") === "true" ? false : true
    );
  }

  updateIframe(src) {
    this.elements.iframe.remove();
    this.elements.iframe.src = src;
    this.elements.frameWrapper.appendChild(this.elements.iframe);
  }

  convertPathToMainPath(path) {
    return path
      .replace(this.paths.embedded, this.paths.container)
      .replace(this.embeddedParam, "");
  }

  closeOtherOpenedComponents(target) {
    this.elements.componentToggles.forEach((toggle) => {
      if (toggle.getAttribute("aria-expanded") === "true") {
        if (
          !toggle.closest(`.${this.classes.menu.listItem}`).contains(target)
        ) {
          toggle.setAttribute("aria-expanded", false);
        }
      }
    });
  }

  openParentComponent(listContainer) {
    if (listContainer) {
      const toggle = this.elements.componentToggles.find(
        (toggle) => toggle.getAttribute("aria-controls") === listContainer.id
      );

      if (toggle) {
        toggle.setAttribute("aria-expanded", true);

        this.openParentComponent(
          toggle.closest(`.${this.classes.menu.listContainer}`)
        );
      }
    }
  }

  setActiveStateInNav(query) {
    {
      var target = this.elements.links.find((link) =>
        link
          .getAttribute("href")
          .includes(query.replace(this.paths.container, this.paths.embedded))
      );

      if (target) {
        const prevEl = target.previousElementSibling;
        var toggle =
          prevEl && prevEl.classList.contains(this.classes.menu.toggleComponent)
            ? prevEl
            : null;
      }
    }

    const current = this.elements.links.find((link) =>
      link.getAttribute("aria-current")
    );

    if (current) {
      current.removeAttribute("aria-current");
    }

    if (target) {
      target.setAttribute("aria-current", "page");
    }

    if (toggle) {
      toggle.setAttribute("aria-expanded", true);
    }

    return target;
  }

  openParentComponents(target) {
    this.openParentComponent(
      target.closest(`.${this.classes.menu.listContainer}`)
    );
  }

  closeToggleMenu() {
    if (window.innerWidth <= 512) {
      this.elements.toggleMenu.setAttribute("aria-expanded", false);
    }
  }

  updateUrl(src) {
    if (src === this.indexPath) {
      history.pushState(null, src, document.querySelector("base").href);
    } else {
      history.pushState(null, src, this.convertPathToMainPath(src));
    }
  }

  // events

  onPageChanged({ detail: query }) {
    const target = this.setActiveStateInNav(query);

    if (target) {
      this.closeOtherOpenedComponents(target);
      this.openParentComponents(target);
    }

    history.pushState(null, query, this.convertPathToMainPath(query));
  }

  onToggleMenuClick(toggle) {
    Main.toggleExpandedAttribute(toggle);
  }

  onDirectoryClick(directory) {
    const toggle = directory.previousElementSibling;

    if (
      toggle &&
      toggle.classList.contains(this.classes.menu.toggleComponent)
    ) {
      if (toggle.getAttribute("aria-expanded") === "true") {
        toggle.setAttribute("aria-expanded", false);
      } else {
        toggle.setAttribute("aria-expanded", true);
      }
    }
  }

  onComponentToggleClick(toggle) {
    Main.toggleExpandedAttribute(toggle);
  }

  onLinkClick(link) {
    const src = link.closest("a").getAttribute("href");

    this.setActiveStateInNav(src);
    this.updateIframe(src);
    this.closeToggleMenu();
    this.updateUrl(src);
  }

  onPopState(path) {
    const target = this.setActiveStateInNav(path);

    this.updateIframe(path);

    if (target) {
      this.closeOtherOpenedComponents(target);
      this.openParentComponents(target);
    }
  }

  // listeners

  addToggleMenuClickListener() {
    if (this.elements.toggleMenu) {
      this.elements.toggleMenu.addEventListener("click", (e) => {
        e.preventDefault();

        this.onToggleMenuClick(e.target);
      });

      this.elements.toggleMenu.addEventListener("keyup", (e) => {
        if (e.keyCode === 23) {
          e.preventDefault();

          this.onToggleMenuClick(e.target);
        }
      });
    }
  }

  addDirectoriesClickListener() {
    this.elements.directories.forEach((directory) => {
      directory.addEventListener("click", (e) => {
        e.preventDefault();

        this.onDirectoryClick(e.target);
      });
    });
  }

  addComponentTogglesClickListener() {
    this.elements.componentToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();

        this.onComponentToggleClick(e.target);
      });

      toggle.addEventListener("keyup", (e) => {
        if (e.keyCode === 32) {
          e.preventDefault();

          this.onComponentToggleClick(e.target);
        }
      });
    });
  }

  addLinksClickListener() {
    this.elements.links.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (!e.metaKey) {
          e.preventDefault();
          this.onLinkClick(e.target);
        }
      });

      link.addEventListener("keyup", (e) => {
        if (e.keyCode === 32) {
          e.preventDefault();

          this.onLinkClick(e.target);
        }
      });
    });
  }

  addPopStateLisener() {
    window.addEventListener("popstate", this.onPopState.bind(this));
  }

  addPageChangedListener() {
    window.addEventListener("pageChanged", this.onPageChanged.bind(this));
  }
}

export default Main;
