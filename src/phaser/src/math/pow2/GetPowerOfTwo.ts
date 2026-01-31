/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the nearest power of 2 to the given `value`.
 *
 * @function Phaser.Math.Pow2.GetNext
 * @since 3.0.0
 *
 * @param {number} value - The value.
 *
 * @return {number} The nearest power of 2 to `value`.
 */
export const GetPowerOfTwo = (value: number): number =>
{
    const index = Math.log(value) / 0.6931471805599453;

    return (1 << Math.ceil(index));
};
