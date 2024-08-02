import ConfigSwitcher from "./index.js";

class DevelopmentModeConfigSwitcher extends ConfigSwitcher {
	/**
	 * @param {HTMLFormElement} form
	 * @memberof DevelopmentModeConfigSwitcher
	 */
	constructor(form) {
		super(form);

		if (window.frames.iframe) {
			window.frames.iframe.addEventListener("load", () => {
				if (this.cookieValue) {
					this.renderTheme(this.cookieValue);
				}
			});
		}
	}

	/**
	 * @param {Event} event
	 * @param {HTMLInputElement} event.target
	 */
	onThemeChange({ target }) {
		const value = target.checked ? "dev" : "presentation";

		this.saveTheme(value);
		this.renderTheme(value);
	}

	/**
	 * @param {string} value
	 */
	renderSwitcher() {
		if (this.cookieValue) {
			this.form.querySelector('[type="checkbox"]').checked =
				this.cookieValue == "dev";
		}
	}

	/**
	 * @param {string} value
	 */
	renderTheme(value) {
		window.frames.iframe.document.documentElement.dataset.mode = value;
	}
}

export default DevelopmentModeConfigSwitcher;
