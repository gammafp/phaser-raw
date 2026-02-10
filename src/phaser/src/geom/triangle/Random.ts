/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';

/**
 * Returns a random Vector2 from within the area of the given Triangle.
 *
 * @function Phaser.Geom.Triangle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get a random point from.
 * @param {Phaser.Math.Vector2} [out] - A Vector2 to store the position in. If not given, a new Vector2 is created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 holding the coordinates of a random position within the Triangle.
 */
export const Random = (triangle: any, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    //  Basis vectors
    const ux = triangle.x2 - triangle.x1;
    const uy = triangle.y2 - triangle.y1;

    const vx = triangle.x3 - triangle.x1;
    const vy = triangle.y3 - triangle.y1;

    //  Random point within the unit square
    let r = Math.random();
    let s = Math.random();

    //  Point outside the triangle? Remap it.
    if (r + s >= 1)
    {
        r = 1 - r;
        s = 1 - s;
    }

    out.x = triangle.x1 + ((ux * r) + (vx * s));
    out.y = triangle.y1 + ((uy * r) + (vy * s));

    return out;
};
