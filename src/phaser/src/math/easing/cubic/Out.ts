/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Cubic ease-out.
 *
 * @function Phaser.Math.Easing.Cubic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
export const Out = (v: number): number =>
{
    return --v * v * v + 1;
};
