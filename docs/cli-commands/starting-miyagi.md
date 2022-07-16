**Installed as a dev dependency:**

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

This will serve _miyagi_ at `http://localhost:5000`. If you already have another _miyagi_ instance or some other application running at port 5000, _miyagi_ will automatically try to find another free port.

## Changing the port

```bash
PORT=<port> miyagi start
```

_**NOTE:** Setting the `NODE_ENV` is optional (default is `development`), but it allows you to serve different assets based on your [configuration](/configuration/options#assets)._
