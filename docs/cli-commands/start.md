**Installed as a dev dependency:**

```bash
NODE_ENV=(development|production) node node_modules/headman start
```

**Installed globally:**

```bash
NODE_ENV=(development|production) headman start
```

This will serve _headman_ at `http://localhost:5000`.

**You can change the port with:**

```bash
NODE_ENV=(development|production) PORT=<port> headman start
```

_**NOTE:** Setting the `NODE_ENV` is optional (default is `development`), but it allows you to serve different assets based on your [configuration](/configuration/options#assets)._
