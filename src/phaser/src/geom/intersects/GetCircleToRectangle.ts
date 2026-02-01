/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { CircleToRectangle } from './CircleToRectangle';
import { GetLineToCircle } from './GetLineToCircle';

/**
 * Checks for intersection between a circle and a rectangle,
 * and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetCircleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The circle to be checked.
 * @param {Phaser.Geom.Rectangle} rect - The rectangle to be checked.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
export const GetCircleToRectangle = (circle: any, rect: any, out?: any[]): any[] =>
{
    if (out === undefined) { out = []; }

    if (CircleToRectangle(circle, rect))
    {
        const lineA = rect.getLineA();
        const lineB = rect.getLineB();
        const lineC = rect.getLineC();
        const lineD = rect.getLineD();

        GetLineToCircle(lineA, circle, out);
        GetLineToCircle(lineB, circle, out);
        GetLineToCircle(lineC, circle, out);
        GetLineToCircle(lineD, circle, out);
    }

    return out;
};
