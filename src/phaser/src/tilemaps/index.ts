/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { LayerData } from './mapdata/LayerData';
import { MapData } from './mapdata/MapData';
import { ObjectLayer } from './mapdata/ObjectLayer';
import { ORIENTATION_CONST as Orientation } from './const/ORIENTATION_CONST';

import { Extend } from '../utils/object/Extend';
import { Formats } from './Formats';
import { ImageCollection } from './ImageCollection';
import { ParseToTilemap } from './ParseToTilemap';
import { Tile } from './Tile';
import { Tilemap } from './Tilemap';
import { Tileset } from './Tileset';
import { TilemapLayerBase } from './TilemapLayerBase';
import { TilemapLayer } from './TilemapLayer';
import { TilemapGPULayer } from './TilemapGPULayer';

const CONST = require('./const');
const Components = require('./components');
import { Parsers } from './parsers';

// Importar los factory/creator files para que se registren
import './TilemapFactory';
import './TilemapCreator';

/**
 * @namespace Phaser.Tilemaps
 *
 * @borrows Phaser.Tilemaps.Orientation.ORTHOGONAL as ORTHOGONAL
 * @borrows Phaser.Tilemaps.Orientation.ISOMETRIC as ISOMETRIC
 * @borrows Phaser.Tilemaps.Orientation.STAGGERED as STAGGERED
 * @borrows Phaser.Tilemaps.Orientation.HEXAGONAL as HEXAGONAL
 */

let Tilemaps: any = {

    Components: Components,
    Parsers: Parsers,

    Formats: Formats,
    ImageCollection: ImageCollection,
    ParseToTilemap: ParseToTilemap,
    Tile: Tile,
    Tilemap: Tilemap,
    Tileset: Tileset,
    TilemapLayerBase: TilemapLayerBase,
    TilemapLayer: TilemapLayer,
    TilemapGPULayer: TilemapGPULayer,
    Orientation: Orientation,

    LayerData: LayerData,
    MapData: MapData,
    ObjectLayer: ObjectLayer

};

Tilemaps = Extend(false, Tilemaps, CONST.ORIENTATION);

export { Tilemaps };
export default Tilemaps;
