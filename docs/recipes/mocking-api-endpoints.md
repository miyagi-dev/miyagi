# Mocking API endpoints

Since _miyagi_ is focused on developing components independently of a backend framework, we might also want to mock API endpoints, for example, to test form submissions using AJAX requests.

We can do that easily using [Mock Service Worker (MSW)](https://mswjs.io).

Please follow the [instructions on the _MSW_ website](https://mswjs.io/docs/integrations/browser) to setup MSW using _Browser Integration_ (not the Node integration). When generating the worker script, use whichever directory you prefer for the `PUBLIC_DIR`. We will use the current directory, so `.` for this example. When we are done with the setup, we will have the following files:

- `mockServiceWorker.js`
- `src/mocks/browser.js`
- `src/mocks/handlers.js`

Additionally, we create a `src/mocks/start.js` (or whatever we would like to call the file) in which we will start the worker:

```js
import { worker } from "./browser.js";

await worker.start();
```

As `src/mocks/browser.js` imports a node module, we cannot use the files in `src/mocks` directly (the browser would not be able to resolve them), but instead have to compile them and then use the build file. To do that, we add `src/mocks/start.js` to our build process as a new entry point and run the build process. Afterwards we need to make sure that the file we just created as well as `mockServiceWorker.js` are served by _miyagi_. To do that, we open `.miyagi.js`, and add both files to `assets.js`, using `type: "module"` to load them as ES modules.

All requests should now be intercepted by _MSW_.
