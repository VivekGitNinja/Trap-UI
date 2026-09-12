import "dotenv/config";
import { buildApp } from "./app.js";
import { startScanWorker } from "./queue/scanQueue.js";
import { initDatabases } from "./services/db.js";

const app = await buildApp();
const port = Number(process.env.PORT || 4000);

const skipInfra = process.env.NO_INFRA === "1";
if (!skipInfra) {
  await initDatabases();
  startScanWorker();
}

app.listen({ port, host: "0.0.0.0" }).catch((err: unknown) => {
  app.log.error(err);
  process.exit(1);
});
