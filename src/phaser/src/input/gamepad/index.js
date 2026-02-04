/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Input.Gamepad
 */

import { Axis } from './Axis';
import { Button } from './Button';

module.exports = {

    Axis,
    Button,
    Events: require('./events'),
    Gamepad: require('./Gamepad'),
    GamepadPlugin: require('./GamepadPlugin'),

    Configs: require('./configs/')
};
