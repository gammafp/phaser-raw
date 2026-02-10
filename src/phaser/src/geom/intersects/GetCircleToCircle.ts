/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';
import { CircleToCircle } from './CircleToCircle';

/**
 * Checks if two Circles intersect and returns the intersection points as a Vector2 array.
 *
 * @function Phaser.Geom.Intersects.GetCircleToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circleA - The first Circle to check for intersection.
 * @param {Phaser.Geom.Circle} circleB - The second Circle to check for intersection.
 * @param {Phaser.Math.Vector2[]} [out] - An optional array in which to store the points of intersection.
 *
 * @return {Phaser.Math.Vector2[]} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
export const GetCircleToCircle = (circleA: any, circleB: any, out?: Vector2[]): Vector2[] =>
{
    if (out === undefined) { out = []; }

    if (CircleToCircle(circleA, circleB))
    {
        const x0 = circleA.x;
        const y0 = circleA.y;
        const r0 = circleA.radius;

        const x1 = circleB.x;
        const y1 = circleB.y;
        const r1 = circleB.radius;

        let coefficientA: number, coefficientB: number, coefficientC: number, lambda: number, x: number;

        if (y0 === y1)
        {
            x = ((r1 * r1) - (r0 * r0) - (x1 * x1) + (x0 * x0)) / (2 * (x0 - x1));

            coefficientA = 1;
            coefficientB = -2 * y1;
            coefficientC = (x1 * x1) + (x * x) - (2 * x1 * x) + (y1 * y1) - (r1 * r1);

            lambda = (coefficientB * coefficientB) - (4 * coefficientA * coefficientC);

            if (lambda === 0)
            {
                out.push(new Vector2(x, (-coefficientB / (2 * coefficientA))));
            }
            else if (lambda > 0)
            {
                out.push(new Vector2(x, (-coefficientB + Math.sqrt(lambda)) / (2 * coefficientA)));
                out.push(new Vector2(x, (-coefficientB - Math.sqrt(lambda)) / (2 * coefficientA)));
            }
        }
        else
        {
            const v1 = (x0 - x1) / (y0 - y1);
            const n = (r1 * r1 - r0 * r0 - x1 * x1 + x0 * x0 - y1 * y1 + y0 * y0) / (2 * (y0 - y1));

            coefficientA = (v1 * v1) + 1;
            coefficientB = (2 * y0 * v1) - (2 * n * v1) - (2 * x0);
            coefficientC = (x0 * x0) + (y0 * y0) + (n * n) - (r0 * r0) - (2 * y0 * n);

            lambda = (coefficientB * coefficientB) - (4 * coefficientA * coefficientC);

            if (lambda === 0)
            {
                x = (-coefficientB / (2 * coefficientA));
                out.push(new Vector2(x, (n - (x * v1))));
            }
            else if (lambda > 0)
            {
                x = (-coefficientB + Math.sqrt(lambda)) / (2 * coefficientA);
                out.push(new Vector2(x, (n - (x * v1))));
                x = (-coefficientB - Math.sqrt(lambda)) / (2 * coefficientA);
                out.push(new Vector2(x, (n - (x * v1))));
            }
        }
    }

    return out;
};
