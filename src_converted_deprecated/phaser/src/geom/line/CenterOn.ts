/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


/**
 * Center a line on the given coordinates.
 *
 * @function Phaser.Geom.Line.CenterOn
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to center.
 * @param {number} x - The horizontal coordinate to center the line on.
 * @param {number} y - The vertical coordinate to center the line on.
 *
 * @return {Phaser.Geom.Line} The centered line.
 */
export const CenterOn = <T extends any>(line: T, x: number, y: number): T =>
{
    const tx = x - ((line.x1 + line.x2) / 2);
    const ty = y - ((line.y1 + line.y2) / 2);

    line.x1 += tx;
    line.y1 += ty;

    line.x2 += tx;
    line.y2 += ty;

    return line;
};
