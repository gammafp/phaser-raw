/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Plugins
 */

import { BasePlugin } from './BasePlugin';

module.exports = {

    BasePlugin,
    DefaultPlugins: require('./DefaultPlugins'),
    PluginCache: require('./PluginCache'),
    PluginManager: require('./PluginManager'),
    ScenePlugin: require('./ScenePlugin')

};
