/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Contains } from './Contains';

/**
 * Checks the given Point again the Polygon to see if the Point lays within its vertices.
 *
 * @function Phaser.Geom.Polygon.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to check.
 * @param {Phaser.Geom.Point} point - The Point to check if it's within the Polygon.
 *
 * @return {boolean} `true` if the Point is within the Polygon, otherwise `false`.
 */
export const ContainsPoint = (polygon: any, point: { x: number; y: number }): boolean =>
{
    return Contains(polygon, point.x, point.y);
};
