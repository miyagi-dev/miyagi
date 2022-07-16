import Main from "./_main.js";

class MainDev extends Main {
  constructor() {
    super();

    this.paths = {
      embedded: "component?",
      container: "show?",
    };

    this.embeddedParam = "&embedded=true";
    this.indexPath = `/${this.paths.embedded}file=all${this.embeddedParam}`;
  }

  onPopState() {
    let path;

    if (document.location.search !== "") {
      path = `${document.location.href.replace(
        this.paths.container,
        this.paths.embedded
      )}${this.embeddedParam}`;
    } else {
      path = this.indexPath;
    }

    path = path.replace(document.location.origin, "");

    super.onPopState(path);
  }
}

document.addEventListener("DOMContentLoaded", () => new MainDev());
