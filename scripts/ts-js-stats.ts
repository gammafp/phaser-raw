import { readdir } from "node:fs/promises";
import { join } from "node:path";

type Counts = {
  ts: number;
  js: number;
};

const TARGET_ROOT = join("src", "phaser", "src");

const isTs = (name: string) => name.endsWith(".ts") && !name.endsWith(".d.ts");
const isJs = (name: string) => name.endsWith(".js");

const walk = async (dir: string, counts: Counts): Promise<void> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath, counts);
      continue;
    }

    if (isTs(entry.name)) {
      counts.ts += 1;
    } else if (isJs(entry.name)) {
      counts.js += 1;
    }
  }
};

const formatPercent = (value: number) => value.toFixed(2);

const main = async () => {
  const counts: Counts = { ts: 0, js: 0 };

  await walk(TARGET_ROOT, counts);

  const total = counts.ts + counts.js;
  const percentTs = total === 0 ? 0 : (counts.ts / total) * 100;

  console.log(`Ruta: ${TARGET_ROOT}`);
  console.log(`TS: ${counts.ts}`);
  console.log(`JS: ${counts.js}`);
  console.log(`% TS: ${formatPercent(percentTs)}`);
};

main().catch((error) => {
  console.error("Error al contar archivos:", error);
  process.exitCode = 1;
});
