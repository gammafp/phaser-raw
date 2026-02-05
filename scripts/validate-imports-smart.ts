import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

type ImportError = {
  file: string;
  module: string;
  line: number;
  content: string;
};

const TARGET_ROOT = join("src", "phaser", "src");

// Find all .ts files (these are converted modules)
const findTsFiles = async (dir: string, tsFiles: Set<string>): Promise<void> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await findTsFiles(fullPath, tsFiles);
      continue;
    }

    // Skip .d.ts files
    if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      // Store relative path without extension
      const relativePath = relative(TARGET_ROOT, fullPath);
      const withoutExt = relativePath.replace(/\.ts$/, '').replace(/\\/g, '/');
      tsFiles.add(withoutExt);
    }
  }
};

// Check .js and .ts files for require() of converted modules
const checkJsFiles = async (dir: string, tsFiles: Set<string>, errors: ImportError[]): Promise<void> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await checkJsFiles(fullPath, tsFiles, errors);
      continue;
    }

    // Check both .js and .ts files (but not .d.ts)
    if (!entry.name.endsWith('.js') && !entry.name.endsWith('.ts')) {
      continue;
    }
    
    if (entry.name.endsWith('.d.ts')) {
      continue;
    }

    try {
      const content = await readFile(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Match: require('path/to/module') or require("path/to/module")
        const requireMatch = line.match(/require\(['"](\.\.?\/[^'"]+)['"]\)/);
        
        if (requireMatch) {
          const requiredPath = requireMatch[1];
          
          // Resolve relative path from current file to absolute module path
          const fileDir = relative(TARGET_ROOT, join(fullPath, '..'));
          const resolvedPath = join(fileDir, requiredPath).replace(/\\/g, '/');
          
          // Check if this required module exists as .ts
          if (tsFiles.has(resolvedPath)) {
            errors.push({
              file: relative(TARGET_ROOT, fullPath),
              module: resolvedPath,
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
  console.log("║         BUILD VALIDATION - IMPORT COMPATIBILITY CHECK        ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  console.log("🔍 Scanning for converted TypeScript modules...");
  const tsFiles = new Set<string>();
  await findTsFiles(TARGET_ROOT, tsFiles);
  console.log(`   Found ${tsFiles.size} TypeScript modules\n`);

  console.log("🔍 Checking JavaScript and TypeScript files for outdated require() statements...");
  const errors: ImportError[] = [];
  await checkJsFiles(TARGET_ROOT, tsFiles, errors);

  if (errors.length === 0) {
    console.log("\n✅ BUILD PASSED\n");
    console.log("   All JavaScript and TypeScript files are using compatible imports.");
    console.log("   No require() statements found for converted TypeScript modules.\n");
    return;
  }

  console.log(`\n❌ BUILD FAILED\n`);
  console.log(`   Found ${errors.length} incompatible require() statements`);
  console.log(`   in ${new Set(errors.map(e => e.file)).size} files\n`);
  console.log("─".repeat(64));

  // Group by file
  const byFile = new Map<string, ImportError[]>();
  for (const error of errors) {
    if (!byFile.has(error.file)) {
      byFile.set(error.file, []);
    }
    byFile.get(error.file)!.push(error);
  }

  console.log("\n📋 FILES WITH ERRORS:\n");

  let fileNum = 0;
  for (const [file, fileErrors] of byFile) {
    fileNum++;
    console.log(`${fileNum}. ${file} (${fileErrors.length} issues)`);
    
    for (const error of fileErrors.slice(0, 3)) {
      console.log(`   Line ${error.line}: ${error.content.substring(0, 60)}...`);
    }
    
    if (fileErrors.length > 3) {
      console.log(`   ... and ${fileErrors.length - 3} more`);
    }
    console.log("");
  }

  console.log("─".repeat(64));
  console.log("\n💡 HOW TO FIX:");
  console.log("   These files are using require() for TypeScript modules.");
  console.log("   TypeScript modules use named exports, so require() doesn't work.");
  console.log("\n   Fix each file by:");
  console.log("   1. Add: // TODO: Convert this file to TypeScript");
  console.log("   2. Replace: var X = require('path')");
  console.log("   3. With: import { X } from 'path'");
  console.log("\n" + "═".repeat(64));
  console.log(`\n❌ BUILD FAILED: ${errors.length} errors in ${byFile.size} files\n`);
  
  process.exitCode = 1;
};

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
