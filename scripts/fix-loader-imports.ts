#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const loaderModules = [
    'GetURL',
    'XHRSettings',
    'MergeXHRSettings',
    'XHRLoader',
    'FileTypesManager'
];

let fixedCount = 0;

function fixFile(filePath: string): boolean {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    for (const moduleName of loaderModules) {
        // Patrón para require en loader
        const pattern1 = new RegExp(`^var ${moduleName} = require\\(['"]\\.\\.?\\/[^\\/]*${moduleName}['"]\\);?$`, 'gm');
        const pattern2 = new RegExp(`^const ${moduleName} = require\\(['"]\\.\\.?\\/[^\\/]*${moduleName}['"]\\);?$`, 'gm');
        
        if (pattern1.test(content) || pattern2.test(content)) {
            pattern1.lastIndex = 0;
            pattern2.lastIndex = 0;
            
            // Detectar el path relativo correcto
            const match1 = content.match(new RegExp(`require\\(['"](\\.\\.\\/?\\.?\\/)${moduleName}['"]\\)`));
            const match2 = content.match(new RegExp(`require\\(['"](\\.\\/)${moduleName}['"]\\)`));
            
            let relativePath = './';
            if (match1) {
                relativePath = match1[1];
            } else if (match2) {
                relativePath = match2[1];
            }
            
            content = content.replace(pattern1, `import { ${moduleName} } from '${relativePath}${moduleName}';`);
            content = content.replace(pattern2, `import { ${moduleName} } from '${relativePath}${moduleName}';`);
            modified = true;
        }
    }

    if (modified) {
        writeFileSync(filePath, content, 'utf-8');
        return true;
    }

    return false;
}

function scanDirectory(dir: string): void {
    const items = readdirSync(dir);

    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            if (item === 'node_modules' || item === '.git' || item === 'temp') continue;
            scanDirectory(fullPath);
        } else if (item.endsWith('.js') || item.endsWith('.ts')) {
            if (fixFile(fullPath)) {
                fixedCount++;
                console.log(`✓ Fixed: ${fullPath}`);
            }
        }
    }
}

console.log('🔧 Fixing loader module imports...\n');

const targetDir = join(process.cwd(), 'src', 'phaser', 'src');
scanDirectory(targetDir);

console.log(`\n✅ Fixed ${fixedCount} files`);
