/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';

/**
 * Returns a random point on a given Line.
 *
 * @function Phaser.Geom.Line.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The Line to calculate the random point on.
 * @param {Phaser.Math.Vector2} [out] - An instance of a Vector2 to be modified.
 *
 * @return {Phaser.Math.Vector2} A random point on the Line stored in a Vector2.
 */
export const Random = (line: any, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    const t = Math.random();

    out.x = line.x1 + t * (line.x2 - line.x1);
    out.y = line.y1 + t * (line.y2 - line.y1);

    return out;
};
