/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { LineToLine } from './LineToLine';
import { LineToRectangle } from './LineToRectangle';

const Point = require('../point/Point');

/**
 * Checks for intersection between the Line and a Rectangle shape,
 * and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetLineToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The Line to check for intersection.
 * @param {(Phaser.Geom.Rectangle|object)} rect - The Rectangle to check for intersection.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
export const GetLineToRectangle = (line: any, rect: any, out?: any[]): any[] =>
{
    if (out === undefined) { out = []; }

    if (LineToRectangle(line, rect))
    {
        const lineA = rect.getLineA();
        const lineB = rect.getLineB();
        const lineC = rect.getLineC();
        const lineD = rect.getLineD();

        const output = [ new Point(), new Point(), new Point(), new Point() ];

        const result = [
            LineToLine(lineA, line, output[0]),
            LineToLine(lineB, line, output[1]),
            LineToLine(lineC, line, output[2]),
            LineToLine(lineD, line, output[3])
        ];

        for (let i = 0; i < 4; i++)
        {
            if (result[i]) { out.push(output[i]); }
        }
    }

    return out;
};
