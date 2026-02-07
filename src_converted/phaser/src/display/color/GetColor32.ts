/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Given an alpha and 3 color values this will return an integer representation of it.
 *
 * @function Phaser.Display.Color.GetColor32
 * @since 3.0.0
 *
 * @param {number} red - The red color value. A number between 0 and 255.
 * @param {number} green - The green color value. A number between 0 and 255.
 * @param {number} blue - The blue color value. A number between 0 and 255.
 * @param {number} alpha - The alpha color value. A number between 0 and 255.
 *
 * @return {number} The combined color value.
 */
export const GetColor32 = (red: number, green: number, blue: number, alpha: number): number =>
{
    return alpha << 24 | red << 16 | green << 8 | blue;
}
