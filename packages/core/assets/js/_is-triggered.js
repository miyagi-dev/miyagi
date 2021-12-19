export const search = (target, key) => {
  return (
    !["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) && key === "f"
  );
};

export const goto = (target, key) => {
  return (
    !["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) && key === "g"
  );
};
