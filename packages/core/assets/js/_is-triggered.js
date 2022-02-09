export const search = (target, key) => {
  return !checkIfTriggeredElementWasFormElement(target.tagName) && key === "f";
};

export const goto = (target, key) => {
  return !checkIfTriggeredElementWasFormElement(target.tagName) && key === "g";
};

/**
 * @param {HTMLElement} tagName
 * @returns {boolean}
 */
function checkIfTriggeredElementWasFormElement(tagName) {
  return ["INPUT", "SELECT", "TEXTAREA"].includes(tagName);
}
