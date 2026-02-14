/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../utils/object/Extend';
import * as Gamepad from './gamepad';
import * as Keyboard from './keyboard';
import * as Mouse from './mouse';
import * as Touch from './touch';
import { CreatePixelPerfectHandler } from './CreatePixelPerfectHandler';
import { CreateInteractiveObject } from './CreateInteractiveObject';
import { InputPluginCache } from './InputPluginCache';
import { INPUT_CONST as CONST } from './const';
import { InputManager } from './InputManager';
import { InputPlugin } from './InputPlugin';
import { Pointer } from './Pointer';

/**
 * @namespace Phaser.Input
 */

var Input = {

    CreatePixelPerfectHandler: CreatePixelPerfectHandler,
    CreateInteractiveObject: CreateInteractiveObject,
    Events: require('./events'),
    Gamepad: Gamepad,
    InputManager: InputManager,
    InputPlugin: InputPlugin,
    InputPluginCache: InputPluginCache,
    Keyboard: Keyboard,
    Mouse: Mouse,
    Pointer: Pointer,
    Touch: Touch

};

//   Merge in the consts
Input = Extend(false, Input, CONST);

module.exports = Input;
