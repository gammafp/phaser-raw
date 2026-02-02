#!/usr/bin/env bun

/**
 * Script to validate JavaScript syntax using Acorn parser
 * 
 * Usage:
 *   bun scripts/validate-js-syntax.ts [file.js]      - Validate single file
 *   bun scripts/validate-js-syntax.ts [directory]    - Validate all .js files in directory
 *   bun scripts/validate-js-syntax.ts                - Validate all .js files in src/phaser/src
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { parse } from 'acorn';

interface ValidationResult {
    file: string;
    valid: boolean;
    error?: string;
    line?: number;
    column?: number;
}

const results: ValidationResult[] = [];
let totalFiles = 0;
let validFiles = 0;
let invalidFiles = 0;

function validateFile(filepath: string): ValidationResult {
    const relativePath = relative(process.cwd(), filepath);
    
    try {
        const content = readFileSync(filepath, 'utf-8');
        
        // Parse with acorn (supports ES6+)
        parse(content, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            locations: true
        });
        
        return {
            file: relativePath,
            valid: true
        };
    } catch (error: any) {
        return {
            file: relativePath,
            valid: false,
            error: error.message || String(error),
            line: error.loc?.line,
            column: error.loc?.column
        };
    }
}

function scanDirectory(dir: string): void {
    const items = readdirSync(dir);
    
    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and other common folders
            if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
            scanDirectory(fullPath);
        } else if (item.endsWith('.js')) {
            totalFiles++;
            const result = validateFile(fullPath);
            results.push(result);
            
            if (result.valid) {
                validFiles++;
            } else {
                invalidFiles++;
            }
        }
    }
}

// Main execution
const target = process.argv[2] || join(process.cwd(), 'src', 'phaser', 'src');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║          JAVASCRIPT SYNTAX VALIDATOR                        ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

if (!existsSync(target)) {
    console.error(`❌ Error: Path does not exist: ${target}`);
    process.exit(1);
}

const stats = statSync(target);

if (stats.isFile()) {
    if (!target.endsWith('.js')) {
        console.error(`❌ Error: File must be a .js file: ${target}`);
        process.exit(1);
    }
    console.log(`📄 Validating single file: ${target}\n`);
    totalFiles = 1;
    const result = validateFile(target);
    results.push(result);
    if (result.valid) {
        validFiles = 1;
    } else {
        invalidFiles = 1;
    }
} else if (stats.isDirectory()) {
    console.log(`📁 Scanning directory: ${target}\n`);
    console.log('🔍 Parsing JavaScript files...\n');
    scanDirectory(target);
} else {
    console.error(`❌ Error: Invalid target: ${target}`);
    process.exit(1);
}

// Display results
console.log('════════════════════════════════════════════════════════════════');
console.log('📊 VALIDATION SUMMARY');
console.log('────────────────────────────────────────────────────────────────');
console.log(`Total files checked: ${totalFiles}`);
console.log(`✅ Valid: ${validFiles} (${((validFiles/totalFiles) * 100).toFixed(1)}%)`);
console.log(`❌ Invalid: ${invalidFiles} (${((invalidFiles/totalFiles) * 100).toFixed(1)}%)`);
console.log('════════════════════════════════════════════════════════════════\n');

// Show errors if any
if (invalidFiles > 0) {
    console.log('❌ FILES WITH SYNTAX ERRORS:');
    console.log('────────────────────────────────────────────────────────────────\n');
    
    const errorResults = results.filter(r => !r.valid);
    
    for (const result of errorResults) {
        console.log(`📄 ${result.file}`);
        if (result.line !== undefined && result.column !== undefined) {
            console.log(`   Location: Line ${result.line}, Column ${result.column}`);
        }
        console.log(`   Error: ${result.error}`);
        console.log('');
    }
    
    console.log('════════════════════════════════════════════════════════════════\n');
    process.exit(1);
} else {
    console.log('✅ ALL FILES HAVE VALID SYNTAX!\n');
    console.log('   No syntax errors detected.\n');
    process.exit(0);
}
