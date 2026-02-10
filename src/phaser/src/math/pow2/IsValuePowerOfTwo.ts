/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Tests the value and returns `true` if it is a power of two.
 *
 * @function Phaser.Math.Pow2.IsValue
 * @since 3.0.0
 *
 * @param {number} value - The value to check if it's a power of two.
 *
 * @return {boolean} Returns `true` if `value` is a power of two, otherwise `false`.
 */
export const IsValuePowerOfTwo = (value: number): boolean =>
{
    return (value > 0 && (value & (value - 1)) === 0);
};
