# Phaser's TS Modules — Phaser 4.0.0 (versión final)

Este proyecto convierte el código fuente de **Phaser 4** a TypeScript para integrarlo mejor en proyectos TS y mejorar el flujo de trabajo. **La base de código es ya Phaser 4.0.0: esta es la versión final del framework con mucho gusto.**

**Phaser es una biblioteca creada por Richard Davey y Phaser Studio Team.**
**Web oficial:** [phaser.io](https://phaser.io/) · **Repositorio oficial:** [github.com/photonstorm/phaser](https://github.com/photonstorm/phaser)

![screenshot](./screenshot.png)

## How to Run the Project

1. Clone the repository
2. Run `npm install` or `bun install`
3. Run `npm run dev` or `bun run dev`

## Phaser's Folder

The Phaser source code is located inside the `src/phaser` folder.

---

## � Version Update Review Progress

Tracking the review and update of namespaces comparing `src_converted` (previous version) with `src/phaser/src` (latest Phaser 4.0.0).

### Review Status
![100%](https://progress-bar.xyz/100)

**All 33 namespaces have been reviewed and categorized.** Command reference:
- `bun run review` - Show all namespaces and their status
- `bun run review:stats` - Show review statistics  
- `bun run diff:folder <namespace>` - Compare a specific namespace

### Reviewed & Updated Namespaces

- [x] **actions** - ✅ Reviewed and updated to latest version
- [x] **animations** - ✅ Reviewed and updated to latest version
- [x] **cache** - ✅ Reviewed and updated to latest version
- [x] **curves** - ✅ Reviewed and updated to latest version
- [x] **data** - ✅ Reviewed and updated to latest version
- [x] **dom** - ✅ Reviewed and updated to latest version
- [x] **events** - ✅ Reviewed and updated to latest version
- [x] **plugins** - ✅ No significant changes; only trivial updates
- [x] **scale** - ✅ Minimal changes (only 0% modifications); no structural changes

### ⚠️ Needs Minor Updates/Patches (12 namespaces)

These namespaces have minor fixes or improvements that need to be patched into the TypeScript version:

- [ ] **device** - ⚠️ Minor update: Added support for mov/QuickTime video format. Need to patch Video.ts to include mov detection
- [ ] **geom** - ⚠️ Remove mesh/ and point/ directories (no longer in 4.0), integrate changes to circle/ellipse/line/etc (minor algorithm updates)
- [ ] **input** - ⚠️ TS conversion is faithful to original; upstream has moderate changes. Need to integrate InputPlugin improvements and KeyboardManager modernization
- [ ] **math** - ⚠️ Needs update to match latest: add GetCentroid/GetVec2Bounds and reconcile SinCosTableGenerator + modified helpers
- [ ] **polyfills** - ⚠️ Remove 9 obsolete polyfills (Array.forEach, Array.isArray, AudioContextMonkeyPatch, Math.trunc, Uint32Array, console, performance.now, requestAnimationFrame) no longer needed in 4.0
- [ ] **scene** - ⚠️ Remove PLUGIN_FBINSTANT conditional checks and impactPhysics from InjectionMap (removed in 4.0). Minor updates to index.js exports
- [ ] **sound** - ⚠️ WebAudioSoundManager improvements (24% changes); minor updates (0-1%) to other sound classes
- [ ] **structs** - ⚠️ Add Set.ts to exports in index.ts (new in 4.0). Minor updates to List and ProcessQueue
- [ ] **time** - ⚠️ Timeline improvements (54% method optimizations); minor updates to COMPLETE_EVENT
- [ ] **types** - ⚠️ Remove 3 obsolete type definitions (CallCallback, GridAlignConfig, index in actions/) removed in 4.0
- [ ] **utils** - ⚠️ Utils refactoring: NOOP/NULL reorganized, string helpers restructured. Update GetFirst (55%) and index.ts exports
- [ ] **create** - ⚠️ Add GenerateTexture and 6 palette definitions (Arne16, C64, CGA, JMP, MSX) new in 4.0

### ⚠️ Needs Reconversion (12 namespaces - Major Architectural Changes)

These namespaces have significant architectural changes in Phaser 4.0 and need to be fully reconverted from the original source:

- [ ] **cameras** - 🔴 Major changes: New filter system (internal/external), removed PostPipeline mixin, simplified effect rendering, references to Phaser 4.0.0
- [ ] **core** - 🔴 Major architectural changes: Removed Facebook Instant Games support, eliminated pipeline config (defaultPipeline, autoMobilePipeline), unified imports to require
- [ ] **display** - 🔴 Major changes: BaseShader API replaced (fragment/vertex/uniforms -> glsl+metadata), GeometryMask WebGL features removed, ColorMatrix expanded
- [ ] **filters** - 🔴 New namespace in 3.90.0. Not present in original_src/src; needs full conversion to TS
- [ ] **fx** - 🔴 Completely removed in 4.0. Replaced by filters namespace. All 17 FX files must be deleted
- [ ] **gameobjects** - 🔴 Massive changes: new/removed files and 100+ significant modifications. Requires full reconversion
- [ ] **loader** - 🔴 Major changes: LoaderPlugin heavily modified, new OBJFile type added, GLSLFile and CompressedTextureFile updated
- [ ] **physics** - 🔴 Arcade & Matter physics heavily modified: World 96% rewritten, Matter Body 82%, MatterImage/Sprite 87%. Significant internal changes
- [ ] **renderer** - 🔴 Complete rewrite for 4.0: 186 files removed (old renderNodes), 100 new files (new pipeline/FX architecture). WebGLRenderer 76% rewritten, shaders 75-96% changed
- [ ] **textures** - 🔴 Major texture system rewrite: TextureManager 96% rewritten, Texture/DynamicTexture/TextureSource 76-79% changed. Removed DynamicTextureCommands and const-wrap
- [ ] **tilemaps** - 🔴 Complete tilemap rewrite: Tile 98%, Tilemap 92%, TilemapLayerWebGLRenderer 92% rewritten. Removed TilemapGPULayer system
- [ ] **tweens** - 🔴 TweenManager 93% rewritten; TweenBuilder 21% changes. Significant internal implementation changes require careful reconversion

---

## �📊 TypeScript Conversion Progress

### Global Summary
![21%](https://progress-bar.xyz/21)

*Última actualización según `bun run stats`.*

- **Total files** (excl. typedefs, matter-js): **1,658**
- **TypeScript (.ts)**: **346**
- **JavaScript (.js)**: **1,312**
- **Progreso**: **20,87 %**
- **Pendientes**: 1,312 archivos

### ✅ Fully Converted (100 %)

- [x] **geom** (201 files) – Geometría (Circle, Rectangle, Line, Polygon, etc.)
- [x] **math** (143 files) – Utilidades matemáticas y funciones

### 🔄 In Progress

- [ ] **utils** (1,30 %) – 1/77 archivos

### ⏳ Not Started (0 %)

- [ ] actions (57), animations (17), cache (6), cameras (34), core (24), curves (9), data (9), device (9), display (77), dom (10), events (2), filters (23), gameobjects (284), input (97), loader (55), physics (55), plugins (6), polyfills (1), renderer (179), scale (14), scene (33), sound (35), structs (9), textures (30), tilemaps (116), time (6), tweens (34)

---

## 🎯 Recent Highlights

### Latest Session

#### FX System ✨
- ✅ **fx** - Complete folder (17 files, 100%)
  - Controller.ts (base class)
  - 14 FX controllers: Barrel, Bloom, Blur, Bokeh, Circle, ColorMatrix, Displacement, Glow, Gradient, Pixelate, Shadow, Shine, Vignette, Wipe
  - const.ts, index.ts

#### Core System ✨
- ✅ **core** - Complete folder (24 files, 100%)
  - Config.ts (662 lines - game configuration)
  - TimeStep.ts (888 lines - game loop)
  - Game.ts, CreateRenderer.ts, DebugHeader.ts
  - All core events

#### Tweens System ✨
- ✅ **tweens** - Complete folder (34 files, 100%)
  - BaseTween.ts, Tween.ts, TweenChain.ts
  - BaseTweenData.ts, TweenData.ts, TweenFrameData.ts
  - TweenManager.ts
  - All builders (12 files)
  - All events (10 files)
  - const.ts, Defaults.ts, ReservedProps.ts

#### Other Conversions
- ✅ **input/gamepad** - Axis.ts, Button.ts
- ✅ **plugins** - BasePlugin.ts
- ✅ **gameobjects/particles/zones** - DeathZone.ts, EdgeZone.ts, RandomZone.ts
- ✅ **gameobjects/text** - GetTextSize.ts, MeasureText.ts

---

## 🛠️ Conversion Tools

### Scripts Created

1. **analyze-class-usage.ts** - Find all files still using Class.js system
2. **check-folder-mixins.ts** - Verify if a folder has Mixins before converting
3. **compare-with-original.ts** - Check for missing files vs original source
4. **convert-class-syntax.ts** - Convert `new Class()` to ES6 with automatic backups in `temp/`
5. **find-todos.ts** - Find all TODO comments in the project ✨
6. **ts-js-stats.ts** - Generate conversion statistics
7. **validate-imports-smart.ts** - Validate import compatibility
8. **validate-js-syntax.ts** - Validate JS syntax with Acorn parser
9. **validate-ts-syntax.ts** - Validate TypeScript syntax

### Conversion Workflow

1. **Check for Mixins**: `bun scripts/check-folder-mixins.ts src/phaser/src/folder`
2. **Convert to ES6**: `bun scripts/convert-class-syntax.ts src/phaser/src/folder` (creates backups)
3. **Validate Syntax**: `bun scripts/validate-js-syntax.ts src/phaser/src/folder`
4. **Convert to TS**: Manual conversion with type annotations
5. **Validate Imports**: `bun scripts/validate-imports-smart.ts`
6. **Check Stats**: `bun scripts/ts-js-stats.ts`

---

## 📝 Conversion Guidelines

### What We Convert

✅ **Pure Functions** - Always convert
```typescript
export const Area = (circle: { radius: number }): number => {
    return Math.PI * circle.radius * circle.radius;
};
```

✅ **Constants** - Always convert
```typescript
export const MATH_CONST = {
    PI2: Math.PI * 2,
    TAU: Math.PI * 0.5
};
```

✅ **Simple Classes** - Convert with care
```typescript
export class TweenManager {
    // Modern ES6+ class with TypeScript types
}
```

### What We Mark with TODO

❌ **Classes with Mixins** - Complex, leave for later
```javascript
// TODO: Convert this to TypeScript class
var Sprite = new Class({
    Extends: GameObject,
    Mixins: [ Components.Alpha, Components.Transform ]
});
```

❌ **Complex Algorithms** - Require careful review
```javascript
// TODO: Convert this complex algorithm to TypeScript
// Earcut triangulation, QuickSelect sorting, etc.
```

---

## 🎯 Key Achievements

- **Base Phaser 4.0.0** — Versión final del framework
- **20,87 %** del código convertido a TypeScript (346 archivos .ts)
- **geom** y **math** al 100 % — listos para uso
- Sintaxis **ES6+** con soporte para tree-shaking
- **Named exports** para mejor tamaño de bundle
- Script **validate-imports** y **--fix** para compatibilidad require/import
- Script **convert-class-syntax** para migrar `Class` a clases ES6
- Copias de seguridad en `temp/` en conversiones

---

## 🚀 Next Steps

Carpetas sugeridas para seguir la conversión a TS:
1. **utils** (ya en progreso)
2. **structs**, **data**, **curves**, **device**, **events**
3. **gameobjects**, **input**, **renderer**, **physics**, etc.

Para ver estadísticas al día: `bun run stats`

---

*Progreso hacia una base Phaser 4 totalmente tipada en TypeScript.*

**Conversión a TypeScript por Francisco Pereira.**
