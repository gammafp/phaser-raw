/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RotateAroundXY } from './RotateAroundXY';

/**
 * Rotate a line around its midpoint by the given angle in radians.
 *
 * @function Phaser.Geom.Line.Rotate
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to rotate.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Geom.Line} The rotated line.
 */
export const Rotate = <T extends any>(line: T, angle: number): T =>
{
    const x = (line.x1 + line.x2) / 2;
    const y = (line.y1 + line.y2) / 2;

    return RotateAroundXY(line, x, y, angle);
};
