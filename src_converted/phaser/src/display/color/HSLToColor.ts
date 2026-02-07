/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Color } from './Color';
import { HueToComponent } from './HueToComponent';

/**
 * Converts HSL (hue, saturation and lightness) values to a Phaser Color object.
 *
 * @function Phaser.Display.Color.HSLToColor
 * @since 3.0.0
 *
 * @param {number} h - The hue value in the range 0 to 1.
 * @param {number} s - The saturation value in the range 0 to 1.
 * @param {number} l - The lightness value in the range 0 to 1.
 *
 * @return {Phaser.Display.Color} A Color object created from the results of the h, s and l values.
 */
export const HSLToColor = (h: number, s: number, l: number): Color =>
{
    // achromatic by default
    let r = l;
    let g = l;
    let b = l;

    if (s !== 0)
    {
        const q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = HueToComponent(p, q, h + 1 / 3);
        g = HueToComponent(p, q, h);
        b = HueToComponent(p, q, h - 1 / 3);
    }

    const color = new Color();

    return color.setGLTo(r, g, b, 1);
}
