/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RoundAwayFromZero } from '../../math/RoundAwayFromZero';

/**
 * Create an array of numbers (positive and/or negative) progressing from `start`
 * up to but not including `end` by advancing by `step`.
 *
 * If `start` is less than `end` a zero-length range is created unless a negative `step` is specified.
 *
 * Certain values for `start` and `end` (eg. NaN/undefined/null) are currently coerced to 0;
 * for forward compatibility make sure to pass in actual numbers.
 *
 * @example
 * NumberArrayStep(4);
 * // => [0, 1, 2, 3]
 *
 * NumberArrayStep(1, 5);
 * // => [1, 2, 3, 4]
 *
 * NumberArrayStep(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * NumberArrayStep(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * NumberArrayStep(1, 4, 0);
 * // => [1, 1, 1]
 *
 * NumberArrayStep(0);
 * // => []
 *
 * @function Phaser.Utils.Array.NumberArrayStep
 * @since 3.0.0
 *
 * @param {number} [start=0] - The start of the range.
 * @param {number} [end=null] - The end of the range.
 * @param {number} [step=1] - The value to increment or decrement by.
 *
 * @return {number[]} The array of number values.
 */
export const NumberArrayStep = (start: number = 0, end: number | null = null, step: number = 1): number[] =>
{
    if (end === null)
    {
        end = start;
        start = 0;
    }

    const result: number[] = [];

    const total = Math.max(RoundAwayFromZero((end - start) / (step || 1)), 0);

    for (let i = 0; i < total; i++)
    {
        result.push(start);
        start += step;
    }

    return result;
};
