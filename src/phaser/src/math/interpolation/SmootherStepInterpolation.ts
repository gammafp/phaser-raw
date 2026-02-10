/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { SmootherStep } from '../SmootherStep';

/**
 * A Smoother Step interpolation method.
 *
 * @function Phaser.Math.Interpolation.SmootherStep
 * @since 3.9.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The interpolated value.
 */
export const SmootherStepInterpolation = (t: number, min: number, max: number): number =>
{
    return min + (max - min) * SmootherStep(t, 0, 1);
};
