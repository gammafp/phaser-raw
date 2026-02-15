/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates a linear (interpolation) value over t.
 *
 * @function Phaser.Math.Linear
 * @since 3.0.0
 *
 * @param {number} p0 - The first point.
 * @param {number} p1 - The second point.
 * @param {number} t - The percentage between p0 and p1 to return, represented as a number between 0 and 1.
 *
 * @return {number} The step t% of the way between p0 and p1.
 */
export const Linear = (p0: number, p1: number, t: number): number =>
{
    return (p1 - p0) * t + p0;
};
