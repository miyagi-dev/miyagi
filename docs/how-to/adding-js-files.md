Since there are different ways to include JavaScript files in HTML, the configuration can be a bit more complex.

The **simplest way** is to add one file:

```json
{
  "assets": {
    "js": "src/index.js"
  }
}
```

This would include one JS file, no matter what `NODE_ENV` you use.

If you want to serve **different files per `NODE_ENV`**, you can do that like this:

```json
{
  "assets": {
    "js": {
      "development": "src/index.js",
      "production": "dist/index.js"
    }
  }
}
```

In both cases you could also use an array in case you want to **serve multiple files**:

```json
{
  "assets": {
    "js": ["src/index.js", "src/another-file.js"]
  }
}
```

or

```json
{
  "assets": {
    "js": {
      "development": ["src/index.js", "src/another-file.js"],
      "production": ["dist/index.js", "dist/another-file.js"]
    }
  }
}
```

In any of these case, the JavaScript files are included with a **render blocking script tag in the head**:

```html
<head>
  <script src="src/index.js">
</head>
```

In case you want to use `async`, `defer`, `type="module"` or include the script right before the closing `</body>` tag, you can use an object like this:

```json
{
  "src": "src/index.js",
  "async": true,
  "defer": true,
  "type": "module",
  "position": "body"
}
```

This object can be used for any of the previously mentioned examples to replace the file path string, for example:

```json
{
  "assets": {
    "js": {
      "src": "src/index.js",
      "async": true,
      "defer": true,
      "type": "module",
      "position": "body"
    }
  }
}
```

or

```json
{
  "assets": {
    "js": {
      "development": [
        {
          "src": "src/index.js",
          "async": true,
          "defer": true,
          "type": "module",
          "position": "body"
        }
      ],
      "production": []
    }
  }
}
```

Please note that the object just mentioned does not make much sense, but merely shows the possible options. The default values are:

```json
{
  "src": null,
  "async": false,
  "defer": false,
  "type": null,
  "position": "head"
}
```
