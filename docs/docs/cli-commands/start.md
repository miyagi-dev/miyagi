**Installed as a dev dependency:**

```bash
NODE_ENV=(development|production) node node_modules/miyagi start
```

**Installed globally:**

```bash
NODE_ENV=(development|production) miyagi start
```

This will serve _miyagi_ at `http://localhost:5000`.

**You can change the port with:**

```bash
NODE_ENV=(development|production) PORT=<port> miyagi start
```

_**NOTE:** Setting the `NODE_ENV` is optional (default is `development`), but it allows you to serve different assets based on your [configuration](/configuration/options#assets)._
