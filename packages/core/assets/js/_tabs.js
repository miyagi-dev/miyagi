class Tabs {
  constructor(element) {
    this.element = element;
    this.buttons = Array.from(
      this.element.querySelectorAll(".MiyagiTabs-button")
    );
    this.tabs = Array.from(this.element.querySelectorAll(".MiyagiTabs-tab"));
    this.index = 0;

    if (this.buttons.length === 1) {
      this.buttons[0].setAttribute("tabindex", -1);
    } else {
      this.buttons.forEach((button, i) => {
        if (i === 0) {
          button.setAttribute("tabindex", 0);
          button.setAttribute("aria-selected", true);
          this.tabs[i].removeAttribute("hidden");
        } else {
          button.setAttribute("tabindex", -1);
          button.setAttribute("aria-selected", false);
          this.tabs[i].setAttribute("hidden", true);
        }

        // on keydown,
        // determine which tab to select
        button.addEventListener("keydown", (e) => {
          const LEFT_ARROW = 37;
          const UP_ARROW = 38;
          const RIGHT_ARROW = 39;
          const DOWN_ARROW = 40;

          const key = e.which || e.keyCode;

          // if the key pressed was an arrow key
          if (key >= LEFT_ARROW && key <= DOWN_ARROW) {
            // move left one tab for left and up arrows
            if (key == LEFT_ARROW || key == UP_ARROW) {
              if (this.index > 0) {
                this.index--;
              }
              // unless you are on the first tab,
              // in which case select the last tab.
              else {
                this.index = this.buttons.length - 1;
              }
            }

            // move right one tab for right and down arrows
            else if (key == RIGHT_ARROW || key == DOWN_ARROW) {
              if (this.index < this.buttons.length - 1) {
                this.index += 1;
              }
              // unless you're at the last tab,
              // in which case select the first one
              else {
                this.index = 0;
              }
            }

            // trigger a click event on the tab to move to
            this.buttons[this.index].click();
            e.preventDefault();
          }
        });

        // just make the clicked tab the selected one
        button.addEventListener("click", (e) => {
          this.index = this.buttons.indexOf(e.target);
          this.setFocus();
          e.preventDefault();
        });
      });
    }
  }

  setFocus() {
    // undo tab control selected state,
    // and make them not selectable with the tab key
    // (all tabs)
    this.buttons.forEach((button) => {
      button.setAttribute("tabindex", -1);
      button.setAttribute("aria-selected", false);
    });

    // hide all tab panels.
    this.tabs.forEach((tab) => {
      tab.setAttribute("hidden", true);
    });

    // make the selected tab the selected one, shift focus to it
    this.buttons[this.index].setAttribute("tabindex", 0);
    this.buttons[this.index].setAttribute("aria-selected", true);
    this.buttons[this.index].focus();

    this.tabs[this.index].removeAttribute("hidden");
  }
}

export default Tabs;
