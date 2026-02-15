/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Centroid } from './Centroid';
import { Offset } from './Offset';

/**
 * @callback CenterFunction
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to return the center coordinates of.
 *
 * @return {Phaser.Math.Vector2} The center point of the Triangle according to the function.
 */

/**
 * Positions the Triangle so that it is centered on the given coordinates.
 *
 * @function Phaser.Geom.Triangle.CenterOn
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The triangle to be positioned.
 * @param {number} x - The horizontal coordinate to center on.
 * @param {number} y - The vertical coordinate to center on.
 * @param {CenterFunction} [centerFunc] - The function used to center the triangle. Defaults to Centroid centering.
 *
 * @return {Phaser.Geom.Triangle} The Triangle that was centered.
 */
export const CenterOn = <T extends any>(triangle: T, x: number, y: number, centerFunc?: any): T =>
{
    if (centerFunc === undefined) { centerFunc = Centroid; }

    //  Get the center of the triangle
    const center = centerFunc(triangle);

    //  Difference
    const diffX = x - center.x;
    const diffY = y - center.y;

    return Offset(triangle, diffX, diffY);
};
