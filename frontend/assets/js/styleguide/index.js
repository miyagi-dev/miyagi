import ColorConverter from "./color-converter.js";

class Styleguide {
	/**
	 * @param {HTMLElement} element
	 */
	constructor(element) {
		this.element = element;
		this.items = Array.from(this.element.querySelectorAll(".CustomProp"));
		this.colors = Array.from(this.element.querySelectorAll(".Colors-item"));
		this.fonts = Array.from(this.element.querySelectorAll(".Fonts-item"));
		this.spacings = Array.from(this.element.querySelectorAll(".Spacings-item"));
		this.buttons = Array.from(
			this.element.querySelectorAll(".CustomProp-button"),
		);
		this.details = Array.from(
			this.element.querySelectorAll(".CustomProp-details"),
		);

		this.renderValues();
		this.element.dataset.mediaQueries.split(",").forEach((mq) => {
			const mql = window.matchMedia(mq);
			mql.addEventListener("change", this.renderValues.bind(this));
		});

		this.element.addEventListener("click", ({ target }) => {
			const item = target.closest(".CustomProp");
			const button = target.closest(".CustomProp-button");
			const details = target.closest(".CustomProp-details");

			if (button) {
				this.items.forEach((i) => {
					if (i !== item) i.setAttribute("aria-selected", false);
				});
				this.buttons.forEach((b) => {
					if (b !== button) b.setAttribute("aria-expanded", false);
				});
				this.details.forEach((d) => {
					if (d !== details) d.hidden = true;
				});

				const isExpanded = button.getAttribute("aria-expanded") === "true";

				document.getElementById(button.getAttribute("aria-controls")).hidden =
					isExpanded;

				item.setAttribute("aria-selected", !isExpanded);
				button.setAttribute("aria-expanded", !isExpanded);
			} else {
				if (!item) {
					this.items.forEach((b) => {
						b.setAttribute("aria-selected", false);
					});
					this.buttons.forEach((b) => {
						b.setAttribute("aria-expanded", false);
					});
					this.details.forEach((d) => {
						d.hidden = true;
					});
				}
			}
		});
	}

	/**
	 *
	 */
	renderValues() {
		this.renderColorValues();
		this.renderFontValues();
		this.renderSpacingValues();
	}

	/**
	 *
	 */
	renderColorValues() {
		this.colors.forEach((item) => {
			const color = getComputedStyle(item).getPropertyValue("--color").trim();

			item.querySelector('[data-value="RGB"]').textContent =
				ColorConverter(color).toRgbString();

			item.querySelector('[data-value="Hex"]').textContent =
				ColorConverter(color).toHexString();

			item.querySelector('[data-value="HSL"]').textContent =
				ColorConverter(color).toHslString();
		});
	}

	/**
	 *
	 */
	renderFontValues() {
		this.fonts.forEach((font) => {
			Array.from(font.querySelectorAll("[data-value]")).forEach((item) => {
				item.textContent = getComputedStyle(item)
					.getPropertyValue(item.dataset.value)
					.trim();
			});
		});
	}

	/**
	 *
	 */
	renderSpacingValues() {
		this.spacings.forEach((font) => {
			Array.from(font.querySelectorAll("[data-value]")).forEach((item) => {
				item.textContent = getComputedStyle(item)
					.getPropertyValue(item.dataset.value)
					.trim();
			});
		});
	}
}

export default Styleguide;
