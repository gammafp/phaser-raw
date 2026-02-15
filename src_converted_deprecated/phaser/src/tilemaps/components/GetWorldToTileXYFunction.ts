/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import * as CONST from '../const/ORIENTATION_CONST';
import { HexagonalWorldToTileXY } from './HexagonalWorldToTileXY';
import { IsometricWorldToTileXY } from './IsometricWorldToTileXY';
import { StaggeredWorldToTileXY } from './StaggeredWorldToTileXY';
import { WorldToTileXY } from './WorldToTileXY';

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetWorldToTileXYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
export const GetWorldToTileXYFunction = (orientation): any =>
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return WorldToTileXY;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return IsometricWorldToTileXY;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalWorldToTileXY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredWorldToTileXY;
    }
    else
    {
        return NOOP;
    }
};



