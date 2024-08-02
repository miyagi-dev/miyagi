import "./_goto.js";
import "./_search.js";
import ThemeConfigSwitcher from "./config-switcher/theme.js";
import TextDirectionConfigSwitcher from "./config-switcher/text-direction.js";
import DevelopmentModeConfigSwitcher from "./config-switcher/development-mode.js";

class Main {
	/**
	 *
	 */
	constructor() {
		this.classes = {
			content: "Content",
			iframe: "Frame",
			frameWrapper: "FrameWrapper",
			toggleMenu: "Nav-toggleMobileMenu",
			menu: {
				rootLink: "Title-link",
				list: "Nav-list",
				children: "Nav-children",
				link: "Nav-item--link",
				variant: "Nav-variant",
				listItem: "Nav-entry",
				toggleComponent: "Nav-toggle",
			},
		};

		this.elements = {
			rootLink: document.querySelector(`.${this.classes.menu.rootLink}`),
			content: document.querySelector(`.${this.classes.content}`),
			frameWrapper: document.querySelector(`.${this.classes.frameWrapper}`),
			iframe: document.querySelector(`.${this.classes.iframe}`),
			toggleMenu: document.querySelector(`.${this.classes.toggleMenu}`),
			children: Array.from(
				document.querySelectorAll(`.${this.classes.menu.children}`),
			),
			links: Array.from(
				document.querySelectorAll(
					`.${this.classes.menu.link}, .${this.classes.menu.variant}`,
				),
			),
			componentToggles: Array.from(
				document.querySelectorAll(`.${this.classes.menu.toggleComponent}`),
			),
		};

		this.addToggleMenuClickListener();
		this.addComponentTogglesClickListener();
		this.addLinksClickListener();
		this.addPopStateLisener();
		this.addPageChangedListener();

		new ThemeConfigSwitcher(document.querySelector(".js-ThemeSwitcher"));
		new TextDirectionConfigSwitcher(
			document.querySelector(".js-TextDirectionSwitcher"),
		);
		new DevelopmentModeConfigSwitcher(
			document.querySelector(".js-DevelopmentModeSwitcher"),
		);
	}

	/**
	 * @param {HTMLButtonElement} toggle
	 */
	static toggleExpandedAttribute(toggle) {
		const open =
			toggle.getAttribute("aria-expanded") === "false" ? true : false;
		toggle.setAttribute("aria-expanded", open ? "true" : "false");
		document.getElementById(toggle.getAttribute("aria-controls")).hidden =
			!open;
	}

	/**
	 * @param {string} src
	 */
	updateIframe(src) {
		this.elements.iframe.remove();
		this.elements.iframe.src = src;
		this.elements.frameWrapper.appendChild(this.elements.iframe);
	}

	/**
	 * @param {string} path
	 * @returns {string}
	 */
	convertPathToMainPath(path) {
		return path
			.replace(this.paths.embedded, this.paths.container)
			.replace(this.embeddedParam, "");
	}

	/**
	 * @param {HTMLElement} target
	 */
	closeOtherOpenedComponents(target) {
		this.elements.componentToggles.forEach((toggle) => {
			if (toggle.getAttribute("aria-expanded") === "true") {
				if (
					!toggle.closest(`.${this.classes.menu.listItem}`).contains(target)
				) {
					toggle.setAttribute("aria-expanded", false);
				}
			}
		});
	}

	/**
	 * @param {HTMLElement} listContainer
	 */
	openParentComponent(listContainer) {
		if (listContainer) {
			const toggle = this.elements.componentToggles.find(
				(toggle) => toggle.getAttribute("aria-controls") === listContainer.id,
			);

			if (toggle) {
				toggle.setAttribute("aria-expanded", true);

				this.openParentComponent(
					toggle.closest(`.${this.classes.menu.listContainer}`),
				);
			}
		}
	}

	/**
	 * @param {string} query
	 * @returns {HTMLElement}
	 */
	setActiveStateInNav(query) {
		{
			var target = this.elements.links.find(
				(link) =>
					query.includes(link.getAttribute("href")) ||
					link
						.getAttribute("href")
						.includes(query.replace(this.paths.container, this.paths.embedded)),
			);

			if (target) {
				const prevEl = target.previousElementSibling;
				var toggle =
					prevEl && prevEl.classList.contains(this.classes.menu.toggleComponent)
						? prevEl
						: null;
			}
		}

		const current = this.elements.links.find((link) =>
			link.getAttribute("aria-current"),
		);

		if (current) {
			current.removeAttribute("aria-current");
		}

		if (target) {
			target.setAttribute("aria-current", "page");
		}

		if (toggle) {
			toggle.setAttribute("aria-expanded", "true");
			document.getElementById(toggle.getAttribute("aria-controls")).hidden =
				false;
		}

		return target;
	}

