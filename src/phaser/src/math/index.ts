/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math
 */

// Export constants object (for CommonJS compatibility via index.js)
export { MATH_CONST } from './const';

// Re-export all namespaced modules
export * as Angle from './angle';
export * as Distance from './distance';
export * as Easing from './easing';
export * as Fuzzy from './fuzzy';
export * as Interpolation from './interpolation';
export * as Pow2 from './pow2';
export * as Snap from './snap';

// Re-export single functions for tree-shaking support
export { Average } from './Average';
export { Bernstein } from './Bernstein';
export { Between } from './Between';
export { CatmullRom } from './CatmullRom';
export { CeilTo } from './CeilTo';
export { Clamp } from './Clamp';
export { DegToRad } from './DegToRad';
export { Difference } from './Difference';
export { Factorial } from './Factorial';
export { FloatBetween } from './FloatBetween';
export { FloorTo } from './FloorTo';
export { FromPercent } from './FromPercent';
export { GetSpeed } from './GetSpeed';
export { IsEven } from './IsEven';
export { IsEvenStrict } from './IsEvenStrict';
export { Linear } from './Linear';
export { LinearXY } from './LinearXY';
export { MaxAdd } from './MaxAdd';
export { Median } from './Median';
export { MinSub } from './MinSub';
export { Percent } from './Percent';
export { RadToDeg } from './RadToDeg';
export { RandomXY } from './RandomXY';
export { RandomXYZ } from './RandomXYZ';
export { RandomXYZW } from './RandomXYZW';
export { Rotate } from './Rotate';
export { RotateAround } from './RotateAround';
export { RotateAroundDistance } from './RotateAroundDistance';
export { RotateTo } from './RotateTo';
export { RoundAwayFromZero } from './RoundAwayFromZero';
export { RoundTo } from './RoundTo';
export { SinCosTableGenerator } from './SinCosTableGenerator';
export { SmootherStep } from './SmootherStep';
export { SmoothStep } from './SmoothStep';
export { Within } from './Within';
export { Wrap } from './Wrap';

// Classes and complex modules still use require for now
// TODO: Convert these to TypeScript classes
const Euler = require('./Euler');
const Matrix3 = require('./Matrix3');
const Matrix4 = require('./Matrix4');
const Quaternion = require('./Quaternion');
const Vector2 = require('./Vector2');
const Vector3 = require('./Vector3');
const Vector4 = require('./Vector4');
const RotateVec3 = require('./RotateVec3');
const ToXY = require('./ToXY');
const TransformXY = require('./TransformXY');
const RandomDataGenerator = require('./random-data-generator/RandomDataGenerator');

// Re-export classes for compatibility
export {
    Euler,
    Matrix3,
    Matrix4,
    Quaternion,
    RandomDataGenerator,
    RotateVec3,
    ToXY,
    TransformXY,
    Vector2,
    Vector3,
    Vector4
};
