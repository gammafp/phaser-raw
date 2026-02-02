/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this file to TypeScript

import { Extend } from '../utils/object/Extend';
import { SCENE_CONST } from './const';

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
Scene = Extend(false, Scene, SCENE_CONST);

module.exports = Scene;
