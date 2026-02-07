/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { CenterOn } from './CenterOn';

/**
 * Increases the size of a Rectangle by a specified amount.
 *
 * The center of the Rectangle stays the same. The amounts are added to each side, so the actual increase in width or height is two times bigger than the respective argument.
 *
 * @function Phaser.Geom.Rectangle.Inflate
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to inflate.
 * @param {number} x - How many pixels the left and the right side should be moved by horizontally.
 * @param {number} y - How many pixels the top and the bottom side should be moved by vertically.
 *
 * @return {Phaser.Geom.Rectangle} The inflated Rectangle.
 */
export const Inflate = <T extends any>(rect: T, x: number, y: number): T =>
{
    const cx = rect.centerX;
    const cy = rect.centerY;

    rect.setSize(rect.width + (x * 2), rect.height + (y * 2));

    return CenterOn(rect, cx, cy);
};
