_headman_ assumes that you have a dedicated folder for each of your components, including a template, css and js file, all named like the folder.

#### Example

```
├── src
│   ├── components
│   │   ├── button
│   │   │   ├── docs.md
│   │   │   ├── index.css
│   │   │   ├── index.hbs
│   │   │   ├── index.js
│   │   │   ├── mocks.json
│   │   │   └── schema.json
│   │   └── teaser
│   │   │   ├── docs.md
│   │   │   ├── index.css
│   │   │   ├── index.hbs
│   │   │   ├── index.js
│   │   │   ├── mocks.json
│   │   │   └── schema.json
│   └── templates
│       └── homepage
│           ├── header
│           │   ├── docs.md
│           │   ├── index.css
│           │   ├── index.hbs
│           │   ├── index.js
│           │   ├── mocks.json
│           │   └── schema.json
│           ├── footer
│           │   ├── docs.md
│           │   ├── index.css
│           │   ├── index.hbs
│           │   ├── index.js
│           │   ├── mocks.json
│           │   └── schema.json
│           ├── docs.md
│           ├── index.css
│           ├── index.hbs
│           ├── index.js
│           ├── mocks.json
│           └── schema.json
└── ...
```

You can call the folders whatever you want and you can nest them as deep as you want.

_**Note:** Files, that are not named the same as the folder they live in, will be ignored._
