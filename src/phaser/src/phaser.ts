/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// require('./polyfills/requestVideoFrame');

import { PHASER_CONST as CONST } from './const';

// 100% converted - ES6 imports
import * as Actions from './actions';
import * as Animations from './animations';
import * as Cache from './cache';
import * as Curves from './curves';
import * as Data from './data';
import DOM from './dom';
import * as Events from './events';
import * as Geom from './geom';
import * as Math from './math';
import * as Plugins from './plugins';
import Scale from './scale';
import { Scene } from './scene/Scene';
import Scenes from './scene';
import Sound from './sound';
import * as Structs from './structs';
import * as Time from './time';
import { Game } from './core/Game';

// Not 100% converted - keep require()
const BlendModes = require('./renderer/BlendModes');
const Cameras = require('./cameras');
const Core = require('./core');
const Display = require('./display');
const Filters = require('./filters');
const GameObjects = require('./gameobjects');
const Input = require('./input');
const Loader = require('./loader');
const Physics = require('./physics');
const Renderer = require('./renderer');
const ScaleModes = require('./renderer/ScaleModes');
const Textures = require('./textures');
const Tilemaps = require('./tilemaps');
const TintModes = require('./renderer/TintModes');
const Tweens = require('./tweens');
const Utils = require('./utils');

export { Actions };
export { Animations };
export { BlendModes };
export { Cache };
export { Cameras };
export { Core };
export { Curves };
export { Data };
export { Display };
export { DOM };
export { Events };
export { Filters };
export { Game };
export { GameObjects };
export { Geom };
export { Input };
export { Loader };
export { Math };
export { Physics };
export { Plugins };
export { Renderer };
export { Scale };
export { ScaleModes };
export { Scene };
export { Scenes };
export { Sound };
export { Structs };
export { Textures };
export { Tilemaps };
export { Time };
export { TintModes };
export { Tweens };
export { Utils };

export const VERSION = CONST.VERSION;
export const AUTO = CONST.AUTO;
export const CANVAS = CONST.CANVAS;
export const WEBGL = CONST.WEBGL;
export const HEADLESS = CONST.HEADLESS;
export const FOREVER = CONST.FOREVER;
export const NONE = CONST.NONE;
export const LEFT = CONST.LEFT;
export const RIGHT = CONST.RIGHT;
export const UP = CONST.UP;
export const DOWN = CONST.DOWN;

// Default export for: import Phaser from './phaser'
const Phaser = {
    Actions,
    Animations,
    BlendModes,
    Cache,
    Cameras,
    Core,
    Curves,
    Data,
    Display,
    DOM,
    Events,
    Filters,
    Game,
    GameObjects,
    Geom,
    Input,
    Loader,
    Math,
    Physics,
    Plugins,
    Renderer,
    Scale,
    ScaleModes,
    Scene,
    Scenes,
    Sound,
    Structs,
    Textures,
    Tilemaps,
    Time,
    TintModes,
    Tweens,
    Utils,
    VERSION: CONST.VERSION,
    AUTO: CONST.AUTO,
    CANVAS: CONST.CANVAS,
    WEBGL: CONST.WEBGL,
    HEADLESS: CONST.HEADLESS,
    FOREVER: CONST.FOREVER,
    NONE: CONST.NONE,
    LEFT: CONST.LEFT,
    RIGHT: CONST.RIGHT,
    UP: CONST.UP,
    DOWN: CONST.DOWN
};

export default Phaser;
