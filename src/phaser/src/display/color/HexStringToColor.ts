/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Color } from './Color';

/**
 * Converts a hex string into a Phaser Color object.
 * 
 * The hex string can supplied as `'#0033ff'` or the short-hand format of `'#03f'`; it can begin with an optional "#" or "0x", or be unprefixed.
 *
 * An alpha channel is _not_ supported.
 *
 * @function Phaser.Display.Color.HexStringToColor
 * @since 3.0.0
 *
 * @param {string} hex - The hex color value to convert, such as `#0033ff` or the short-hand format: `#03f`.
 *
 * @return {Phaser.Display.Color} A Color object populated by the values of the given string.
 */
export const HexStringToColor = (hex: string): Color =>
{
    const color = new Color();

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    hex = hex.replace(/^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i, (_m: string, r: string, g: string, b: string) => {
        return r + r + g + g + b + b;
    });

    const result = (/^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

    if (result)
    {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);

        color.setTo(r, g, b);
    }

    return color;
}
