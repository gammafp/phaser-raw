/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Tileset } from '../../Tileset';

/**
 * Tilesets and Image Collections
 *
 * @function Phaser.Tilemaps.Parsers.Impact.ParseTilesets
 * @since 3.0.0
 *
 * @param {object} json - The Impact JSON data.
 *
 * @return {array} An array of Tilesets.
 */
export const ParseTilesets = (json: any): any[] =>
{
    const tilesets: any[] = [];
    const tilesetsNames: string[] = [];

    for (let i = 0; i < json.layer.length; i++)
    {
        const layer = json.layer[i];

        // A relative filepath to the source image (within Weltmeister) is used for the name
        const tilesetName = layer.tilesetName;

        // Only add unique tilesets that have a valid name. Collision layers will have a blank name.
        if (tilesetName !== '' && tilesetsNames.indexOf(tilesetName) === -1)
        {
            tilesetsNames.push(tilesetName);

            // Tiles are stored with an ID relative to the tileset, rather than a globally unique ID
            // across all tilesets. Also, tilesets in Weltmeister have no margin or padding.
            tilesets.push(new Tileset(tilesetName, 0, layer.tilesize, layer.tilesize, 0, 0));
        }
    }

    return tilesets;
};
