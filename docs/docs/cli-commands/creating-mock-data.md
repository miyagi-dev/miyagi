```bash
miyagi mocks path/to/your/component
```

If you have a valid schema file in your component folder, this will create a mock file with dummy content (created by [@stoplight/json-schema-sampler](https://www.npmjs.com/package/@stoplight/json-schema-sampler)).

Please be aware that this should only be used as a small helper when starting to write mock data. The generated mock data is by no means realistic mock data, but merely data with the correct types and should only serve as a starting point.
