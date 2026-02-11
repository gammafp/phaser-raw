/**
 * Namespace Review Tracker
 * 
 * Tracks the review status of each Phaser namespace when comparing
 * src_converted (old) with src/phaser/src (Phaser 3.90.0)
 * 
 * Usage:
 *   bun run scripts/namespace-review-tracker.ts
 *   bun run scripts/namespace-review-tracker.ts --update <namespace> <status>
 *   bun run scripts/namespace-review-tracker.ts --stats
 */

export enum ReviewStatus {
    /** Not yet reviewed */
    PENDING = 'pending',
    /** Reviewed and up to date - no significant changes */
    UP_TO_DATE = 'up-to-date',
        /** Reviewed but has minor changes/fixes that need to be patched */
        NEEDS_PATCH = 'needs-patch',
    /** Reviewed but has major architectural changes - needs reconversion */
    DEPRECATED = 'deprecated',
    /** Currently being reviewed */
    IN_PROGRESS = 'in-progress'
}

export interface NamespaceInfo {
    name: string;
    status: ReviewStatus;
    notes?: string;
    filesChanged?: number;
    percentChanged?: number;
    lastReviewed?: string;
}

/**
 * Namespace review database
 * Update this as you review each namespace
 */
export const namespaceDB: NamespaceInfo[] = [
    {
        name: 'actions',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Logic verified vs original_src/src_v4 for all modified files. AddEffectBloom, AddMaskShape, FitToRegion converted to TS in v4_converted_staging. Typedefs AddEffectBloomConfig/Return, AddMaskShapeConfig, FitToRegionItemCoverage added. index.js maintained manually.',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'animations',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Only trivial changes (copyright year, import vs require)',
        filesChanged: 1,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'cache',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'No significant changes',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'cameras',
        status: ReviewStatus.DEPRECATED,
        notes: 'Major changes: New filter system (internal/external), removed PostPipeline mixin, simplified effect rendering, references to Phaser 4.0.0. Files: BaseCamera (96% changed), Camera (92%), RotateTo (79%), Fade/Flash (15% each)',
        filesChanged: 6,
        percentChanged: 60,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'core',
        status: ReviewStatus.DEPRECATED,
        notes: 'Major architectural changes: Removed Facebook Instant Games support completely, eliminated pipeline config (defaultPipeline, autoMobilePipeline), unified imports to require. Files: Config (97% changed, -11 lines), Game (94% changed, +21 lines), DebugHeader (16% changed)',
        filesChanged: 4,
        percentChanged: 70,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'create',
        status: ReviewStatus.DEPRECATED,
        notes: 'REMOVED in 4.0 - Namespace existed in 3.90 (GenerateTexture + 5 palettes: Arne16, C64, CGA, JMP, MSX) but was completely removed in 4.0. Do not convert. Delete from TS conversion if present.',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'curves',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Only trivial changes (copyright year)',
        filesChanged: 1,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'data',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'No significant changes',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'device',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Patch applied: Video.ts now includes mov/QuickTime detection (canPlayType video/quicktime4).',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'display',
        status: ReviewStatus.DEPRECATED,
        notes: 'Major changes: BaseShader API replaced (fragment/vertex/uniforms -> glsl+metadata), GeometryMask WebGL features removed, ColorMatrix expanded. Multiple files significantly changed.',
        filesChanged: 7,
        percentChanged: 50,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'dom',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'No significant changes (TS/JS parity)',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'events',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'No significant changes',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'filters',
        status: ReviewStatus.DEPRECATED,
        notes: 'New namespace in 4.0.0, replacing the old "fx" namespace from 3.90. Contains 23 filter effects (Blur, Glow, Shadow, Barrel, Bokeh, etc.) managed via Camera.filters.internal/external FilterList. Full conversion to TS required.',
        filesChanged: 23,
        percentChanged: 100,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'fx',
        status: ReviewStatus.DEPRECATED,
        notes: 'fx namespace completely removed in 4.0. Replaced by filters (new namespace). All 17 FX files must be deleted from TS conversion.',
        filesChanged: 17,
        percentChanged: 100,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'gameobjects',
        status: ReviewStatus.DEPRECATED,
        notes: 'Massive changes: many new and removed files, 100+ significant modifications. Requires full reconversion.',
        filesChanged: 105,
        percentChanged: 80,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'geom',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'DONE',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'input',
        status: ReviewStatus.NEEDS_PATCH,
        notes: 'TS conversion is faithful to original; upstream has moderate changes (31% InputPlugin, 99% syntax-only KeyboardManager). Need to integrate: InputPlugin improvements, KeyboardManager modernization.',
        filesChanged: 7,
        percentChanged: 35,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'loader',
        status: ReviewStatus.DEPRECATED,
        notes: 'Major changes: LoaderPlugin 99% rewritten (1283 lines changed, CustomSet removed), OBJFile support removed in 4.0, GLSLFile API changed (shaderType param removed), CompressedTextureFile updated with better validation.',
        filesChanged: 7,
        percentChanged: 99,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'math',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Added GetCentroid.ts and GetVec2Bounds.ts, exported in index. SinCosTableGenerator kept as-is.',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'physics',
        status: ReviewStatus.DEPRECATED,
        notes: 'Arcade & Matter physics heavily modified: World 96% rewritten (2430 lines), Matter Body 82%, MatterImage/Sprite 87%. PhysicsGroup 64%, significant internal changes. Full reconversion recommended.',
        filesChanged: 13,
        percentChanged: 70,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'plugins',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'No significant changes between 3.90 and 4.0; only trivial updates (copyright, comments)',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'polyfills',
        status: ReviewStatus.NEEDS_PATCH,
        notes: 'Remove 9 obsolete polyfills (Array.forEach, Array.isArray, AudioContextMonkeyPatch, Math.trunc, Uint32Array, console, performance.now, requestAnimationFrame) no longer needed in 4.0',
        filesChanged: 9,
        percentChanged: 90,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'renderer',
        status: ReviewStatus.DEPRECATED,
        notes: 'Complete renderer rewrite for 4.0: 186 files removed (old renderNodes system), 100 new files (new pipeline/FX architecture). WebGLRenderer 76% rewritten, shaders 75-96% changed. Full reconversion required.',
        filesChanged: 209,
        percentChanged: 85,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'scale',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Minimal changes between 3.90 and 4.0; only 0% modifications (7 lines cosmétic) in ScaleManager. No structural changes.',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'scene',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Removed PLUGIN_FBINSTANT/facebook, impactPhysics, PLUGIN_CAMERA3D from InjectionMap/Systems/Scene. Copyright 2026.',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'sound',
        status: ReviewStatus.NEEDS_PATCH,
        notes: 'TS conversion faithful to 3.90. WebAudioSoundManager has 24% changes (improvements in audio handling). Minor updates (0-1%) to BaseSound, BaseSoundManager, NoAudioSound, NoAudioSoundManager.',
        filesChanged: 5,
        percentChanged: 10,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'structs',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Set removed (not in reference). ProcessQueue comment typo fixed, copyright 2026 in index/List/ProcessQueue.',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'textures',
        status: ReviewStatus.DEPRECATED,
        notes: 'Major texture system rewrite for 4.0: TextureManager 96% rewritten, Texture 77%, DynamicTexture 76%, TextureSource 79%). Removed DynamicTextureCommands and const-wrap. Full reconversion required.',
        filesChanged: 7,
        percentChanged: 80,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'tilemaps',
        status: ReviewStatus.DEPRECATED,
        notes: 'Complete tilemap rewrite for 4.0: Tile 98% rewritten, Tilemap 92%, TilemapLayerWebGLRenderer 92%. Removed TilemapGPULayer system. GetWorldToTile functions 84-85% changed. Full reconversion required.',
        filesChanged: 19,
        percentChanged: 80,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'time',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Timeline logic matches v4. COMPLETE_EVENT doc text aligned with reference.',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'tweens',
        status: ReviewStatus.DEPRECATED,
        notes: 'TweenManager 93% rewritten (1073 lines changed); TweenBuilder 21% changes. Tween/TweenData unchanged. Significant internal implementation changes require care during reconversion.',
        filesChanged: 5,
        percentChanged: 60,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'types',
        status: ReviewStatus.NEEDS_PATCH,
        notes: 'Remove 3 obsolete type definitions (CallCallback, GridAlignConfig, index in actions/) that were removed in 4.0. Rest of types remain unchanged.',
        filesChanged: 3,
        percentChanged: 5,
        lastReviewed: '2026-02-10'
    },
    {
        name: 'utils',
        status: ReviewStatus.UP_TO_DATE,
        notes: 'Patches applied: GetFirst aligned with v4, MatrixToString unchanged (same logic), string folder replaceable. Exports in index.ts updated to match 4.0 when needed.',
        filesChanged: 0,
        percentChanged: 0,
        lastReviewed: '2026-02-10'
    }
];

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    gray: '\x1b[90m'
};

