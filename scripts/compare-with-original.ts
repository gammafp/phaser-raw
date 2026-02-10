#!/usr/bin/env bun

/**
 * Script de conciliación: compara src/phaser/src (nuestro árbol) con original_src/src_v4 (referencia v4).
 * Detecta si hemos perdido algún archivo (existe en v4 y no lo tenemos) o tenemos de más.
 */

import * as fs from 'fs';
import * as path from 'path';

const REFERENCE_BASE = 'original_src/src_v4';   // referencia v4
const CURRENT_BASE = 'src/phaser/src';           // nuestro árbol a comprobar

interface ComparisonResult {
    missing: string[];           // En v4 pero no en nuestro árbol
    converted: string[];         // En v4 como .js, nosotros tenemos .ts
    extra: string[];             // En nuestro árbol pero no en v4
    missingAndNotConverted: string[]; // En v4, no los tenemos (ni .js ni .ts)
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
    console.log('║   CONCILIACIÓN: src/phaser/src vs original_src/src_v4       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log(`📂 Referencia v4:  ${REFERENCE_BASE}`);
    console.log(`📂 Nuestro árbol:  ${CURRENT_BASE}\n`);

    const referenceFiles = getAllFiles(REFERENCE_BASE);
    const currentFiles = getAllFiles(CURRENT_BASE);

    console.log(`📊 Archivos en referencia (v4): ${referenceFiles.length}`);
    console.log(`📊 Archivos en nuestro árbol:  ${currentFiles.length}\n`);

    const result: ComparisonResult = {
        missing: [],
        converted: [],
        extra: [],
        missingAndNotConverted: []
    };

    const referenceSet = new Set(referenceFiles.map(f => f.replace(/\\/g, '/')));
    const currentSet = new Set(currentFiles.map(f => f.replace(/\\/g, '/')));

    // 1. Archivos que están en v4 pero no los tenemos (perdidos o no convertidos)
    for (const refFile of referenceSet) {
        if (!currentSet.has(refFile)) {
            if (refFile.endsWith('.js')) {
                const tsVersion = refFile.replace(/\.js$/, '.ts');
                if (currentSet.has(tsVersion)) {
                    result.converted.push(refFile);
                } else {
                    result.missing.push(refFile);
                    result.missingAndNotConverted.push(refFile);
                }
            } else {
                result.missing.push(refFile);
                result.missingAndNotConverted.push(refFile);
            }
        }
    }

    // 2. Archivos que tenemos y no están en v4 (extra)
    for (const currentFile of currentSet) {
        if (currentFile.endsWith('.ts')) {
            const jsVersion = currentFile.replace(/\.ts$/, '.js');
            if (!referenceSet.has(jsVersion) && !referenceSet.has(currentFile)) {
                result.extra.push(currentFile);
            }
        } else if (!referenceSet.has(currentFile)) {
            result.extra.push(currentFile);
        }
    }

    return result;
}

function printResults(result: ComparisonResult) {
    console.log('════════════════════════════════════════════════════════════════\n');

    // Tenemos el .ts equivalente al .js de v4
    if (result.converted.length > 0) {
        console.log(`✅ TENEMOS .TS EQUIVALENTE (${result.converted.length} files)`);
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
        console.log(`❌ FALTAN (están en v4, no los tenemos) (${result.missingAndNotConverted.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('⚠️  Existen en original_src/src_v4 pero NO en src/phaser/src:\n');
        
        for (const file of result.missingAndNotConverted.slice(0, 20)) {
            console.log(`  ❌ ${file}`);
        }
        
        if (result.missingAndNotConverted.length > 20) {
            console.log(`  ... and ${result.missingAndNotConverted.length - 20} more files`);
        }
        console.log('');
    }

    // Archivos que tenemos y no están en v4
    if (result.extra.length > 0) {
        console.log(`🆕 EXTRA (tenemos nosotros, no en v4) (${result.extra.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('Están en src/phaser/src pero NO en original_src/src_v4:\n');
        
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
    console.log(`✅ Tenemos .ts equivalente: ${result.converted.length} files`);
    console.log(`❌ Faltan (en v4, no nuestros): ${result.missingAndNotConverted.length} files`);
    console.log(`🆕 Extra (nuestros, no en v4):  ${result.extra.length} files\n`);

    if (result.missingAndNotConverted.length > 0) {
        console.log('⚠️  WARNING: Hay archivos en v4 que no tenemos en src/phaser/src.');
        console.log('   Revisar si faltan por conversión o se eliminaron en v4.\n');
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
