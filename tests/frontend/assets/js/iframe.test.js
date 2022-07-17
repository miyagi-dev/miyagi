require("../../../../frontend/assets/js/iframe.js");

describe("assets/js/iframe.js", () => {
	describe("is embedded", () => {
		describe.skip("clicking on a link", () => {
			const link = document.createElement("a");
			link.classList.add("MiyagiComponent-file");
			link.setAttribute("href", "the target");
			document.body.appendChild(link);

			test("calls history.replaceState", () => {
				const spy = jest.spyOn(history, "replaceState");
				document.dispatchEvent(new Event("DOMContentLoaded"));

				link.dispatchEvent(new Event("click"));

				expect(spy).toHaveBeenCalledWith(
					null,
					null,
					`${location.origin}/the%20target`
				);
			});

			test("triggers 'pageChanged' on parent.window", () => {
				const spy = jest.spyOn(parent.window, "dispatchEvent");
				document.dispatchEvent(new Event("DOMContentLoaded"));

				link.dispatchEvent(new Event("click"));

				expect(spy).toHaveBeenCalledWith(
					new CustomEvent("pageChanged", {
						detail: encodeURI("the target"),
					})
				);
			});
		});
	});

	describe("is not embedded", () => {
		test("", () => {
			const link = document.createElement("a");
			link.classList.add("MiyagiComponent-file");
			document.body.appendChild(link);
			document.dispatchEvent(new Event("DOMContentLoaded"));

			link.dispatchEvent(new Event("click"));
		});
	});
});
