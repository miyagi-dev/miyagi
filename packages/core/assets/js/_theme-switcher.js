/**
 * @typedef {"auto" | "light" | "dark"} Theme
 */

const OPTIONS = ["light", "dark", "auto"];
const THEME_CLASS_PREFIX = "theme";

let THEME_SWITCHER;
let LOGO_WRAPPER;
let LOGO_IMG;

document.addEventListener("DOMContentLoaded", () => {
  THEME_SWITCHER = document.querySelector(".ThemeSwitcher");
  LOGO_WRAPPER = document.querySelector(".Nav-projectLogo");

  if (LOGO_WRAPPER) {
    LOGO_IMG = LOGO_WRAPPER.querySelector("img");
  }

  THEME_SWITCHER.querySelectorAll('[name="theme"]').forEach((input) => {
    input.addEventListener("change", onThemeChange);
  });
});

/**
 * @param {Event} event
 * @param {HTMLInputElement} event.target
 */
function onThemeChange({ target }) {
  const { value } = target;

  saveTheme(value);
  renderTheme(value);
}

/**
 * @param {Theme} theme
 */
function saveTheme(theme) {
  document.cookie = `miyagi_${document.title}_theme=${theme};`;
}

/**
 * @param {Theme} theme
 */
function renderTheme(theme) {
  const IFRAMES = Array.from(window.frames.iframe.frames);
  const IFRAME_HTML_NODE = window.frames.iframe.document.documentElement;

  OPTIONS.forEach((option) => {
    document.documentElement.classList.remove(
      `${THEME_CLASS_PREFIX}-${option}`
    );

    if (IFRAME_HTML_NODE) {
      IFRAME_HTML_NODE.classList.remove(`MiyagiTheme--${option}`);
    }

    IFRAMES.forEach((frame) => {
      frame.document.documentElement.classList.remove(`MiyagiTheme--${option}`);
    });
  });

  THEME_SWITCHER.querySelector(`[value="${theme}"]`).checked = true;

  document.documentElement.classList.add(`${THEME_CLASS_PREFIX}-${theme}`);

  IFRAME_HTML_NODE.classList.add(`MiyagiTheme--${theme}`);
  IFRAMES.forEach((frame) => {
    frame.document.documentElement.classList.add(`MiyagiTheme--${theme}`);
  });

  if (LOGO_WRAPPER) {
    if (theme === "auto") {
      OPTIONS.forEach((option) => {
        if (option === "auto") return;

        const source = document.createElement("source");
        source.srcset = LOGO_IMG.dataset[option];
        source.media = `(prefers-color-scheme: ${option})`;

        LOGO_WRAPPER.prepend(source);
      });
    } else {
      LOGO_WRAPPER.querySelectorAll("source").forEach((source) =>
        source.remove()
      );
      LOGO_IMG.src = LOGO_IMG.dataset[theme];
    }
  }
}
