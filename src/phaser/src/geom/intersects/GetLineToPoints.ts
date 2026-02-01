/**
 * @author       Richard Davey
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetLineToLine } from './GetLineToLine';

const Line = require('../line/Line');
const Vector3 = require('../../math/Vector3');

//  Temp calculation segment
const segment = new Line();

//  Temp vec3
const tempIntersect = new Vector3();

/**
 * Checks for the closest point of intersection between a line segment and an array of points, where each pair
 * of points are converted to line segments for the intersection tests.
 *
 * If no intersection is found, this function returns `null`.
 *
 * If intersection was found, a Vector3 is returned with the following properties:
 *
 * The `x` and `y` components contain the point of the intersection.
 * The `z` component contains the closest distance.
 *
 * @function Phaser.Geom.Intersects.GetLineToPoints
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Line} line - The line segment, or ray, to check. If a ray, set the `isRay` parameter to `true`.
 * @param {Phaser.Math.Vector2[] | Phaser.Geom.Point[]} points - An array of points to check.
 * @param {boolean} [isRay=false] - Is `line` a ray or a line segment?
 * @param {Phaser.Math.Vector3} [out] - A Vector3 to store the intersection results in.
 *
 * @return {Phaser.Math.Vector3} A Vector3 containing the intersection results, or `null`.
 */
export const GetLineToPoints = (line: any, points: any[], isRay: boolean = false, out?: any): any =>
{
    if (out === undefined) { out = new Vector3(); }

    let closestIntersect = false;

    //  Reset our vec3s
    out.set();
    tempIntersect.set();

    let prev = points[points.length - 1];

    for (let i = 0; i < points.length; i++)
    {
        const current = points[i];

        segment.setTo(prev.x, prev.y, current.x, current.y);

        prev = current;

        if (GetLineToLine(line, segment, isRay, tempIntersect))
        {
            if (!closestIntersect || tempIntersect.z < out.z)
            {
                out.copy(tempIntersect);

                closestIntersect = true;
            }
        }
    }

    return (closestIntersect) ? out : null;
};
