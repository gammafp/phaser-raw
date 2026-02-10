/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RotateAroundXY } from './RotateAroundXY';

/**
 * Rotates a Triangle at a certain angle about a given Point or object with public `x` and `y` properties.
 *
 * @function Phaser.Geom.Triangle.RotateAroundPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to rotate.
 * @param {Phaser.Geom.Point} point - The Point to rotate the Triangle about.
 * @param {number} angle - The angle by which to rotate the Triangle, in radians.
 *
 * @return {Phaser.Geom.Triangle} The rotated Triangle.
 */
export const RotateAroundPoint = <T extends any>(triangle: T, point: { x: number; y: number }, angle: number): T =>
{
    return RotateAroundXY(triangle, point.x, point.y, angle);
};
