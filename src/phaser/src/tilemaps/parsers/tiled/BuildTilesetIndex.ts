/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


import { Tileset } from '../../Tileset';

/**
 * Master list of tiles -> x, y, index in tileset.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.BuildTilesetIndex
 * @since 3.0.0
 *
 * @param {(Phaser.Tilemaps.MapData|Phaser.Tilemaps.Tilemap)} mapData - The Map Data object.
 *
 * @return {array} An array of Tileset objects.
 */
export const BuildTilesetIndex = function (mapData: any): any[]
{
    let i: number;
    let set: any;
    const tiles: any[] = [];

    for (i = 0; i < mapData.imageCollections.length; i++)
    {
        const collection = mapData.imageCollections[i];
        const images = collection.images;

        for (let j = 0; j < images.length; j++)
        {
            const image = images[j];
            const offset = {
                x: 0,
                y: image.height - mapData.tileHeight
            };

            set = new Tileset(image.image, image.gid, image.width, image.height, 0, 0, undefined, undefined, offset);

            set.updateTileData(image.width, image.height);

            mapData.tilesets.push(set);
        }
    }

    for (i = 0; i < mapData.tilesets.length; i++)
    {
        set = mapData.tilesets[i];

        let x = set.tileMargin;
        let y = set.tileMargin;

        let count = 0;
        let countX = 0;
        let countY = 0;

        for (let t = set.firstgid; t < set.firstgid + set.total; t++)
        {
            //  Can add extra properties here as needed
            tiles[t] = [ x, y, i ];

            x += set.tileWidth + set.tileSpacing;

            count++;

            if (count === set.total)
            {
                break;
            }

            countX++;

            if (countX === set.columns)
            {
                x = set.tileMargin;
                y += set.tileHeight + set.tileSpacing;

                countX = 0;
                countY++;

                if (countY === set.rows)
                {
                    break;
                }
            }
        }
    }

    return tiles;
};
