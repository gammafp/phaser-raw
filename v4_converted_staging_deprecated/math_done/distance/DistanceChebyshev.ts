/**
 * @author       samme
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the Chebyshev distance between two sets of coordinates (points).
 *
 * Chebyshev distance (or chessboard distance) is the maximum of the horizontal and vertical distances.
 * It's the effective distance when movement can be horizontal, vertical, or diagonal.
 *
 * @function Phaser.Math.Distance.Chebyshev
 * @since 3.22.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point.
 */
export const DistanceChebyshev = (x1: number, y1: number, x2: number, y2: number): number =>
{
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
};
