#!/usr/bin/env bun

/**
 * Compare one subfolder between two source versions.
 * Base/origin is fixed to src/phaser/src.
 *
 * Usage:
 *   bun scripts/compare-src-versions-folder.ts <subfolder>
 *   bun scripts/compare-src-versions-folder.ts <subfolder> <newVersionBase>
 *
 * Examples:
 *   bun scripts/compare-src-versions-folder.ts actions
 *   bun scripts/compare-src-versions-folder.ts actions original_src/src
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const ORIGIN_BASE = 'src/phaser/src';
const NEW_VERSION_DEFAULT = 'original_src/src';

interface FileInfo {
    path: string;
    hash: string;
}

interface ComparisonResult {
    onlyInOrigin: string[];
    onlyInNewVersion: string[];
    modified: string[];
    trivialChanges: string[];
    identical: string[];
}

interface FileDiff {
    linesAdded: number;
    linesRemoved: number;
    linesChanged: number;
    totalLines: number;
}

function shouldIgnoreRelativePath(relativePath: string): boolean {
    const segments = relativePath.split('/').filter(Boolean);
    return segments.includes('typedef') || segments.includes('typedefs');
}

function normalizeSubfolder(input?: string): string {
    if (!input) {
        return '';
    }

    return input.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function calculateHash(filePath: string): string {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
}

function getAllFiles(dir: string, baseDir: string = dir): FileInfo[] {
    const files: FileInfo[] = [];

    if (!fs.existsSync(dir)) {
        return files;
    }

    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (entry === 'typedef' || entry === 'typedefs') {
                continue;
            }
            files.push(...getAllFiles(fullPath, baseDir));
            continue;
        }

        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        if (shouldIgnoreRelativePath(relativePath)) {
            continue;
        }

        files.push({
            path: relativePath,
            hash: calculateHash(fullPath)
        });
    }

    return files;
}

function isTrivialChange(originFilePath: string, newFilePath: string): boolean {
    const originLines = fs.readFileSync(originFilePath, 'utf-8').split('\n');
    const newLines = fs.readFileSync(newFilePath, 'utf-8').split('\n');

    if (originLines.length !== newLines.length) {
        return false;
    }

    let changedLines = 0;

    for (let i = 0; i < originLines.length; i++) {
        if (originLines[i] === newLines[i]) {
            continue;
        }

        changedLines++;

        const isCopyrightLine =
            originLines[i].includes('@copyright') &&
            newLines[i].includes('@copyright');

        const yearChangedOnly =
            originLines[i].replace(/\b20\d{2}\b/g, 'YEAR') ===
            newLines[i].replace(/\b20\d{2}\b/g, 'YEAR');

        if (!isCopyrightLine || !yearChangedOnly) {
            return false;
        }
    }

    return changedLines === 1;
}

function getFileDiff(originFilePath: string, newFilePath: string): FileDiff {
    const originLines = fs.readFileSync(originFilePath, 'utf-8').split('\n');
    const newLines = fs.readFileSync(newFilePath, 'utf-8').split('\n');

    let linesAdded = 0;
    let linesRemoved = 0;
    let linesChanged = 0;

    const maxLines = Math.max(originLines.length, newLines.length);

    for (let i = 0; i < maxLines; i++) {
        const originLine = originLines[i];
        const newLine = newLines[i];

        if (originLine === undefined) {
            linesAdded++;
            continue;
        }

        if (newLine === undefined) {
            linesRemoved++;
            continue;
        }

        if (originLine !== newLine) {
            linesChanged++;
        }
    }

    return {
        linesAdded,
        linesRemoved,
        linesChanged,
        totalLines: newLines.length
    };
}

function compareSubfolder(subfolder: string, newVersionBase: string): ComparisonResult {
    const originFolder = path.join(ORIGIN_BASE, subfolder);
    const newVersionFolder = path.join(newVersionBase, subfolder);

    const originFiles = getAllFiles(originFolder);
    const newVersionFiles = getAllFiles(newVersionFolder);

    const originMap = new Map(originFiles.map(file => [file.path, file]));
    const newVersionMap = new Map(newVersionFiles.map(file => [file.path, file]));

    const result: ComparisonResult = {
        onlyInOrigin: [],
        onlyInNewVersion: [],
        modified: [],
        trivialChanges: [],
        identical: []
    };

    for (const [relativePath, originInfo] of originMap.entries()) {
        if (!newVersionMap.has(relativePath)) {
            result.onlyInOrigin.push(relativePath);
            continue;
        }

        const newVersionInfo = newVersionMap.get(relativePath);
        if (!newVersionInfo) {
            continue;
        }

        if (originInfo.hash === newVersionInfo.hash) {
            result.identical.push(relativePath);
            continue;
        }

        const originFilePath = path.join(originFolder, relativePath);
        const newFilePath = path.join(newVersionFolder, relativePath);

        if (isTrivialChange(originFilePath, newFilePath)) {
            result.trivialChanges.push(relativePath);
        } else {
            result.modified.push(relativePath);
        }
    }

    for (const relativePath of newVersionMap.keys()) {
        if (!originMap.has(relativePath)) {
            result.onlyInNewVersion.push(relativePath);
        }
    }

    result.onlyInOrigin.sort();
    result.onlyInNewVersion.sort();
    result.modified.sort();
    result.trivialChanges.sort();
    result.identical.sort();

    return result;
}

function printList(title: string, files: string[], prefix: string): void {
    if (files.length === 0) {
        return;
    }

    console.log(`\n${title} (${files.length})`);
    for (const file of files.slice(0, 40)) {
        console.log(`${prefix} ${file}`);
    }

    if (files.length > 40) {
        console.log(`... and ${files.length - 40} more`);
    }
}

function main(): void {
    const subfolder = normalizeSubfolder(process.argv[2]);
    const newVersionBase = process.argv[3] ?? NEW_VERSION_DEFAULT;

    if (!subfolder) {
        console.error('Usage: bun scripts/compare-src-versions-folder.ts <subfolder> [newVersionBase]');
        console.error('Example: bun scripts/compare-src-versions-folder.ts actions');
        console.error('Example: bun scripts/compare-src-versions-folder.ts actions original_src/src');
        process.exit(2);
    }

    const originFolder = path.join(ORIGIN_BASE, subfolder);
    const newVersionFolder = path.join(newVersionBase, subfolder);

    if (!fs.existsSync(originFolder) && !fs.existsSync(newVersionFolder)) {
        console.error(`Subfolder not found in either tree: ${subfolder}`);
        process.exit(2);
    }

    console.log(`Comparing subfolder: ${subfolder}`);
    console.log(`Origin base: ${ORIGIN_BASE}`);
    console.log(`New version base: ${newVersionBase}`);

    const result = compareSubfolder(subfolder, newVersionBase);

    printList('Only in origin', result.onlyInOrigin, '-');
    printList('Only in new version', result.onlyInNewVersion, '+');

    if (result.modified.length > 0) {
        console.log(`\nModified (significant) (${result.modified.length})`);
        for (const file of result.modified.slice(0, 30)) {
            const diff = getFileDiff(
                path.join(originFolder, file),
                path.join(newVersionFolder, file)
            );
            const changePct =
                diff.totalLines === 0 ? '0' : ((diff.linesChanged / diff.totalLines) * 100).toFixed(0);

            console.log(
                `! ${file} | ${diff.totalLines} lines | ${diff.linesChanged} changed (${changePct}%) | +${diff.linesAdded} -${diff.linesRemoved}`
            );
        }

        if (result.modified.length > 30) {
            console.log(`... and ${result.modified.length - 30} more`);
        }
    }

    console.log('\nSummary');
    console.log(`Only in origin: ${result.onlyInOrigin.length}`);
    console.log(`Only in new version: ${result.onlyInNewVersion.length}`);
    console.log(`Modified (significant): ${result.modified.length}`);
    console.log(`Trivial changes ignored: ${result.trivialChanges.length}`);
    console.log(`Identical: ${result.identical.length}`);

    process.exit(0);
}

main();
