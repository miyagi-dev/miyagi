_miyagi_ assumes that you have a dedicated folder for each of your components like this:

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

Additionally to [info files in your components](/component-files/info/), you can also put a `info.json` or `info.yaml` in every other folder if you want to change the displayed name in the navigation.
