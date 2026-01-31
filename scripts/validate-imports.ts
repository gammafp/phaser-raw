import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

type ImportError = {
  file: string;
  module: string;
  line: number;
  content: string;
};

const TARGET_ROOT = join("src", "phaser", "src");

// Modules converted to TypeScript with named exports
const CONVERTED_MODULES = [
  'utils/object/GetValue',
  'utils/object/GetFastValue',
  'utils/object/GetAdvancedValue',
  'utils/object/GetMinMaxValue',
  'utils/object/SetValue',
  'utils/object/HasValue',
  'utils/object/HasAll',
  'utils/object/HasAny',
  'utils/object/Clone',
  'utils/object/DeepCopy',
  'utils/object/Extend',
  'utils/object/Merge',
  'utils/object/MergeRight',
  'utils/object/IsPlainObject',
  'utils/object/Pick',
  'utils/array',
  'utils/base64',
  'math/Clamp',
  'math/Between',
  'math/FloatBetween',
  'math/snap',
  'math/angle',
  'math/distance',
  'math/fuzzy',
  'math/interpolation',
  'math/pow2',
  'geom/rectangle',
  'geom/circle',
  'geom/point',
  'geom/line',
  'geom/triangle',
  'geom/ellipse',
  'geom/polygon',
];

const walk = async (dir: string, errors: ImportError[]): Promise<void> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath, errors);
      continue;
    }

    if (!entry.name.endsWith('.js')) {
      continue;
    }

    try {
      const content = await readFile(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        for (const module of CONVERTED_MODULES) {
          const requirePattern = new RegExp(`require\\(['"]\\.{0,2}.*/${module}['"]\\)`);
          
          if (requirePattern.test(line)) {
            errors.push({
              file: relative(TARGET_ROOT, fullPath),
              module: module,
              line: index + 1,
              content: line.trim()
            });
          }
        }
      });
    } catch (error) {
      // Skip files that can't be read
    }
  }
};

const main = async () => {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║            IMPORT VALIDATION - BUILD CHECK                  ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  const errors: ImportError[] = [];
  await walk(TARGET_ROOT, errors);

  if (errors.length === 0) {
    console.log("✅ BUILD PASSED: All imports are valid!\n");
    console.log("   No require() statements found using converted modules.");
    console.log("   All files are using modern ES6 imports.\n");
    return;
  }

  console.log("❌ BUILD FAILED: Invalid imports detected\n");
  console.log(`Found ${errors.length} require() statements using converted TypeScript modules`);
  console.log(`These must be updated to use ES6 imports for compatibility.\n`);
  console.log("─".repeat(64));

  // Group by file
  const byFile = new Map<string, ImportError[]>();
  for (const error of errors) {
    if (!byFile.has(error.file)) {
      byFile.set(error.file, []);
    }
    byFile.get(error.file)!.push(error);
  }

  console.log("\n📋 FILES REQUIRING FIXES:\n");

  let fileCount = 0;
  for (const [file, fileErrors] of byFile) {
    fileCount++;
    console.log(`${fileCount}. ${file}`);
    
    for (const error of fileErrors) {
      console.log(`   Line ${error.line}: require('.../${error.module}')`);
      console.log(`   → Must use: import { X } from '.../${error.module}'`);
    }
    console.log("");
  }

  console.log("─".repeat(64));
  console.log("\n💡 TO FIX:");
  console.log("   1. Add comment: // TODO: Convert this file to TypeScript");
  console.log("   2. Replace require() with import statements");
  console.log("   3. Use named imports: import { GetValue } from '...'");
  console.log("\n" + "═".repeat(64));
  console.log(`\n❌ BUILD FAILED: ${errors.length} import errors in ${byFile.size} files\n`);
  
  process.exitCode = 1;
};

main().catch((error) => {
  console.error("Error running validation:", error);
  process.exitCode = 1;
});
