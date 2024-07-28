const openMockData = Array.from(document.querySelectorAll(".js-openMockData"));

openMockData.forEach((button) => {
	button.addEventListener("click", (e) => {
		const target = document.getElementById(
			e.target.closest("button").getAttribute("aria-controls"),
		);

		if (target) {
			target.showModal();
		}
	});
});
