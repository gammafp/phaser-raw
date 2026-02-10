import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

type ImportError = {
  file: string;
  module: string;
  line: number;
  content: string;
};

const TARGET_ROOT = join("src", "phaser", "src");

// Extract variable name and path from a require line: "var Clamp = require('../math/Clamp');"
function parseRequireLine(content: string): { varName: string; path: string } | null {
  const m = content.match(/(?:var|let|const)\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
  return m ? { varName: m[1], path: m[2] } : null;
}

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
          const resolvedPathNoExt = resolvedPath.replace(/\.(js|ts)$/, '');
          
          // Check if this required module exists as .ts (with or without .js in require)
          if (tsFiles.has(resolvedPath) || tsFiles.has(resolvedPathNoExt)) {
            errors.push({
              file: relative(TARGET_ROOT, fullPath),
              module: resolvedPathNoExt,
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

  const doFix = process.argv.includes("--fix");
  if (doFix) {
    console.log("\n🔧 Applying --fix: replacing only the require() that point to TS modules with import...\n");
    for (const [file, fileErrors] of byFile) {
      const fullPath = join(TARGET_ROOT, file);
      const content = await readFile(fullPath, "utf-8");
      const lines = content.split("\n");
      const linesToRemove = new Set(fileErrors.map((e) => e.line - 1));
      const seen = new Set<string>();
      const imports: string[] = [];
      for (const err of fileErrors) {
        const parsed = parseRequireLine(err.content);
        if (!parsed) continue;
        const key = `${parsed.path}\0${parsed.varName}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const pathForImport = parsed.path.replace(/\.js$/, "");
        const exportName = pathForImport.replace(/^.*\//, "");
        if (parsed.varName === exportName) {
          imports.push(`import { ${exportName} } from '${pathForImport}';`);
        } else {
          imports.push(`import { ${exportName} as ${parsed.varName} } from '${pathForImport}';`);
        }
      }
      const newLines = lines.filter((_, i) => !linesToRemove.has(i));
      let insertAt = 0;
      for (let i = 0; i < newLines.length; i++) {
        if (newLines[i].trim().endsWith("*/")) {
          insertAt = i + 1;
          while (insertAt < newLines.length && newLines[insertAt].trim() === "") insertAt++;
          break;
        }
      }
      const before = newLines.slice(0, insertAt);
      const after = newLines.slice(insertAt);
      const out = [...before, ...imports, "", ...after].join("\n");
      await writeFile(fullPath, out);
      console.log(`   Fixed ${file}`);
    }
    console.log("\n✅ Fix applied. Run validate-imports again to verify.\n");
    process.exitCode = 0;
    return;
  }

  console.log("─".repeat(64));
  console.log("\n💡 HOW TO FIX:");
  console.log("   Run: bun run validate-imports -- --fix");
  console.log("   to replace only the require() that point to TS modules with import.\n");
  console.log("═".repeat(64));
  console.log(`\n❌ BUILD FAILED: ${errors.length} errors in ${byFile.size} files\n`);
  
  process.exitCode = 1;
};

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
