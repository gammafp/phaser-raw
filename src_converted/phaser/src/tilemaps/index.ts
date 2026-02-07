/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this file to TypeScript

import { Extend } from '../utils/object/Extend';

var CONST = require('./const');

/**
 * @namespace Phaser.Tilemaps
 *
 * @borrows Phaser.Tilemaps.Orientation.ORTHOGONAL as ORTHOGONAL
 * @borrows Phaser.Tilemaps.Orientation.ISOMETRIC as ISOMETRIC
 * @borrows Phaser.Tilemaps.Orientation.STAGGERED as STAGGERED
 * @borrows Phaser.Tilemaps.Orientation.HEXAGONAL as HEXAGONAL
 */

import * as Components from './components';
import * as Parsers from './parsers';
import * as Formats from './Formats';
import { ImageCollection } from './ImageCollection';
import { ParseToTilemap } from './ParseToTilemap';
import { Tile } from './Tile';
import { Tilemap } from './Tilemap';
import './TilemapCreator';
import './TilemapFactory';
import { Tileset } from './Tileset';
import { TilemapLayer } from './TilemapLayer';
import * as Orientation from './const/ORIENTATION_CONST';
import { LayerData } from './mapdata/LayerData';
import { MapData } from './mapdata/MapData';
import { ObjectLayer } from './mapdata/ObjectLayer';

let Tilemaps: any = {
    Components,
    Parsers,
    Formats,
    ImageCollection,
    ParseToTilemap,
    Tile,
    Tilemap,
    Tileset,
    TilemapLayer,
    Orientation,
    LayerData,
    MapData,
    ObjectLayer
};

Tilemaps = Extend(false, Tilemaps, CONST.ORIENTATION);

export default Tilemaps;
