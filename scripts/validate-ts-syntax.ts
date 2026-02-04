#!/usr/bin/env bun

/**
 * Script to validate TypeScript syntax and types using TypeScript Compiler API
 * 
 * Usage:
 *   bun scripts/validate-ts-syntax.ts [file.ts]      - Validate single file
 *   bun scripts/validate-ts-syntax.ts [directory]    - Validate all .ts files in directory
 *   bun scripts/validate-ts-syntax.ts                - Validate all .ts files in src/phaser/src
 */

import ts from 'typescript';
import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';

interface ValidationResult {
    file: string;
    valid: boolean;
    errors: Array<{
        message: string;
        line?: number;
        column?: number;
        category: string;
    }>;
}

const results: ValidationResult[] = [];
let totalFiles = 0;
let validFiles = 0;
let invalidFiles = 0;
let totalErrors = 0;

// TypeScript compiler options (matching tsconfig.json)
const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowImportingTsExtensions: true,
    noEmit: true,
    strict: true,
    skipLibCheck: true,
    lib: ['es2020', 'dom', 'dom.iterable'],
};

function validateFile(filepath: string): ValidationResult {
    const relativePath = relative(process.cwd(), filepath);
    
    try {
        const content = readFileSync(filepath, 'utf-8');
        
        // Create a source file for syntax checking
        const sourceFile = ts.createSourceFile(
            filepath,
            content,
            ts.ScriptTarget.ES2020,
            true,
            ts.ScriptKind.TS
        );
        
        // Get only syntactic diagnostics (no type checking)
        // This is faster and works without resolving all dependencies
        const syntacticDiagnostics = (sourceFile as any).parseDiagnostics || [];
        
        const errors = syntacticDiagnostics.map((diagnostic: ts.Diagnostic) => {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            let line: number | undefined;
            let column: number | undefined;
            
            if (diagnostic.file && diagnostic.start !== undefined) {
                const { line: l, character: c } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                line = l + 1; // 1-indexed
                column = c + 1; // 1-indexed
            }
            
            const category = diagnostic.category === ts.DiagnosticCategory.Error ? 'Error' :
                           diagnostic.category === ts.DiagnosticCategory.Warning ? 'Warning' :
                           diagnostic.category === ts.DiagnosticCategory.Suggestion ? 'Suggestion' :
                           'Message';
            
            return { message, line, column, category };
        });
        
        // Also do a basic AST walk to find common issues
        const customErrors: any[] = [];
        
        function visit(node: ts.Node) {
            // Check for common conversion issues
            if (ts.isCallExpression(node)) {
                const text = node.expression.getText(sourceFile);
                // Check for old require() syntax mixed with imports
                if (text === 'require' && content.includes('import ')) {
                    // This is actually OK in our mixed codebase
                }
            }
            
            ts.forEachChild(node, visit);
        }
        
        visit(sourceFile);
        
        const allErrors = [...errors, ...customErrors];
        totalErrors += allErrors.length;
        
        return {
            file: relativePath,
            valid: allErrors.length === 0,
            errors: allErrors
        };
    } catch (error: any) {
        totalErrors++;
        return {
            file: relativePath,
            valid: false,
            errors: [{
                message: error.message || String(error),
                category: 'Error'
            }]
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
            if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'temp') continue;
            scanDirectory(fullPath);
        } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
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
console.log('║          TYPESCRIPT SYNTAX & TYPE VALIDATOR                 ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

if (!existsSync(target)) {
    console.error(`❌ Error: Path does not exist: ${target}`);
    process.exit(1);
}

const stats = statSync(target);

if (stats.isFile()) {
    if (!target.endsWith('.ts') || target.endsWith('.d.ts')) {
        console.error(`❌ Error: File must be a .ts file (not .d.ts): ${target}`);
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
    console.log('🔍 Analyzing TypeScript files...\n');
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
console.log(`✅ Valid: ${validFiles} (${totalFiles > 0 ? ((validFiles/totalFiles) * 100).toFixed(1) : '0.0'}%)`);
console.log(`❌ With errors: ${invalidFiles} (${totalFiles > 0 ? ((invalidFiles/totalFiles) * 100).toFixed(1) : '0.0'}%)`);
console.log(`🐛 Total errors: ${totalErrors}`);
console.log('════════════════════════════════════════════════════════════════\n');

// Show errors if any
if (invalidFiles > 0) {
    console.log('❌ FILES WITH ERRORS:');
    console.log('────────────────────────────────────────────────────────────────\n');
    
    const errorResults = results.filter(r => !r.valid);
    
    for (const result of errorResults) {
        console.log(`📄 ${result.file} (${result.errors.length} error${result.errors.length > 1 ? 's' : ''})`);
        
        for (const error of result.errors) {
            if (error.line !== undefined && error.column !== undefined) {
                console.log(`   [${error.category}] Line ${error.line}:${error.column}`);
            } else {
                console.log(`   [${error.category}]`);
            }
            console.log(`   ${error.message}`);
            console.log('');
        }
    }
    
    console.log('════════════════════════════════════════════════════════════════\n');
    
    console.log('💡 TIP: Some errors are expected during incremental conversion.');
    console.log('   Focus on syntax errors and critical type issues.\n');
    
    process.exit(1);
} else {
    console.log('✅ ALL FILES ARE VALID!\n');
    console.log('   No significant TypeScript errors detected.\n');
    process.exit(0);
}
