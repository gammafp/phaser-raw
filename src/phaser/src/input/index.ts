/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../utils/object/Extend';
import { INPUT_CONST } from './const';
import { CreatePixelPerfectHandler } from './CreatePixelPerfectHandler';
import { CreateInteractiveObject } from './CreateInteractiveObject';
import * as Events from './events';
const Gamepad = require('./gamepad');
import { InputManager } from './InputManager';
import { InputPlugin } from './InputPlugin';
import { InputPluginCache } from './InputPluginCache';
import * as Keyboard from './keyboard';
import * as Mouse from './mouse';
import { Pointer } from './Pointer';
import * as Touch from './touch';

/**
 * @namespace Phaser.Input
 */

const Input = {

    CreatePixelPerfectHandler,
    CreateInteractiveObject,
    Events,
    Gamepad,
    InputManager,
    InputPlugin,
    InputPluginCache,
    Keyboard,
    Mouse,
    Pointer,
    Touch

};

//   Merge in the consts
export default Extend(false, Input, INPUT_CONST);
