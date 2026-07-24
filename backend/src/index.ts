import { app } from "./app";
import { env } from "./config/env";

const server = Bun.serve({
    hostname: env.host,
    port: env.port,
    fetch: app.fetch,
    idleTimeout: 255,
});

console.log(
  `Veridex backend running at http://${server.hostname}:${server.port}`,
);