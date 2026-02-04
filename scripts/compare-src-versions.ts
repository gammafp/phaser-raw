#!/usr/bin/env bun

/**
 * Script para comparar las carpetas src y src_4.0
 * Detecta archivos añadidos, eliminados y modificados
 * Muestra diferencias de contenido entre versiones
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const SRC_BASE = 'original_src/src';
const SRC_4_BASE = 'original_src/src_4.0';

interface FileInfo {
    path: string;
    hash: string;
    size: number;
}

interface ComparisonResult {
    onlyInSrc: string[];           // Files only in src
    onlyInSrc4: string[];          // Files only in src_4.0
    modified: string[];            // Modified files (different)
    trivialChanges: string[];      // Files with only trivial changes (copyright, etc)
    identical: string[];           // Identical files
}

interface FileDiff {
    file: string;
    linesAdded: number;
    linesRemoved: number;
    linesChanged: number;
    totalLines: number;
}

function calculateHash(filePath: string): string {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
        return '';
    }
}

function getAllFiles(dir: string, baseDir: string = dir): FileInfo[] {
    const files: FileInfo[] = [];
    
    if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        return files;
    }

    try {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            
            try {
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    files.push(...getAllFiles(fullPath, baseDir));
                } else {
                    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
                    const hash = calculateHash(fullPath);
                    
                    files.push({
                        path: relativePath,
                        hash: hash,
                        size: stat.size
                    });
                }
            } catch (error) {
                // Skip files that can't be read
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }

    return files;
}

function compareDirectories(): ComparisonResult {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║           COMPARISON: src vs src_4.0                        ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log(`📂 Base version:    ${SRC_BASE}`);
    console.log(`📂 Version 4.0:     ${SRC_4_BASE}\n`);

    console.log('🔍 Scanning directories...\n');

    const srcFiles = getAllFiles(SRC_BASE);
    const src4Files = getAllFiles(SRC_4_BASE);

    console.log(`📊 Files in ${SRC_BASE}:     ${srcFiles.length}`);
    console.log(`📊 Files in ${SRC_4_BASE}:  ${src4Files.length}\n`);

    const result: ComparisonResult = {
        onlyInSrc: [],
        onlyInSrc4: [],
        modified: [],
        trivialChanges: [],
        identical: []
    };

    // Create maps for fast lookup
    const srcMap = new Map(srcFiles.map(f => [f.path, f]));
    const src4Map = new Map(src4Files.map(f => [f.path, f]));

    console.log('🔍 Analyzing changes (detecting copyright-only changes)...\n');

    // Files only in src
    for (const [filePath, fileInfo] of srcMap) {
        if (!src4Map.has(filePath)) {
            result.onlyInSrc.push(filePath);
        } else {
            const src4File = src4Map.get(filePath)!;
            if (fileInfo.hash !== src4File.hash) {
                // Check if changes are trivial
                if (isTrivialChange(filePath)) {
                    result.trivialChanges.push(filePath);
                } else {
                    result.modified.push(filePath);
                }
            } else {
                result.identical.push(filePath);
            }
        }
    }

    // Files only in src_4.0
    for (const [filePath] of src4Map) {
        if (!srcMap.has(filePath)) {
            result.onlyInSrc4.push(filePath);
        }
    }

    return result;
}

function isTrivialChange(file: string): boolean {
    const srcPath = path.join(SRC_BASE, file);
    const src4Path = path.join(SRC_4_BASE, file);

    try {
        const srcContent = fs.readFileSync(srcPath, 'utf-8').split('\n');
        const src4Content = fs.readFileSync(src4Path, 'utf-8').split('\n');

        if (srcContent.length !== src4Content.length) {
            return false; // Different number of lines = not trivial
        }

        let changedLines = 0;
        let copyrightChanges = 0;

        for (let i = 0; i < srcContent.length; i++) {
            if (srcContent[i] !== src4Content[i]) {
                changedLines++;
                
                // Check if this line is ONLY a copyright year change
                const srcLine = srcContent[i];
                const src4Line = src4Content[i];
                
                const isCopyrightLine = srcLine.includes('@copyright') && src4Line.includes('@copyright');
                const has2025 = srcLine.includes('2025');
                const has2026 = src4Line.includes('2026');
                
                if (isCopyrightLine && has2025 && has2026) {
                    copyrightChanges++;
                } else {
                    // Found a non-copyright change
                    return false;
                }
            }
        }

        // Only trivial if there's exactly 1 line changed and it's copyright
        return changedLines === 1 && copyrightChanges === 1;
    } catch (error) {
        return false;
    }
}

function getFileDiff(file: string): FileDiff | null {
    const srcPath = path.join(SRC_BASE, file);
    const src4Path = path.join(SRC_4_BASE, file);

    try {
        const srcContent = fs.readFileSync(srcPath, 'utf-8').split('\n');
        const src4Content = fs.readFileSync(src4Path, 'utf-8').split('\n');

        let added = 0;
        let removed = 0;
        let changed = 0;

        const maxLines = Math.max(srcContent.length, src4Content.length);

        for (let i = 0; i < maxLines; i++) {
            const srcLine = srcContent[i] || '';
            const src4Line = src4Content[i] || '';

            if (i >= srcContent.length) {
                added++;
            } else if (i >= src4Content.length) {
                removed++;
            } else if (srcLine !== src4Line) {
                changed++;
            }
        }

        return {
            file,
            linesAdded: added,
            linesRemoved: removed,
            linesChanged: changed,
            totalLines: src4Content.length
        };
    } catch (error) {
        return null;
    }
}

function groupByDirectory(files: string[]): Record<string, string[]> {
    const groups: Record<string, string[]> = {};
    
    for (const file of files) {
        const dir = path.dirname(file) || '.';
        if (!groups[dir]) {
            groups[dir] = [];
        }
        groups[dir].push(path.basename(file));
    }
    
    return groups;
}

function printResults(result: ComparisonResult) {
    console.log('════════════════════════════════════════════════════════════════\n');

    // Files only in src
    if (result.onlyInSrc.length > 0) {
        console.log(`❌ ONLY IN ${SRC_BASE} (${result.onlyInSrc.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('These files exist in src but NOT in src_4.0:\n');
        
        const grouped = groupByDirectory(result.onlyInSrc);
        const dirs = Object.keys(grouped).sort();
        
        for (const dir of dirs.slice(0, 15)) {
            console.log(`  📁 ${dir}/ (${grouped[dir].length} files)`);
            for (const file of grouped[dir].slice(0, 5)) {
                console.log(`     - ${file}`);
            }
            if (grouped[dir].length > 5) {
                console.log(`     ... and ${grouped[dir].length - 5} more`);
            }
        }
        
        if (dirs.length > 15) {
            console.log(`  ... and ${dirs.length - 15} more folders`);
        }
        console.log('');
    }

    // Files only in src_4.0
    if (result.onlyInSrc4.length > 0) {
        console.log(`🆕 ONLY IN ${SRC_4_BASE} (${result.onlyInSrc4.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('These files are NEW in src_4.0:\n');
        
        const grouped = groupByDirectory(result.onlyInSrc4);
        const dirs = Object.keys(grouped).sort();
        
        for (const dir of dirs.slice(0, 15)) {
            console.log(`  📁 ${dir}/ (${grouped[dir].length} files)`);
            for (const file of grouped[dir].slice(0, 5)) {
                console.log(`     + ${file}`);
            }
            if (grouped[dir].length > 5) {
                console.log(`     ... and ${grouped[dir].length - 5} more`);
            }
        }
        
        if (dirs.length > 15) {
            console.log(`  ... and ${dirs.length - 15} more folders`);
        }
        console.log('');
    }

    // Trivial changes
    if (result.trivialChanges.length > 0) {
        console.log(`📝 COPYRIGHT ONLY CHANGES (${result.trivialChanges.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('These files ONLY have copyright year changes (2025 → 2026):\n');
        
        const grouped = groupByDirectory(result.trivialChanges);
        const dirs = Object.keys(grouped).sort();
        const dirsToShow = Math.min(5, dirs.length);
        
        for (const dir of dirs.slice(0, dirsToShow)) {
            console.log(`  📁 ${dir}/ (${grouped[dir].length} files)`);
        }
        
        if (dirs.length > dirsToShow) {
            console.log(`  ... and ${dirs.length - dirsToShow} more folders`);
        }
        console.log('');
    }

    // Modified files
    if (result.modified.length > 0) {
        console.log(`⚠️  SIGNIFICANTLY MODIFIED FILES (${result.modified.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('These files have real code changes that need review:\n');
        
        // Analyze some diffs
        const diffsToShow = Math.min(10, result.modified.length);
        console.log(`Showing diff analysis for the first ${diffsToShow} files:\n`);
        
        for (let i = 0; i < diffsToShow; i++) {
            const file = result.modified[i];
            const diff = getFileDiff(file);
            
            if (diff) {
                console.log(`  📝 ${file}`);
                console.log(`     Lines: ${diff.totalLines} | ` +
                           `Changed: ${diff.linesChanged} | ` +
                           `Added: ${diff.linesAdded} | ` +
                           `Removed: ${diff.linesRemoved}`);
            } else {
                console.log(`  📝 ${file} (could not analyze)`);
            }
        }
        
        if (result.modified.length > diffsToShow) {
            console.log(`\n  ... and ${result.modified.length - diffsToShow} more modified files`);
        }
        console.log('');
    }

    // Identical files
    if (result.identical.length > 0) {
        console.log(`✅ IDENTICAL FILES (${result.identical.length} files)`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('These files are exactly the same in both versions\n');
    }

    console.log('════════════════════════════════════════════════════════════════\n');

    // Final summary
    console.log('📊 SUMMARY');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`❌ Only in ${SRC_BASE}:        ${result.onlyInSrc.length} files`);
    console.log(`🆕 Only in ${SRC_4_BASE}:     ${result.onlyInSrc4.length} files`);
    console.log(`⚠️  Significantly modified:    ${result.modified.length} files`);
    console.log(`📝 Copyright only changes:     ${result.trivialChanges.length} files`);
    console.log(`✅ Identical files:            ${result.identical.length} files\n`);

    const totalFiles = result.onlyInSrc.length + result.onlyInSrc4.length + 
                      result.modified.length + result.trivialChanges.length + result.identical.length;
    console.log(`📦 Total unique files:        ${totalFiles}\n`);
    
    // Show percentage
    const totalChanged = result.modified.length + result.trivialChanges.length;
    if (totalChanged > 0) {
        const copyrightPercent = ((result.trivialChanges.length / totalChanged) * 100).toFixed(1);
        console.log(`💡 ${copyrightPercent}% of changed files have ONLY copyright year changes\n`);
    }

    // Change analysis
    if (result.onlyInSrc4.length > 0 || result.modified.length > 0) {
        console.log('💡 RECOMMENDATIONS:');
        console.log('────────────────────────────────────────────────────────────────');
        
        if (result.onlyInSrc4.length > 0) {
            console.log(`✓ There are ${result.onlyInSrc4.length} new files in src_4.0 you may want to integrate`);
        }
        
        if (result.modified.length > 0) {
            console.log(`✓ There are ${result.modified.length} files with significant changes (require manual review)`);
        }
        
        if (result.trivialChanges.length > 0) {
            console.log(`✓ There are ${result.trivialChanges.length} files with ONLY copyright changes (can skip)`);
        }
        
        if (result.onlyInSrc.length > 0) {
            console.log(`⚠ There are ${result.onlyInSrc.length} files in src that are NOT in src_4.0`);
            console.log(`  (they may be customizations or obsolete files)`);
        }
        console.log('');
    }

    console.log('════════════════════════════════════════════════════════════════\n');
}

// Verify that both folders exist
if (!fs.existsSync(SRC_BASE)) {
    console.error(`❌ Error: Directory ${SRC_BASE} does not exist`);
    process.exit(1);
}

if (!fs.existsSync(SRC_4_BASE)) {
    console.error(`❌ Error: Directory ${SRC_4_BASE} does not exist`);
    console.log(`\n💡 Make sure the src_4.0 folder is in original_src/\n`);
    process.exit(1);
}

// Run comparison
const result = compareDirectories();
printResults(result);

// Exit code
if (result.onlyInSrc4.length > 0 || result.modified.length > 0) {
    console.log('ℹ️  There are differences between versions');
    process.exit(0);
} else {
    console.log('✅ Versions are identical');
    process.exit(0);
}
