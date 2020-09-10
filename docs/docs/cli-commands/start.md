**Installed as a dev dependency:**

```bash
node node_modules/@miyagi/core start
```

or

```bash
npm run miyagi start
```

or

```bash
yarn miyagi start
```

**Installed globally:**

```bash
miyagi start
```

This will serve _miyagi_ at `http://localhost:5000`.

**You can change the port with:**

```bash
PORT=<port> miyagi start
```

_**NOTE:** Setting the `NODE_ENV` is optional (default is `development`), but it allows you to serve different assets based on your [configuration](/configuration/options#assets)._
