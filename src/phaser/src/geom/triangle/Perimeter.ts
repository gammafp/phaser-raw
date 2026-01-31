/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Length = require('../line/Length');

/**
 * Gets the length of the perimeter of the given triangle.
 * Calculated by adding together the length of each of the three sides.
 *
 * @function Phaser.Geom.Triangle.Perimeter
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get the length from.
 *
 * @return {number} The length of the Triangle.
 */
export const Perimeter = (triangle: any): number =>
{
    const line1 = triangle.getLineA();
    const line2 = triangle.getLineB();
    const line3 = triangle.getLineC();

    return (Length(line1) + Length(line2) + Length(line3));
};
