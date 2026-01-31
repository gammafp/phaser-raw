/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const EarCut = require('../polygon/Earcut');
const Triangle = require('./Triangle');

/**
 * Takes an array of vertex coordinates, and optionally an array of hole indices, then returns an array
 * of Triangle instances, where the given vertices have been decomposed into a series of triangles.
 *
 * @function Phaser.Geom.Triangle.BuildFromPolygon
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle[]} O - [out,$return]
 *
 * @param {array} data - A flat array of vertex coordinates like [x0,y0, x1,y1, x2,y2, ...]
 * @param {array} [holes=null] - An array of hole indices if any (e.g. [5, 8] for a 12-vertex input would mean one hole with vertices 5–7 and another with 8–11).
 * @param {number} [scaleX=1] - Horizontal scale factor to multiply the resulting points by.
 * @param {number} [scaleY=1] - Vertical scale factor to multiply the resulting points by.
 * @param {(array|Phaser.Geom.Triangle[])} [out] - An array to store the resulting Triangle instances in. If not provided, a new array is created.
 *
 * @return {(array|Phaser.Geom.Triangle[])} An array of Triangle instances, where each triangle is based on the decomposed vertices data.
 */
export const BuildFromPolygon = (data: number[], holes: number[] | null = null, scaleX: number = 1, scaleY: number = 1, out?: any[]): any[] =>
{
    if (out === undefined) { out = []; }

    const tris = EarCut(data, holes);

    let a: number;
    let b: number;
    let c: number;

    let x1: number;
    let y1: number;

    let x2: number;
    let y2: number;

    let x3: number;
    let y3: number;

    for (let i = 0; i < tris.length; i += 3)
    {
        a = tris[i];
        b = tris[i + 1];
        c = tris[i + 2];

        x1 = data[a * 2] * scaleX;
        y1 = data[(a * 2) + 1] * scaleY;

        x2 = data[b * 2] * scaleX;
        y2 = data[(b * 2) + 1] * scaleY;

        x3 = data[c * 2] * scaleX;
        y3 = data[(c * 2) + 1] * scaleY;

        out.push(new Triangle(x1, y1, x2, y2, x3, y3));
    }

    return out;
};
