#!/usr/bin/env bun

/**
 * Script to find all files using the legacy Class.js system
 * 
 * Usage:
 *   bun scripts/analyze-class-usage.ts
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';

interface ClassUsage {
    file: string;
    lines: number;
    hasRequire: boolean;
    hasNewClass: boolean;
    requireLine?: number;
}

const results: ClassUsage[] = [];

function analyzeFile(filepath: string): ClassUsage | null {
    const relativePath = relative(process.cwd(), filepath);
    const content = readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    
    const hasRequire = /require\(['"].*utils\/Class['"]\)/.test(content);
    const hasNewClass = /new Class\({/.test(content);
    
    if (!hasRequire && !hasNewClass) {
        return null;
    }
    
    let requireLine: number | undefined;
    
    for (let i = 0; i < lines.length; i++) {
        if (/require\(['"].*utils\/Class['"]\)/.test(lines[i])) {
            requireLine = i + 1;
            break;
        }
    }
    
    return {
        file: relativePath,
        lines: lines.length,
        hasRequire,
        hasNewClass,
        requireLine
    };
}

function scanDirectory(dir: string): void {
    const items = readdirSync(dir);
    
    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'temp') continue;
            scanDirectory(fullPath);
        } else if (item.endsWith('.js') || item.endsWith('.ts')) {
            const result = analyzeFile(fullPath);
            if (result) {
                results.push(result);
            }
        }
    }
}

// Main execution
const target = join(process.cwd(), 'src', 'phaser', 'src');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║          CLASS.JS USAGE ANALYZER                            ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log(`📁 Scanning directory: ${relative(process.cwd(), target)}\n`);
console.log('🔍 Searching for Class.js usage...\n');

scanDirectory(target);

// Sort by size (smallest first)
results.sort((a, b) => a.lines - b.lines);

console.log('════════════════════════════════════════════════════════════════');
console.log('📊 SUMMARY');
console.log('────────────────────────────────────────────────────────────────');
console.log(`Total files using Class.js: ${results.length}`);
console.log(`Files with require(): ${results.filter(r => r.hasRequire).length}`);
console.log(`Files with new Class(): ${results.filter(r => r.hasNewClass).length}`);
console.log('════════════════════════════════════════════════════════════════\n');

console.log('📋 FILES USING CLASS.JS (SMALLEST TO LARGEST)');
console.log('────────────────────────────────────────────────────────────────\n');

for (const file of results) {
    const icon = file.file.endsWith('.js') ? '🟡' : '🔵';
    const status = file.hasNewClass ? ' ⚠️  new Class()' : '';
    console.log(`${icon} ${file.file.padEnd(60)} ${String(file.lines).padStart(5)} lines${status}`);
}

console.log('════════════════════════════════════════════════════════════════');
console.log('\n💡 LEGEND:');
console.log('   🟡 JavaScript file (needs conversion)');
console.log('   🔵 TypeScript file (already converted but still using require)');
console.log('   ⚠️  File uses legacy Class syntax\n');
