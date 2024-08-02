import ConfigSwitcher from "./index.js";

class TextDirectionConfigSwitcher extends ConfigSwitcher {
	/**
	 * @param {HTMLFormElement} form
	 * @memberof TextDirectionConfigSwitcher
	 */
	constructor(form) {
		super(form);

		if (this.iframe) {
			this.iframe.addEventListener("load", () => {
				this.iframeHtml = this.iframe.document.documentElement;

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
		this.iframeHtml
			.querySelectorAll(".MiyagiComponent-html")
			.forEach((el) => el.setAttribute("dir", value));

		this.iframes.forEach((frame) => {
			frame.document.documentElement.setAttribute("dir", value);
		});
	}
}

export default TextDirectionConfigSwitcher;
