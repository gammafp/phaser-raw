/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { MATH_CONST } from '../../math/const';
import { Angle } from './Angle';

/**
 * Returns the x component of the normal vector of the given line.
 *
 * @function Phaser.Geom.Line.NormalX
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The Line object to get the normal value from.
 *
 * @return {number} The x component of the normal vector of the line.
 */
export const NormalX = (line: any): number =>
{
    return Math.cos(Angle(line) - MATH_CONST.TAU);
};
