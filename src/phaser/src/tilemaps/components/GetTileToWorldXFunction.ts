/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ORIENTATION_CONST as CONST } from '../const/ORIENTATION_CONST';

import { NOOP } from '../../utils/NOOP';
import { TileToWorldX } from './TileToWorldX';

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetTileToWorldXFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
export const GetTileToWorldXFunction = (orientation: number): Function => {
    if (orientation === CONST.ORTHOGONAL)
    {
        return TileToWorldX;
    }
    else
    {
        return NOOP;
    }
};
