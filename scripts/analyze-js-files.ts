#!/usr/bin/env bun

/**
 * Script para analizar archivos JS y determinar si son convertibles a TS
 * Clasifica cada archivo según su complejidad y tipo
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface FileAnalysis {
    path: string;
    type: 'simple-function' | 'constant' | 'event' | 'class-complex' | 'class-mixin' | 'algorithm-complex' | 'unknown';
    convertible: boolean;
    reason: string;
    lines: number;
}

const BASE_PATH = 'src/phaser/src';

// Detectar tipo de archivo analizando su contenido
function analyzeFile(filePath: string): FileAnalysis {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').length;
    const fileName = filePath.split(/[/\\]/).pop() || '';
    
    // 0. Excluir archivos en carpetas typedefs (solo JSDoc, no se convierten)
    if (filePath.includes('typedefs') || filePath.includes('typedef')) {
        return {
            path: filePath,
            type: 'unknown',
            convertible: false,
            reason: 'Typedef file (JSDoc only, not converted)',
            lines
        };
    }
    
    // 1. Verificar si hay TODO que dice no convertir
    const hasTodoNoConvert = /\/\/\s*TODO:.*(?:depends on|Convert this.*algorithm|complex)/i.test(content);
    
    // 2. Detectar eventos (exporta un string simple)
    if (/module\.exports\s*=\s*['"][^'"]+['"];?\s*$/m.test(content)) {
        return {
            path: filePath,
            type: 'event',
            convertible: true,
            reason: 'String constant event',
            lines
        };
    }
    
    // 3. Detectar clases con new Class (más robusto)
    if (/new\s+Class\s*\(/m.test(content)) {
        // 3a. Detectar mixins o extends
        if (/Mixins\s*:\s*\[/m.test(content) || /Extends\s*:/m.test(content)) {
            return {
                path: filePath,
                type: 'class-mixin',
                convertible: false,
                reason: 'Class with Mixins/Extends',
                lines
            };
        }
        
        // 3b. Clase compleja sin mixins
        return {
            path: filePath,
            type: 'class-complex',
            convertible: false,
            reason: 'new Class() syntax',
            lines
        };
    }
    
    // 4. Detectar constantes (objetos exportados)
    if (/var\s+\w+\s*=\s*\{[\s\S]*?\};?\s*module\.exports\s*=\s*\w+/m.test(content)) {
        // Si tiene funciones dentro, no es constante pura
        if (/function\s*\(/m.test(content) || /=>\s*\{/m.test(content)) {
            return {
                path: filePath,
                type: 'unknown',
                convertible: false,
                reason: 'Object with functions (module pattern)',
                lines
            };
        }
        
        return {
            path: filePath,
            type: 'constant',
            convertible: true,
            reason: 'Constant object',
            lines
        };
    }
    
    // 5. Detectar funciones simples
    if (/var\s+\w+\s*=\s*function\s*\(/m.test(content)) {
        // 5a. Verificar si tiene TODO que dice no convertir
        if (hasTodoNoConvert) {
            return {
                path: filePath,
                type: 'algorithm-complex',
                convertible: false,
                reason: 'Has TODO comment about dependencies/complexity',
                lines
            };
        }
        
        // 5b. Detectar funciones con múltiples funciones internas (patrón de módulo)
        const functionMatches = content.match(/function\s+\w+\s*\(/g);
        if (functionMatches && functionMatches.length > 3) {
            return {
                path: filePath,
                type: 'algorithm-complex',
                convertible: false,
                reason: `Multiple internal functions (${functionMatches.length} functions)`,
                lines
            };
        }
        
        // 5c. Algoritmos complejos por nombre o tamaño
        const isComplexAlgorithm = 
            fileName.includes('Earcut') ||
            fileName.includes('Simplify') ||
            fileName.includes('QuickSelect') ||
            fileName.includes('Triangulate') ||
            fileName.includes('Sort') ||
            fileName.includes('Pool') ||
            lines > 200; // Bajado de 300 a 200
        
        if (isComplexAlgorithm) {
            return {
                path: filePath,
                type: 'algorithm-complex',
                convertible: false,
                reason: `Complex algorithm (${lines} lines or special name)`,
                lines
            };
        }
        
        return {
            path: filePath,
            type: 'simple-function',
            convertible: true,
            reason: 'Simple function',
            lines
        };
    }
    
    // 6. Archivos con múltiples exports (index.js)
    if (/module\.exports\s*=\s*\{[\s\S]*?require\s*\(/m.test(content)) {
        return {
            path: filePath,
            type: 'constant',
            convertible: true,
            reason: 'Index file with requires',
            lines
        };
    }
    
    return {
        path: filePath,
        type: 'unknown',
        convertible: false,
        reason: 'Unknown pattern',
        lines
    };
}

// Escanear recursivamente todos los archivos .js
function scanDirectory(dir: string, results: FileAnalysis[] = []): FileAnalysis[] {
    const files = readdirSync(dir);
    
    for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        
        if (stat.isDirectory()) {
            scanDirectory(filePath, results);
        } else if (file.endsWith('.js')) {
            try {
                const analysis = analyzeFile(filePath);
                results.push(analysis);
            } catch (error) {
                console.error(`Error analyzing ${filePath}:`, error);
            }
        }
    }
    
    return results;
}

// Generar reporte
function generateReport(analyses: FileAnalysis[]) {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║           JS FILES ANALYSIS - CONVERSION REPORT             ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    // Estadísticas globales
    const total = analyses.length;
    const convertible = analyses.filter(a => a.convertible).length;
    const notConvertible = total - convertible;
    
    console.log('📊 GLOBAL STATISTICS');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`Total JS files: ${total}`);
    console.log(`✅ Convertible: ${convertible} (${((convertible/total)*100).toFixed(1)}%)`);
    console.log(`❌ Not convertible: ${notConvertible} (${((notConvertible/total)*100).toFixed(1)}%)\n`);
    
    // Agrupar por tipo
    const byType = new Map<string, FileAnalysis[]>();
    for (const analysis of analyses) {
        if (!byType.has(analysis.type)) {
            byType.set(analysis.type, []);
        }
        byType.get(analysis.type)!.push(analysis);
    }
    
    console.log('📋 CLASSIFICATION BY TYPE');
    console.log('────────────────────────────────────────────────────────────────');
    
    const typeOrder = [
        'event',
        'constant', 
        'simple-function',
        'class-complex',
        'class-mixin',
        'algorithm-complex',
        'unknown'
    ];
    
    const typeLabels: Record<string, string> = {
        'event': '🟢 Events (string constants)',
        'constant': '🟢 Constants (objects)',
        'simple-function': '🟢 Simple Functions',
        'class-complex': '🔴 Complex Classes (new Class)',
        'class-mixin': '🔴 Classes with Mixins/Extends',
        'algorithm-complex': '🔴 Complex Algorithms',
        'unknown': '🟡 Unknown/Typedefs'
    };
    
    for (const type of typeOrder) {
        const files = byType.get(type) || [];
        if (files.length === 0) continue;
        
        const convertibleCount = files.filter(f => f.convertible).length;
        console.log(`\n${typeLabels[type]}: ${files.length} files`);
        console.log(`   Convertible: ${convertibleCount}/${files.length}`);
    }
    
    // Listar archivos convertibles por carpeta
    console.log('\n\n✅ CONVERTIBLE FILES BY FOLDER');
    console.log('────────────────────────────────────────────────────────────────');
    
    const convertibleFiles = analyses.filter(a => a.convertible);
    const byFolder = new Map<string, FileAnalysis[]>();
    
    for (const file of convertibleFiles) {
        const relativePath = relative(BASE_PATH, file.path);
        const folder = relativePath.split(/[/\\]/)[0];
        
        if (!byFolder.has(folder)) {
            byFolder.set(folder, []);
        }
        byFolder.get(folder)!.push(file);
    }
    
    const sortedFolders = Array.from(byFolder.entries())
        .sort((a, b) => b[1].length - a[1].length);
    
    for (const [folder, files] of sortedFolders) {
        console.log(`\n📁 ${folder} (${files.length} files)`);
        
        // Mostrar primeros 5 archivos
        const preview = files.slice(0, 5);
        for (const file of preview) {
            const fileName = file.path.split(/[/\\]/).pop();
            console.log(`   - ${fileName} (${file.type}, ${file.lines} lines)`);
        }
        
        if (files.length > 5) {
            console.log(`   ... and ${files.length - 5} more files`);
        }
    }
    
    // Top 5 carpetas para convertir
    console.log('\n\n🎯 TOP 5 FOLDERS TO CONVERT (most convertible files)');
    console.log('────────────────────────────────────────────────────────────────');
    
    const top5 = sortedFolders.slice(0, 5);
    for (let i = 0; i < top5.length; i++) {
        const [folder, files] = top5[i];
        const types = new Set(files.map(f => f.type));
        console.log(`${i + 1}. ${folder}: ${files.length} files (${Array.from(types).join(', ')})`);
    }
    
    console.log('\n════════════════════════════════════════════════════════════════\n');
}

// Ejecutar análisis
console.log('🔍 Scanning JS files...\n');
const analyses = scanDirectory(BASE_PATH);
generateReport(analyses);
