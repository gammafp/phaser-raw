/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Point = require('./Point');

/**
 * Inverts a Point's coordinates.
 *
 * @function Phaser.Geom.Point.Negative
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point} point - The Point to invert.
 * @param {Phaser.Geom.Point} [out] - The Point to return the inverted coordinates in.
 *
 * @return {Phaser.Geom.Point} The modified `out` Point, or a new Point if none was provided.
 */
export const Negative = (point: any, out?: any): any =>
{
    if (out === undefined) { out = new Point(); }

    return out.setTo(-point.x, -point.y);
};
