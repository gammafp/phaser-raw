/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Polygon } from './Polygon';

/**
 * Create a new polygon which is a copy of the specified polygon
 *
 * @function Phaser.Geom.Polygon.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon to create a clone of
 *
 * @return {Phaser.Geom.Polygon} A new separate Polygon cloned from the specified polygon, based on the same points.
 */
export const Clone = (polygon: any): any =>
{
    return new Polygon(polygon.points);
};
