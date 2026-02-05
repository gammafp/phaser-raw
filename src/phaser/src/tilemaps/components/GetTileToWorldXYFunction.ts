/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import * as CONST from '../const/ORIENTATION_CONST';
import { HexagonalTileToWorldXY } from './HexagonalTileToWorldXY';
import { IsometricTileToWorldXY } from './IsometricTileToWorldXY';
import { StaggeredTileToWorldXY } from './StaggeredTileToWorldXY';
import { TileToWorldXY } from './TileToWorldXY';

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetTileToWorldXYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
export const GetTileToWorldXYFunction = (orientation): any =>
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return TileToWorldXY;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return IsometricTileToWorldXY;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalTileToWorldXY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredTileToWorldXY;
    }
    else
    {
        return NOOP;
    }
};



