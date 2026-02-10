/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { CircumferencePoint } from './CircumferencePoint';
import { FromPercent } from '../../math/FromPercent';
import { MATH_CONST } from '../../math/const';
import { Vector2 } from '../../math/Vector2';

/**
 * Returns a Vector2 object containing the coordinates of a point on the circumference of the Ellipse
 * based on the given angle normalized to the range 0 to 1. I.e. a value of 0.5 will give the point
 * at 180 degrees around the ellipse.
 *
 * @function Phaser.Geom.Ellipse.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the circumference point on.
 * @param {number} position - A value between 0 and 1, where 0 equals 0 degrees, 0.5 equals 180 degrees and 1 equals 360 around the ellipse.
 * @param {Phaser.Math.Vector2} [out] - A Vector2 instance to store the return values in. If not given a new Vector2 object will be created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 containing the coordinates of the point around the ellipse.
 */
export const GetPoint = (ellipse: any, position: number, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    const angle = FromPercent(position, 0, MATH_CONST.PI2);

    return CircumferencePoint(ellipse, angle, out);
};