function getStatusColor(status: ReviewStatus): string {
    switch (status) {
        case ReviewStatus.UP_TO_DATE:
            return colors.green;
        case ReviewStatus.NEEDS_PATCH:
            return colors.yellow;
        case ReviewStatus.DEPRECATED:
            return colors.red;
        case ReviewStatus.IN_PROGRESS:
            return colors.blue;
        case ReviewStatus.PENDING:
        default:
            return colors.gray;
    }
}

function getStatusIcon(status: ReviewStatus): string {
    switch (status) {
        case ReviewStatus.UP_TO_DATE:
            return '✅';
        case ReviewStatus.NEEDS_PATCH:
            return '⚠️';
        case ReviewStatus.DEPRECATED:
            return '🔴';
        case ReviewStatus.IN_PROGRESS:
            return '🔄';
        case ReviewStatus.PENDING:
        default:
            return '⏳';
    }
}

function printStats() {
    const stats = {
        total: namespaceDB.length,
        upToDate: namespaceDB.filter(n => n.status === ReviewStatus.UP_TO_DATE).length,
            needsPatch: namespaceDB.filter(n => n.status === ReviewStatus.NEEDS_PATCH).length,
        deprecated: namespaceDB.filter(n => n.status === ReviewStatus.DEPRECATED).length,
        inProgress: namespaceDB.filter(n => n.status === ReviewStatus.IN_PROGRESS).length,
        pending: namespaceDB.filter(n => n.status === ReviewStatus.PENDING).length
    };

    const reviewedCount = stats.upToDate + stats.needsPatch + stats.deprecated;
    const percentage = Math.round((reviewedCount / stats.total) * 100);

    console.log(`\n${colors.bright}📊 Namespace Review Progress${colors.reset}\n`);
    console.log(`Total namespaces: ${stats.total}`);
    console.log(`${colors.green}✅ Up to date: ${stats.upToDate}${colors.reset}`);
        console.log(`${colors.yellow}⚠️  Needs patch: ${stats.needsPatch}${colors.reset}`);
    console.log(`${colors.red}🔴 Needs reconversion: ${stats.deprecated}${colors.reset}`);
    console.log(`${colors.blue}🔄 In progress: ${stats.inProgress}${colors.reset}`);
    console.log(`${colors.gray}⏳ Pending review: ${stats.pending}${colors.reset}`);
    console.log(`\n${colors.bright}Progress: ${percentage}% (${reviewedCount}/${stats.total})${colors.reset}`);
    
    // Progress bar
    const barLength = 40;
    const filled = Math.round((reviewedCount / stats.total) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
    console.log(`[${colors.green}${bar}${colors.reset}] ${percentage}%\n`);
}

function printList(filter?: ReviewStatus) {
    console.log(`\n${colors.bright}📋 Namespace Review Status${colors.reset}\n`);
    
    const filtered = filter 
        ? namespaceDB.filter(n => n.status === filter)
        : namespaceDB;

    if (filtered.length === 0) {
        console.log(`No namespaces with status: ${filter}`);
        return;
    }

    for (const ns of filtered) {
        const color = getStatusColor(ns.status);
        const icon = getStatusIcon(ns.status);
        const name = ns.name.padEnd(15);
        const status = ns.status.padEnd(15);
        
        let output = `${icon} ${color}${name}${colors.reset} ${status}`;
        
        if (ns.notes) {
            output += ` ${colors.gray}// ${ns.notes}${colors.reset}`;
        }
        
        console.log(output);
    }
    console.log('');
}

function updateNamespace(name: string, status: ReviewStatus, notes?: string) {
    const ns = namespaceDB.find(n => n.name === name);
    if (!ns) {
        console.error(`${colors.red}Error: Namespace "${name}" not found${colors.reset}`);
        return;
    }

    ns.status = status;
    if (notes) {
        ns.notes = notes;
    }
    ns.lastReviewed = new Date().toISOString().split('T')[0];

    console.log(`${colors.green}✓ Updated ${name} to ${status}${colors.reset}`);
    console.log(`${colors.gray}Note: Remember to update the database in namespace-review-tracker.ts${colors.reset}`);
}

function exportMarkdown(): string {
    const upToDate = namespaceDB.filter(n => n.status === ReviewStatus.UP_TO_DATE);
    const needsPatch = namespaceDB.filter(n => n.status === ReviewStatus.NEEDS_PATCH);
    const deprecated = namespaceDB.filter(n => n.status === ReviewStatus.DEPRECATED);
    const pending = namespaceDB.filter(n => n.status === ReviewStatus.PENDING);
    
    const reviewed = upToDate.length + needsPatch.length + deprecated.length;
    const total = namespaceDB.length;
    const percentage = Math.round((reviewed / total) * 100);

    let md = `### Review Status\n`;
    md += `![${percentage}%](https://progress-bar.xyz/${percentage})\n\n`;

    if (upToDate.length > 0) {
        md += `### Reviewed & Updated Namespaces\n\n`;
        for (const ns of upToDate) {
            md += `- [x] **${ns.name}** - ✅ ${ns.notes || 'Reviewed and updated to latest version'}\n`;
        }
        md += `\n`;
    }

    if (needsPatch.length > 0) {
        md += `### ⚠️ Needs Minor Updates/Patches\n\n`;
        md += `These namespaces have minor fixes or improvements that need to be patched into the TypeScript version:\n\n`;
        for (const ns of needsPatch) {
            md += `- [ ] **${ns.name}** - ⚠️ ${ns.notes || 'Minor changes detected'}\n`;
        }
        md += `\n`;
    }

    if (deprecated.length > 0) {
        md += `### ⚠️ Needs Reconversion (Deprecated - Major Changes)\n\n`;
        md += `These namespaces have significant architectural changes in Phaser 3.90.0 and need to be converted from the original source:\n\n`;
        for (const ns of deprecated) {
            md += `- [ ] **${ns.name}** - 🔴 ${ns.notes || 'Major changes detected'}\n`;
        }
        md += `\n`;
    }

    if (pending.length > 0) {
        md += `### Pending Review\n`;
        for (const ns of pending) {
            md += `- [ ] **${ns.name}**\n`;
        }
    }

    return md;
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case '--stats':
    case '-s':
        printStats();
        break;
    
    case '--list':
    case '-l':
        const filter = args[1] as ReviewStatus | undefined;
        printList(filter);
        break;
    
    case '--update':
    case '-u':
        const [, name, status, ...notesParts] = args;
        if (!name || !status) {
            console.error('Usage: --update <namespace> <status> [notes]');
            process.exit(1);
        }
        updateNamespace(name, status as ReviewStatus, notesParts.join(' '));
        break;
    
    case '--markdown':
    case '-md':
        console.log(exportMarkdown());
        break;
    
    case '--help':
    case '-h':
        console.log(`
${colors.bright}Namespace Review Tracker${colors.reset}

${colors.bright}Usage:${colors.reset}
  bun run scripts/namespace-review-tracker.ts [command]

${colors.bright}Commands:${colors.reset}
  (no args)           Show all namespaces with their status
  --stats, -s         Show statistics summary
  --list [status]     List namespaces (optionally filter by status)
  --update, -u        Update namespace status (not persistent - edit file)
  --markdown, -md     Export as markdown for README
  --help, -h          Show this help

${colors.bright}Status values:${colors.reset}
  pending             Not yet reviewed
  up-to-date          Reviewed and current
  deprecated          Needs reconversion due to major changes
  in-progress         Currently being reviewed

${colors.bright}Examples:${colors.reset}
  bun run scripts/namespace-review-tracker.ts --stats
  bun run scripts/namespace-review-tracker.ts --list pending
  bun run scripts/namespace-review-tracker.ts --markdown
        `);
        break;
    
    default:
        printList();
        console.log(`\n${colors.gray}Run with --help for more options${colors.reset}\n`);
        break;
}
