import "./_socket.js";
import "./_tests.js";
import "./_iframe-links.js";

if (
  location.href.indexOf("/component?") >= 0 &&
  location.href.indexOf("&embedded=true") >= 0 &&
  window.self === window.top
) {
  window.location = location.href.replace("&embedded=true", "");
}
