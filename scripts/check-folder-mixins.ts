#!/usr/bin/env bun

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

// Get folder path from command line argument
const folderArg = process.argv[2];

if (!folderArg) {
    console.error('❌ Usage: bun scripts/check-folder-mixins.ts <folder-path>');
    console.error('   Example: bun scripts/check-folder-mixins.ts src/phaser/src/curves');
    process.exit(1);
}

const baseDir = process.cwd();
const targetFolder = join(baseDir, folderArg);

console.log(`\n🔍 Checking folder for Mixins/Extends: ${folderArg}\n`);

interface FileResult {
    path: string;
    hasMixins: boolean;
    hasExtends: boolean;
    hasNewClass: boolean;
    isES6Class: boolean;
    lines: number;
}

const results: FileResult[] = [];

function scanFolder(dir: string): void {
    const items = readdirSync(dir);

    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip typedef folders
            if (item === 'typedefs') continue;
            scanFolder(fullPath);
        } else if (item.endsWith('.js')) {
            const content = readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n').length;
            const relativePath = relative(join(baseDir, 'src/phaser/src'), fullPath);

            const hasMixins = /Mixins\s*:\s*\[/m.test(content);
            const hasExtends = /Extends\s*:/m.test(content);
            const hasNewClass = /= new Class\(/m.test(content);
            const isES6Class = /^(export\s+)?class\s+\w+/m.test(content);

            results.push({
                path: relativePath,
                hasMixins,
                hasExtends,
                hasNewClass,
                isES6Class,
                lines
            });
        }
    }
}

try {
    scanFolder(targetFolder);
} catch (error) {
    console.error(`❌ Error: Folder not found or cannot be read: ${folderArg}`);
    process.exit(1);
}

// Analyze results
const totalFiles = results.length;
const filesWithMixins = results.filter(f => f.hasMixins);
const filesWithExtends = results.filter(f => f.hasExtends);
const filesWithNewClass = results.filter(f => f.hasNewClass);
const es6Classes = results.filter(f => f.isES6Class);
const complexClasses = results.filter(f => f.hasMixins || f.hasExtends);
const simpleNewClass = results.filter(f => f.hasNewClass && !f.hasMixins && !f.hasExtends);

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║              FOLDER ANALYSIS - MIXINS CHECK                  ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log('📊 SUMMARY');
console.log('────────────────────────────────────────────────────────────────');
console.log(`Total JS files: ${totalFiles}`);
console.log(`Files with Mixins: ${filesWithMixins.length}`);
console.log(`Files with Extends: ${filesWithExtends.length}`);
console.log(`Complex classes (Mixins/Extends): ${complexClasses.length}`);
console.log(`Simple classes (new Class): ${simpleNewClass.length}`);
console.log(`ES6 modern classes: ${es6Classes.length}\n`);

if (complexClasses.length > 0) {
    console.log('🔴 FILES WITH MIXINS/EXTENDS (COMPLEX):');
    console.log('────────────────────────────────────────────────────────────────');
    complexClasses.forEach(file => {
        const tags = [];
        if (file.hasMixins) tags.push('Mixins');
        if (file.hasExtends) tags.push('Extends');
        console.log(`  ❌ ${file.path} (${tags.join(', ')}, ${file.lines} lines)`);
    });
    console.log('');
}

if (simpleNewClass.length > 0) {
    console.log('🟡 FILES WITH SIMPLE CLASSES (new Class):');
    console.log('────────────────────────────────────────────────────────────────');
    simpleNewClass.forEach(file => {
        console.log(`  ⚠️  ${file.path} (${file.lines} lines)`);
    });
    console.log('');
}

if (es6Classes.length > 0) {
    console.log('🟢 FILES WITH ES6 CLASSES:');
    console.log('────────────────────────────────────────────────────────────────');
    es6Classes.forEach(file => {
        console.log(`  ✅ ${file.path} (${file.lines} lines)`);
    });
    console.log('');
}

const simpleFiles = results.filter(f => 
    !f.hasMixins && 
    !f.hasExtends && 
    !f.hasNewClass && 
    !f.isES6Class
);

if (simpleFiles.length > 0) {
    console.log('✅ SIMPLE FILES (CONVERTIBLE):');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`  Found ${simpleFiles.length} simple function/constant files`);
    simpleFiles.slice(0, 10).forEach(file => {
        console.log(`  ✓ ${file.path} (${file.lines} lines)`);
    });
    if (simpleFiles.length > 10) {
        console.log(`  ... and ${simpleFiles.length - 10} more`);
    }
    console.log('');
}

console.log('════════════════════════════════════════════════════════════════\n');

// Conclusion
if (complexClasses.length === 0 && simpleNewClass.length === 0) {
    console.log('✅ FOLDER IS SAFE TO CONVERT');
    console.log('   No Mixins or Extends found in any file.\n');
} else {
    console.log('⚠️  FOLDER HAS COMPLEX CLASSES');
    console.log(`   ${complexClasses.length} files with Mixins/Extends`);
    console.log(`   ${simpleNewClass.length} files with simple new Class\n`);
}

process.exit(0);
