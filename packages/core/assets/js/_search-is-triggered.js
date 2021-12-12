export default (target, key) => {
  return (
    !["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) && key === "f"
  );
};
