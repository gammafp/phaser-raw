/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetValue } from '../utils/object/GetValue';

//  Contains the plugins that Phaser uses globally and locally.
//  These are the source objects, not instantiated.
const inputPlugins: Record<string, any> = {};

/**
 * @namespace Phaser.Input.InputPluginCache
 */

export const InputPluginCache = {
    /**
     * Static method called directly by the Core internal Plugins.
     * Key is a reference used to get the plugin from the plugins object (i.e. InputPlugin)
     * Plugin is the object to instantiate to create the plugin
     * Mapping is what the plugin is injected into the Scene.Systems as (i.e. input)
     *
     * @function Phaser.Input.InputPluginCache.register
     * @static
     * @since 3.10.0
     *
     * @param {string} key - A reference used to get this plugin from the plugin cache.
     * @param {function} plugin - The plugin to be stored. Should be the core object, not instantiated.
     * @param {string} mapping - If this plugin is to be injected into the Input Plugin, this is the property key used.
     * @param {string} settingsKey - The key in the Scene Settings to check to see if this plugin should install or not.
     * @param {string} configKey - The key in the Game Config to check to see if this plugin should install or not.
     */
    register: (key: string, plugin: any, mapping: string, settingsKey: string, configKey: string): void => {
        inputPlugins[key] = { plugin: plugin, mapping: mapping, settingsKey: settingsKey, configKey: configKey };
    },

    /**
     * Returns the input plugin object from the cache based on the given key.
     *
     * @function Phaser.Input.InputPluginCache.getPlugin
     * @static
     * @since 3.10.0
     *
     * @param {string} key - The key of the input plugin to get.
     *
     * @return {Phaser.Types.Input.InputPluginContainer} The input plugin object.
     */
    getPlugin: (key: string): any => {
        return inputPlugins[key];
    },

    /**
     * Installs all of the registered Input Plugins into the given target.
     *
     * @function Phaser.Input.InputPluginCache.install
     * @static
     * @since 3.10.0
     *
     * @param {Phaser.Input.InputPlugin} target - The target InputPlugin to install the plugins into.
     */
    install: (target: any): void => {
        const sys = target.scene.sys;
        const settings = sys.settings.input;
        const config = sys.game.config;

        for (const key in inputPlugins)
        {
            const source = inputPlugins[key].plugin;
            const mapping = inputPlugins[key].mapping;
            const settingsKey = inputPlugins[key].settingsKey;
            const configKey = inputPlugins[key].configKey;

            if (GetValue(settings, settingsKey, config[configKey]))
            {
                target[mapping] = new source(target);
            }
        }
    },

    /**
     * Removes an input plugin based on the given key.
     *
     * @function Phaser.Input.InputPluginCache.remove
     * @static
     * @since 3.10.0
     *
     * @param {string} key - The key of the input plugin to remove.
     */
    remove: (key: string): void => {
        if (inputPlugins.hasOwnProperty(key))
        {
            delete inputPlugins[key];
        }
    }
};
