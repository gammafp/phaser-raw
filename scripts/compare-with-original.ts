#!/usr/bin/env bun

/**
 * Script para comparar archivos originales con los convertidos
 * Detecta archivos perdidos, modificados o que no deberían existir
 */

import * as fs from 'fs';
import * as path from 'path';

const ORIGINAL_BASE = 'original_src/src';
const CURRENT_BASE = 'src/phaser/src';

interface ComparisonResult {
    missing: string[];           // Archivos que existen en original pero no en current (.js faltantes)
    converted: string[];         // Archivos .js que se convirtieron a .ts
    extra: string[];             // Archivos en current que no están en original
    missingAndNotConverted: string[]; // Archivos .js faltantes que NO tienen .ts equivalente
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
    const files: string[] = [];
    
    if (!fs.existsSync(dir)) {
        return files;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getAllFiles(fullPath, baseDir));
        } else {
            const relativePath = path.relative(baseDir, fullPath);
            files.push(relativePath);
        }
    }

    return files;
}

function compareDirectories(): ComparisonResult {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║         COMPARISON: ORIGINAL vs CURRENT FILES               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log(`📂 Original: ${ORIGINAL_BASE}`);
    console.log(`📂 Current:  ${CURRENT_BASE}\n`);

    const originalFiles = getAllFiles(ORIGINAL_BASE);
    const currentFiles = getAllFiles(CURRENT_BASE);

    console.log(`📊 Original files: ${originalFiles.length}`);
    console.log(`📊 Current files:  ${currentFiles.length}\n`);

    const result: ComparisonResult = {
        missing: [],
        converted: [],
        extra: [],
        missingAndNotConverted: []
    };

    // Normalizar rutas
    const originalSet = new Set(originalFiles.map(f => f.replace(/\\/g, '/')));
    const currentSet = new Set(currentFiles.map(f => f.replace(/\\/g, '/')));

    // 1. Buscar archivos faltantes
    for (const originalFile of originalSet) {
        if (!currentSet.has(originalFile)) {
            // Verificar si se convirtió a .ts
            if (originalFile.endsWith('.js')) {
                const tsVersion = originalFile.replace(/\.js$/, '.ts');
                
                if (currentSet.has(tsVersion)) {
                    result.converted.push(originalFile);
                } else {
                    result.missing.push(originalFile);
                    result.missingAndNotConverted.push(originalFile);
                }
            } else {
                result.missing.push(originalFile);
            }
        }
    }

    // 2. Buscar archivos extra (que no estaban en original)
    for (const currentFile of currentSet) {
        // Si es .ts, verificar si existe .js en original
        if (currentFile.endsWith('.ts')) {
            const jsVersion = currentFile.replace(/\.ts$/, '.js');
            
            if (!originalSet.has(jsVersion) && !originalSet.has(currentFile)) {
                // Es un archivo .ts nuevo (no conversión de .js existente)
                result.extra.push(currentFile);
            }
        } else if (!originalSet.has(currentFile)) {
            result.extra.push(currentFile);
        }
    }

    return result;
}

function printResults(result: ComparisonResult) {
    console.log('════════════════════════════════════════════════════════════════\n');

    // Archivos convertidos
    if (result.converted.length > 0) {
        console.log(`✅ CONVERTED TO TYPESCRIPT (${result.converted.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        
        // Agrupar por carpeta
        const byFolder: Record<string, string[]> = {};
        for (const file of result.converted) {
            const folder = path.dirname(file);
            if (!byFolder[folder]) byFolder[folder] = [];
            byFolder[folder].push(path.basename(file));
        }

        const folders = Object.keys(byFolder).sort();
        for (const folder of folders.slice(0, 10)) {
            console.log(`  ✓ ${folder}/ (${byFolder[folder].length} files)`);
        }
        
        if (folders.length > 10) {
            console.log(`  ... and ${folders.length - 10} more folders`);
        }
        console.log('');
    }

    // Archivos perdidos (CRÍTICO)
    if (result.missingAndNotConverted.length > 0) {
        console.log(`❌ MISSING FILES - NOT CONVERTED (${result.missingAndNotConverted.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('⚠️  These files exist in original but are missing in current:');
        console.log('⚠️  They were NOT converted to .ts\n');
        
        for (const file of result.missingAndNotConverted.slice(0, 20)) {
            console.log(`  ❌ ${file}`);
        }
        
        if (result.missingAndNotConverted.length > 20) {
            console.log(`  ... and ${result.missingAndNotConverted.length - 20} more files`);
        }
        console.log('');
    }

    // Archivos nuevos
    if (result.extra.length > 0) {
        console.log(`🆕 NEW FILES (${result.extra.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('Files that exist in current but not in original (new creations):\n');
        
        for (const file of result.extra.slice(0, 20)) {
            console.log(`  🆕 ${file}`);
        }
        
        if (result.extra.length > 20) {
            console.log(`  ... and ${result.extra.length - 20} more files`);
        }
        console.log('');
    }

    console.log('════════════════════════════════════════════════════════════════\n');

    // Resumen final
    console.log('📊 SUMMARY');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`✅ Converted to TypeScript: ${result.converted.length} files`);
    console.log(`❌ Missing (not converted):  ${result.missingAndNotConverted.length} files`);
    console.log(`🆕 New files created:        ${result.extra.length} files\n`);

    if (result.missingAndNotConverted.length > 0) {
        console.log('⚠️  WARNING: Some original files are missing!');
        console.log('   These files should be restored from original_src/\n');
    }

    console.log('════════════════════════════════════════════════════════════════\n');
}

// Ejecutar comparación
const result = compareDirectories();
printResults(result);

// Exit code
if (result.missingAndNotConverted.length > 0) {
    process.exit(1); // Hay archivos perdidos
} else {
    process.exit(0); // Todo OK
}
