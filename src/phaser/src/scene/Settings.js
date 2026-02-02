/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this file to TypeScript

import { GetValue } from '../utils/object/GetValue';
import { Merge } from '../utils/object/Merge';
import { SCENE_CONST as CONST } from './const';

var InjectionMap = require('./InjectionMap');

/**
 * @namespace Phaser.Scenes.Settings
 */

var Settings = {

    /**
     * Takes a Scene configuration object and returns a fully formed System Settings object.
     *
     * @function Phaser.Scenes.Settings.create
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Scenes.SettingsConfig)} config - The Scene configuration object used to create this Scene Settings.
     *
     * @return {Phaser.Types.Scenes.SettingsObject} The Scene Settings object created as a result of the config and default settings.
     */
    create: function (config)
    {
        if (typeof config === 'string')
        {
            config = { key: config };
        }
        else if (config === undefined)
        {
            //  Pass the 'hasOwnProperty' checks
            config = {};
        }

        return {

            status: CONST.PENDING,

            key: GetValue(config, 'key', ''),
            active: GetValue(config, 'active', false),
            visible: GetValue(config, 'visible', true),

            isBooted: false,

            isTransition: false,
            transitionFrom: null,
            transitionDuration: 0,
            transitionAllowInput: true,

            //  Loader payload array

            data: {},

            pack: GetValue(config, 'pack', false),

            //  Cameras

            cameras: GetValue(config, 'cameras', null),

            //  Scene Property Injection Map

            map: GetValue(config, 'map', Merge(InjectionMap, GetValue(config, 'mapAdd', {}))),

            //  Physics

            physics: GetValue(config, 'physics', {}),

            //  Loader

            loader: GetValue(config, 'loader', {}),

            //  Plugins

            plugins: GetValue(config, 'plugins', false),

            //  Input

            input: GetValue(config, 'input', {})

        };
    }

};

module.exports = Settings;