	/**
	 * @param {HTMLElement} target
	 */
	openParentComponents(target) {
		this.openParentComponent(
			target.closest(`.${this.classes.menu.listContainer}`),
		);
	}

	/**
	 *
	 */
	closeToggleMenu() {
		if (window.innerWidth <= 512) {
			this.elements.toggleMenu.setAttribute("aria-expanded", false);
		}
	}

	/**
	 * @param {string} src
	 */
	updateUrl(src) {
		if (src.startsWith("iframe-")) {
			history.pushState(null, src, src.replace("iframe-", ""));
		} else if (src.startsWith("/iframe")) {
			history.pushState(null, src, src.replace("/iframe", ""));
		} else if (src === this.indexPath) {
			history.pushState(null, src, document.querySelector("base").href);
		} else {
			history.pushState(null, src, this.convertPathToMainPath(src));
		}
	}

	// events

	/**
	 *
	 * @param {Event} root0
	 * @param {object} root0.detail
	 */
	onPageChanged({ detail: query }) {
		const target = this.setActiveStateInNav(query);

		if (target) {
			this.closeOtherOpenedComponents(target);
			this.openParentComponents(target);
		}

		history.pushState(null, query, this.convertPathToMainPath(query));
	}

	/**
	 * @param {HTMLButtonElement} toggle
	 */
	onToggleMenuClick(toggle) {
		Main.toggleExpandedAttribute(toggle);
	}

	/**
	 * @param {HTMLButtonElement} toggle
	 */
	onComponentToggleClick(toggle) {
		Main.toggleExpandedAttribute(toggle);
	}

	/**
	 * @param {HTMLElement} link
	 */
	onRootLinkClick(link) {
		const anchor = link.closest("a");
		const src = anchor.getAttribute("href");

		anchor.setAttribute("aria-current", "page");

		this.elements.componentToggles.forEach((toggle) => {
			toggle.setAttribute("aria-expanded", "false");
		});

		this.elements.links.forEach((link) => {
			link.removeAttribute("aria-current");
		});

		this.elements.children.forEach((list) => {
			list.hidden = true;
		});

		this.updateIframe(src);
		this.closeToggleMenu();
		this.updateUrl(src);
	}

	/**
	 * @param {HTMLElement} link
	 */
	onLinkClick(link) {
		const src = link.closest("a").getAttribute("href");

		this.setActiveStateInNav(src);
		this.updateIframe(src);
		this.closeToggleMenu();
		this.updateUrl(src);
	}

	/**
	 * @param {string} path
	 */
	onPopState(path) {
		const target = this.setActiveStateInNav(path);

		this.updateIframe(path);

		if (target) {
			this.closeOtherOpenedComponents(target);
			this.openParentComponents(target);
		}
	}

	// listeners

	/**
	 * @returns {void}
	 */
	addToggleMenuClickListener() {
		if (this.elements.toggleMenu) {
			this.elements.toggleMenu.addEventListener("click", (e) => {
				e.preventDefault();

				this.onToggleMenuClick(e.target);
			});

			this.elements.toggleMenu.addEventListener("keyup", (e) => {
				if (e.keyCode === 23) {
					e.preventDefault();

					this.onToggleMenuClick(e.target);
				}
			});
		}
	}

	/**
	 * @returns {void}
	 */
	addComponentTogglesClickListener() {
		this.elements.componentToggles.forEach((toggle) => {
			toggle.addEventListener("click", (e) => {
				e.preventDefault();

				this.onComponentToggleClick(e.target);
			});

			toggle.addEventListener("keyup", (e) => {
				if (e.keyCode === 32) {
					e.preventDefault();

					this.onComponentToggleClick(e.target);
				}
			});
		});
	}

	/**
	 * @returns {void}
	 */
	addLinksClickListener() {
		this.elements.rootLink.addEventListener("click", (e) => {
			if (!e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				this.onRootLinkClick(e.target);
			}
		});

		this.elements.links.forEach((link) => {
			link.addEventListener("click", (e) => {
				if (!e.metaKey && !e.ctrlKey) {
					e.preventDefault();
					this.onLinkClick(e.target);
				}
			});

			link.addEventListener("keyup", (e) => {
				if (e.keyCode === 32) {
					e.preventDefault();

					this.onLinkClick(e.target);
				}
			});
		});
	}

	/**
	 * @returns {void}
	 */
	addPopStateLisener() {
		window.addEventListener("popstate", this.onPopState.bind(this));
	}

	/**
	 * @returns {void}
	 */
	addPageChangedListener() {
		window.addEventListener("pageChanged", this.onPageChanged.bind(this));
	}
}

export default Main;
