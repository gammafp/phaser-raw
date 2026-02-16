#!/usr/bin/env bun

/**
 * Usage:
 *   bun run counter.ts <directorio>
 *
 * - Cuenta todos los archivos EXCEPTO .ts
 * - No cuenta carpetas
 * - Ignora carpetas llamadas "typedef" o "typedefs"
 * - Ordena namespaces de mayor a menor contenido
 */

import { readdir } from "node:fs/promises";
import { join } from "node:path";

const EXCLUDED_DIR_NAMES = new Set(["typedef", "typedefs"]);

async function countNonTsFiles(dir: string): Promise<number> {
  let total = 0;

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return 0;
  }

  for (const ent of entries) {
    const full = join(dir, ent.name);

    if (ent.isSymbolicLink()) continue;

    if (ent.isDirectory()) {
      if (EXCLUDED_DIR_NAMES.has(ent.name)) {
        continue;
      }

      total += await countNonTsFiles(full);
    } else if (ent.isFile()) {
      if (!ent.name.endsWith(".ts")) {
        total += 1;
      }
    }
  }

  return total;
}

async function main() {
  const root = Bun.argv[2];

  if (!root) {
    console.error("Uso: bun run counter.ts <directorio>");
    process.exit(1);
  }

  const rootEntries = await readdir(root, { withFileTypes: true });

  const namespaces = rootEntries
    .filter((e) => e.isDirectory())
    .map((e) => ({
      name: e.name,
      path: join(root, e.name),
    }));

  const results: { name: string; count: number }[] = [];

  for (const ns of namespaces) {
    if (EXCLUDED_DIR_NAMES.has(ns.name)) {
      results.push({ name: ns.name, count: 0 });
      continue;
    }

    const count = await countNonTsFiles(ns.path);
    results.push({ name: ns.name, count });
  }

  results.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const maxName = results.length
    ? Math.max(...results.map((r) => r.name.length))
    : 0;

  console.log(`Ordenado por contenido (sin contar .ts):`);
  console.log(`${"namespace".padEnd(maxName)}  count`);
  console.log(`${"-".repeat(maxName)}  -----`);

  for (const r of results) {
    console.log(`${r.name.padEnd(maxName)}  ${String(r.count).padStart(5)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
