class Main {
  constructor() {
    this.classes = {
      list: "Headman-list",
      listContainer: "Headman-listContainer",
      listItem: "Headman-listItem",
      content: "Headman-content",
      iframe: "Headman-frame",
      toggleComponent: "Headman-toggle",
      toggleMenu: "Headman-toggleMobileMenu",
      link: "Headman-link"
    };

    this.elements = {
      content: document.querySelector(`.${this.classes.content}`),
      iframe: document.querySelector(`.${this.classes.iframe}`),
      toggleMenu: document.querySelector(`.${this.classes.toggleMenu}`),
      links: Array.from(document.querySelectorAll(`.${this.classes.link}`)),
      componentToggles: Array.from(
        document.querySelectorAll(`.${this.classes.toggleComponent}`)
      )
    };

    this.addToggleMenuClickListener();
    this.addComponentTogglesClickListener();
    this.addLinksClickListener();
    this.addPopStateLisener();
    this.addPageChangedListener();
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
    this.elements.content.insertBefore(
      this.elements.iframe,
      this.elements.content.lastElementChild
    );
  }

  convertPathToMainPath(path) {
    return path
      .replace(this.paths.embedded, this.paths.container)
      .replace(this.embeddedParam, "");
  }

  closeOtherOpenedComponents(target) {
    this.elements.componentToggles.forEach(toggle => {
      if (toggle.getAttribute("aria-expanded") === "true") {
        if (!toggle.closest(`.${this.classes.listItem}`).contains(target)) {
          toggle.setAttribute("aria-expanded", false);
        }
      }
    });
  }

  openParentComponent(listContainer) {
    if (listContainer) {
      const toggle = this.elements.componentToggles.find(
        toggle => toggle.getAttribute("aria-controls") === listContainer.id
      );

      if (toggle) {
        toggle.setAttribute("aria-expanded", true);

        this.openParentComponent(
          toggle.closest(`.${this.classes.listContainer}`)
        );
      }
    }
  }

  setActiveStateInNav(query) {
    {
      var target = this.elements.links.find(link =>
        link
          .getAttribute("href")
          .includes(query.replace(this.paths.container, this.paths.embedded))
      );

      const prevEl = target.previousElementSibling;
      var toggle =
        prevEl && prevEl.classList.contains(this.classes.toggleComponent)
          ? prevEl
          : null;
    }

    const current = this.elements.links.find(link =>
      link.getAttribute("aria-current")
    );

    if (current) {
      current.removeAttribute("aria-current");
    }

    target.setAttribute("aria-current", "page");

    if (toggle) {
      toggle.setAttribute("aria-expanded", true);
    }

    return target;
  }

  openParentComponents(target) {
    this.openParentComponent(target.closest(`.${this.classes.listContainer}`));
  }

  closeToggleMenu() {
    if (window.innerWidth <= 512) {
      this.elements.toggleMenu.setAttribute("aria-expanded", false);
    }
  }

  updateUrl(src) {
    if (src === this.indexPath) {
      history.pushState(null, src, "/");
    } else {
      history.pushState(null, src, this.convertPathToMainPath(src));
    }
  }

  // events

  onPageChanged({ detail: query }) {
    const target = this.setActiveStateInNav(query);

    this.closeOtherOpenedComponents(target);
    this.openParentComponents(target);

    history.pushState(null, query, this.convertPathToMainPath(query));
  }

  onToggleMenuClick(toggle) {
    Main.toggleExpandedAttribute(toggle);
  }

  onComponentToggleClick(toggle) {
    Main.toggleExpandedAttribute(toggle);
  }

  onLinkClick(link) {
    const src = link.getAttribute("href");

    this.setActiveStateInNav(src);
    this.updateIframe(src);
    this.closeToggleMenu();
    this.updateUrl(src);
  }

  onPopState(path) {
    const target = this.setActiveStateInNav(path);

    this.updateIframe(path);
    this.closeOtherOpenedComponents(target);
    this.openParentComponents(target);
  }

  // listeners

  addToggleMenuClickListener() {
    if (this.elements.toggleMenu) {
      this.elements.toggleMenu.addEventListener("click", e => {
        e.preventDefault();

        this.onToggleMenuClick(e.target);
      });

      this.elements.toggleMenu.addEventListener("keyup", e => {
        if (e.keyCode === 23) {
          e.preventDefault();

          this.onToggleMenuClick(e.target);
        }
      });
    }
  }

  addComponentTogglesClickListener() {
    this.elements.componentToggles.forEach(toggle => {
      toggle.addEventListener("click", e => {
        e.preventDefault();

        this.onComponentToggleClick(e.target);
      });

      toggle.addEventListener("keyup", e => {
        if (e.keyCode === 32) {
          e.preventDefault();

          this.onComponentToggleClick(e.target);
        }
      });
    });
  }

  addLinksClickListener() {
    this.elements.links.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();

        this.onLinkClick(e.target);
      });

      link.addEventListener("keyup", e => {
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
