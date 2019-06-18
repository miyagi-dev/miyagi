function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("Pattern")) {
    const states = ["passes", "inapplicable", "violations", "incomplete"];
    const summaries = Array.from(
      document.querySelectorAll(".A11yResults-summary")
    );

    summaries.forEach(summary => {
      summary.addEventListener("click", e => {
        summaries.forEach(sum => {
          const details = sum.closest("details");
          if (e.target.closest("details") !== details) {
            if (details.open) {
              sum.click();
            }
          }
        });
      });
    });

    axe.run(document.getElementById("Pattern"), function(err, results) {
      if (err) throw err;

      states.forEach(state => {
        let html = "";

        document.querySelector(
          `.A11yResults--${state} .A11yResults-result`
        ).innerText = results[state].length;

        if (results[state].length) {
          html += '<ul class="A11yResults-entries">';
          results[state].forEach(result => {
            html += '<li class="A11yResults-entry">';
            html += "<dl>";

            if (result.helpUrl) {
              html += `<dt>Description:</dt> <dd>${escapeHtml(
                result.description
              )}</dd>`;
            }

            if (result.helpUrl) {
              html += `<dt>Help:</dt> <dd>${escapeHtml(result.help)}</dd>`;
            }

            if (result.helpUrl) {
              html += `<dt>Link:</dt> <dd><a href="${
                result.helpUrl
              }" target="_blank">${result.helpUrl}</dd></a>`;
            }

            if (result.impact) {
              let impactClass = "";

              switch (result.impact) {
                case "serious":
                  impactClass = "is-negative";
                  break;
                case "moderate":
                  impactClass = "is-warning";
              }

              html += `<dt>Impact:</dt> <dd class="${impactClass}">${
                result.impact
              }</dd>`;
            }

            html += "</dl>";
            html += "</li>";
          });
          html += "</ul>";
        } else {
          html +=
            '<p><i class="A11yResults-noResults">Nothing to report.</i></p>';
        }

        document.querySelector(
          `.A11yResults--${state} .A11yResults-details`
        ).innerHTML = html;
      });

      document.querySelector(".A11yResultsContainer").removeAttribute("hidden");
    });
  }
});
