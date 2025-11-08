import fs from "fs";
import path from "path";
import { openApiSpec } from "@/core/openapi";

async function main() {
  const outDir = path.resolve("dist");
  await fs.promises.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "openapi.json");
  await fs.promises.writeFile(outPath, JSON.stringify(openApiSpec, null, 2), "utf-8");
  console.log("Wrote", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
