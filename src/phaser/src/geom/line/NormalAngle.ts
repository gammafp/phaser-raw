/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { MATH_CONST } from '../../math/const';
import { Wrap } from '../../math/Wrap';
import { Angle } from './Angle';

/**
 * Get the angle of the normal of the given line in radians.
 *
 * @function Phaser.Geom.Line.NormalAngle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the angle of the normal of.
 *
 * @return {number} The angle of the normal of the line in radians.
 */
export const NormalAngle = (line: any): number =>
{
    const angle = Angle(line) - MATH_CONST.TAU;

    return Wrap(angle, -Math.PI, Math.PI);
};
