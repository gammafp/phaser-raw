/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';

/**
 * Get the midpoint of the given line.
 *
 * @function Phaser.Geom.Line.GetMidPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to get the midpoint of.
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 object to store the midpoint in.
 *
 * @return {Phaser.Math.Vector2} The midpoint of the Line.
 */
export const GetMidPoint = (line: any, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    out.x = (line.x1 + line.x2) / 2;
    out.y = (line.y1 + line.y2) / 2;

    return out;
};
