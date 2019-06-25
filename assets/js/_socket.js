/* globals io */

const socket = io.connect(
  `${window.location.protocol}//${window.location.hostname}:${
    window.location.port
  }`
);

socket.on("fileChanged", reloadParent => {
  setTimeout(() => {
    if (reloadParent) {
      parent.window.location.reload();
    } else {
      window.location.reload();
    }
  }, 500);
});
