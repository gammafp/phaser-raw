/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ORIENTATION_CONST as CONST } from '../const/ORIENTATION_CONST';

import { HexagonalGetTileCorners } from './HexagonalGetTileCorners';
import { NOOP } from '../../utils/NOOP';
import { GetTileCorners } from './GetTileCorners';

/**
 * Gets the correct function to use to get the tile corners, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetTileCornersFunction
 * @since 3.60.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
export const GetTileCornersFunction = (orientation: number): Function => {
    if (orientation === CONST.ORTHOGONAL)
    {
        return GetTileCorners;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return NOOP;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalGetTileCorners;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return NOOP;
    }
    else
    {
        return NOOP;
    }
};
