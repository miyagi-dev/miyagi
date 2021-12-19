import { goto as gotoIsTriggered } from "./_is-triggered.js";

document.addEventListener("DOMContentLoaded", () => {
  const GOTO = document.querySelector(".GoTo");
  let isOpen = false;

  if (GOTO) {
    const URL_PATTERN = GOTO.dataset.urlPattern;
    const INPUT = GOTO.querySelector(".GoTo-input");
    const DATA_LIST = GOTO.querySelector("#goto-list");

    if (INPUT && DATA_LIST) {
      const VALUES = Array.from(DATA_LIST.querySelectorAll("option")).map(
        (el) => el.value
      );

      INPUT.addEventListener("input", ({ target }) => {
        const VALUE = target.value;

        if (VALUES.includes(VALUE)) {
          document.location.href = URL_PATTERN.replace("{{component}}", VALUE);
        }
      });

      window.addEventListener("keyup", ({ target, key }) => {
        const lowerCasedKey = key.toLowerCase();

        if (gotoIsTriggered(target, lowerCasedKey)) {
          openGoto(GOTO, INPUT);
        } else if (isOpen && lowerCasedKey === "escape") {
          closeGoto(GOTO, INPUT);
        }
      });
      window.addEventListener("gotoTriggered", () => openGoto(GOTO, INPUT));
    }
  }

  /**
   * @param {HTMLFormElement} goto
   * @param {HTMLInputElement} input
   */
  function openGoto(goto, input) {
    goto.classList.remove("u-hiddenVisually");
    input.focus();
    isOpen = true;
  }

  /**
   * @param {HTMLFormElement} goto
   * @param {HTMLInputElement} input
   */
  function closeGoto(goto, input) {
    GOTO.classList.add("u-hiddenVisually");
    input.value = "";
    input.blur();
    isOpen = false;
  }
});
