import { createDemoContext } from "./admin/seed.js";
import { createAppBanner } from "./app.js";

async function main(): Promise<void> {
  const context = await createDemoContext();
  console.log(createAppBanner(context));
}

await main();
