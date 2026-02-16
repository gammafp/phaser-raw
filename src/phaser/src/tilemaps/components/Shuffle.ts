/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Shuffle as ShuffleArray } from '../../utils/array/Shuffle';
import { GetTilesWithin } from './GetTilesWithin';
import type { LayerData } from '../typedefs';

/**
 * Shuffles the tiles in a rectangular region (specified in tile coordinates) within the given
 * layer. It will only randomize the tiles in that area, so if they're all the same nothing will
 * appear to have changed! This method only modifies tile indexes and does not change collision
 * information.
 *
 * @function Phaser.Tilemaps.Components.Shuffle
 * @since 3.0.0
 *
 * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
 * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
 * @param {Phaser.Tilemaps.LayerData} [layer] - The Tilemap Layer to act upon.
 */
export const Shuffle = (tileX?: number, tileY?: number, width?: number, height?: number, layer?: LayerData): void => {
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    var indexes = tiles.map(function (tile: any) { return tile.index; });

    ShuffleArray(indexes);

    for (var i = 0; i < tiles.length; i++)
    {
        tiles[i].index = indexes[i];
    }
};
