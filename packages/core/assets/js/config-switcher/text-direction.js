import ConfigSwitcher from "./index.js";

class TextDirectionConfigSwitcher extends ConfigSwitcher {
  /**
   * @param {HTMLFormElement} form
   * @memberof TextDirectionConfigSwitcher
   */
  constructor(form) {
    super(form);
  }

  /**
   * @param {string} value
   */
  renderTheme(value) {
    super.renderTheme(value);

    this.iframe
      .querySelectorAll(".MiyagiComponent-html")
      .forEach((el) => el.setAttribute("dir", value));

    this.iframes.forEach((frame) => {
      frame.document.documentElement.setAttribute("dir", value);
    });
  }
}

export default TextDirectionConfigSwitcher;
