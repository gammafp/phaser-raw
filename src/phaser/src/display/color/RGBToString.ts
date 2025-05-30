/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ComponentToHex } from './ComponentToHex';

/**
 * Converts the color values into an HTML compatible color string, prefixed with either `#` or `0x`.
 *
 * @function Phaser.Display.Color.RGBToString
 * @since 3.0.0
 *
 * @param {number} r - The red color value. A number between 0 and 255.
 * @param {number} g - The green color value. A number between 0 and 255.
 * @param {number} b - The blue color value. A number between 0 and 255.
 * @param {number} [a=255] - The alpha value. A number between 0 and 255.
 * @param {string} [prefix=#] - The prefix of the string. Either `#` or `0x`.
 *
 * @return {string} A string-based representation of the color values.
 */
export const RGBToString = (
    r: number,
    g: number,
    b: number,
    a: number = 255,
    prefix: string = '#'
): string => {
    if (prefix === '#')
    {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
    }
    else
    {
        return '0x' + ComponentToHex(a) + ComponentToHex(r) + ComponentToHex(g) + ComponentToHex(b);
    }
}
