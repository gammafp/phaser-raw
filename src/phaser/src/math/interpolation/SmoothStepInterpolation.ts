/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { SmoothStep } from '../SmoothStep';

/**
 * A Smooth Step interpolation method.
 *
 * @function Phaser.Math.Interpolation.SmoothStep
 * @since 3.9.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep}
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The interpolated value.
 */
export const SmoothStepInterpolation = (t: number, min: number, max: number): number =>
{
    return min + (max - min) * SmoothStep(t, 0, 1);
};
