/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Linear = require('../../math/Linear');
import type { Color } from './Color';
import { GetColor } from './GetColor';

/**
 * @namespace Phaser.Display.Color.Interpolate
 * @memberof Phaser.Display.Color
 * @since 3.0.0
 */

/**
 * Interpolates between the two given color ranges over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.RGBWithRGB
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {number} r1 - Red value.
 * @param {number} g1 - Blue value.
 * @param {number} b1 - Green value.
 * @param {number} r2 - Red value.
 * @param {number} g2 - Blue value.
 * @param {number} b2 - Green value.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
export const RGBWithRGB = (
    r1: number,
    g1: number,
    b1: number,
    r2: number,
    g2: number,
    b2: number,
    length: number = 100,
    index: number = 0
): Phaser.Types.Display.ColorObject =>
{
    const t = index / length;
    const r = Linear(r1, r2, t);
    const g = Linear(g1, g2, t);
    const b = Linear(b1, b2, t);

    return {
        r: r,
        g: g,
        b: b,
        a: 255,
        color: GetColor(r, g, b)
    };
}

/**
 * Interpolates between the two given color objects over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.ColorWithColor
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {Phaser.Display.Color} color1 - The first Color object.
 * @param {Phaser.Display.Color} color2 - The second Color object.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
export const ColorWithColor = (
    color1: Color,
    color2: Color,
    length: number = 100,
    index: number = 0
): Phaser.Types.Display.ColorObject =>
{
    return RGBWithRGB(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b, length, index);
}

/**
 * Interpolates between the Color object and color values over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.ColorWithRGB
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {Phaser.Display.Color} color1 - The first Color object.
 * @param {number} r - Red value.
 * @param {number} g - Blue value.
 * @param {number} b - Green value.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
export const ColorWithRGB = (
    color: Color,
    r: number,
    g: number,
    b: number,
    length: number = 100,
    index: number = 0
): Phaser.Types.Display.ColorObject =>
{
    return RGBWithRGB(color.r, color.g, color.b, r, g, b, length, index);
}
