As _miyagi_ uses [consolidate.js](https://github.com/tj/consolidate.js), most of its template engines should work out of the box.

The following template engines have been tested and appear to work without problems:

- [dustjs](https://github.com/linkedin/dustjs)
- [ect](https://github.com/baryshev/ect)
- [ejs](https://github.com/mde/ejs)
- [haml.js](https://github.com/tj/haml.js)
- [handlebars.js](https://github.com/wycats/handlebars.js/)
- [hogan.js](https://github.com/twitter/hogan.js)
- [mustache.js](https://github.com/janl/mustache.js)
- [nunjucks](https://github.com/mozilla/nunjucks)
- [pug](https://github.com/pugjs/pug)
- [twig.js](https://github.com/twigjs/twig.js)
- [twing](https://github.com/NightlyCommit/twing)

Due to the nature of their APIs, there might be some constraints though.

**The following engines do not allow passing data into includes, but the data is globally available:**

- [hogan.js](https://github.com/twitter/hogan.js)
- [mustache.js](https://github.com/janl/mustache.js)
- [pug](https://github.com/pugjs/pug)

Because of that, _miyagi_'s concept of using mock data does not work. Nevertheless, you can still define all variables manually in your mock files. These variables will then be available in your included components.

If you use `pug`, you could also use a `mixin` and would then be able to use mock data. However, _miyagi_ is not able to render mixins independently, so you could only render them in the context of the including file.

**The following engines do not allow passing data into includes and the data is not globally available:**

- [nunjucks](https://github.com/mozilla/nunjucks)

If you use `nunjucks`, you could set a variable in your component (e.g. `{% set myVar = myData.myVar %}` which creates a global variable. This would be available in the included component. Alternatively, you could use a `macro`, but _miyagi_ is not able to render these independently, so you could only render them in the context of the including file.

**Engines that do not support includes at all:**

- [underscore](https://github.com/jashkenas/underscore)
- [haml.js](https://github.com/tj/haml.js)

**_miyagi_ does not work with the following template engines:**

- [doT](https://github.com/olado/doT)
- [marko](https://github.com/marko-js/marko)
