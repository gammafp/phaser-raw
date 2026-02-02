/**
 * @author       Richard Davey
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetLineToPolygon } from './GetLineToPolygon';

const Vector4 = require('../../math/Vector4');
const Line = require('../line/Line');

//  Temp calculation segment
const segment = new Line();

/**
 * @ignore
 */
const CheckIntersects = (angle: number, x: number, y: number, polygons: any, intersects: any[]): void =>
{
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    segment.setTo(x, y, x + dx, y + dy);

    const closestIntersect = GetLineToPolygon(segment, polygons, true);

    if (closestIntersect)
    {
        intersects.push(new Vector4(closestIntersect.x, closestIntersect.y, angle, closestIntersect.w));
    }
};

/**
 * @ignore
 */
const SortIntersects = (a: any, b: any): number =>
{
    return a.z - b.z;
};

/**
 * Projects rays out from the given point to each line segment of the polygons.
 *
 * If the rays intersect with the polygons, the points of intersection are returned in an array.
 *
 * If no intersections are found, the returned array will be empty.
 *
 * Each Vector4 intersection result has the following properties:
 *
 * The `x` and `y` components contain the point of the intersection.
 * The `z` component contains the angle of intersection.
 * The `w` component contains the index of the polygon, in the given array, that triggered the intersection.
 *
 * @function Phaser.Geom.Intersects.GetRaysFromPointToPolygon
 * @since 3.50.0
 *
 * @param {number} x - The x coordinate to project the rays from.
 * @param {number} y - The y coordinate to project the rays from.
 * @param {Phaser.Geom.Polygon | Phaser.Geom.Polygon[]} polygons - A single polygon, or array of polygons, to check against the rays.
 *
 * @return {Phaser.Math.Vector4[]} An array containing all intersections in Vector4s.
 */
export const GetRaysFromPointToPolygon = (x: number, y: number, polygons: any): any[] =>
{
    if (!Array.isArray(polygons))
    {
        polygons = [ polygons ];
    }

    const intersects: any[] = [];
    const angles: number[] = [];

    for (let i = 0; i < polygons.length; i++)
    {
        const points = polygons[i].points;

        for (let p = 0; p < points.length; p++)
        {
            const angle = Math.atan2(points[p].y - y, points[p].x - x);

            if (angles.indexOf(angle) === -1)
            {
                //  +- 0.00001 rads to catch lines behind segment corners

                CheckIntersects(angle, x, y, polygons, intersects);
                CheckIntersects(angle - 0.00001, x, y, polygons, intersects);
                CheckIntersects(angle + 0.00001, x, y, polygons, intersects);

                angles.push(angle);
            }
        }
    }

    return intersects.sort(SortIntersects);
};
