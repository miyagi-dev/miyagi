**Installed as a dev dependency:**

```bash
NODE_ENV=(development|production) node node_modules/roundup start
```

**Installed globally:**

```bash
NODE_ENV=(development|production) roundup start
```

This will serve _roundup_ at `http://localhost:5000`.

**You can change the port with:**

```bash
NODE_ENV=(development|production) PORT=<port> roundup start
```

_**NOTE:** Setting the `NODE_ENV` is optional (default is `development`), but it allows you to serve different assets based on your [configuration](/configuration/options#assets)._
