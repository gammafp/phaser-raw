# Phaser's TS Modules - Current Version Phaser 3.90.0

This is a project done in spare time that aims to convert Phaser files to TypeScript in order to have code that integrates more easily into TS projects and improve workflow.

**Phaser framework is a library created by Richard Davey and Phaser Studio Team.
Please visit the [official website](https://phaser.io/) for more information and official repository [here](https://github.com/photonstorm/phaser).**

![screenshot](./screenshot.png)

## How to Run the Project

1. Clone the repository
2. Run `npm install` or `bun install`
3. Run `npm run dev` or `bun run dev`

## Phaser's Folder

The Phaser source code is located inside the `src/phaser` folder.

---

## 📊 TypeScript Conversion Progress

### Global Summary
![71%](https://progress-bar.xyz/71)

- **Total files** (excluding typedefs): 1,651
- **TypeScript files**: 1,173
- **JavaScript files**: 478
- **Progress**: **71%** 🎉

### 🏆 Fully Converted (100%) - 20 Folders

- [x] **actions** (54 files) - All action utilities
- [x] **cache** (6 files) - CacheManager and BaseCache
- [x] **cameras** (34 files) - Camera system, effects, and controls
- [x] **core** (24 files) - Config, TimeStep, Game, CreateRenderer ✨
- [x] **create** (8 files) - Texture generation utilities
- [x] **curves** (9 files) - Path, MoveTo, and all Bezier curves
- [x] **device** (9 files) - Device detection
- [x] **display** (78 files) - ColorMatrix, RGB, Masks, Canvas utilities
- [x] **dom** (10 files) - DOM manipulation utilities
- [x] **events** (2 files) - Event system
- [x] **fx** (17 files) - FX Controllers (Bloom, Blur, Glow, etc.) ✨
- [x] **geom** (201 files) - All geometry classes and functions
- [x] **loader** (56 files) - LoaderPlugin and all file types
- [x] **math** (142 files) - All math utilities and functions
- [x] **polyfills** (10 files) - Browser polyfills
- [x] **scene** (33 files) - SceneManager, Systems, ScenePlugin
- [x] **tilemaps** (112 files) - Complete tilemap system
- [x] **time** (6 files) - Clock and Timeline
- [x] **tweens** (34 files) - Complete tween system ✨
- [x] **types** (3 files) - Type definitions

### 📈 Nearly Complete (>90%)

- [ ] **utils** (99%) - 77/78 files - Only 1 file remaining (Class.js)

### 🔄 In Progress (50-90%)

- [ ] **data** (78%) - 7/9 files
- [ ] **sound** (77%) - 27/35 files
- [ ] **animations** (71%) - 12/17 files
- [ ] **input** (66%) - 64/97 files
- [ ] **scale** (50%) - 7/14 files

### ⏳ Lower Progress (<50%)

- [ ] **structs** (40%) - 4/10 files
- [ ] **textures** (29%) - 8/28 files
- [ ] **gameobjects** (27%) - 73/271 files
- [ ] **physics** (20%) - 26/130 files
- [ ] **plugins** (17%) - 1/6 files
- [ ] **renderer** (15%) - 16/104 files

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

- **71%** of the codebase converted to TypeScript
- **20 complete folders** ready for production use
- **Modern ES6+ syntax** with tree-shaking support
- **Named exports** for optimal bundle size
- **Zero import compatibility errors**
- **Backup system** for safe conversions
- **1,173 TypeScript files** converted and validated

---

## 🚀 Next Steps

Recommended folders for conversion:
1. **structs** (40%) - 6 files remaining (ProcessQueue, Map, Set, Size, List)
2. **data** (78%) - 2 files remaining (DataManagerPlugin, DataManager)
3. **sound** (77%) - 8 files remaining (BaseSound, HTML5Audio, WebAudio, etc.)
4. **animations** (71%) - 5 files remaining
5. Complete **gameobjects** (27%) - Many files remaining (shapes, sprites, etc.)

---

*A work in progress toward a fully typed Phaser experience.*

**TypeScript conversion by Francisco Pereira.**
