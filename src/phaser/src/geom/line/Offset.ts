/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Offset a line by the given amount.
 *
 * @function Phaser.Geom.Line.Offset
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to offset.
 * @param {number} x - The horizontal offset to add to the line.
 * @param {number} y - The vertical offset to add to the line.
 *
 * @return {Phaser.Geom.Line} The offset line.
 */
export const Offset = <T extends any>(line: T, x: number, y: number): T =>
{
    line.x1 += x;
    line.y1 += y;

    line.x2 += x;
    line.y2 += y;

    return line;
};
