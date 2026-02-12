/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../utils/object/Extend';

var CONST = require('./const');

/**
 * @namespace Phaser.Input
 */

var Input = {

    CreatePixelPerfectHandler: require('./CreatePixelPerfectHandler'),
    CreateInteractiveObject: require('./CreateInteractiveObject'),
    Events: require('./events'),
    Gamepad: require('./gamepad'),
    InputManager: require('./InputManager'),
    InputPlugin: require('./InputPlugin'),
    InputPluginCache: require('./InputPluginCache'),
    Keyboard: require('./keyboard'),
    Mouse: require('./mouse'),
    Pointer: require('./Pointer'),
    Touch: require('./touch')

};

//   Merge in the consts
Input = Extend(false, Input, CONST);

module.exports = Input;
