/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the mean average of the given values.
 *
 * @function Phaser.Math.Average
 * @since 3.0.0
 *
 * @param {number[]} values - The values to average.
 *
 * @return {number} The average value.
 */
export const Average = (values: number[]): number =>
{
    let sum = 0;

    for (let i = 0; i < values.length; i++)
    {
        sum += (+values[i]);
    }

    return sum / values.length;
};
