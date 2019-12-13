/* globals axe */

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function addToggle(container) {
  const summaries = Array.from(
    container.querySelectorAll(".HeadmanResults-summary")
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

function getHtmlForResultItem(label, result, impactClass) {
  return `<div class="HeadmanResult-wrapper"><dt class="HeadmanResult-attr">${label}</dt> <dd class="HeadmanResult-value ${impactClass}">${result}</dd></div>`;
}

function a11yTest(container) {
  const states = ["passes", "inapplicable", "violations", "incomplete"];

  addToggle(container);

  axe.run(document.getElementById("HeadmanComponent"), function(err, results) {
    if (err) throw err;

    states.forEach(state => {
      const resultElement = container.querySelector(
        `.HeadmanResults--${state} .HeadmanResults-value`
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
          html += '<li class="HeadmanResult">';
          html += '<dl class="HeadmanResult-data">';

          if (result.description) {
            html += getHtmlForResultItem(
              "Description",
              escapeHtml(result.description)
            );
          }

          if (result.help) {
            html += getHtmlForResultItem("Help", escapeHtml(result.help));
          }

          if (result.helpUrl) {
            html += getHtmlForResultItem(
              "Link",
              `<a href="${result.helpUrl}" target="_blank" rel="noopener">${result.helpUrl}</a>`
            );
          }

          if (result.impact) {
            let impactClass = "";

            switch (result.impact) {
              case "serious":
                impactClass = "HeadmanResults-value--negative";
                break;
              case "moderate":
                impactClass = "HeadmanResults-value--warning";
            }

            html += getHtmlForResultItem("Impact", result.impact, impactClass);
          }

          html += "</dl>";
          html += "</li>";
        });
        html += "</ul>";
      } else {
        html += '<p><i class="HeadmanResults-empty">Nothing to report.</i></p>';
      }

      container.querySelector(
        `.HeadmanResults--${state} .HeadmanResults-details`
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
                  `.HeadmanResults--${state} .HeadmanResults-value`
                );
                let html = "";

                resultElement.innerText = results.length;

                if (results.length) {
                  resultElement.classList.add("has-positiveValue");

                  html += "<ul>";
                  results.forEach(result => {
                    html += '<li class="HeadmanResult">';
                    html += '<dl class="HeadmanResult-data">';

                    if (result.message) {
                      html += getHtmlForResultItem("Message", result.message);
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

                      html += getHtmlForResultItem(
                        "Extract",
                        `<code class="HeadmanResult-extract">${markedExtract.replace(
                          /\n/g,
                          "↩"
                        )}</code>`
                      );
                    }

                    html += getHtmlForResultItem(
                      "From",
                      `Line: ${
                        result[result.firstLine ? "firstLine" : "lastLine"]
                      }, Column: ${result.firstColumn}`
                    );
                    html += getHtmlForResultItem(
                      "To",
                      `Line: ${result.lastLine}, Column: ${result.lastColumn}`
                    );

                    html += "</dl>";
                    html += "</li>";
                  });
                  html += "</ul>";
                } else {
                  resultElement.classList.remove("has-positiveValue");
                  html +=
                    '<p><i class="HeadmanResults-empty">Nothing to report.</i></p>';
                }

                container.querySelector(
                  `.HeadmanResults--${state} .HeadmanResults-details`
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
  const tests = parent.document.querySelector(".Headman-tests");

  if (tests) {
    if (document.getElementById("HeadmanComponent")) {
      const a11yContainer = parent.document.querySelector(".HeadmanTest--a11y");
      const htmlContainer = parent.document.querySelector(".HeadmanTest--html");

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
