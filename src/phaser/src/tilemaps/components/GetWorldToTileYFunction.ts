/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NULL } from '../../utils/NULL';

var CONST = require('../const/ORIENTATION_CONST');
import { StaggeredWorldToTileY } from './StaggeredWorldToTileY';
import { WorldToTileY } from './WorldToTileY';

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetWorldToTileYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
export const GetWorldToTileYFunction = (orientation): any =>
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return WorldToTileY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredWorldToTileY;
    }
    else
    {
        return NULL;
    }
};



