import Main from "./_main.js";

class MainBuild extends Main {
  constructor() {
    super();

    this.paths = {
      embedded: "component-",
      container: "show-"
    };

    this.indexPath = "component-all-embedded.html";
    this.embeddedParam = "-embedded";
  }

  onPopState() {
    let path;

    if (document.location.pathname !== "/") {
      path = document.location.pathname
        .replace(this.paths.container, this.paths.embedded)
        .replace(".html", `${this.embeddedParam}.html`)
        .slice(1);
    } else {
      path = `${this.paths.embedded}all-embedded.html`;
    }

    super.onPopState(path);
  }
}

document.addEventListener("DOMContentLoaded", () => new MainBuild());
