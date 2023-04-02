const ws = new WebSocket(`ws://${document.location.host}`);

ws.onmessage = async (message) => {
	if (message.data === "reloadParent") {
		parent.window.location.reload();
	} else {
		window.location.reload();
	}
};
