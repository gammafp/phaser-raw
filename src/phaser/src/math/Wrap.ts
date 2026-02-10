/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Wrap the given `value` between `min` and `max`.
 *
 * @function Phaser.Math.Wrap
 * @since 3.0.0
 *
 * @param {number} value - The value to wrap.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 *
 * @return {number} The wrapped value.
 */
export const Wrap = (value: number, min: number, max: number): number =>
{
    const range = max - min;

    return (min + ((((value - min) % range) + range) % range));
};
