/**
 * @author       samme
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the snake distance between two sets of coordinates (points).
 *
 * Snake distance (rectilinear distance, Manhattan distance) is the sum of the horizontal and vertical distances.
 * It's the effective distance when movement is allowed only horizontally or vertically (but not both).
 *
 * @function Phaser.Math.Distance.Snake
 * @since 3.22.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point.
 */
export const DistanceSnake = (x1: number, y1: number, x2: number, y2: number): number =>
{
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};
