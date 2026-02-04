#!/usr/bin/env bun

/**
 * Script to find all TODO comments in the project
 * 
 * Usage:
 *   bun scripts/find-todos.ts
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';

interface TodoItem {
    file: string;
    line: number;
    content: string;
    type: string; // 'js' or 'ts'
}

const todos: TodoItem[] = [];
const TARGET_ROOT = join(process.cwd(), 'src', 'phaser', 'src');

function scanDirectory(dir: string): void {
    const items = readdirSync(dir);
    
    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'temp') continue;
            scanDirectory(fullPath);
        } else if (item.endsWith('.js') || item.endsWith('.ts')) {
            const content = readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                // Match: // TODO: or //TODO: (with or without space)
                if (/\/\/\s*TODO:/i.test(line)) {
                    const relativePath = relative(TARGET_ROOT, fullPath);
                    todos.push({
                        file: relativePath,
                        line: index + 1,
                        content: line.trim(),
                        type: item.endsWith('.ts') ? 'ts' : 'js'
                    });
                }
            });
        }
    }
}

// Main execution
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║                    TODO FINDER                              ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log(`📁 Scanning directory: ${relative(process.cwd(), TARGET_ROOT)}\n`);
console.log('🔍 Searching for TODO comments...\n');

scanDirectory(TARGET_ROOT);

// Group by file type
const jsTodos = todos.filter(t => t.type === 'js');
const tsTodos = todos.filter(t => t.type === 'ts');

console.log('════════════════════════════════════════════════════════════════');
console.log('📊 SUMMARY');
console.log('────────────────────────────────────────────────────────────────');
console.log(`Total TODOs found: ${todos.length}`);
console.log(`  🟡 In JavaScript files: ${jsTodos.length}`);
console.log(`  🔵 In TypeScript files: ${tsTodos.length}`);
console.log('════════════════════════════════════════════════════════════════\n');

if (todos.length === 0) {
    console.log('✅ NO TODOs FOUND!\n');
    console.log('   All files are clean.\n');
    process.exit(0);
}

console.log('📋 TODOS BY FILE TYPE');
console.log('────────────────────────────────────────────────────────────────\n');

// Show JavaScript TODOs
if (jsTodos.length > 0) {
    console.log('🟡 JAVASCRIPT FILES:\n');
    for (const todo of jsTodos) {
        console.log(`   ${todo.file}:${todo.line}`);
        console.log(`      ${todo.content}\n`);
    }
}

// Show TypeScript TODOs
if (tsTodos.length > 0) {
    console.log('🔵 TYPESCRIPT FILES:\n');
    for (const todo of tsTodos) {
        console.log(`   ${todo.file}:${todo.line}`);
        console.log(`      ${todo.content}\n`);
    }
}

console.log('════════════════════════════════════════════════════════════════');
console.log('\n💡 TIP:');
console.log('   TODOs in .js files usually mean "Convert this file to TypeScript"');
console.log('   TODOs in .ts files may indicate pending work or complex algorithms\n');
