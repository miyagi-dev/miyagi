customElements.define(
  "element-details",
  class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById("element-details-template")
        .content;
      this.attachShadow({ mode: "open" }).appendChild(template.cloneNode(true));
    }
  }
);
