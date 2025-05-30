/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetColor } from './GetColor';

/**
 * Return an array of Colors in a Color Spectrum.
 *
 * The spectrum colors flow in the order: red, yellow, green, blue.
 *
 * By default this function will return an array with 1024 elements in.
 *
 * However, you can reduce this to a smaller quantity if needed, by specitying the `limit` parameter.
 *
 * @function Phaser.Display.Color.ColorSpectrum
 * @since 3.50.0
 *
 * @param {number} [limit=1024] - How many colors should be returned? The maximum is 1024 but you can set a smaller quantity if required.
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array containing `limit` parameter number of elements, where each contains a Color Object.
 */
export const ColorSpectrum = (limit: number = 1024) =>
{
    const colors = [];

    const range = 255;

    let i;
    let r = 255;
    let g = 0;
    let b = 0;

    //  Red to Yellow
    for (i = 0; i <= range; i++)
    {
        colors.push({ r: r, g: i, b: b, color: GetColor(r, i, b) });
    }

    g = 255;

    //  Yellow to Green
    for (i = range; i >= 0; i--)
    {
        colors.push({ r: i, g: g, b: b, color: GetColor(i, g, b) });
    }

    r = 0;

    //  Green to Blue
    for (i = 0; i <= range; i++, g--)
    {
        colors.push({ r: r, g: g, b: i, color: GetColor(r, g, i) });
    }

    g = 0;
    b = 255;

    //  Blue to Red
    for (i = 0; i <= range; i++, b--, r++)
    {
        colors.push({ r: r, g: g, b: b, color: GetColor(r, g, b) });
    }

    if (limit === 1024)
    {
        return colors;
    }
    else
    {
        const out = [];

        let t = 0;
        const inc = 1024 / limit;

        for (i = 0; i < limit; i++)
        {
            out.push(colors[Math.floor(t)]);

            t += inc;
        }

        return out;
    }
}
