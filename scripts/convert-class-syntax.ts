#!/usr/bin/env bun

/**
 * Script to convert Phaser's `new Class({...})` syntax to ES6 class syntax
 * 
 * Original PHP version by LjjGit (https://github.com/LjjGit) - Thank you for your work!
 * Converted from PHP to TypeScript for Bun runtime by Phaser Studio Team
 * 
 * Usage: 
 *   bun scripts/convert-class-syntax.ts [directory]  - Process all .js files in directory
 *   bun scripts/convert-class-syntax.ts [file.js]    - Process single file
 */

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

let classCount = 0;
let extendsCount = 0;

function scan(dir: string, callback: (filename: string, dir: string) => void): void {
    const files = readdirSync(dir);
    
    for (const file of files) {
        if (file === '.' || file === '..') continue;
        
        const filename = join(dir, file);
        const stats = statSync(filename);
        
        if (stats.isDirectory()) {
            scan(filename, callback);
        } else if (file.endsWith('.js')) {
            callback(filename, dir);
        }
    }
}

function processFile(filename: string, dir: string): void {
    let content = readFileSync(filename, 'utf-8');
    
    // Pattern: var ClassName = new Class({...});
    const newClassPattern = /(^var (\w+) = )new Class\((\{[\s\S]*?^})\)(;$)/m;
    const match = content.match(newClassPattern);
    
    if (!match) return;
    
    classCount++;
    
    let classContent = match[0];
    const className = match[2];
    
    let extend = '';
    
    // Check for Extends
    const extendsPattern = /\s*?^ {4}Extends: (\w+),/m;
    const extendsMatch = classContent.match(extendsPattern);
    
    if (extendsMatch) {
        classContent = classContent.replace(extendsPattern, '');
        extend = ' extends ' + extendsMatch[1];
        
        // Replace ClassName.call(this, ...) with super(...)
        const superPattern = new RegExp(`\\b${extendsMatch[1]}\\.call\\(\\s*this\\b,?\\s*(.*?\\);)`, 'g');
        classContent = classContent.replace(superPattern, 'super($1');
    }
    
    // Convert initialize: function ClassName(...) to constructor(...)
    classContent = classContent.replace(/\binitialize\s*:\s*function\s*\w+\s*/g, 'constructor');
    
    // Convert var ClassName = new Class({...}); to var ClassName = class extends X {...};
    classContent = classContent.replace(newClassPattern, `$1class${extend} $3$4`);
    
    // Convert method: function(...) to method(...)
    classContent = classContent.replace(/(^ {4}\w+)\s*:\s*\bfunction\b\s*/gm, '$1');
    
    // Remove trailing comma from closing brace
    classContent = classContent.replace(/(^ {4}}),/gm, '$1');
    
    // Handle Mixins
    classContent = classContent.replace(
        /^ {4}\bMixins: \[([\s\S]*?^ {4})],/m,
        (match, mixins) => {
            const adjustedMixins = mixins.replace(/        /g, '            ');
            return `    static
    {
        Class.mixin(this, [${adjustedMixins}    ], false);
    }`;
        }
    );
    
    // Handle getters and setters
    classContent = classContent.replace(
        /^ {4}(\w+)\s*:\s*\{([\s\S]*?(\bget\s*:|\bset\s*:)[\s\S]*?^ {4})}/gm,
        (match, propName, body) => {
            // Remove trailing commas from inner braces
            body = body.replace(/(^ {8}}),/gm, '$1');
            body = body.trim();
            body = '\n    ' + body;
            body = body.replace(/^ {8}/gm, '    ');
            
            // Convert get: function() and set: function() to get propName() and set propName()
            body = body.replace(/(\b(g|s)et)\s*:\s*function\b\s*/g, `$1 ${propName}`);
            
            return body;
        }
    );
    
    // Apply changes to original content
    content = content.replace(newClassPattern, classContent);
    
    // Write back to file
    writeFileSync(filename, content, 'utf-8');
    
    console.log(`✓ Converted: ${filename}`);
}

// Main execution
const target = process.argv[2] || join(process.cwd(), 'src', 'phaser', 'src');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║        PHASER CLASS SYNTAX CONVERTER                        ║');
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
    console.log(`📄 Processing single file: ${target}\n`);
    processFile(target, '.');
} else if (stats.isDirectory()) {
    console.log(`📁 Scanning directory: ${target}\n`);
    scan(target, processFile);
} else {
    console.error(`❌ Error: Invalid target: ${target}`);
    process.exit(1);
}

console.log('\n════════════════════════════════════════════════════════════════');
console.log(`✅ Conversion complete!`);
console.log(`   Classes converted: ${classCount}`);
console.log('════════════════════════════════════════════════════════════════\n');
