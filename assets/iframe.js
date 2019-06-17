document.addEventListener("DOMContentLoaded", () => {
  const a11yResults = axs.Audit.run();

  const passed = Object.entries(a11yResults).filter(result => {
    return result[1].result === "PASS";
  });

  const na = Object.entries(a11yResults).filter(result => {
    return result[1].result === "NA";
  });

  const failed = Object.entries(a11yResults).filter(result => {
    return result[1].result === "FAIL";
  });

  document.querySelector(".A11yResults-result--positive").innerText =
    passed.length;
  document.querySelector(".A11yResults-result--neutral").innerText = na.length;
  document.querySelector(".A11yResults-result--negative").innerText =
    failed.length;
  document.querySelector(
    ".A11yResults-details"
  ).innerText = axs.Audit.createReport(a11yResults);

  document.querySelector(".A11yResults").removeAttribute("hidden");
});
