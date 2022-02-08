export const search = (targets, key) => {
  return (
    targets
      .map((target) => target.tagName)
      .every((tagName) => !["INPUT", "SELECT", "TEXTAREA"].includes(tagName)) &&
    key === "f"
  )
}

export const goto = (targets, key) => {
  return (
    targets
      .map((target) => target.tagName)
      .every((tagName) => !["INPUT", "SELECT", "TEXTAREA"].includes(tagName)) &&
    key === "g"
  )
}
