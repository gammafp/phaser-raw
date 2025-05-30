/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { HSVToRGB } from './HSVToRGB';

/**
 * Generates an HSV color wheel which is an array of 360 Color objects, for each step of the wheel.
 *
 * @function Phaser.Display.Color.HSVColorWheel
 * @since 3.0.0
 *
 * @param {number} [s=1] - The saturation, in the range 0 - 1.
 * @param {number} [v=1] - The value, in the range 0 - 1.
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array containing 360 ColorObject elements, where each element contains a Color object corresponding to the color at that point in the HSV color wheel.
 */
export const HSVColorWheel = (s: number = 1, v: number = 1): Phaser.Types.Display.ColorObject[] => {
    const colors: Phaser.Types.Display.ColorObject[] = [];

    for (let c = 0; c <= 359; c++)
    {
        colors.push(HSVToRGB(c / 359, s, v));
    }

    return colors;
};
