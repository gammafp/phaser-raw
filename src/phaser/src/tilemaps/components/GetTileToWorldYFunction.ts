/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import * as CONST from '../const/ORIENTATION_CONST';
import { StaggeredTileToWorldY } from './StaggeredTileToWorldY';
import { TileToWorldY } from './TileToWorldY';

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetTileToWorldYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
export const GetTileToWorldYFunction = (orientation): any =>
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return TileToWorldY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredTileToWorldY;
    }
    else
    {
        return NOOP;
    }
};



