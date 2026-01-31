/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Contains } from './Contains';

/**
 * Check to see if the Ellipse contains the given Point object.
 *
 * @function Phaser.Geom.Ellipse.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to check.
 * @param {(Phaser.Geom.Point|object)} point - The Point object to check if it's within the Circle or not.
 *
 * @return {boolean} True if the Point coordinates are within the circle, otherwise false.
 */
export const ContainsPoint = (ellipse: any, point: { x: number; y: number }): boolean =>
{
    return Contains(ellipse, point.x, point.y);
};
