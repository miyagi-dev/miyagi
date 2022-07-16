/**
 * @typedef {"auto" | "light" | "dark"} Theme
 */

class ConfigSwitcher {
  constructor(form) {
    this.form = form;
    this.inputs = Array.from(this.form.querySelectorAll('[type="radio"]'));
    this.options = this.inputs.map((el) => el.value);
    this.name = this.inputs[0].name;
    this.normalizedTitle = document.title;

    this.inputs.forEach((input) => {
      input.addEventListener("change", this.onThemeChange.bind(this));
    });
  }

  /**
   * @param {Event} event
   * @param {HTMLInputElement} event.target
   */
  onThemeChange({ target }) {
    const { value } = target;

    this.saveTheme(value);
    this.renderTheme(value);
  }

  /**
   * @param {string} value
   */
  saveTheme(value) {
    document.cookie = `miyagi_${document.title}_${this.name}=${value};`;
  }

  /**
   * @param {Theme} value
   */
  renderTheme(value) {
    this.form.querySelector(`[value="${value}"]`).checked = true;
    this.iframe = window.frames.iframe.document.documentElement;
    this.iframes = Array.from(window.frames.iframe.frames);
  }
}

export default ConfigSwitcher;
