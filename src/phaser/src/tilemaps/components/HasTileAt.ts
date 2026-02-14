/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { IsInLayerBounds } from './IsInLayerBounds';
import type { LayerData } from '../typedefs';

/**
 * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
 * false if there is no tile or if the tile at that location has an index of -1.
 *
 * @function Phaser.Tilemaps.Components.HasTileAt
 * @since 3.0.0
 *
 * @param {number} tileX - X position to get the tile from (given in tile units, not pixels).
 * @param {number} tileY - Y position to get the tile from (given in tile units, not pixels).
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {?boolean} Returns a boolean, or null if the layer given was invalid.
 */
export const HasTileAt = (tileX: number, tileY: number, layer: LayerData): boolean => {
    if (IsInLayerBounds(tileX, tileY, layer))
    {
        var tile = layer.data[tileY][tileX];

        return (tile !== null && tile.index > -1);
    }
    else
    {
        return false;
    }
};
