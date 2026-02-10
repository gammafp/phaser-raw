/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { MATH_CONST } from './const';

/**
 * Convert the given angle from degrees, to the equivalent angle in radians.
 *
 * @function Phaser.Math.DegToRad
 * @since 3.0.0
 *
 * @param {number} degrees - The angle (in degrees) to convert to radians.
 *
 * @return {number} The given angle converted to radians.
 */
export const DegToRad = (degrees: number): number =>
{
    return degrees * MATH_CONST.DEG_TO_RAD;
};
