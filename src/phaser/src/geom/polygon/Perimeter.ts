/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Length = require('../line/Length');
const Line = require('../line/Line');

/**
 * Returns the perimeter of the given Polygon.
 *
 * @function Phaser.Geom.Polygon.Perimeter
 * @since 3.12.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to get the perimeter of.
 *
 * @return {number} The perimeter of the Polygon.
 */
export const Perimeter = (polygon: any): number =>
{
    const points = polygon.points;
    let perimeter = 0;

    for (let i = 0; i < points.length; i++)
    {
        const pointA = points[i];
        const pointB = points[(i + 1) % points.length];
        const line = new Line(
            pointA.x,
            pointA.y,
            pointB.x,
            pointB.y
        );

        perimeter += Length(line);
    }

    return perimeter;
};
