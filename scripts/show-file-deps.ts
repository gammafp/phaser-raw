#!/usr/bin/env bun

/**
 * Show dependencies (imports) of a file under a base folder.
 *
 * Usage:
 *   bun scripts/show-file-deps.ts <relativeFilePath> [baseDir]
 *
 * Examples:
 *   bun scripts/show-file-deps.ts actions/AlignTo.ts
 *   bun scripts/show-file-deps.ts actions/AlignTo.ts src_converted/phaser/src
 *
 * Output: list of resolved dependency paths (relative to baseDir).
 */

import * as fs from 'fs';
import * as path from 'path';

const BASE_DIR_DEFAULT = 'src_converted/phaser/src';

// Match: import ... from 'specifier' or "specifier", capture specifier and quote
const IMPORT_FROM_REGEX = /(?:from\s+|require\s*\(\s*)(['"])([^'"]+)\1/g;

// Detect if the import line is type-only (import type { X } from '...')
function isTypeOnlyImport(content: string, matchIndex: number): boolean {
  const lineStart = content.lastIndexOf('\n', matchIndex - 1) + 1;
  const lineEnd = content.indexOf('\n', matchIndex);
  const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
  return /\bimport\s+type\b/.test(line);
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

/** First path segment = namespace (e.g. "actions", "display", "gameobjects") */
function getNamespace(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, '/');
  const seg = normalized.split('/').filter(Boolean);
  return seg[0] ?? '';
}

function resolveModulePath(
  baseDir: string,
  fromFile: string,
  specifier: string
): { path: string; exists: boolean } {
  // Skip node_modules / external packages (no relative path)
  if (typeof specifier !== 'string' || !specifier.startsWith('.')) {
    return { path: specifier, exists: false };
  }

  const fromDir = path.dirname(path.join(baseDir, fromFile));
  const resolvedAbsolute = path.normalize(path.join(fromDir, specifier));
  const resolvedRelative = path.relative(baseDir, resolvedAbsolute);
  const resolvedSlash = resolvedRelative.replace(/\\/g, '/');

  const candidates = [
    path.join(baseDir, resolvedRelative + '.ts'),
    path.join(baseDir, resolvedRelative + '.tsx'),
    path.join(baseDir, resolvedRelative + '.js'),
    path.join(baseDir, resolvedRelative, 'index.ts'),
    path.join(baseDir, resolvedRelative, 'index.tsx'),
    path.join(baseDir, resolvedRelative, 'index.js'),
  ];

  for (const fullPath of candidates) {
    if (fs.existsSync(fullPath)) {
      const rel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      return { path: rel, exists: true };
    }
  }

  return { path: resolvedSlash, exists: false };
}

interface ImportInfo {
  specifier: string;
  isType: boolean;
}

function extractImports(content: string): ImportInfo[] {
  const seen = new Set<string>();
  const list: ImportInfo[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(IMPORT_FROM_REGEX.source, 'g');
  while ((m = re.exec(content)) !== null) {
    const spec = m[2];
    if (typeof spec !== 'string' || spec.length === 0) continue;
    if (seen.has(spec)) continue;
    seen.add(spec);
    const isType = m[0].startsWith('require') ? false : isTypeOnlyImport(content, m.index);
    list.push({ specifier: spec, isType });
  }
  return list;
}

function main(): void {
  const relativeFilePath = normalizePath(process.argv[2] || '');
  const baseDirRaw = normalizePath(process.argv[3] || BASE_DIR_DEFAULT).replace(/\//g, path.sep);
  const baseDir = path.isAbsolute(baseDirRaw) ? baseDirRaw : path.join(process.cwd(), baseDirRaw);

  if (!relativeFilePath) {
    console.error('Usage: bun scripts/show-file-deps.ts <relativeFilePath> [baseDir]');
    console.error('Example: bun scripts/show-file-deps.ts actions/AlignTo.ts');
    process.exit(2);
  }

  const absolutePath = path.join(baseDir, relativeFilePath.replace(/\//g, path.sep));

  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(2);
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  const imports = extractImports(content);

  const currentNamespace = getNamespace(relativeFilePath);

  console.log(`\nDependencies of: ${relativeFilePath}`);
  console.log(`Namespace (parent): ${currentNamespace}`);
  console.log(`Base dir: ${baseDir}\n`);

  if (imports.length === 0) {
    console.log('(no imports found)\n');
    process.exit(0);
  }

  const results: {
    specifier: string;
    resolved: string;
    exists: boolean;
    isType: boolean;
    depNamespace: string;
    sameNamespace: boolean;
  }[] = [];

  for (const imp of imports) {
    const { path: resolved, exists } = resolveModulePath(baseDir, relativeFilePath, imp.specifier);
    const isRelative = typeof imp.specifier === 'string' && imp.specifier.startsWith('.');
    const depNamespace = isRelative ? getNamespace(resolved) : '';
    const sameNamespace = depNamespace !== '' && depNamespace === currentNamespace;
    results.push({
      specifier: imp.specifier,
      resolved,
      exists,
      isType: imp.isType,
      depNamespace,
      sameNamespace,
    });
  }

  const maxSpec = Math.max(...results.map((r) => r.specifier.length), 8);
  const maxRes = Math.max(...results.map((r) => r.resolved.length), 12);

  console.log(
    '  ' +
      'Specifier'.padEnd(maxSpec) +
      '  Resolved path'.padEnd(Math.max(maxRes, 24)) +
      '  Kind   Namespace'
  );
  console.log('  ' + '-'.repeat(maxSpec + 2 + Math.max(maxRes, 24) + 2 + 6 + 2 + 20));

  for (const r of results) {
    const kindStr = r.isType ? 'type' : 'value';
    const nsStr = r.depNamespace === ''
      ? '(external)'
      : r.sameNamespace
        ? `same (${r.depNamespace})`
        : `→ ${r.depNamespace}`;
    console.log(
      '  ' +
        r.specifier.padEnd(maxSpec) +
        '  ' +
        r.resolved.padEnd(Math.max(maxRes, 24)) +
        '  ' +
        kindStr.padEnd(6) +
        '  ' +
        nsStr
    );
  }

  console.log('');
  process.exit(0);
}

/** Result for one dependency (for use by show-folder-deps) */
export interface DepEntry {
  specifier: string;
  resolved: string;
  exists: boolean;
  isType: boolean;
  depNamespace: string;
  sameNamespace: boolean;
}

/** Get dependencies of a single file. Used by show-folder-deps. */
export function getFileDeps(
  baseDir: string,
  relativeFilePath: string
): DepEntry[] {
  const absolutePath = path.join(baseDir, relativeFilePath.replace(/\//g, path.sep));
  if (!fs.existsSync(absolutePath)) return [];
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const imports = extractImports(content);
  const currentNamespace = getNamespace(relativeFilePath);
  const results: DepEntry[] = [];
  for (const imp of imports) {
    const { path: resolved, exists } = resolveModulePath(baseDir, relativeFilePath, imp.specifier);
    const isRelative = typeof imp.specifier === 'string' && imp.specifier.startsWith('.');
    const depNamespace = isRelative ? getNamespace(resolved) : '';
    const sameNamespace = depNamespace !== '' && depNamespace === currentNamespace;
    results.push({
      specifier: imp.specifier,
      resolved,
      exists,
      isType: imp.isType,
      depNamespace,
      sameNamespace,
    });
  }
  return results;
}

if (import.meta.main) main();
