const io = require("socket.io");

const socket = io.connect(
  `${window.location.protocol}//${window.location.hostname}:${
    window.location.port
  }`
);

socket.on("fileChanged", () => {
  setTimeout(() => {
    window.location.reload();
  }, 500);
});
