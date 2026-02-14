/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { LayerData } from '../../mapdata/LayerData';
import { Tile } from '../../Tile';

/**
 * Parses all tilemap layers in an Impact JSON object into new LayerData objects.
 *
 * @function Phaser.Tilemaps.Parsers.Impact.ParseTileLayers
 * @since 3.0.0
 *
 * @param {object} json - The Impact JSON object.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled (see {@link Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled}).
 *
 * @return {Phaser.Tilemaps.LayerData[]} - An array of LayerData objects, one for each entry in
 * json.layers with the type 'tilelayer'.
 */
export const ParseTileLayers = (json: any, insertNull: boolean): any[] =>
{
    const tileLayers: any[] = [];

    for (let i = 0; i < json.layer.length; i++)
    {
        const layer = json.layer[i];

        const layerData = new LayerData({
            name: layer.name,
            width: layer.width,
            height: layer.height,
            tileWidth: layer.tilesize,
            tileHeight: layer.tilesize,
            visible: layer.visible === 1
        });

        let row: any[] = [];
        const tileGrid: any[] = [];

        //  Loop through the data field in the JSON. This is a 2D array containing the tile indexes,
        //  one after the other. The indexes are relative to the tileset that contains the tile.
        for (let y = 0; y < layer.data.length; y++)
        {
            for (let x = 0; x < layer.data[y].length; x++)
            {
                // In Weltmeister, 0 = no tile, but the Tilemap API expects -1 = no tile.
                const index = layer.data[y][x] - 1;

                let tile: any;

                if (index > -1)
                {
                    tile = new Tile(layerData, index, x, y, layer.tilesize, layer.tilesize);
                }
                else
                {
                    tile = insertNull
                        ? null
                        : new Tile(layerData, -1, x, y, layer.tilesize, layer.tilesize);
                }

                row.push(tile);
            }

            tileGrid.push(row);
            row = [];
        }

        layerData.data = tileGrid;

        tileLayers.push(layerData);
    }

    return tileLayers;
};
