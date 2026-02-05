/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { OverlapRect } from './OverlapRect';
import { Circle } from '../../../geom/circle/Circle';
import { CircleToCircle } from '../../../geom/intersects/CircleToCircle';
import { CircleToRectangle } from '../../../geom/intersects/CircleToRectangle';

export const OverlapCirc = (world: any, x: number, y: number, radius: number, includeDynamic?: boolean, includeStatic?: boolean): any[] =>
{
    var bodiesInRect = OverlapRect(world, x - radius, y - radius, 2 * radius, 2 * radius, includeDynamic, includeStatic);

    if (bodiesInRect.length === 0)
    {
        return bodiesInRect;
    }

    var area = new Circle(x, y, radius);
    var circFromBody = new Circle();
    var bodiesInArea = [];

    for (var i = 0; i < bodiesInRect.length; i++)
    {
        var body = bodiesInRect[i];

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
