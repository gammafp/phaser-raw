#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const mathClasses = [
    'Vector2',
    'Vector3',
    'Vector4',
    'Matrix3',
    'Matrix4',
    'Quaternion',
    'Euler',
    'RandomDataGenerator',
    'TransformXY',
    'ToXY',
    'RotateVec3'
];

let fixedCount = 0;

function fixFile(filePath: string): boolean {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    for (const className of mathClasses) {
        // Patrón para Vector2, Matrix4, etc.
        const pattern1 = new RegExp(`^var ${className} = require\\(['"](.*)\\/${className}['"]\\);?$`, 'gm');
        const pattern2 = new RegExp(`^const ${className} = require\\(['"](.*)\\/${className}['"]\\);?$`, 'gm');
        
        if (pattern1.test(content) || pattern2.test(content)) {
            // Resetear lastIndex
            pattern1.lastIndex = 0;
            pattern2.lastIndex = 0;
            
            content = content.replace(pattern1, `import { ${className} } from '$1/${className}';`);
            content = content.replace(pattern2, `import { ${className} } from '$1/${className}';`);
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

console.log('🔧 Fixing math class imports...\n');

const targetDir = join(process.cwd(), 'src', 'phaser', 'src');
scanDirectory(targetDir);

console.log(`\n✅ Fixed ${fixedCount} files`);
