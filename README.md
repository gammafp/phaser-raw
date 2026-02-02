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

**Last Update:** 2026-02-02

### Global Summary
![52.55%](https://progress-bar.xyz/52.55)

- **Total files** (excluding typedefs): 1,648
- **TypeScript files**: 866
- **JavaScript files**: 782
- **Progress**: **52.55%** 🎉

### 🏆 Fully Converted (100%) - 8 Folders

- [x] **actions** (54 files) - All action utilities
- [x] **create** (8 files) - Texture generation utilities
- [x] **curves** (9 files) - Path, MoveTo, and all Bezier curves
- [x] **display** (78 files) - ColorMatrix, RGB, Masks, Canvas utilities
- [x] **dom** (10 files) - DOM manipulation utilities
- [x] **events** (2 files) - Event system
- [x] **scene** (33 files) - SceneManager, Systems, ScenePlugin
- [x] **types** (3 files) - Type definitions

### 📈 Nearly Complete (>90%)

- [ ] **utils** (96.10%) - 74/77 files - Only 3 complex files remaining
- [ ] **math** (91.61%) - 131/143 files
- [ ] **geom** (91.54%) - 184/201 files

### 🔄 In Progress (50-90%)

- [ ] **data** (77.78%) - 7/9 files
- [ ] **sound** (77.14%) - 27/35 files
- [ ] **core** (70.83%) - 17/24 files
- [ ] **animations** (70.59%) - 12/17 files
- [ ] **tweens** (70.59%) - 24/34 files
  - ✅ **tweens/builders** subfolder 100% complete
- [ ] **cache** (66.67%) - 4/6 files
- [ ] **input** (63.92%) - 62/97 files
- [ ] **cameras** (55.88%) - 19/34 files
- [ ] **scale** (50.00%) - 7/14 files
- [ ] **time** (50.00%) - 3/6 files

### ⏳ Lower Progress (<50%)

- [ ] **device** (44.44%) - 4/9 files
- [ ] **structs** (40.00%) - 4/10 files
- [ ] **textures** (28.57%) - 8/28 files
- [ ] **loader** (23.21%) - 13/56 files
- [ ] **physics** (20.00%) - 26/130 files
- [ ] **renderer** (15.38%) - 16/104 files
- [ ] **gameobjects** (9.33%) - 25/268 files

### 📋 Not Started (0%)

- [ ] **fx** - 17 files
- [ ] **plugins** - 6 files
- [ ] **polyfills** - 10 files
- [ ] **tilemaps** - 112 files

---

## 🎯 Recent Highlights

### Major Conversions Completed

#### Tweens System
- ✅ **tweens/builders** - All 12 builder files converted (100%)
  - Helper functions: GetBoolean, GetEaseFunction, GetInterpolationFunction, GetNewValue, GetProps, GetTargets, GetValueOp
  - Builders: NumberTweenBuilder, StaggerBuilder, TweenBuilder, TweenChainBuilder
- ✅ **TweenManager.ts** - Main tween controller class (1,157 lines)

#### Curves System
- ✅ **curves** - Complete folder (9 files, 100%)
  - Curve.ts (base class)
  - Path.ts, MoveTo.ts
  - CubicBezierCurve, QuadraticBezierCurve, LineCurve, SplineCurve, EllipseCurve

#### Scene System
- ✅ **scene** - Complete folder (33 files, 100%)
  - SceneManager.ts, Systems.ts, Scene.ts, ScenePlugin.ts
  - All scene constants, helper functions, and events

#### Display System
- ✅ **display** - Complete folder (78 files, 100%)
  - ColorMatrix.ts, RGB.ts, BaseShader.ts
  - BitmapMask.ts, GeometryMask.ts
  - CanvasPool.ts, Smoothing.ts, and all canvas utilities
  - All color utilities, bounds, and alignment helpers

---

## 🛠️ Conversion Tools

### Scripts Created

1. **check-folder-mixins.ts** - Verify if a folder has Mixins before converting
2. **validate-js-syntax.ts** - Validate JS syntax with Acorn parser
3. **convert-class-syntax.ts** - Convert `new Class()` to ES6 with automatic backups in `temp/`
4. **ts-js-stats.ts** - Updated to ignore `typedefs/` folders
5. **validate-imports-smart.ts** - Validate import compatibility
6. **analyze-js-files.ts** - Analyze which files are convertible

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

- **52.55%** of the codebase converted to TypeScript
- **8 complete folders** ready for production use
- **Modern ES6+ syntax** with tree-shaking support
- **Named exports** for optimal bundle size
- **Zero import compatibility errors**
- **Backup system** for safe conversions

---

## 🚀 Next Steps

Recommended folders for conversion:
1. **polyfills** (10 files) - Simple functions, 0% risk
2. **plugins** (6 files) - Small folder
3. Complete **utils** (only 3 files left)
4. Complete **math** (12 files left)
5. Complete **geom** (17 files left)

---

*A work in progress toward a fully typed Phaser experience.*

**TypeScript conversion by Francisco Pereira.**
