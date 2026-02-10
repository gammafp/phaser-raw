/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// import { GetColor } from '../../display/color/GetColor';
var GetColor = require('../../display/color/GetColor');

/**
 * Takes a Wavefront Material file and extracts the diffuse reflectivity of the named
 * materials, converts them to integer color values and returns them.
 *
 * This is used internally by the `addOBJ` and `addModel` methods, but is exposed for
 * public consumption as well.
 *
 * Note this only works with diffuse values, specified in the `Kd r g b` format, where
 * `g` and `b` are optional, but `r` is required. It does not support spectral rfl files,
 * or any other material statement (such as `Ka` or `Ks`)
 *
 * @method Phaser.Geom.Mesh.ParseObjMaterial
 * @since 3.50.0
 *
 * @param {string} mtl - The OBJ MTL file as a raw string, i.e. loaded via `this.load.text`.
 *
 * @return {object} The parsed material colors, where each property of the object matches the material name.
 */
export const ParseObjMaterial = (mtl: string): Record<string, number> =>
{
    const output: Record<string, number> = {};

    const lines = mtl.split('\n');

    let currentMaterial = '';

    for (let i = 0; i < lines.length; i++)
    {
        const line = lines[i].trim();

        if (line.indexOf('#') === 0 || line === '')
        {
            continue;
        }

        const lineItems = line.replace(/\s\s+/g, ' ').trim().split(' ');

        switch (lineItems[0].toLowerCase())
        {
            case 'newmtl':
            {
                currentMaterial = lineItems[1];
                break;
            }

            //  The diffuse reflectivity of the current material
            //  Support r, [g], [b] format, where g and b are optional
            case 'kd':
            {
                const r = Math.floor(lineItems[1] * 255);
                const g = (lineItems.length >= 2) ? Math.floor(lineItems[2] * 255) : r;
                const b = (lineItems.length >= 3) ? Math.floor(lineItems[3] * 255) : r;

                output[currentMaterial] = GetColor(r, g, b);

                break;
            }
        }
    }

    return output;
};
