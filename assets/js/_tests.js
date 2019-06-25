/* globals axe, validations */
import "../../node_modules/axe-core/axe.js";

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function addToggle(container) {
  const summaries = Array.from(
    container.querySelectorAll(".RoundupResults-summary")
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
}

function a11yTest() {
  const states = ["passes", "inapplicable", "violations", "incomplete"];
  const container = parent.document.querySelector(".RoundupTest--a11y");

  addToggle(container);

  axe.run(document.getElementById("RoundupComponent"), function(err, results) {
    if (err) throw err;

    states.forEach(state => {
      const resultElement = container.querySelector(
        `.RoundupResults--${state} .RoundupResults-value`
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
        html += "<ul>";
        results[state].forEach(result => {
          html += '<li class="RoundupResult">';
          html += '<dl class="RoundupResult-data">';

          if (result.description) {
            html += `<div class="RoundupResult-wrapper"><dt class="RoundupResult-attr">Description</dt> <dd class="RoundupResult-value">${escapeHtml(
              result.description
            )}</div></dd>`;
          }

          if (result.help) {
            html += `<div class="RoundupResult-wrapper"><dt class="RoundupResult-attr">Help</dt> <dd class="RoundupResult-value">${escapeHtml(
              result.help
            )}</div></dd>`;
          }

          if (result.helpUrl) {
            html += `<div class="RoundupResult-wrapper"><dt class="RoundupResult-attr">Link</dt> <dd class="RoundupResult-value"><a href="${
              result.helpUrl
            }" target="_blank">${result.helpUrl}</div></dd></a>`;
          }

          if (result.impact) {
            let impactClass = "";

            switch (result.impact) {
              case "serious":
                impactClass = "RoundupResults-value--negative";
                break;
              case "moderate":
                impactClass = "RoundupResults-value--warning";
            }

            html += `<div class="RoundupResult-wrapper"><dt class="RoundupResult-attr">Impact</dt> <dd class="${impactClass}">${
              result.impact
            }</div></dd>`;
          }

          html += "</dl>";
          html += "</li>";
        });
        html += "</ul>";
      } else {
        html += '<p><i class="RoundupResults-empty">Nothing to report.</i></p>';
      }

      container.querySelector(
        `.RoundupResults--${state} .RoundupResults-details`
      ).innerHTML = html;
    });

    container.removeAttribute("hidden");
  });
}

function htmlTest() {
  const container = parent.document.querySelector(".RoundupTest--html");
  const states = ["error", "warning"];

  addToggle(container);

  fetch(location.href).then(response => {
    if (response.ok) {
      response.text().then(html => {
        const formData = new FormData();
        formData.append("out", "json");
        formData.append("content", html);
        fetch("https://validator.w3.org/nu/", {
          method: "post",
          headers: {
            Accept: "application/json"
          },
          body: formData
        }).then(function(response) {
          if (response.ok) {
            response.json().then(data => {
              states.forEach(state => {
                const results = data.messages.filter(
                  message => message.type === state
                );

                const resultElement = container.querySelector(
                  `.RoundupResults--${state} .RoundupResults-value`
                );
                let html = "";

                resultElement.innerText = results.length;

                if (results.length) {
                  resultElement.classList.add("has-positiveValue");

                  html += "<ul>";
                  results.forEach(result => {
                    html += '<li class="RoundupResult">';
                    html += '<dl class="RoundupResult-data">';

                    if (result.message) {
                      html += `<div class="RoundupResult-wrapper"><dt class="RoundupResult-attr">Message</dt> <dd class="RoundupResult-value">${
                        result.message
                      }</div></dd>`;
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

                      html += `<div class="RoundupResult-wrapper"><dt class="RoundupResult-attr">Extract</dt> <dd class="RoundupResult-value"><code class="RoundupResult-extract">${markedExtract.replace(
                        /\n/g,
                        "↩"
                      )}</code></div></dd>`;
                    }

                    html += `<div class="RoundupResult-wrapper"><dt class="RoundupResult-attr">From</dt><dd class="RoundupResult-value">Line: ${
                      result[result.firstLine ? "firstLine" : "lastLine"]
                    }, Column: ${result.firstColumn}</div></dd>`;
                    html += `<div class="RoundupResult-wrapper"><dt class="RoundupResult-attr">To</dt><dd class="RoundupResult-value">Line: ${
                      result.lastLine
                    }, Column: ${result.lastColumn}</div></dd>`;

                    html += "</dl>";
                    html += "</li>";
                  });
                  html += "</ul>";
                } else {
                  resultElement.classList.remove("has-positiveValue");
                  html +=
                    '<p><i class="RoundupResults-empty">Nothing to report.</i></p>';
                }

                container.querySelector(
                  `.RoundupResults--${state} .RoundupResults-details`
                ).innerHTML = html;
              });

              container.removeAttribute("hidden");
            });
          } else {
            console.warn(
              "HTML validation failed. Most likely something went wrong with https://validator.w3.org/nu/. Maybe you also ran into rate limiting."
            );
          }
        });
      });
    }
  });
}

addEventListener("DOMContentLoaded", () => {
  const tests = parent.document.querySelector(".Roundup-tests");

  if (tests) {
    if (document.getElementById("RoundupComponent")) {
      if (validations.accessibility) {
        a11yTest();
      }

      if (validations.html) {
        htmlTest();
      }

      tests.removeAttribute("hidden");
    } else {
      tests.setAttribute("hidden", true);
    }
  }
});
