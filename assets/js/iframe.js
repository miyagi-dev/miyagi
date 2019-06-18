function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function a11yTest() {
  const states = ["passes", "inapplicable", "violations", "incomplete"];
  const container = document.querySelector(".A11yResultsContainer--a11y");
  const summaries = Array.from(
    container.querySelectorAll(".A11yResults-summary")
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
      const resultElement = container.querySelector(
        `.A11yResults--${state} .A11yResults-result`
      );
      let html = "";

      resultElement.innerText = results[state].length;

      if (
        (state === "violations" || state === "incomplete") &&
        results[state].length
      ) {
        resultElement.classList.add("has-positiveValue");
      }

      if (results[state].length) {
        html += '<ul class="A11yResults-entries">';
        results[state].forEach(result => {
          html += '<li class="A11yResults-entry">';
          html += '<dl class="A11yResults-data">';

          if (result.description) {
            html += `<dt>Description</dt> <dd>${escapeHtml(
              result.description
            )}</dd>`;
          }

          if (result.help) {
            html += `<dt>Help</dt> <dd>${escapeHtml(result.help)}</dd>`;
          }

          if (result.helpUrl) {
            html += `<dt>Link</dt> <dd><a href="${
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

            html += `<dt>Impact</dt> <dd class="${impactClass}">${
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

      container.querySelector(
        `.A11yResults--${state} .A11yResults-details`
      ).innerHTML = html;
    });

    container.removeAttribute("hidden");
  });
}

function htmlTest() {
  const container = document.querySelector(".A11yResultsContainer--html");
  const states = ["error", "warning"];

  fetch(location.href).then(response => {
    if (response.ok) {
      response.text().then(html => {
        const formData = new FormData();
        formData.append("out", "json");
        formData.append("content", html);
        fetch("http://html5.validator.nu/", {
          method: "post",
          headers: {
            Accept: "application/json"
          },
          body: formData
        })
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            states.forEach(state => {
              const results = data.messages.filter(
                message => message.type === state
              );
              const resultElement = container.querySelector(
                `.A11yResults--${state} .A11yResults-result`
              );
              let html = "";

              resultElement.innerText = results.length;

              if (results.length) {
                resultElement.classList.add("has-positiveValue");
              }

              if (results.length) {
                html += '<ul class="A11yResults-entries">';
                results.forEach(result => {
                  html += '<li class="A11yResults-entry">';
                  html += '<dl class="A11yResults-data">';

                  if (result.message) {
                    html += `<dt>Message</dt> <dd>${result.message}</dd>`;
                  }

                  if (result.extract) {
                    const markedExtract = `${escapeHtml(
                      result.extract.slice(0, result.hiliteStart)
                    )}<mark>${escapeHtml(
                      result.extract.slice(
                        result.hiliteStart,
                        result.hiliteStart + result.hiliteLength
                      )
                    )}</mark>${escapeHtml(
                      result.extract.slice(
                        result.hiliteStart + result.hiliteLength
                      )
                    )}`;

                    html += `<dt>Extract</dt> <dd><code class="extract">${markedExtract.replace(
                      /\n/g,
                      "↩"
                    )}</code></dd>`;
                  }

                  html += `<dt>From</dt><dd>Line: ${
                    result[result.firstLine ? "firstLine" : "lastLine"]
                  }, Column: ${result.firstColumn}</dd>`;
                  html += `<dt>To</dt><dd>Line: ${result.lastLine}, Column: ${
                    result.lastColumn
                  }</dd>`;

                  html += "</dl>";
                  html += "</li>";
                });
                html += "</ul>";
              } else {
                html +=
                  '<p><i class="A11yResults-noResults">Nothing to report.</i></p>';
              }

              container.querySelector(
                `.A11yResults--${state} .A11yResults-details`
              ).innerHTML = html;
            });

            container.removeAttribute("hidden");
          });
      });
    }
  });
}

addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("Pattern")) {
    a11yTest();
    htmlTest();
  }
});
