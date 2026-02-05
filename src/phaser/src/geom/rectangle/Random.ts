/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Point } from '../point/Point';

/**
 * Returns a random point within a Rectangle.
 *
 * @function Phaser.Geom.Rectangle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to return a point from.
 * @param {Phaser.Geom.Point} out - The object to update with the point's coordinates.
 *
 * @return {Phaser.Geom.Point} The modified `out` object, or a new Point if none was provided.
 */
export const Random = (rect: any, out?: any): any =>
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.x + (Math.random() * rect.width);
    out.y = rect.y + (Math.random() * rect.height);

    return out;
};
