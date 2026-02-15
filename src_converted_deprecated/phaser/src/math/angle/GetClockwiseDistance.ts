/**
 * @author       samme
 * @copyright    2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Normalize as NormalizeAngle } from './Normalize';

/**
 * Gets the shortest nonnegative angular distance from angle1 to angle2.
 *
 * @function Phaser.Math.Angle.GetClockwiseDistance
 * @since 4.0.0
 *
 * @param {number} angle1 - The starting angle in radians.
 * @param {number} angle2 - The target angle in radians.
 *
 * @return {number} The distance in radians, in the range [0, 2pi).
 */
export const GetClockwiseDistance = (angle1: number, angle2: number): number =>
{
    return NormalizeAngle(angle2 - angle1);
};
