import "./_accordion-tabs.js";
import "./_prism.js";
import "./_iframe-links.js";
import {
	goto as gotoIsTriggered,
	search as searchIsTriggered,
} from "./_is-triggered.js";

if (
	window.location.pathname.startsWith("/component-") &&
	window.location.href.endsWith("-embedded.html") &&
	window.self === window.top
) {
	window.location = new URL(window.location).replace(
		/-embedded\.html$/,
		".html",
	);
}

document.addEventListener("DOMContentLoaded", function () {
	const styleguide = document.querySelector(".MiyagiStyleguide");

	if (styleguide) {
		import("./styleguide/index.js")
			.then((Styleguide) => new Styleguide.default(styleguide))
			.catch((err) => console.error(err));
	}

	if (document.querySelector(".js-openMockData")) {
		import("./_mock-data.js");
	}
});

document.addEventListener("keyup", (e) => {
	const { path, originalTarget, target, key } = e;
	const el = path ? path[0] : originalTarget || target;

	if (searchIsTriggered(el, key)) {
		parent.window.dispatchEvent(new CustomEvent("searchTriggered"));
	} else if (gotoIsTriggered(el, key)) {
		parent.window.dispatchEvent(new CustomEvent("gotoTriggered"));
	}
});
