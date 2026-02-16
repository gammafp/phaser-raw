import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

type Counts = {
  ts: number;
  js: number;
};

type FolderStats = {
  name: string;
  ts: number;
  js: number;
  total: number;
  percent: number;
};

const TARGET_ROOT = join("src", "phaser", "src");
const RENDERER_CANVAS_DIR = join(TARGET_ROOT, "renderer", "canvas");

const isTs = (name: string) => name.endsWith(".ts") && !name.endsWith(".d.ts");
const isJs = (name: string) => name.endsWith(".js") && !name.includes("Canvas");

const walk = async (dir: string, counts: Counts): Promise<void> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip renderer/canvas folder - legacy canvas renderer not part of TS conversion
      if (fullPath === RENDERER_CANVAS_DIR) {
        continue;
      }
      // Skip typedefs folders - they contain JSDoc types that will be removed in TS
      if (entry.name === 'typedefs') {
        continue;
      }
      // Skip matter-js folder - external library that will be removed
      if (entry.name === 'matter-js') {
        continue;
      }
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

const getFolderStats = async (dir: string): Promise<Counts> => {
  const counts: Counts = { ts: 0, js: 0 };
  await walk(dir, counts);
  return counts;
};

const formatPercent = (value: number) => value.toFixed(2) + "%";

const getProgressBar = (percent: number, width: number = 30): string => {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
};

const main = async () => {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║          PHASER TYPESCRIPT CONVERSION STATISTICS             ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  // Global stats
  const globalCounts: Counts = { ts: 0, js: 0 };
  await walk(TARGET_ROOT, globalCounts);

  const total = globalCounts.ts + globalCounts.js;
  const percentTs = total === 0 ? 0 : (globalCounts.ts / total) * 100;

  console.log("📊 GLOBAL SUMMARY");
  console.log("─".repeat(64));
  console.log(`Base path: ${TARGET_ROOT}`);
  console.log(`Total files: ${total}`);
  console.log(`  ✓ TypeScript (.ts): ${globalCounts.ts}`);
  console.log(`  ✗ JavaScript (.js): ${globalCounts.js}`);
  console.log(`\nConversion progress: ${formatPercent(percentTs)}`);
  console.log(getProgressBar(percentTs));
  console.log(`Remaining files: ${globalCounts.js}\n`);

  console.log("🚫 IGNORED IN STATS");
  console.log("─".repeat(64));
  console.log(`Directories skipped:`);
  console.log(`  - ${relative(TARGET_ROOT, RENDERER_CANVAS_DIR)} (legacy canvas renderer)`);
  console.log(`  - **/matter-js (removed from conversion scope)`);
  console.log(`  - **/typedefs (JSDoc-only type defs)`);
  console.log(`Files skipped:`);
  console.log(`  - *.js files with "Canvas" in filename`);
  console.log("");

  // Per-folder stats
  console.log("\n📁 FOLDER STATISTICS");
  console.log("─".repeat(64));

  const entries = await readdir(TARGET_ROOT, { withFileTypes: true });
  const folders: FolderStats[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const folderPath = join(TARGET_ROOT, entry.name);
      const counts = await getFolderStats(folderPath);
      const folderTotal = counts.ts + counts.js;
      
      if (folderTotal > 0) {
        const percent = (counts.ts / folderTotal) * 100;
        folders.push({
          name: entry.name,
          ts: counts.ts,
          js: counts.js,
          total: folderTotal,
          percent: percent
        });
      }
    }
  }

  // Sort by percent (desc), then by name
  folders.sort((a, b) => {
    if (b.percent !== a.percent) {
      return b.percent - a.percent;
    }
    return a.name.localeCompare(b.name);
  });

  // Display folders
  const converted: FolderStats[] = [];
  const inProgress: FolderStats[] = [];
  const notStarted: FolderStats[] = [];

  for (const folder of folders) {
    if (folder.percent === 100) {
      converted.push(folder);
    } else if (folder.percent > 0) {
      inProgress.push(folder);
    } else {
      notStarted.push(folder);
    }
  }

  if (converted.length > 0) {
    console.log("\n✅ FULLY CONVERTED (100%):");
    for (const folder of converted) {
      console.log(`  ✓ ${folder.name.padEnd(25)} ${folder.ts.toString().padStart(4)} files`);
    }
  }

  if (inProgress.length > 0) {
    console.log("\n🔄 IN PROGRESS:");
    for (const folder of inProgress) {
      const bar = getProgressBar(folder.percent, 20);
      console.log(`  ${folder.name.padEnd(25)} ${formatPercent(folder.percent).padStart(8)} ${bar}  (${folder.ts}/${folder.total})`);
    }
  }

  if (notStarted.length > 0) {
    console.log("\n⏳ NOT STARTED (0%):");
    for (const folder of notStarted) {
      console.log(`  ○ ${folder.name.padEnd(25)} ${folder.js.toString().padStart(4)} files`);
    }
  }

  console.log("\n" + "═".repeat(64));
  console.log(`\n🎯 Total progress: ${formatPercent(percentTs)} completed`);
  console.log(`   ${globalCounts.js} files remaining out of ${total} total\n`);
};

main().catch((error) => {
  console.error("Error counting files:", error);
  process.exitCode = 1;
});
