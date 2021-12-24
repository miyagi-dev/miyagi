export default [
  {
    title: "Accessibility",
    alias: "a11y",
    results: [
      {
        label: "Failed",
        class: "negative",
        alias: "violations",
      },
      {
        label: "Incomplete",
        class: "warning",
        alias: "incomplete",
      },
      {
        label: "Passed",
        class: "positive",
        alias: "passes",
      },
      {
        label: "Inapplicable",
        class: "neutral",
        alias: "inapplicable",
      },
    ],
  },
  {
    title: "HTML",
    alias: "html",
    results: [
      {
        label: "Errors",
        class: "negative",
        alias: "error",
      },
      {
        label: "Warnings",
        class: "warning",
        alias: "warning",
      },
    ],
  },
];
