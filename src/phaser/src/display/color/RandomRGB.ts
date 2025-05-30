/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Between = require('../../math/Between');
import { Color } from './Color';

/**
 * Creates a new Color object where the r, g, and b values have been set to random values
 * based on the given min max values.
 *
 * @function Phaser.Display.Color.RandomRGB
 * @since 3.0.0
 *
 * @param {number} [min=0] - The minimum value to set the random range from (between 0 and 255)
 * @param {number} [max=255] - The maximum value to set the random range from (between 0 and 255)
 *
 * @return {Phaser.Display.Color} A Color object.
 */
export const RandomRGB = (min: number = 0, max: number = 255): Color => {
    return new Color(Between(min, max), Between(min, max), Between(min, max));
};
