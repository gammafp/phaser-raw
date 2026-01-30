/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { QuickSet as AlignIn } from '../display/align/in/QuickSet';
import { NOOP } from '../utils/NOOP';

// TODO: Convert this
var CONST = require('../display/align/const');
var GetFastValue = require('../utils/object/GetFastValue');
var Zone = require('../gameobjects/zone/Zone');
//

const tempZone = new Zone({ sys: { queueDepthSort: NOOP, events: { once: NOOP } } }, 0, 0, 1, 1).setOrigin(0, 0);

/**
 * Takes an array of Game Objects, or any objects that have public `x` and `y` properties,
 * and then aligns them based on the grid configuration given to this action.
 *
 * @function Phaser.Actions.GridAlign
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {Phaser.Types.Actions.GridAlignConfig} options - The GridAlign Configuration object.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
export const GridAlign = <G extends any[]>(
    items: G,
    options: Record<string, any> = {}
): G =>
{
    const widthSet = options.hasOwnProperty('width');
    const heightSet = options.hasOwnProperty('height');

    const width = GetFastValue(options, 'width', -1);
    const height = GetFastValue(options, 'height', -1);

    const cellWidth = GetFastValue(options, 'cellWidth', 1);
    const cellHeight = GetFastValue(options, 'cellHeight', cellWidth);

    const position = GetFastValue(options, 'position', CONST.TOP_LEFT);
    const x = GetFastValue(options, 'x', 0);
    const y = GetFastValue(options, 'y', 0);

    let cx = 0;
    let cy = 0;
    const w = (width * cellWidth);
    const h = (height * cellHeight);

    tempZone.setPosition(x, y);
    tempZone.setSize(cellWidth, cellHeight);

    for (let i = 0; i < items.length; i++)
    {
        AlignIn(items[i], tempZone, position);

        if (widthSet && width === -1)
        {
            //  We keep laying them out horizontally until we've done them all
            tempZone.x += cellWidth;
        }
        else if (heightSet && height === -1)
        {
            //  We keep laying them out vertically until we've done them all
            tempZone.y += cellHeight;
        }
        else if (heightSet && !widthSet)
        {
            //  We keep laying them out until we hit the column limit
            cy += cellHeight;
            tempZone.y += cellHeight;

            if (cy === h)
            {
                cy = 0;
                cx += cellWidth;
                tempZone.y = y;
                tempZone.x += cellWidth;

                if (cx === w)
                {
                    //  We've hit the column limit, so return, even if there are items left
                    break;
                }
            }
        }
        else
        {
            //  We keep laying them out until we hit the column limit
            cx += cellWidth;
            tempZone.x += cellWidth;

            if (cx === w)
            {
                cx = 0;
                cy += cellHeight;
                tempZone.x = x;
                tempZone.y += cellHeight;

                if (cy === h)
                {
                    //  We've hit the column limit, so return, even if there are items left
                    break;
                }
            }
        }
    }

    return items;
};
