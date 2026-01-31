/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Point = require('../point/Point');

/**
 * Returns the size of the Rectangle, expressed as a Point object.
 * With the value of the `width` as the `x` property and the `height` as the `y` property.
 *
 * @function Phaser.Geom.Rectangle.GetSize
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to get the size from.
 * @param {(Phaser.Geom.Point|object)} [out] - The Point object to store the size in. If not given, a new Point instance is created.
 *
 * @return {(Phaser.Geom.Point|object)} A Point object where `x` holds the width and `y` holds the height of the Rectangle.
 */
export const GetSize = (rect: any, out?: any): any =>
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.width;
    out.y = rect.height;

    return out;
};
