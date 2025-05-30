/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts the given color value into an Object containing r,g,b and a properties.
 *
 * @function Phaser.Display.Color.ColorToRGBA
 * @since 3.0.0
 *
 * @param {number} color - A color value, optionally including the alpha value.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the parsed color values.
 */
export const ColorToRGBA = (color: number) =>
{
    const output = {
        r: color >> 16 & 0xFF,
        g: color >> 8 & 0xFF,
        b: color & 0xFF,
        a: 255
    };

    if (color > 16777215)
    {
        output.a = color >>> 24;
    }

    return output;
}
