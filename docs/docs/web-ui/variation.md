The _variation_ page renders a single variation of a component, validation status of the mock file as well, the compiled mock data as well as the validation results (see below). You can open it in a new tab, which renders nothing but the component, which is best for development.

## Validations

By default, components are tested for accessibility and HTML violations.
The accessibility validation uses a local [axe-core](https://github.com/dequelabs/axe-core/) installation, while the HTML validation uses an external service from [https://validator.w3.org/nu/](https://validator.w3.org/nu/).

[https://validator.w3.org/nu/](https://validator.w3.org/nu/) has a rate limit of max. 10 requests per minute. If you are updating your components often, you might want to deactivate the HTML validation, otherwise your IP will be blocked.
