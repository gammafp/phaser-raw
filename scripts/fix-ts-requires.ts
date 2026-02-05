#!/usr/bin/env bun

/**
 * Script para convertir require() a import {} en archivos TypeScript
 * SOLO convierte require() que apuntan a módulos YA CONVERTIDOS a TypeScript
 */

import * as fs from 'fs';
import * as path from 'path';

const TARGET_ROOT = 'src/phaser/src';

interface FixResult {
    file: string;
    fixesApplied: number;
}

// Find all .ts files (converted modules)
async function findTsModules(dir: string, tsModules: Set<string>): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await findTsModules(fullPath, tsModules);
            continue;
        }

        if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
            const relativePath = path.relative(TARGET_ROOT, fullPath);
            const withoutExt = relativePath.replace(/\.ts$/, '').replace(/\\/g, '/');
            tsModules.add(withoutExt);
        }
    }
}

async function fixRequiresInFile(filePath: string, tsModules: Set<string>): Promise<number> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileDir = path.relative(TARGET_ROOT, path.join(filePath, '..'));
    let fixes = 0;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Skip comments and special cases
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
        if (line.includes('if (typeof') || line.includes('if(typeof')) continue;
        if (line.match(/^\s*[\w]+:\s*require\(/)) continue;

        // Pattern 1: const/var X = require('path')
        const simpleMatch = line.match(/(const|var)\s+(\w+)\s*=\s*require\(['"](\.\.?\/[^'"]+)['"]\)/);
        
        if (simpleMatch) {
            const [fullMatch, keyword, varName, modulePath] = simpleMatch;
            const resolvedPath = path.join(fileDir, modulePath).replace(/\\/g, '/');
            
            // Only convert if module is TypeScript
            if (tsModules.has(resolvedPath)) {
                lines[i] = line.replace(fullMatch, `import { ${varName} } from '${modulePath}'`);
                fixes++;
                modified = true;
            }
            continue;
        }

        // Pattern 2: const { X, Y } = require('path')
        const destructureMatch = line.match(/(const|var)\s+\{\s*([^}]+)\s*\}\s*=\s*require\(['"](\.\.?\/[^'"]+)['"]\)/);
        
        if (destructureMatch) {
            const [fullMatch, keyword, names, modulePath] = destructureMatch;
            const resolvedPath = path.join(fileDir, modulePath).replace(/\\/g, '/');
            
            // Only convert if module is TypeScript
            if (tsModules.has(resolvedPath)) {
                lines[i] = line.replace(fullMatch, `import { ${names.trim()} } from '${modulePath}'`);
                fixes++;
                modified = true;
            }
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    }

    return fixes;
}

async function findAndFixTsFiles(dir: string, tsModules: Set<string>, results: FixResult[]): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await findAndFixTsFiles(fullPath, tsModules, results);
            continue;
        }

        // Only process .ts files (not .d.ts)
        if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
            const fixes = await fixRequiresInFile(fullPath, tsModules);
            
            if (fixes > 0) {
                results.push({
                    file: path.relative(TARGET_ROOT, fullPath),
                    fixesApplied: fixes
                });
            }
        }
    }
}

const main = async () => {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║         FIX TYPESCRIPT REQUIRES → IMPORTS                   ║');
    console.log('║         (Only converts require() to converted TS modules)    ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log('🔍 Scanning for converted TypeScript modules...');
    const tsModules = new Set<string>();
    await findTsModules(TARGET_ROOT, tsModules);
    console.log(`   Found ${tsModules.size} TypeScript modules\n`);

    console.log('🔍 Fixing require() statements in TypeScript files...\n');

    const results: FixResult[] = [];
    await findAndFixTsFiles(TARGET_ROOT, tsModules, results);

    if (results.length === 0) {
        console.log('✅ NO FIXES NEEDED\n');
        console.log('   All TypeScript files are already using import statements.\n');
        return;
    }

    console.log('═'.repeat(64));
    console.log(`\n✅ FIXED ${results.length} FILES\n`);
    
    const totalFixes = results.reduce((sum, r) => sum + r.fixesApplied, 0);
    console.log(`   Total require() → import conversions: ${totalFixes}\n`);

    // Show first 10 files
    const filesToShow = Math.min(10, results.length);
    console.log(`📋 Files fixed (showing first ${filesToShow}):\n`);
    
    for (let i = 0; i < filesToShow; i++) {
        const result = results[i];
        console.log(`   ${i + 1}. ${result.file} (${result.fixesApplied} fixes)`);
    }
    
    if (results.length > filesToShow) {
        console.log(`   ... and ${results.length - filesToShow} more files\n`);
    }

    console.log('\n' + '═'.repeat(64));
    console.log(`\n✅ SUCCESS: Fixed ${totalFixes} require() statements in ${results.length} files\n`);
};

main().catch((error) => {
    console.error('Error:', error);
    process.exitCode = 1;
});
