/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Color } from './Color';

/**
 * Converts a CSS 'web' string into a Phaser Color object.
 * 
 * The web string can be in the format `'rgb(r,g,b)'` or `'rgba(r,g,b,a)'` where r/g/b are in the range [0..255] and a is in the range [0..1].
 *
 * @function Phaser.Display.Color.RGBStringToColor
 * @since 3.0.0
 *
 * @param {string} rgb - The CSS format color string, using the `rgb` or `rgba` format.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
export const RGBStringToColor = (rgb: string): Color => {
    const color = new Color();

    const result = (/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/).exec(rgb.toLowerCase());

    if (result)
    {
        const r = parseInt(result[1], 10);
        const g = parseInt(result[2], 10);
        const b = parseInt(result[3], 10);
        const a = (result[4] !== undefined) ? parseFloat(result[4]) : 1;

        color.setTo(r, g, b, a * 255);
    }

    return color;
};
