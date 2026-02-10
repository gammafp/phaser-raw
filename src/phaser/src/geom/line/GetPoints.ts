/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';
import { Length } from './Length';

/**
 * Get a number of points along a line's length.
 *
 * Provide a `quantity` to get an exact number of points along the line.
 *
 * Provide a `stepRate` to ensure a specific distance between each point on the line. Set `quantity` to `0` when
 * providing a `stepRate`.
 *
 * See also `GetEasedPoints` for a way to distribute the points across the line according to an ease type or input function.
 *
 * @function Phaser.Geom.Line.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {number} quantity - The number of points to place on the line. Set to `0` to use `stepRate` instead.
 * @param {number} [stepRate] - The distance between each point on the line. When set, `quantity` is implied and should be set to `0`.
 * @param {Phaser.Math.Vector2[]} [out] - An optional array of Vector2 objects to store the coordinates of the points on the line.
 *
 * @return {Phaser.Math.Vector2[]} An array of Vector2 objects containing the coordinates of the points on the line.
 */
export const GetPoints = (line: any, quantity: number, stepRate?: number, out?: Vector2[]): Vector2[] =>
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity && stepRate! > 0)
    {
        quantity = Length(line) / stepRate!;
    }

    const x1 = line.x1;
    const y1 = line.y1;

    const x2 = line.x2;
    const y2 = line.y2;

    for (let i = 0; i < quantity; i++)
    {
        const position = i / quantity;

        const x = x1 + (x2 - x1) * position;
        const y = y1 + (y2 - y1) * position;

        out.push(new Vector2(x, y));
    }

    return out;
};
