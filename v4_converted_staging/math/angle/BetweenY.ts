/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Find the angle of a segment from (x1, y1) -> (x2, y2).
 *
 * The difference between this method and {@link Phaser.Math.Angle.Between} is that this assumes the y coordinate
 * travels down the screen.
 *
 * @function Phaser.Math.Angle.BetweenY
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The angle in radians.
 */
export const BetweenY = (x1: number, y1: number, x2: number, y2: number): number =>
{
    return Math.atan2(x2 - x1, y2 - y1);
};
