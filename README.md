# Phaser's TS modules - Current version Phaser 3.90.0

This is a small project done in spare time that aims to convert Phaser files to TypeScript in order to have code that integrates more easily into TS projects and improve workflow.

**Phaser framework is a library created by Richard Davey and Phaser Studio Team.
Please visit the [official website](https://phaser.io/) for more information and oficial repository [here](https://github.com/photonstorm/phaser).**

![screenshot](./screenshot.png)

## How to run the project

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## Phaser's folder

The Phaser source code is located inside the `src/phaser` folder.

## Refactor 

I have added "// TODO: Fix types" in files that have been converted to TS and need a review with the new converted class types.
While not all code has been converted, phaser.d.ts will be used for intermediate types.

Recommended TODOs are:
// TODO: Fix types
// TODO: Refactor
// TODO: Check this code (if there are doubts about whether the code is correct.)

- [ ] src/display/color - needs refactor - and fix types

## Global Summary
![26%](https://progress-bar.xyz/26)

- Total files: 2001
- TS files: 521
- JS files: 1480
- Percentage: 26.04%

## Progress by Namespace

### ✅ Fully Converted (100%)
  - [x] actions (100%) - 57 files
  - [x] dom (100%) - 10 files
  - [x] types (100%) - 3 files

### 🔄 High Progress (>75%)
  - [ ] utils (96.10%) - 74/77 files
  - [ ] math (87.92%) - 131/149 files
  - [ ] geom (84.36%) - 178/211 files
  - [ ] display (76.83%) - 63/82 files

### ⏳ In Progress
  - [ ] scene (6.82%) - 3/44 files

### 📋 Not Started (0%)
  - [ ] animations (0%) - 26 files
  - [ ] cache (0%) - 6 files
  - [ ] cameras (0%) - 46 files
  - [ ] core (0%) - 48 files
  - [ ] create (0%) - 11 files
  - [ ] curves (0%) - 14 files
  - [ ] data (0%) - 9 files
  - [ ] device (0%) - 9 files
  - [ ] events (0%) - 2 files
  - [ ] fx (0%) - 17 files
  - [ ] gameobjects (0%) - 372 files
  - [ ] input (0%) - 109 files
  - [ ] loader (0%) - 97 files
  - [ ] physics (0%) - 166 files
  - [ ] plugins (0%) - 10 files
  - [ ] polyfills (0%) - 10 files
  - [ ] renderer (0%) - 117 files
  - [ ] scale (0%) - 14 files
  - [ ] sound (0%) - 43 files
  - [ ] structs (0%) - 10 files
  - [ ] textures (0%) - 35 files
  - [ ] tilemaps (0%) - 124 files
  - [ ] time (0%) - 10 files
  - [ ] tweens (0%) - 59 files

## Recent Changes

**Last update:** ES6 imports modernization completed
- ✅ 186 JS files modernized with `import { X } from 'path'`
- ✅ 521 TypeScript modules with functional tree-shaking
- ✅ 0 import compatibility errors
- ✅ Build validation passing

*A work in progress toward a fully typed Phaser experience.*

**TypeScript conversion by Francisco Pereira.**
