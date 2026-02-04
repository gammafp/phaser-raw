/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const GameObjectFactory = require('../gameobjects/GameObjectFactory');
import { ParseToTilemap } from './ParseToTilemap';

/**
 * Creates a Tilemap from the given key or data, or creates a blank Tilemap if no key/data provided.
 * When loading from CSV or a 2D array, you should specify the tileWidth & tileHeight. When parsing
 * from a map from Tiled, the tileWidth, tileHeight, width & height will be pulled from the map
 * data. For an empty map, you should specify tileWidth, tileHeight, width & height.
 *
 * @method Phaser.GameObjects.GameObjectFactory#tilemap
 * @since 3.0.0
 *
 * @param {string} [key] - The key in the Phaser cache that corresponds to the loaded tilemap data.
 * @param {number} [tileWidth=32] - The width of a tile in pixels. Pass in `null` to leave as the
 * default.
 * @param {number} [tileHeight=32] - The height of a tile in pixels. Pass in `null` to leave as the
 * default.
 * @param {number} [width=10] - The width of the map in tiles. Pass in `null` to leave as the
 * default.
 * @param {number} [height=10] - The height of the map in tiles. Pass in `null` to leave as the
 * default.
 * @param {number[][]} [data] - Instead of loading from the cache, you can also load directly from
 * a 2D array of tile indexes. Pass in `null` for no data.
 * @param {boolean} [insertNull=false] - Controls how empty tiles, tiles with an index of -1, in the
 * map data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 *
 * @return {Phaser.Tilemaps.Tilemap}
 */
GameObjectFactory.register('tilemap', function (key?: any, tileWidth?: number, tileHeight?: number, width?: number, height?: number, data?: any, insertNull?: boolean)
{
    if (key === null) { key = undefined; }
    if (tileWidth === null) { tileWidth = undefined; }
    if (tileHeight === null) { tileHeight = undefined; }
    if (width === null) { width = undefined; }
    if (height === null) { height = undefined; }

    return ParseToTilemap(this.scene, key, tileWidth, tileHeight, width, height, data, insertNull);
});
