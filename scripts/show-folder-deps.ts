#!/usr/bin/env bun

/**
 * Show dependencies of every file in a folder (recursive).
 * Uses the same logic as show-file-deps.ts.
 *
 * Usage:
 *   bun scripts/show-folder-deps.ts <relativeFolderPath> [baseDir]
 *
 * Examples:
 *   bun scripts/show-folder-deps.ts actions
 *   bun scripts/show-folder-deps.ts math/angle src_converted/phaser/src
 *
 * Output: for each file, its dependencies (resolved path, kind, namespace).
 */

import * as fs from 'fs';
import * as path from 'path';
import { getFileDeps, type DepEntry } from './show-file-deps.ts';

const BASE_DIR_DEFAULT = 'src_converted/phaser/src';

const EXTENSIONS = ['.ts', '.tsx', '.js'];

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function collectFiles(dir: string, baseDir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(baseDir, full).replace(/\\/g, '/');
    if (e.isDirectory()) {
      collectFiles(full, baseDir, out);
    } else if (EXTENSIONS.some((ext) => e.name.endsWith(ext))) {
      out.push(rel);
    }
  }
}

function formatDep(r: DepEntry): string {
  const kind = r.isType ? 'type' : 'value';
  const ns =
    r.depNamespace === ''
      ? 'external'
      : r.sameNamespace
        ? `same`
        : `→${r.depNamespace}`;
  return `${r.resolved} (${kind}, ${ns})`;
}

function main(): void {
  const folderPath = normalizePath(process.argv[2] || '');
  const baseDirRaw = normalizePath(process.argv[3] || BASE_DIR_DEFAULT).replace(/\//g, path.sep);
  const baseDir = path.isAbsolute(baseDirRaw) ? baseDirRaw : path.join(process.cwd(), baseDirRaw);

  if (!folderPath) {
    console.error('Usage: bun scripts/show-folder-deps.ts <relativeFolderPath> [baseDir]');
    console.error('Example: bun scripts/show-folder-deps.ts actions');
    process.exit(2);
  }

  const absoluteFolder = path.join(baseDir, folderPath.replace(/\//g, path.sep));

  if (!fs.existsSync(absoluteFolder)) {
    console.error(`Folder not found: ${absoluteFolder}`);
    process.exit(2);
  }

  const files: string[] = [];
  collectFiles(absoluteFolder, baseDir, files);
  files.sort();

  console.log(`\nDependencies for folder: ${folderPath}`);
  console.log(`Base dir: ${baseDir}`);
  console.log(`Files: ${files.length}\n`);

  if (files.length === 0) {
    console.log('(no .ts/.tsx/.js files found)\n');
    process.exit(0);
  }

  for (const rel of files) {
    const deps = getFileDeps(baseDir, rel);
    console.log(`  ${rel}`);
    if (deps.length === 0) {
      console.log('    (no imports)');
    } else {
      for (const d of deps) {
        console.log(`    - ${formatDep(d)}`);
      }
    }
    console.log('');
  }

  process.exit(0);
}

main();
