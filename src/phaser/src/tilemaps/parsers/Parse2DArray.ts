/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Tile } from '../Tile';

import { Formats } from '../Formats';
import { LayerData } from '../mapdata/LayerData';
import { MapData } from '../mapdata/MapData';


/**
 * Parses a 2D array of tile indexes into a new MapData object with a single layer.
 *
 * @function Phaser.Tilemaps.Parsers.Parse2DArray
 * @since 3.0.0
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {number[][]} data - 2D array, CSV string or Tiled JSON object.
 * @param {number} tileWidth - The width of a tile in pixels.
 * @param {number} tileHeight - The height of a tile in pixels.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 *
 * @return {Phaser.Tilemaps.MapData} The MapData object.
 */
export const Parse2DArray = (name: string, data: number[][], tileWidth: number, tileHeight: number, insertNull?: boolean): MapData =>
{
    const layerData = new LayerData({
        tileWidth: tileWidth,
        tileHeight: tileHeight
    });

    const mapData = new MapData({
        name: name,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        format: Formats.ARRAY_2D,
        layers: [ layerData ]
    });

    const tiles: any[] = [];
    const height = data.length;
    let width = 0;

    for (let y = 0; y < data.length; y++)
    {
        tiles[y] = [];
        const row = data[y];

        for (let x = 0; x < row.length; x++)
        {
            const tileIndex = parseInt(String(row[x]), 10);

            if (isNaN(tileIndex) || tileIndex === -1)
            {
                tiles[y][x] = insertNull
                    ? null
                    : new Tile(layerData, -1, x, y, tileWidth, tileHeight);
            }
            else
            {
                tiles[y][x] = new Tile(layerData, tileIndex, x, y, tileWidth, tileHeight);
            }
        }

        if (width === 0)
        {
            width = row.length;
        }
    }

    mapData.width = layerData.width = width;
    mapData.height = layerData.height = height;
    mapData.widthInPixels = layerData.widthInPixels = width * tileWidth;
    mapData.heightInPixels = layerData.heightInPixels = height * tileHeight;
    layerData.data = tiles;

    return mapData;
};
