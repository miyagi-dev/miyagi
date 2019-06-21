/* globals axe */
import "../../node_modules/axe-core/axe.js";

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function addToggle(container) {
  const summaries = Array.from(
    container.querySelectorAll(".ComponentLibraryResults-summary")
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
  const container = parent.document.querySelector(
    ".ComponentLibraryTest--a11y"
  );

  addToggle(container);

  axe.run(document.getElementById("ComponentLibraryComponent"), function(
    err,
    results
  ) {
    if (err) throw err;

    states.forEach(state => {
      const resultElement = container.querySelector(
        `.ComponentLibraryResults--${state} .ComponentLibraryResults-value`
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
          html += '<li class="ComponentLibraryResult">';
          html += '<dl class="ComponentLibraryResult-data">';

          if (result.description) {
            html += `<div class="ComponentLibraryResult-wrapper"><dt class="ComponentLibraryResult-attr">Description</dt> <dd class="ComponentLibraryResult-value">${escapeHtml(
              result.description
            )}</div></dd>`;
          }

          if (result.help) {
            html += `<div class="ComponentLibraryResult-wrapper"><dt class="ComponentLibraryResult-attr">Help</dt> <dd class="ComponentLibraryResult-value">${escapeHtml(
              result.help
            )}</div></dd>`;
          }

          if (result.helpUrl) {
            html += `<div class="ComponentLibraryResult-wrapper"><dt class="ComponentLibraryResult-attr">Link</dt> <dd class="ComponentLibraryResult-value"><a href="${
              result.helpUrl
            }" target="_blank">${result.helpUrl}</div></dd></a>`;
          }

          if (result.impact) {
            let impactClass = "";

            switch (result.impact) {
              case "serious":
                impactClass = "ComponentLibraryResults-value--negative";
                break;
              case "moderate":
                impactClass = "ComponentLibraryResults-value--warning";
            }

            html += `<div class="ComponentLibraryResult-wrapper"><dt class="ComponentLibraryResult-attr">Impact</dt> <dd class="${impactClass}">${
              result.impact
            }</div></dd>`;
          }

          html += "</dl>";
          html += "</li>";
        });
        html += "</ul>";
      } else {
        html +=
          '<p><i class="ComponentLibraryResults-empty">Nothing to report.</i></p>';
      }

      container.querySelector(
        `.ComponentLibraryResults--${state} .ComponentLibraryResults-details`
      ).innerHTML = html;
    });

    container.removeAttribute("hidden");
  });
}

function htmlTest() {
  const container = parent.document.querySelector(
    ".ComponentLibraryTest--html"
  );
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
                  `.ComponentLibraryResults--${state} .ComponentLibraryResults-value`
                );
                let html = "";

                resultElement.innerText = results.length;

                if (results.length) {
                  resultElement.classList.add("has-positiveValue");

                  html += "<ul>";
                  results.forEach(result => {
                    html += '<li class="ComponentLibraryResult">';
                    html += '<dl class="ComponentLibraryResult-data">';

                    if (result.message) {
                      html += `<div class="ComponentLibraryResult-wrapper"><dt class="ComponentLibraryResult-attr">Message</dt> <dd class="ComponentLibraryResult-value">${
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

                      html += `<div class="ComponentLibraryResult-wrapper"><dt class="ComponentLibraryResult-attr">Extract</dt> <dd class="ComponentLibraryResult-value"><code class="ComponentLibraryResult-extract">${markedExtract.replace(
                        /\n/g,
                        "↩"
                      )}</code></div></dd>`;
                    }

                    html += `<div class="ComponentLibraryResult-wrapper"><dt class="ComponentLibraryResult-attr">From</dt><dd class="ComponentLibraryResult-value">Line: ${
                      result[result.firstLine ? "firstLine" : "lastLine"]
                    }, Column: ${result.firstColumn}</div></dd>`;
                    html += `<div class="ComponentLibraryResult-wrapper"><dt class="ComponentLibraryResult-attr">To</dt><dd class="ComponentLibraryResult-value">Line: ${
                      result.lastLine
                    }, Column: ${result.lastColumn}</div></dd>`;

                    html += "</dl>";
                    html += "</li>";
                  });
                  html += "</ul>";
                } else {
                  resultElement.classList.remove("has-positiveValue");
                  html +=
                    '<p><i class="ComponentLibraryResults-empty">Nothing to report.</i></p>';
                }

                container.querySelector(
                  `.ComponentLibraryResults--${state} .ComponentLibraryResults-details`
                ).innerHTML = html;
              });

              container.removeAttribute("hidden");
            });
          } else {
            console.log(
              "HTML validation failed. Most likely something went wrong with https://validator.w3.org/nu/. Maybe you also ran into rate limiting."
            );
          }
        });
      });
    }
  });
}

addEventListener("DOMContentLoaded", () => {
  const tests = parent.document.querySelector(".ComponentLibrary-tests");

  if (tests) {
    if (document.getElementById("ComponentLibraryComponent")) {
      a11yTest();
      htmlTest();

      tests.removeAttribute("hidden");
    } else {
      tests.setAttribute("hidden", true);
    }
  }
});
