/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Scenes
 */

export { SceneManager } from './SceneManager';
export { Systems } from './Systems';

var Scene = {

    Events: require('./events'),
    GetPhysicsPlugins: require('./GetPhysicsPlugins'),
    GetScenePlugins: require('./GetScenePlugins'),
    ScenePlugin: require('./ScenePlugin'),
    Settings: require('./Settings')

};

//   Merge in the consts
Scene = Extend(false, Scene, CONST);

module.exports = Scene;
