/**
 * @typedef {"auto" | "light" | "dark"} Theme
 */

class ConfigSwitcher {
	/**
	 * @param {HTMLElement} form
	 */
	constructor(form) {
		this.form = form;
		this.inputs = Array.from(
			this.form.querySelectorAll('[type="radio"], [type="checkbox"]'),
		);
		this.options = this.inputs.map((el) => el.value);
		this.name = this.inputs[0].name;
		this.cookieName = `miyagi_${document.title.replaceAll(" ", "-")}_${this.name}`;
		this.cookieValue = this.#getCookie(this.cookieName);

		this.inputs.forEach((input) => {
			input.addEventListener("change", this.onThemeChange.bind(this));
		});

		this.renderSwitcher();
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
		document.cookie = `${this.cookieName}=${value};`;
	}

	/**
	 * @param {Theme} value
	 */
	renderSwitcher() {
		const input = this.form.querySelector(`[value="${this.cookieValue}"]`);

		if (input) {
			input.checked = true;
		}
	}

	#getCookie(name) {
		return document.cookie.split("; ").reduce((r, v) => {
			const parts = v.split("=");
			return parts[0] === name ? decodeURIComponent(parts[1]) : r;
		}, "");
	}
}

export default ConfigSwitcher;
