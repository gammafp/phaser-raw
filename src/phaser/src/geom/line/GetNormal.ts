/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { MATH_CONST } from '../../math/const';
import { Vector2 } from '../../math/Vector2';
import { Angle } from './Angle';

/**
 * Calculate the normal of the given line.
 *
 * The normal of a line is a vector that points perpendicular from it.
 *
 * @function Phaser.Geom.Line.GetNormal
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the normal of.
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 object to store the normal in.
 *
 * @return {Phaser.Math.Vector2} The normal of the Line.
 */
export const GetNormal = (line: any, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    const a = Angle(line) - MATH_CONST.TAU;

    out.x = Math.cos(a);
    out.y = Math.sin(a);

    return out;
};
