import ConfigSwitcher from "./index.js";

class ThemeConfigSwitcher extends ConfigSwitcher {
	/**
	 * @param {HTMLFormElement} form
	 * @memberof ThemeConfigSwitcher
	 */
	constructor(form) {
		super(form);

		this.logoWrapper = document.querySelector(".Title-logo");
		if (this.logoWrapper) {
			this.logoImage = this.logoWrapper.querySelector("img");
		}

		if (window.frames.iframe) {
			if (this.cookieValue) {
				this.render(this.cookieValue);
			}

			window.frames.iframe.addEventListener("load", () => {
				if (this.cookieValue) {
					this.renderTheme(this.cookieValue);
				}
			});
		}
	}

	onThemeChange({ target }) {
		super.onThemeChange({ target });

		this.render(target.value);
	}

	/**
	 * @param {string} value
	 */
	renderTheme(value) {
		this.options.forEach((option) => {
			if (window.frames.iframe.document.documentElement) {
				window.frames.iframe.document.documentElement.classList.remove(
					`theme-${option}`,
				);
			}

			Array.from(window.frames.iframe.frames).forEach((frame) => {
				frame.document.documentElement.classList.remove(`theme-${option}`);
			});
		});

		window.frames.iframe.document.documentElement.classList.add(
			`theme-${value}`,
		);
		Array.from(window.frames.iframe.frames).forEach((frame) => {
			frame.document.documentElement.classList.add(`theme-${value}`);
		});
	}

	render(value) {
		this.options.forEach((option) => {
			document.documentElement.classList.remove(`${this.name}-${option}`);
		});

		document.documentElement.classList.add(`${this.name}-${value}`);

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
