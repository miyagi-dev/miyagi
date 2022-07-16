When linting components, _miyagi_ checks if the JSON schema files are valid and if the mock data fits to the JSON schema file.

You can either lint all components at once via:

```bash
miyagi lint
```

or lint only a specific component via:

```bash
miyagi lint path/to/component
```

Please note that when you reference a schema file from another schema file or a mock file from another mock file ([Referencing other mock files](/component-files/mocks/#referencing-other-mock-files)) and the referenced file is invalid, you will get multiple errors reported by _miyagi_ (one for the invalid file and one for the file which includes the invalid file).

If you lint all components, the process will properly be exited with error code 1. This can be helpful if you want to include the linting in your CI e.g..
