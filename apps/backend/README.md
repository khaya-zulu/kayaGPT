```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```

# Exposing the server to your local network

In order to test api requests from your mobile device, you can expose the server to your local network. Which wrangler restricts by default. See this [issue](https://github.com/cloudflare/workers-sdk/issues/4239#issuecomment-1832332829).

To fix this issue, run the following command:

```bash
yarn dev --ip 0.0.0.0 // the networks IP address
```

# Running remote resources locally

```bash
yarn dev --x-remote-bindings
```
