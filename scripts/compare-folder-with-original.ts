#!/usr/bin/env bun

/**
 * Compare a subfolder between original and current source trees.
 * Usage:
 *   bun scripts/compare-folder-with-original.ts actions
 */

import * as fs from 'fs';
import * as path from 'path';

const ORIGINAL_BASE = 'original_src/src';
const CURRENT_BASE = 'src/phaser/src';

interface ComparisonResult {
    missing: string[];
    converted: string[];
    extra: string[];
    missingAndNotConverted: string[];
}

function normalizeFolderArg(folderArg?: string): string {
    if (!folderArg) {
        return '';
    }

    return folderArg
        .replace(/\\/g, '/')
        .replace(/^\/+|\/+$/g, '');
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
        return files;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getAllFiles(fullPath, baseDir));
        } else {
            const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
            files.push(relativePath);
        }
    }

    return files;
}

function filterByFolder(files: string[], folderFilter: string): string[] {
    const prefix = `${folderFilter}/`;
    return files.filter(file => file === folderFilter || file.startsWith(prefix));
}

function compareDirectories(folderFilter: string): ComparisonResult {
    const originalFiles = filterByFolder(getAllFiles(ORIGINAL_BASE), folderFilter);
    const currentFiles = filterByFolder(getAllFiles(CURRENT_BASE), folderFilter);

    const result: ComparisonResult = {
        missing: [],
        converted: [],
        extra: [],
        missingAndNotConverted: []
    };

    const originalSet = new Set(originalFiles);
    const currentSet = new Set(currentFiles);

    for (const originalFile of originalSet) {
        if (!currentSet.has(originalFile)) {
            if (originalFile.endsWith('.js')) {
                const tsVersion = originalFile.replace(/\.js$/, '.ts');

                if (currentSet.has(tsVersion)) {
                    result.converted.push(originalFile);
                } else {
                    result.missing.push(originalFile);
                    result.missingAndNotConverted.push(originalFile);
                }
            } else {
                result.missing.push(originalFile);
            }
        }
    }

    for (const currentFile of currentSet) {
        if (currentFile.endsWith('.ts')) {
            const jsVersion = currentFile.replace(/\.ts$/, '.js');

            if (!originalSet.has(jsVersion) && !originalSet.has(currentFile)) {
                result.extra.push(currentFile);
            }
        } else if (!originalSet.has(currentFile)) {
            result.extra.push(currentFile);
        }
    }

    return result;
}

function printSection(title: string, files: string[]): void {
    if (files.length === 0) {
        return;
    }

    console.log(`\n${title} (${files.length})`);
    for (const file of files.slice(0, 30)) {
        console.log(`- ${file}`);
    }

    if (files.length > 30) {
        console.log(`... and ${files.length - 30} more`);
    }
}

function main(): void {
    const folderFilter = normalizeFolderArg(process.argv[2]);

    if (!folderFilter) {
        console.error('Usage: bun scripts/compare-folder-with-original.ts <folder>');
        console.error('Example: bun scripts/compare-folder-with-original.ts actions');
        process.exit(2);
    }

    const originalFolderPath = path.join(ORIGINAL_BASE, folderFilter);
    const currentFolderPath = path.join(CURRENT_BASE, folderFilter);

    if (!fs.existsSync(originalFolderPath) && !fs.existsSync(currentFolderPath)) {
        console.error(`Folder not found in either tree: ${folderFilter}`);
        process.exit(2);
    }

    console.log(`Comparing folder: ${folderFilter}`);
    console.log(`Original base: ${ORIGINAL_BASE}`);
    console.log(`Current base:  ${CURRENT_BASE}`);

    const result = compareDirectories(folderFilter);

    printSection('Converted (.js -> .ts)', result.converted);
    printSection('Missing and not converted', result.missingAndNotConverted);
    printSection('Extra files in current', result.extra);

    console.log('\nSummary');
    console.log(`Converted: ${result.converted.length}`);
    console.log(`Missing (not converted): ${result.missingAndNotConverted.length}`);
    console.log(`Extra: ${result.extra.length}`);

    process.exit(result.missingAndNotConverted.length > 0 ? 1 : 0);
}

main();
