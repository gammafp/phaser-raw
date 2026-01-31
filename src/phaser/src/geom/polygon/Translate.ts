/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Tranlates the points of the given Polygon.
 *
 * @function Phaser.Geom.Polygon.Translate
 * @since 3.50.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to modify.
 * @param {number} x - The amount to horizontally translate the points by.
 * @param {number} y - The amount to vertically translate the points by.
 *
 * @return {Phaser.Geom.Polygon} The modified Polygon.
 */
export const Translate = <T extends any>(polygon: T, x: number, y: number): T =>
{
    const points = polygon.points;

    for (let i = 0; i < points.length; i++)
    {
        points[i].x += x;
        points[i].y += y;
    }

    return polygon;
};
