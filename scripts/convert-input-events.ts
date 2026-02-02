#!/usr/bin/env bun

import { readFileSync, writeFileSync, unlinkSync, readdirSync } from 'fs';
import { join } from 'path';

const eventFolder = 'src/phaser/src/physics/matter-js/events';

const files = readdirSync(eventFolder).filter(f => f.endsWith('_EVENT.js'));

console.log(`Converting ${files.length} event files from input/events...`);

for (const file of files) {
    const jsPath = join(eventFolder, file);
    const tsPath = join(eventFolder, file.replace('.js', '.ts'));
    
    let content = readFileSync(jsPath, 'utf-8');
    
    // Extract the event name from filename
    const eventName = file.replace('_EVENT.js', '');
    
    // Extract the string value
    const match = content.match(/module\.exports\s*=\s*'([^']+)'/);
    if (match) {
        const value = match[1];
        content = content.replace(
            /module\.exports\s*=\s*'([^']+)';?/,
            `export const ${eventName} = '${value}';`
        );
        
        writeFileSync(tsPath, content);
        console.log(`✅ ${file} -> ${file.replace('.js', '.ts')}`);
    } else {
        console.log(`❌ Failed to parse ${file}`);
    }
}

console.log('Done!');
