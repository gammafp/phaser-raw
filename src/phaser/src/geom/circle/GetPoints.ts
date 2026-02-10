/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';
import { Circumference } from './Circumference';
import { CircumferencePoint } from './CircumferencePoint';
import { FromPercent } from '../../math/FromPercent';
import { MATH_CONST } from '../../math/const';

/**
 * Returns an array of Vector2 objects containing the coordinates of the points around the circumference of the Circle,
 * based on the given quantity or stepRate values.
 *
 * @function Phaser.Geom.Circle.GetPoints
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get the points from.
 * @param {number} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
 * @param {number} [stepRate] - Sets the quantity by getting the circumference of the circle and dividing it by the stepRate.
 * @param {Phaser.Math.Vector2[]} [out] - An array to insert the points in to. If not provided a new array will be created.
 *
 * @return {Phaser.Math.Vector2[]} An array of Vector2 pertaining to the points around the circumference of the circle.
 */
export const GetPoints = (circle: any, quantity: number, stepRate?: number, out?: Vector2[]): Vector2[] =>
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity && stepRate! > 0)
    {
        quantity = Circumference(circle) / stepRate!;
    }

    for (let i = 0; i < quantity; i++)
    {
        const angle = FromPercent(i / quantity, 0, MATH_CONST.PI2);

        out.push(CircumferencePoint(circle, angle));
    }

    return out;
};
