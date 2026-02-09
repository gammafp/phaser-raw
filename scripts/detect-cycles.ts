#!/usr/bin/env bun

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';

type Graph = Map<string, Set<string>>;

const TARGET_ROOT = join(process.cwd(), 'src', 'phaser', 'src');
const EXTENSIONS = ['.js', '.ts', '.mjs', '.cjs', '.jsx', '.tsx'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out']);

function collectFiles(dir: string, files: Set<string>): void {
    const entries = readdirSync(dir);

    for (const entry of entries) {
        if (SKIP_DIRS.has(entry)) {
            continue;
        }

        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            collectFiles(fullPath, files);
            continue;
        }

        const ext = extname(entry);
        if (!EXTENSIONS.includes(ext)) {
            continue;
        }
        if (entry.endsWith('.d.ts')) {
            continue;
        }

        files.add(resolve(fullPath));
    }
}

function stripComments(source: string): string {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');
}

function extractSpecifiers(source: string): string[] {
    const stripped = stripComments(source);
    const specs: string[] = [];
    const patterns = [
        /import\s+[^'";]*?from\s*['"]([^'"]+)['"]/g,
        /import\s*['"]([^'"]+)['"]/g,
        /export\s+[^'";]*?from\s*['"]([^'"]+)['"]/g,
        /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
        /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    ];

    for (const pattern of patterns) {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(stripped)) !== null) {
            specs.push(match[1]);
        }
    }

    return specs;
}

function resolveModule(fromFile: string, spec: string, fileSet: Set<string>): string | null {
    if (!spec.startsWith('.')) {
        return null;
    }

    const base = resolve(dirname(fromFile), spec);
    const hasExt = extname(base).length > 0;

    if (hasExt) {
        const direct = base;
        if (fileSet.has(direct)) {
            return direct;
        }
        return null;
    }

    for (const ext of EXTENSIONS) {
        const candidate = `${base}${ext}`;
        if (fileSet.has(candidate)) {
            return candidate;
        }
    }

    for (const ext of EXTENSIONS) {
        const candidate = join(base, `index${ext}`);
        if (fileSet.has(candidate)) {
            return candidate;
        }
    }

    return null;
}

function buildGraph(files: Set<string>): Graph {
    const graph: Graph = new Map();

    for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        const specs = extractSpecifiers(content);

        for (const spec of specs) {
            const resolved = resolveModule(file, spec, files);
            if (!resolved) {
                continue;
            }

            if (!graph.has(file)) {
                graph.set(file, new Set());
            }
            graph.get(file)!.add(resolved);
        }

        if (!graph.has(file)) {
            graph.set(file, new Set());
        }
    }

    return graph;
}

function toRelPath(filePath: string): string {
    return relative(TARGET_ROOT, filePath).replace(/\\/g, '/');
}

function normalizeCycle(cycle: string[]): string {
    const nodes = cycle.slice(0, -1).map(toRelPath);
    if (nodes.length === 0) {
        return '';
    }

    let best = '';
    for (let i = 0; i < nodes.length; i++) {
        const rotated = nodes.slice(i).concat(nodes.slice(0, i));
        const text = `${rotated.join(' -> ')} -> ${rotated[0]}`;
        if (best === '' || text < best) {
            best = text;
        }
    }

    return best;
}

function findCycles(graph: Graph): string[] {
    const visited = new Set<string>();
    const stack = new Set<string>();
    const path: string[] = [];
    const cycles = new Set<string>();

    function dfs(node: string): void {
        visited.add(node);
        stack.add(node);
        path.push(node);

        for (const next of graph.get(node) ?? []) {
            if (!visited.has(next)) {
                dfs(next);
                continue;
            }

            if (stack.has(next)) {
                const index = path.indexOf(next);
                if (index !== -1) {
                    const cycle = path.slice(index);
                    cycle.push(next);
                    const normalized = normalizeCycle(cycle);
                    if (normalized) {
                        cycles.add(normalized);
                    }
                }
            }
        }

        stack.delete(node);
        path.pop();
    }

    for (const node of graph.keys()) {
        if (!visited.has(node)) {
            dfs(node);
        }
    }

    return Array.from(cycles).sort();
}

function main(): void {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║           CIRCULAR DEPENDENCY SCANNER                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const files = new Set<string>();
    collectFiles(TARGET_ROOT, files);

    console.log(`Scanning: ${TARGET_ROOT}`);
    console.log(`Files: ${files.size}`);

    const graph = buildGraph(files);
    const cycles = findCycles(graph);

    console.log('\n════════════════════════════════════════════════════════════════');

    if (cycles.length === 0) {
        console.log('No cycles found.');
        return;
    }

    console.log(`Found ${cycles.length} cycle(s):\n`);
    cycles.forEach((cycle, index) => {
        console.log(`${index + 1}. ${cycle}`);
    });
}

main();
