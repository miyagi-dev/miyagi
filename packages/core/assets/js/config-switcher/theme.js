import ConfigSwitcher from "./index.js";

class ThemeConfigSwitcher extends ConfigSwitcher {
  /**
   * @param {HTMLFormElement} form
   * @memberof ThemeConfigSwitcher
   */
  constructor(form) {
    super(form);

    this.logoWrapper = document.querySelector(".Nav-projectLogo");
    if (this.logoWrapper) {
      this.logoImage = this.logoWrapper.querySelector("img");
    }
  }

  /**
   * @param {string} value
   */
  renderTheme(value) {
    super.renderTheme(value);

    this.options.forEach((option) => {
      document.documentElement.classList.remove(`${this.name}-${option}`);

      if (this.iframe) {
        this.iframe.classList.remove(`MiyagiTheme--${option}`);
      }

      this.iframes.forEach((frame) => {
        frame.document.documentElement.classList.remove(
          `MiyagiTheme--${option}`
        );
      });
    });

    document.documentElement.classList.add(`${this.name}-${value}`);

    this.iframe.classList.add(`MiyagiTheme--${value}`);
    this.iframes.forEach((frame) => {
      frame.document.documentElement.classList.add(`MiyagiTheme--${value}`);
    });

    if (this.logoWrapper) {
      if (value === "auto") {
        this.options.forEach((option) => {
          if (option === "auto") return;

          const source = document.createElement("source");
          source.srcset = this.logoImage.dataset[option];
          source.media = `(prefers-color-scheme: ${option})`;

          this.logoWrapper.prepend(source);
        });
      } else {
        this.logoWrapper
          .querySelectorAll("source")
          .forEach((source) => source.remove());
        this.logoImage.src = this.logoImage.dataset[value];
      }
    }
  }
}

export default ThemeConfigSwitcher;
