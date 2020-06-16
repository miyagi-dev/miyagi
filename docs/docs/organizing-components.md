_headman_ assumes that you have a dedicated folder for each of your components, including a template, css and js file, all named like the folder.

#### Example

```
├── src
│   ├── components
│   │   ├── button
│   │   │   ├── index.css
│   │   │   ├── index.hbs
│   │   │   ├── index.js
│   │   │   ├── mocks.json
│   │   │   ├── README.md
│   │   │   └── schema.json
│   │   └── teaser
│   │   │   ├── index.css
│   │   │   ├── index.hbs
│   │   │   ├── index.js
│   │   │   ├── mocks.json
│   │   │   ├── README.md
│   │   │   └── schema.json
│   └── templates
│       └── homepage
│           ├── header
│           │   ├── index.css
│           │   ├── index.hbs
│           │   ├── index.js
│           │   ├── mocks.json
│           │   ├── README.md
│           │   └── schema.json
│           ├── footer
│           │   ├── index.css
│           │   ├── index.hbs
│           │   ├── index.js
│           │   ├── mocks.json
│           │   ├── README.md
│           │   └── schema.json
│           ├── index.css
│           ├── index.hbs
│           ├── index.js
│           ├── mocks.json
│           ├── README.md
│           └── schema.json
└── ...
```

You can call the folders whatever you want and you can nest them as deep as you want.

_**Note:** Files, that are not named the same as the folder they live in, will be ignored._
