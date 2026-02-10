/**
 * @author       samme
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the distance between two points.
 *
 * @function Phaser.Math.Distance.BetweenPoints
 * @since 3.22.0
 *
 * @param {Phaser.Types.Math.Vector2Like} a - The first point.
 * @param {Phaser.Types.Math.Vector2Like} b - The second point.
 *
 * @return {number} The distance between the points.
 */
export const DistanceBetweenPoints = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
{
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
};
