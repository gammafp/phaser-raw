/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { PointToLine } from './PointToLine';

/**
 * Checks if a Point is located on the given line segment.
 *
 * @function Phaser.Geom.Intersects.PointToLineSegment
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - The Point to check for intersection.
 * @param {Phaser.Geom.Line} line - The line segment to check for intersection.
 *
 * @return {boolean} `true` if the Point is on the given line segment, otherwise `false`.
 */
export const PointToLineSegment = (point: any, line: any): boolean =>
{
    if (!PointToLine(point, line))
    {
        return false;
    }

    const xMin = Math.min(line.x1, line.x2);
    const xMax = Math.max(line.x1, line.x2);
    const yMin = Math.min(line.y1, line.y2);
    const yMax = Math.max(line.y1, line.y2);

    return ((point.x >= xMin && point.x <= xMax) && (point.y >= yMin && point.y <= yMax));
};
