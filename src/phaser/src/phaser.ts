/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// New imports
import * as Math from './math';

// TODO: Deprecated?
import * as Scenes from './scene';

import { Scene } from './scene/Scene';


require('./polyfills/requestVideoFrame');

import { PHASER_CONST as CONST } from './const';

/**
 * @namespace Phaser
 */

const Phaser: any = {

    Actions: require('./actions'),
    Animations: require('./animations'),
    BlendModes: require('./renderer/BlendModes'),
    Cache: require('./cache'),
    Cameras: require('./cameras'),
    Core: require('./core'),
    Class: require('./utils/Class'),
    Curves: require('./curves'),
    Data: require('./data'),
    Display: require('./display'),
    DOM: require('./dom'),
    Events: require('./events'),
    Filters: require('./filters'),
    Game: require('./core/Game'),
    GameObjects: require('./gameobjects'),
    Geom: require('./geom'),
    Input: require('./input'),
    Loader: require('./loader'),
    Math,
    Physics: require('./physics'),
    Plugins: require('./plugins'),
    Renderer: require('./renderer'),
    Scale: require('./scale'),
    ScaleModes: require('./renderer/ScaleModes'),
    Scene: Scene,
    Scenes,
    Structs: require('./structs'),
    Textures: require('./textures'),
    Tilemaps: require('./tilemaps'),
    Time: require('./time'),
    TintModes: require('./renderer/TintModes'),
    Tweens: require('./tweens'),
    Utils: require('./utils'),

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

//  Merge in the optional plugins and WebGL only features

if (typeof FEATURE_SOUND)
{
    // Phaser.Sound = require('./sound');
}

/**
 * The root types namespace.
 *
 * @namespace Phaser.Types
 * @since 3.17.0
 */

//  Export it

// module.exports = Phaser;
export default Phaser;

// global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
