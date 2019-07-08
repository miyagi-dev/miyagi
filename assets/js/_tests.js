/* globals axe */

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function addToggle(container) {
  const summaries = Array.from(
    container.querySelectorAll(".FreitagResults-summary")
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

function a11yTest(container) {
  const states = ["passes", "inapplicable", "violations", "incomplete"];

  addToggle(container);

  axe.run(document.getElementById("FreitagComponent"), function(err, results) {
    if (err) throw err;

    states.forEach(state => {
      const resultElement = container.querySelector(
        `.FreitagResults--${state} .FreitagResults-value`
      );
      let html = "";

      resultElement.innerText = results[state].length;

      if (state === "violations" || state === "incomplete") {
        resultElement.classList.toggle(
          "has-positiveValue",
          results[state].length
        );
      }

      if (results[state].length) {
        html += "<ul>";
        results[state].forEach(result => {
          html += '<li class="FreitagResult">';
          html += '<dl class="FreitagResult-data">';

          if (result.description) {
            html += `<div class="FreitagResult-wrapper"><dt class="FreitagResult-attr">Description</dt> <dd class="FreitagResult-value">${escapeHtml(
              result.description
            )}</div></dd>`;
          }

          if (result.help) {
            html += `<div class="FreitagResult-wrapper"><dt class="FreitagResult-attr">Help</dt> <dd class="FreitagResult-value">${escapeHtml(
              result.help
            )}</div></dd>`;
          }

          if (result.helpUrl) {
            html += `<div class="FreitagResult-wrapper"><dt class="FreitagResult-attr">Link</dt> <dd class="FreitagResult-value"><a href="${
              result.helpUrl
            }" target="_blank">${result.helpUrl}</div></dd></a>`;
          }

          if (result.impact) {
            let impactClass = "";

            switch (result.impact) {
              case "serious":
                impactClass = "FreitagResults-value--negative";
                break;
              case "moderate":
                impactClass = "FreitagResults-value--warning";
            }

            html += `<div class="FreitagResult-wrapper"><dt class="FreitagResult-attr">Impact</dt> <dd class="${impactClass}">${
              result.impact
            }</div></dd>`;
          }

          html += "</dl>";
          html += "</li>";
        });
        html += "</ul>";
      } else {
        html += '<p><i class="FreitagResults-empty">Nothing to report.</i></p>';
      }

      container.querySelector(
        `.FreitagResults--${state} .FreitagResults-details`
      ).innerHTML = html;
    });

    container.removeAttribute("hidden");
  });
}

function htmlTest(container) {
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
                  `.FreitagResults--${state} .FreitagResults-value`
                );
                let html = "";

                resultElement.innerText = results.length;

                if (results.length) {
                  resultElement.classList.add("has-positiveValue");

                  html += "<ul>";
                  results.forEach(result => {
                    html += '<li class="FreitagResult">';
                    html += '<dl class="FreitagResult-data">';

                    if (result.message) {
                      html += `<div class="FreitagResult-wrapper"><dt class="FreitagResult-attr">Message</dt> <dd class="FreitagResult-value">${
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

                      html += `<div class="FreitagResult-wrapper"><dt class="FreitagResult-attr">Extract</dt> <dd class="FreitagResult-value"><code class="FreitagResult-extract">${markedExtract.replace(
                        /\n/g,
                        "↩"
                      )}</code></div></dd>`;
                    }

                    html += `<div class="FreitagResult-wrapper"><dt class="FreitagResult-attr">From</dt><dd class="FreitagResult-value">Line: ${
                      result[result.firstLine ? "firstLine" : "lastLine"]
                    }, Column: ${result.firstColumn}</div></dd>`;
                    html += `<div class="FreitagResult-wrapper"><dt class="FreitagResult-attr">To</dt><dd class="FreitagResult-value">Line: ${
                      result.lastLine
                    }, Column: ${result.lastColumn}</div></dd>`;

                    html += "</dl>";
                    html += "</li>";
                  });
                  html += "</ul>";
                } else {
                  resultElement.classList.remove("has-positiveValue");
                  html +=
                    '<p><i class="FreitagResults-empty">Nothing to report.</i></p>';
                }

                container.querySelector(
                  `.FreitagResults--${state} .FreitagResults-details`
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
  const tests = parent.document.querySelector(".Freitag-tests");

  if (tests) {
    if (document.getElementById("FreitagComponent")) {
      const a11yContainer = parent.document.querySelector(".FreitagTest--a11y");
      const htmlContainer = parent.document.querySelector(".FreitagTest--html");

      if (a11yContainer) {
        if (window.validations.accessibility) {
          a11yTest(a11yContainer);
        } else {
          a11yContainer.remove();
        }
      }

      if (htmlContainer) {
        if (window.validations.html) {
          htmlTest(htmlContainer);
        } else {
          htmlContainer.remove();
        }
      }

      tests.removeAttribute("hidden");
    } else {
      tests.setAttribute("hidden", true);
    }
  }
});
