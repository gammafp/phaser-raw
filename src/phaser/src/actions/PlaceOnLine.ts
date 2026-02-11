/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetPoints } from '../geom/line/GetPoints';
import { GetEasedPoints } from '../geom/line/GetEasedPoints';

/**
 * Positions an array of Game Objects on evenly spaced points of a Line.
 * If the ease parameter is supplied, it will space the points based on that easing function along the line.
 *
 * @function Phaser.Actions.PlaceOnLine
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Line} line - The Line to position the Game Objects on.
 * @param {(string|function)} [ease] - An optional ease to use. This can be either a string from the EaseMap, or a custom function.
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
export const PlaceOnLine = <G extends any[]>(
    items: G,
    line: any,
    ease?: string | Function
): G =>
{
    let points: any[];

    if (ease)
    {
        points = GetEasedPoints(line, ease, items.length);
    }
    else
    {
        points = GetPoints(line, items.length);
    }

    for (let i = 0; i < items.length; i++)
    {
        const item = items[i];
        const point = points[i];

        item.x = point.x;
        item.y = point.y;
    }

    return items;
};
