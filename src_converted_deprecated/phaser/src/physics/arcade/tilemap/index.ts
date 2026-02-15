/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Physics.Arcade.Tilemap
 */

import { ProcessTileCallbacks } from './ProcessTileCallbacks';
import { ProcessTileSeparationX } from './ProcessTileSeparationX';
import { ProcessTileSeparationY } from './ProcessTileSeparationY';
import { SeparateTile } from './SeparateTile';
const TileCheckX = require('./TileCheckX');
const TileCheckY = require('./TileCheckY');
const TileIntersectsBody = require('./TileIntersectsBody');

export {
    ProcessTileCallbacks,
    ProcessTileSeparationX,
    ProcessTileSeparationY,
    SeparateTile,
    TileCheckX,
    TileCheckY,
    TileIntersectsBody
};
