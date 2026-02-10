/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this complex export pattern to modern TypeScript
// This file uses Extend to merge SCENE_CONST into the Scene object
// Need to analyze best pattern: namespace, merged exports, or object with static properties

import { Extend } from '../utils/object/Extend';
import { SCENE_CONST } from './const';
import { GetPhysicsPlugins } from './GetPhysicsPlugins';
import { GetScenePlugins } from './GetScenePlugins';
import { ScenePlugin } from './ScenePlugin';
import { Settings } from './Settings';

/**
 * @namespace Phaser.Scenes
 */

export { SceneManager } from './SceneManager';
export { Systems } from './Systems';

const Events = require('./events');

let Scene: any = {

    Events,
    GetPhysicsPlugins,
    GetScenePlugins,
    ScenePlugin,
    Settings

};

// TODO: Convert extens
//   Merge in the consts
Scene = Extend(false, Scene, SCENE_CONST);

export default Scene;
