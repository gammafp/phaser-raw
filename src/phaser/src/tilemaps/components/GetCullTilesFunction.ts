/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ORIENTATION_CONST as CONST } from '../const/ORIENTATION_CONST';

import { CullTiles } from './CullTiles';
import { HexagonalCullTiles } from './HexagonalCullTiles';
import { IsometricCullTiles } from './IsometricCullTiles';
import { NOOP } from '../../utils/NOOP';
import { StaggeredCullTiles } from './StaggeredCullTiles';

/**
 * Gets the correct function to use to cull tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetCullTilesFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to cull tiles for the given map type.
 */
export const GetCullTilesFunction = (orientation: number): Function => {
    if (orientation === CONST.ORTHOGONAL)
    {
        return CullTiles;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalCullTiles;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredCullTiles;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return IsometricCullTiles;
    }
    else
    {
        return NOOP;
    }
};
