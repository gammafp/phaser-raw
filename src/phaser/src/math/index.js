/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math
 * 
 * CommonJS compatibility layer that provides a mutable namespace.
 * This is needed because Config.js assigns Math.RND at runtime.
 */

// Import constants object (mutable)
const { MATH_CONST } = require('./const.ts');

// Import all other exports from index.ts
const MathModule = require('./index.ts');

// Create the PhaserMath object with MATH_CONST properties spread at the root level
const PhaserMath = {
    ...MathModule,
    // Spread MATH_CONST to have constants as top-level properties
    ...MATH_CONST
};

// Re-export as CommonJS
module.exports = PhaserMath;
