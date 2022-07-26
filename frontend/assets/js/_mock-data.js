const openMockData = Array.from(document.querySelectorAll(".js-openMockData"));

openMockData.forEach((button) => {
	button.addEventListener("click", (e) => {
		const target = document.getElementById(
			e.target.closest("button").getAttribute("aria-controls")
		);
		const closeButton = target.querySelector(".js-closeMockData");

		target.hidden = false;

		const closeHandler = () => {
			target.hidden = true;
			closeButton.removeEventListener("click", closeHandler);
			document.removeEventListener("keydown", keyboardCloseHandler);
		};
		const keyboardCloseHandler = (e) => {
			if (e.key === "Escape") {
				closeHandler();
			}
		};

		closeButton.addEventListener("click", closeHandler);
		document.addEventListener("keydown", keyboardCloseHandler);
		closeButton.focus();
	});
});
