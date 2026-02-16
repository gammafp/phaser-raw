/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Circle } from '../../../geom/circle/Circle';
import { CircleToCircle } from '../../../geom/intersects/CircleToCircle';
import { CircleToRectangle } from '../../../geom/intersects/CircleToRectangle';
import { OverlapRect } from './OverlapRect';

/**
 * This method will search the given circular area and return an array of all physics bodies that
 * overlap with it. It can return either Dynamic, Static bodies or a mixture of both.
 *
 * A body only has to intersect with the search area to be considered, it doesn't have to be fully
 * contained within it.
 *
 * If Arcade Physics is set to use the RTree (which it is by default) then the search is rather fast,
 * otherwise the search is O(N) for Dynamic Bodies.
 */
export const OverlapCirc = function (world: any, x: number, y: number, radius: number, includeDynamic?: boolean, includeStatic?: boolean): any[]
{
    const bodiesInRect = OverlapRect(world, x - radius, y - radius, 2 * radius, 2 * radius, includeDynamic, includeStatic);

    if (bodiesInRect.length === 0)
    {
        return bodiesInRect;
    }

    const area = new Circle(x, y, radius);
    const circFromBody = new Circle();
    const bodiesInArea: any[] = [];

    for (let i = 0; i < bodiesInRect.length; i++)
    {
        const body = bodiesInRect[i];

        if (body.isCircle)
        {
            circFromBody.setTo(body.center.x, body.center.y, body.halfWidth);

            if (CircleToCircle(area, circFromBody))
            {
                bodiesInArea.push(body);
            }
        }
        else if (CircleToRectangle(area, body))
        {
            bodiesInArea.push(body);
        }
    }

    return bodiesInArea;
};
