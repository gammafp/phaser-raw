/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Circular ease-in.
 *
 * @function Phaser.Math.Easing.Circular.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
export const In = (v: number): number =>
{
    return 1 - Math.sqrt(1 - v * v);
};
