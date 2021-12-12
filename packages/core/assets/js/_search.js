import searchIsTriggered from "./_search-is-triggered.js";

document.addEventListener("DOMContentLoaded", () => {
  const SEARCH_INPUT = document.querySelector(".Menu-searchInput");
  const SEARCH_LABEL = document.querySelector(".Menu-searchLabel");
  const SEARCH_CLEAR = document.querySelector(".Menu-searchClear");

  const COMPONENTS = Array.from(
    document.querySelectorAll(".Menu-component")
  ).map((node) => {
    return {
      node,
      listItem: node.closest(".Menu-listItem"),
      label: node.textContent.toLowerCase(),
      matchesQuery: false,
      toggle: node.previousElementSibling || null,
      parentToggles: getParentToggles(node),
      initiallyOpened: node.previousElementSibling
        ? node.previousElementSibling.getAttribute("aria-expanded") === "true"
          ? true
          : false
        : false,
    };
  });

  if (SEARCH_INPUT) {
    if (SEARCH_CLEAR) {
      SEARCH_CLEAR.addEventListener("click", onClearSearch);
    }

    SEARCH_INPUT.addEventListener("input", onInputSearch);
    SEARCH_INPUT.addEventListener("keyup", onInputKeyup);

    window.addEventListener("keyup", ({ target, key }) => {
      if (searchIsTriggered(target, key)) {
        SEARCH_INPUT.focus();
      }
    });
    window.addEventListener("searchTriggered", () => {
      SEARCH_INPUT.focus();
    });
  }

  /**
   * @returns {void}
   */
  function onClearSearch() {
    SEARCH_INPUT.value = "";
    resetMenu();
  }

  /**
   * @param {object} event
   * @param {HTMLInputElement} event.target
   */
  function onInputSearch({ target }) {
    const QUERY = target.value.toLowerCase();

    if (QUERY.length > 0) {
      updateMenu(QUERY);
    } else {
      resetMenu();
    }
  }

  function onInputKeyup({ target, key }) {
    if (key.toLowerCase() === "escape") {
      target.value = "";
      target.blur();
      resetMenu();
    }
  }

  /**
   * @param {string} query
   */
  function updateMenu(query) {
    SEARCH_LABEL.classList.add("u-hiddenVisually");
    SEARCH_CLEAR.hidden = false;

    COMPONENTS.forEach((component) => {
      if (component.toggle) {
        component.toggle.setAttribute("aria-expanded", "false");
      }
      component.parentToggles.forEach((toggle) => {
        toggle.parentNode.classList.remove("has-match");
      });
    });

    COMPONENTS.forEach((component) => {
      component.matchesQuery = component.label.includes(query);
      component.listItem.classList.toggle("is-match", component.matchesQuery);
      component.listItem.classList.toggle(
        "is-no-match",
        !component.matchesQuery
      );

      if (component.matchesQuery) {
        component.node.innerHTML = component.label.replace(
          new RegExp(query, "g"),
          `<mark>${query}</mark>`
        );
        component.parentToggles.forEach((toggle) => {
          toggle.parentNode.classList.add("has-match");
          toggle.parentNode.classList.remove("has-no-match");
          toggle.setAttribute("aria-expanded", "true");
        });
      } else {
        component.node.textContent = component.label;
      }
    });

    COMPONENTS.forEach((component) => {
      if (!component.listItem.classList.contains("has-match")) {
        component.listItem.classList.add("has-no-match");
      }
    });
  }

  /**
   * @returns {void}
   */
  function resetMenu() {
    SEARCH_LABEL.classList.remove("u-hiddenVisually");
    SEARCH_CLEAR.hidden = true;

    COMPONENTS.forEach((component) => {
      if (component.matchesQuery) {
        component.node.textContent = component.label;
      }

      component.matchesQuery = false;

      if (component.toggle) {
        component.toggle.setAttribute(
          "aria-expanded",
          component.initiallyOpened ? "true" : "false"
        );
      }
    });

    document
      .querySelectorAll(".is-match, .is-no-match, .has-match, .has-no-match")
      .forEach((el) =>
        el.classList.remove(
          "is-match",
          "is-no-match",
          "has-match",
          "has-no-match"
        )
      );
  }

  /**
   * @param {HTMLElement} node
   * @returns {Array}
   */
  function getParentToggles(node) {
    const parentToggles = [];
    let element = node;

    while (
      element.closest(".Menu-listItem").parentNode.closest(".Menu-listItem")
    ) {
      const toggle = element
        .closest(".Menu-listItem")
        .parentNode.closest(".Menu-listItem")
        .querySelector(".Menu-toggle");

      if (toggle) {
        parentToggles.push(toggle);
      }
      element = element
        .closest(".Menu-listItem")
        .parentNode.closest(".Menu-listItem");
    }

    return parentToggles;
  }
});
