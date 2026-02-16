#!/usr/bin/env bun

/**
 * Usage:
 *   bun run counter.ts <directorio>
 *
 * - Cuenta todos los archivos EXCEPTO .ts
 * - No cuenta carpetas
 * - Ignora carpetas llamadas "typedef" o "typedefs"
 * - Ordena namespaces de mayor a menor contenido
 * - Muestra líneas del archivo más grande
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const EXCLUDED_DIR_NAMES = new Set(["typedef", "typedefs"]);

type NamespaceStats = {
  name: string;
  count: number;
  maxLines: number;
};

async function analyzeDirectory(dir: string): Promise<{ count: number; maxLines: number }> {
  let total = 0;
  let maxLines = 0;

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return { count: 0, maxLines: 0 };
  }

  for (const ent of entries) {
    const full = join(dir, ent.name);

    if (ent.isSymbolicLink()) continue;

    if (ent.isDirectory()) {
      if (EXCLUDED_DIR_NAMES.has(ent.name)) {
        continue;
      }

      const sub = await analyzeDirectory(full);
      total += sub.count;
      if (sub.maxLines > maxLines) {
        maxLines = sub.maxLines;
      }

    } else if (ent.isFile()) {
      if (!ent.name.endsWith(".ts")) {
        total += 1;

        try {
          const content = await readFile(full, "utf8");
          const lines = content.split("\n").length;
          if (lines > maxLines) {
            maxLines = lines;
          }
        } catch {
          // Ignorar errores de lectura
        }
      }
    }
  }

  return { count: total, maxLines };
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

  const results: NamespaceStats[] = [];

  for (const ns of namespaces) {
    if (EXCLUDED_DIR_NAMES.has(ns.name)) {
      results.push({ name: ns.name, count: 0, maxLines: 0 });
      continue;
    }

    const stats = await analyzeDirectory(ns.path);

    results.push({
      name: ns.name,
      count: stats.count,
      maxLines: stats.maxLines,
    });
  }

  results.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const maxName = results.length
    ? Math.max(...results.map((r) => r.name.length))
    : 0;

  console.log(`Ordenado por contenido (sin contar .ts):`);
  console.log(`${"namespace".padEnd(maxName)}  count   maxLines`);
  console.log(`${"-".repeat(maxName)}  -----   --------`);

  for (const r of results) {
    console.log(
      `${r.name.padEnd(maxName)}  ${String(r.count).padStart(5)}   ${String(r.maxLines).padStart(8)}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
