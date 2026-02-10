/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Florian Mertens
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';

/**
 * Get the nearest point on a line perpendicular to the given point.
 *
 * @function Phaser.Geom.Line.GetNearestPoint
 * @since 3.16.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to get the nearest point on.
 * @param {(Phaser.Math.Vector2|object)} point - The point to get the nearest point to.
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 to store the coordinates of the nearest point on the line.
 *
 * @return {Phaser.Math.Vector2} The nearest point on the line.
 */
export const GetNearestPoint = (line: any, point: any, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    const x1 = line.x1;
    const y1 = line.y1;

    const x2 = line.x2;
    const y2 = line.y2;

    const L2 = (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    if (L2 === 0)
    {
        return out;
    }

    const r = (((point.x - x1) * (x2 - x1)) + ((point.y - y1) * (y2 - y1))) / L2;

    out.x = x1 + (r * (x2 - x1));
    out.y = y1 + (r * (y2 - y1));

    return out;
};
