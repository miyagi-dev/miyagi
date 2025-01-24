import ConfigSwitcher from "./index.js";

class TextDirectionConfigSwitcher extends ConfigSwitcher {
	/**
	 * @param {HTMLFormElement} form
	 * @memberof TextDirectionConfigSwitcher
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
	 * @param {string} value
	 */
	renderTheme(value) {
		Array.from(window.frames.iframe.frames).forEach((frame) => {
			frame.document.documentElement.setAttribute("dir", value);
		});
	}
}

export default TextDirectionConfigSwitcher;
