/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DegToRad } from '../../math/DegToRad';

const Point = require('../point/Point');

/**
 * Returns a Point from the perimeter of a Rectangle based on the given angle.
 *
 * @function Phaser.Geom.Rectangle.PerimeterPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectangle - The Rectangle to get the perimeter point from.
 * @param {number} angle - The angle of the point, in degrees.
 * @param {Phaser.Geom.Point} [out] - The Point object to store the position in. If not given, a new Point instance is created.
 *
 * @return {Phaser.Geom.Point} A Point object holding the coordinates of the Rectangle perimeter.
 */
export const PerimeterPoint = (rectangle: any, angle: number, out?: any): any =>
{
    if (out === undefined) { out = new Point(); }

    angle = DegToRad(angle);

    const s = Math.sin(angle);
    const c = Math.cos(angle);

    let dx = (c > 0) ? rectangle.width / 2 : rectangle.width / -2;
    let dy = (s > 0) ? rectangle.height / 2 : rectangle.height / -2;

    if (Math.abs(dx * s) < Math.abs(dy * c))
    {
        dy = (dx * s) / c;
    }
    else
    {
        dx = (dy * c) / s;
    }

    out.x = dx + rectangle.centerX;
    out.y = dy + rectangle.centerY;

    return out;
};
