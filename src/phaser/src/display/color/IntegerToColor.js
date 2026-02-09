/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Color = require('./Color');
var IntegerToRGB = require('./IntegerToRGB');

/**
 * Converts the given color value into an instance of a Color object.
 *
 * @function Phaser.Display.Color.IntegerToColor
 * @since 3.0.0
 *
 * @param {number} input - The color value to convert into a Color object.
 * @param {Phaser.Display.Color} [color] - The color where the new color will be stored. If not defined, a new color object is returned.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
var IntegerToColor = function (input, color)
{
    var rgb = IntegerToRGB(input);

    if (!color) { return new Color(rgb.r, rgb.g, rgb.b, rgb.a); }

    return color.setTo(rgb.r, rgb.g, rgb.b, rgb.a);
};

module.exports = IntegerToColor;
