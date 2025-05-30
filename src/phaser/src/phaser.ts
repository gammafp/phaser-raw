/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('./polyfills/requestVideoFrame');

var CONST = require('./const');

/**
 * @namespace Phaser
 */

// New imports

import { Scene } from './scene/Scene';


export const Actions = require('./actions');
export const Animations = require('./animations');
export const BlendModes = require('./renderer/BlendModes');
export const Cache = require('./cache');
export const Cameras = require('./cameras');
export const Core = require('./core');
export const Class = require('./utils/Class');
export const Create = require('./create');
export const Curves = require('./curves');
export const Data = require('./data');
export const Display = require('./display');
export const Events = require('./events');
export const FX = require('./fx');
export const GameObjects = require('./gameobjects');
export const Geom = require('./geom');
export const Loader = require('./loader');
export const Math = require('./math');
// export const Physics = require('./physics');
export const Plugins = require('./plugins');
export const Renderer = require('./renderer');
export const Scale = require('./scale');
export const ScaleModes = require('./renderer/ScaleModes');

// export const Scene = require('./scene/Scene');
export { Scene };

export const Scenes = require('./scene');
export const Structs = require('./structs');
export const Textures = require('./textures');
export const Tilemaps = require('./tilemaps');
export const Time = require('./time');
export const Tweens = require('./tweens');
export const Utils = require('./utils');

// Export constants
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
export const Game = require('./core/Game');
export const DOM = require('./dom');

// Optional plugins
// if (typeof FEATURE_SOUND) {
//     export const Sound = require('./sound');
// }

// if (typeof PLUGIN_CAMERA3D) {
    // export const Sprite3D = require('../plugins/camera3d/src');
    // export const Sprite3DFactory = require('../plugins/camera3d/src/sprite3d/Sprite3D');
    // export const Sprite3DCreator = require('../plugins/camera3d/src/sprite3d/Sprite3DCreator');
// }

// if (typeof PLUGIN_FBINSTANT) {
//     export const FacebookInstantGamesPlugin = require('../plugins/fbinstant/src/FacebookInstantGamesPlugin');
// }

// Create the main Phaser object
const Phaser = {
    Actions,
    Animations,
    BlendModes,
    Cache,
    Cameras,
    Core,
    Class,
    Create,
    Curves,
    Data,
    Display,
    DOM,
    Events,
    FX,
    Game,
    GameObjects,
    Geom,
    Input: require('./input'),

    Loader,
    Math,
    Plugins,
    Renderer,
    Scale,
    ScaleModes,
    Scene,
    Scenes,
    Structs,
    Textures,
    Tilemaps,
    Time,
    Tweens,
    Utils,
    VERSION,
    AUTO,
    CANVAS,
    WEBGL,
    HEADLESS,
    FOREVER,
    NONE,
    LEFT,
    RIGHT,
    UP,
    DOWN
};

// Merge in optional plugins
// if (typeof FEATURE_SOUND) {
//     Phaser.Sound = Sound;
// }

// Merge in the consts
Object.assign(Phaser, CONST);

// Expose Phaser to the global scope
// if (typeof window !== 'undefined') {
//     window.Phaser = Phaser;
// } else if (typeof global !== 'undefined') {
//     global.Phaser = Phaser;
// }

export default Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */