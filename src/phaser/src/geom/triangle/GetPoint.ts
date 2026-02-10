/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';
import { Length } from '../line/Length';

/**
 * Returns a Vector2 point from around the perimeter of a Triangle.
 *
 * @function Phaser.Geom.Triangle.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get the point on its perimeter from.
 * @param {number} position - The position along the perimeter of the triangle. A value between 0 and 1.
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 point to store the value in. If not given a new Vector2 will be created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 point object containing the given position from the perimeter of the triangle.
 */
export const GetPoint = (triangle: any, position: number, out?: Vector2): Vector2 =>
{
    if (out === undefined) { out = new Vector2(); }

    const line1 = triangle.getLineA();
    const line2 = triangle.getLineB();
    const line3 = triangle.getLineC();

    if (position <= 0 || position >= 1)
    {
        out.x = line1.x1;
        out.y = line1.y1;

        return out;
    }

    const length1 = Length(line1);
    const length2 = Length(line2);
    const length3 = Length(line3);

    const perimeter = length1 + length2 + length3;

    let p = perimeter * position;
    let localPosition = 0;

    //  Which line is it on?

    if (p < length1)
    {
        //  Line 1
        localPosition = p / length1;

        out.x = line1.x1 + (line1.x2 - line1.x1) * localPosition;
        out.y = line1.y1 + (line1.y2 - line1.y1) * localPosition;
    }
    else if (p > length1 + length2)
    {
        //  Line 3
        p -= length1 + length2;
        localPosition = p / length3;

        out.x = line3.x1 + (line3.x2 - line3.x1) * localPosition;
        out.y = line3.y1 + (line3.y2 - line3.y1) * localPosition;
    }
    else
    {
        //  Line 2
        p -= length1;
        localPosition = p / length2;

        out.x = line2.x1 + (line2.x2 - line2.x1) * localPosition;
        out.y = line2.y1 + (line2.y2 - line2.y1) * localPosition;
    }

    return out;
};
