/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DistanceBetweenPoints } from '../../math/distance/DistanceBetweenPoints';

// import { GetEaseFunction } from '../../tweens/builders/GetEaseFunction';
var GetEaseFunction = require('../../tweens/builders/GetEaseFunction');
import { Vector2 } from '../../math/Vector2';

/**
 * Returns an array of `quantity` Vector2 points where each point is taken from the given Line,
 * spaced out according to the ease function specified.
 * 
 * ```javascript
 * const line = new Phaser.Geom.Line(100, 300, 700, 300);
 * const points = Phaser.Geom.Line.GetEasedPoints(line, 'sine.out', 32)
 * ```
 * 
 * In the above example, the `points` array will contain 32 points spread-out across
 * the length of `line`, where the position of each point is determined by the `Sine.out`
 * ease function.
 * 
 * You can optionally provide a collinear threshold. In this case, the resulting points
 * are checked against each other, and if they are `< collinearThreshold` distance apart,
 * they are dropped from the results. This can help avoid lots of clustered points at
 * far ends of the line with tightly-packed eases such as Quartic. Leave the value set
 * to zero to skip this check.
 * 
 * Note that if you provide a collinear threshold, the resulting array may not always
 * contain `quantity` points.
 *
 * @function Phaser.Geom.Line.GetEasedPoints
 * @since 3.23.0
 *
 * @generic {Phaser.Math.Vector2[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The Line object.
 * @param {(string|function)} ease - The ease to use. This can be either a string from the EaseMap, or a custom function.
 * @param {number} quantity - The number of points to return. Note that if you provide a `collinearThreshold`, the resulting array may not always contain this number of points.
 * @param {number} [collinearThreshold=0] - An optional threshold. The final array is reduced so that each point is spaced out at least this distance apart. This helps reduce clustering in noisey eases.
 * @param {number[]} [easeParams] - An optional array of ease parameters to go with the ease.
 *
 * @return {Phaser.Math.Vector2[]} An array of Vector2 containing the coordinates of the points on the line.
 */
export const GetEasedPoints = (line: any, ease: string | Function, quantity: number, collinearThreshold: number = 0, easeParams: number[] = []): Vector2[] =>
{
    const results: Vector2[] = [];

    const x1 = line.x1;
    const y1 = line.y1;

    const spaceX = line.x2 - x1;
    const spaceY = line.y2 - y1;

    const easeFunc = GetEaseFunction(ease, easeParams);

    let i;
    let v;
    const q = quantity - 1;

    for (i = 0; i < q; i++)
    {
        v = easeFunc(i / q);

        results.push(new Vector2(x1 + (spaceX * v), y1 + (spaceY * v)));
    }

    //  Always include the end of the line
    v = easeFunc(1);

    results.push(new Vector2(x1 + (spaceX * v), y1 + (spaceY * v)));

    //  Remove collinear parts
    if (collinearThreshold > 0)
    {
        let prevPoint = results[0];

        //  Store the new results here
        const sortedResults = [ prevPoint ];

        for (i = 1; i < results.length - 1; i++)
        {
            const point = results[i];

            if (DistanceBetweenPoints(prevPoint, point) >= collinearThreshold)
            {
                sortedResults.push(point);
                prevPoint = point;
            }
        }

        //  Top and tail
        const endPoint = results[results.length - 1];

        if (DistanceBetweenPoints(prevPoint, endPoint) < collinearThreshold)
        {
            sortedResults.pop();
        }

        sortedResults.push(endPoint);

        return sortedResults;
    }
    else
    {
        return results;
    }
};
