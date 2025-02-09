# Mocking API endpoints

Since _miyagi_ is focused on developing components independently of a backend framework, we might also want to mock API endpoints, for example, to test form submissions using AJAX requests.

We can do that easily using [Mock Service Worker (MSW)](https://mswjs.io).

Please follow the [instructions on the _MSW_ website](https://mswjs.io/docs/integrations/browser) to setup MSW using _Browser Integration_ (not the Node integration). When generating the worker script, use whichever directory you prefer for the `PUBLIC_DIR`. We will use the current directory, so `.` for this example. 

The `init` script does the following:

- It copies the `mockServiceWorker.js` file to the `PUBLIC_DIR` (in this case, the current directory).
- It adds the following to the `package.json`

```json
"scripts": {
  "msw": {
    "workerDirectory": ""
  }
}
```

Inside `src/mocks`, we create a `browser.js` file, which will import the worker and export it:

```js
import { setupWorker } from "msw/browser";

const worker = setupWorker();
await worker.start({
  onUnhandledRequest: "bypass",
});

export default worker;
```

> **Note:** You can learn more about [`onUnhandledRequest` here](https://mswjs.io/docs/api/setup-server/listen/#onunhandledrequest).

You can read more about [intercepting requests](https://mswjs.io/docs/basics/intercepting-requests) and [mocking responses](https://mswjs.io/docs/basics/mocking-responses) as part of the MSW documentation. Below is an example of how to intercept a request and respond with a JSON object:

```js
// create-user.js
import { http, HttpResponse } from "msw";

import worker from "./browser.js";

const success = {
   success: true,
};

const handlers = [http.post("/create-user", () => HttpResponse.json(success))];

worker.use(...handlers);
```

When we are done with the setup, we will have the following files:

- `mockServiceWorker.js`
- `src/mocks/browser.js`
- `src/mocks/create-user.js`

As `src/mocks/browser.js` imports a node module, we cannot use the files in `src/mocks` directly (the browser would not be able to resolve them), but instead have to compile them and then use the build file. To do that, we add `src/mocks/browser.js` to our build process as a new entry point and run the build process. Afterwards we need to make sure that the file we just created as well as `mockServiceWorker.js` are served by _miyagi_. To do that, we open `.miyagi.js`, and add both files to `assets.js`, using `type: "module"` to load them as ES modules.

All requests should now be intercepted by _MSW_.
