/* globals io */

function fileChangedCallback(reloadParent) {
  setTimeout(() => {
    if (reloadParent) {
      parent.window.location.reload();
    } else {
      window.location.reload();
    }
  }, 500);
}

if (typeof io !== "undefined") {
  const socket = io.connect(window.location.origin);

  socket.on("fileChanged", fileChangedCallback);
}
