# The UI

## Start

To render some markdown based introduction or documentation on the start page, you can put a markdown file `README.md` in your [`components folder`](/configuration/options#components). Its content is rendered at the very top directly below the [`project name`](/configuration/options#projectname).

The start page also renders an overview of your design tokens, if you configured _miyagi_ to do so. You can read more about that on "[Creating a design token overview](/how-to/creating-a-design-token-overview/)".

## Component

The _component_ page renders

- the content of the component's [documentation file](/component-files/documentation),
- an info section including the actual component path,
- the component's [schema](/component-files/schema), [mock data](/component-files/mocks) and [template](/component-files/template),
- all variants including the validation status of the mock file as well as the compiled mock data.

## Component variation

The _variation_ page renders a single variation of a component, validation status of the mock file as well, the compiled mock data as well as the validation results (see below). You can open it in a new tab, which renders nothing but the component, which is best for development.
