/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';
import { Axis } from './Axis';
import { Button } from './Button';
import { EventEmitter } from 'eventemitter3';
import type { GamepadPlugin } from './GamepadPlugin';
import type { Pad } from './typedefs/Pad';

/**
 * @classdesc
 * A single Gamepad.
 *
 * These are created, updated and managed by the Gamepad Plugin.
 *
 * @class Gamepad
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.GamepadPlugin} manager - A reference to the Gamepad Plugin.
 * @param {Phaser.Types.Input.Gamepad.Pad} pad - The Gamepad object, as extracted from GamepadEvent.
 */
export class Gamepad extends EventEmitter {
    /**
     * A reference to the Gamepad Plugin.
     *
     * @name Phaser.Input.Gamepad.Gamepad#manager
     * @type {Phaser.Input.Gamepad.GamepadPlugin}
     * @since 3.0.0
     */
    manager: GamepadPlugin | null;

    /**
     * A reference to the native Gamepad object that is connected to the browser.
     *
     * @name Phaser.Input.Gamepad.Gamepad#pad
     * @type {any}
     * @since 3.10.0
     */
    pad: any;

    /**
     * A string containing some information about the controller.
     *
     * This is not strictly specified, but in Firefox it will contain three pieces of information
     * separated by dashes (-): two 4-digit hexadecimal strings containing the USB vendor and
     * product id of the controller, and the name of the controller as provided by the driver.
     * In Chrome it will contain the name of the controller as provided by the driver,
     * followed by vendor and product 4-digit hexadecimal strings.
     *
     * @name Phaser.Input.Gamepad.Gamepad#id
     * @type {string}
     * @since 3.0.0
     */
    id: string;

    /**
     * An integer that is unique for each Gamepad currently connected to the system.
     * This can be used to distinguish multiple controllers.
     * Note that disconnecting a device and then connecting a new device may reuse the previous index.
     *
     * @name Phaser.Input.Gamepad.Gamepad#index
     * @type {number}
     * @since 3.0.0
     */
    index: number;

    /**
     * An array of Gamepad Button objects, corresponding to the different buttons available on the Gamepad.
     *
     * @name Phaser.Input.Gamepad.Gamepad#buttons
     * @type {Phaser.Input.Gamepad.Button[]}
     * @since 3.0.0
     */
    buttons: Button[];

    /**
     * An array of Gamepad Axis objects, corresponding to the different axes available on the Gamepad, if any.
     *
     * @name Phaser.Input.Gamepad.Gamepad#axes
     * @type {Phaser.Input.Gamepad.Axis[]}
     * @since 3.0.0
     */
    axes: Axis[];

    /**
     * The Gamepad's Haptic Actuator (Vibration / Rumble support).
     * This is highly experimental and only set if both present on the device,
     * and exposed by both the hardware and browser.
     *
     * @name Phaser.Input.Gamepad.Gamepad#vibration
     * @type {GamepadHapticActuator}
     * @since 3.10.0
     */
    vibration: any;

    /**
     * A reference to the Left Button in the Left Cluster.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_LCLeft
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _LCLeft: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Right Button in the Left Cluster.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_LCRight
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _LCRight: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Top Button in the Left Cluster.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_LCTop
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _LCTop: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Bottom Button in the Left Cluster.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_LCBottom
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _LCBottom: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Left Button in the Right Cluster.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_RCLeft
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _RCLeft: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Right Button in the Right Cluster.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_RCRight
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _RCRight: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Top Button in the Right Cluster.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_RCTop
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _RCTop: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Bottom Button in the Right Cluster.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_RCBottom
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _RCBottom: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Top Left Front Button (L1 Shoulder Button)
     *
     * @name Phaser.Input.Gamepad.Gamepad#_FBLeftTop
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _FBLeftTop: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Bottom Left Front Button (L2 Shoulder Button)
     *
     * @name Phaser.Input.Gamepad.Gamepad#_FBLeftBottom
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _FBLeftBottom: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Top Right Front Button (R1 Shoulder Button)
     *
     * @name Phaser.Input.Gamepad.Gamepad#_FBRightTop
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _FBRightTop: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Bottom Right Front Button (R2 Shoulder Button)
     *
     * @name Phaser.Input.Gamepad.Gamepad#_FBRightBottom
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _FBRightBottom: Button | { value: number; pressed: boolean };

    /**
     * A reference to the Horizontal Axis for the Left Stick.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_HAxisLeft
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _HAxisLeft: Axis | { value: number };

    /**
     * A reference to the Vertical Axis for the Left Stick.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_VAxisLeft
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _VAxisLeft: Axis | { value: number };

    /**
     * A reference to the Horizontal Axis for the Right Stick.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_HAxisRight
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _HAxisRight: Axis | { value: number };

    /**
     * A reference to the Vertical Axis for the Right Stick.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_VAxisRight
     * @type {Phaser.Input.Gamepad.Button}
     * @private
     * @since 3.10.0
     */
    _VAxisRight: Axis | { value: number };

    /**
     * A Vector2 containing the most recent values from the Gamepad's left axis stick.
     * This is updated automatically as part of the Gamepad.update cycle.
     * The H Axis is mapped to the `Vector2.x` property, and the V Axis to the `Vector2.y` property.
     * The values are based on the Axis thresholds.
     * If the Gamepad does not have a left axis stick, the values will always be zero.
     *
     * @name Phaser.Input.Gamepad.Gamepad#leftStick
     * @type {Phaser.Math.Vector2}
     * @since 3.10.0
     */
    leftStick: Vector2;

    /**
     * A Vector2 containing the most recent values from the Gamepad's right axis stick.
     * This is updated automatically as part of the Gamepad.update cycle.
     * The H Axis is mapped to the `Vector2.x` property, and the V Axis to the `Vector2.y` property.
     * The values are based on the Axis thresholds.
     * If the Gamepad does not have a right axis stick, the values will always be zero.
     *
     * @name Phaser.Input.Gamepad.Gamepad#rightStick
     * @type {Phaser.Math.Vector2}
     * @since 3.10.0
     */
    rightStick: Vector2;

    /**
     * When was this Gamepad created? Used to avoid duplicate event spamming in the update loop.
     *
     * @name Phaser.Input.Gamepad.Gamepad#_created
     * @type {number}
     * @private
     * @since 3.50.0
     */
    _created: number;

    constructor(manager: GamepadPlugin, pad: Pad)
    {
        super();

        this.manager = manager;
        this.pad = pad;
        this.id = pad.id;
        this.index = pad.index;

        const buttons: Button[] = [];

        for (let i = 0; i < pad.buttons.length; i++)
        {
            buttons.push(new Button(this, i, (pad.buttons[i].value >= 0.5)));
        }

        this.buttons = buttons;

        const axes: Axis[] = [];

        for (let i = 0; i < pad.axes.length; i++)
        {
            axes.push(new Axis(this, i));
        }

        this.axes = axes;
        this.vibration = pad.vibrationActuator;

        // https://w3c.github.io/gamepad/#remapping

        const _noButton = { value: 0, pressed: false };

        this._LCLeft = (buttons[14]) ? buttons[14] : _noButton;
        this._LCRight = (buttons[15]) ? buttons[15] : _noButton;
        this._LCTop = (buttons[12]) ? buttons[12] : _noButton;
        this._LCBottom = (buttons[13]) ? buttons[13] : _noButton;
        this._RCLeft = (buttons[2]) ? buttons[2] : _noButton;
        this._RCRight = (buttons[1]) ? buttons[1] : _noButton;
        this._RCTop = (buttons[3]) ? buttons[3] : _noButton;
        this._RCBottom = (buttons[0]) ? buttons[0] : _noButton;
        this._FBLeftTop = (buttons[4]) ? buttons[4] : _noButton;
        this._FBLeftBottom = (buttons[6]) ? buttons[6] : _noButton;
        this._FBRightTop = (buttons[5]) ? buttons[5] : _noButton;
        this._FBRightBottom = (buttons[7]) ? buttons[7] : _noButton;

        const _noAxis = { value: 0 };

        this._HAxisLeft = (axes[0]) ? axes[0] : _noAxis;
        this._VAxisLeft = (axes[1]) ? axes[1] : _noAxis;
        this._HAxisRight = (axes[2]) ? axes[2] : _noAxis;
        this._VAxisRight = (axes[3]) ? axes[3] : _noAxis;

        this.leftStick = new Vector2();
        this.rightStick = new Vector2();
        this._created = performance.now();
    }

    /**
     * Gets the total number of axis this Gamepad claims to support.
     *
     * @method Phaser.Input.Gamepad.Gamepad#getAxisTotal
     * @since 3.10.0
     *
     * @return {number} The total number of axes this Gamepad claims to support.
     */
    getAxisTotal(): number
    {
        return this.axes.length;
    }

    /**
     * Gets the value of an axis based on the given index.
     * The index must be valid within the range of axes supported by this Gamepad.
     * The return value will be a float between 0 and 1.
     *
     * @method Phaser.Input.Gamepad.Gamepad#getAxisValue
     * @since 3.10.0
     *
     * @param {number} index - The index of the axes to get the value for.
     *
     * @return {number} The value of the axis, between 0 and 1.
     */
    getAxisValue(index: number): number
    {
        return this.axes[index].getValue();
    }

    /**
     * Sets the threshold value of all axis on this Gamepad.
     * The value is a float between 0 and 1 and is the amount below which the axis is considered as not having been moved.
     *
     * @method Phaser.Input.Gamepad.Gamepad#setAxisThreshold
     * @since 3.10.0
     *
     * @param {number} value - A value between 0 and 1.
     */
    setAxisThreshold(value: number): void
    {
        for (let i = 0; i < this.axes.length; i++)
        {
            this.axes[i].threshold = value;
        }
    }

    /**
     * Gets the total number of buttons this Gamepad claims to have.
     *
     * @method Phaser.Input.Gamepad.Gamepad#getButtonTotal
     * @since 3.10.0
     *
     * @return {number} The total number of buttons this Gamepad claims to have.
     */
    getButtonTotal(): number
    {
        return this.buttons.length;
    }

    /**
     * Gets the value of a button based on the given index.
     * The index must be valid within the range of buttons supported by this Gamepad.
     *
     * The return value will be either 0 or 1 for an analogue button, or a float between 0 and 1
     * for a pressure-sensitive digital button, such as the shoulder buttons on a Dual Shock.
     *
     * @method Phaser.Input.Gamepad.Gamepad#getButtonValue
     * @since 3.10.0
     *
     * @param {number} index - The index of the button to get the value for.
     *
     * @return {number} The value of the button, between 0 and 1.
     */
    getButtonValue(index: number): number
    {
        return this.buttons[index].value;
    }

    /**
     * Returns if the button is pressed down or not.
     * The index must be valid within the range of buttons supported by this Gamepad.
     *
     * @method Phaser.Input.Gamepad.Gamepad#isButtonDown
     * @since 3.10.0
     *
     * @param {number} index - The index of the button to get the value for.
     *
     * @return {boolean} `true` if the button is considered as being pressed down, otherwise `false`.
     */
    isButtonDown(index: number): boolean
    {
        return this.buttons[index].pressed;
    }

    /**
     * Internal update handler for this Gamepad.
     * Called automatically by the Gamepad Manager as part of its update.
     *
     * @method Phaser.Input.Gamepad.Gamepad#update
     * @private
     * @since 3.0.0
     */
    update(pad: any): void
    {
        if (pad.timestamp < this._created)
        {
            return;
        }

        let i;

        //  Sync the button values

        const localButtons = this.buttons;
        const gamepadButtons = pad.buttons;

        let len = localButtons.length;

        for (i = 0; i < len; i++)
        {
            localButtons[i].update(gamepadButtons[i].value);
        }

        //  Sync the axis values

        const localAxes = this.axes;
        const gamepadAxes = pad.axes;

        len = localAxes.length;

        for (i = 0; i < len; i++)
        {
            localAxes[i].update(gamepadAxes[i]);
        }

        if (len >= 2)
        {
            this.leftStick.set(localAxes[0].getValue(), localAxes[1].getValue());

            if (len >= 4)
            {
                this.rightStick.set(localAxes[2].getValue(), localAxes[3].getValue());
            }
        }
    }

    /**
     * Destroys this Gamepad instance, its buttons and axes, and releases external references it holds.
     *
     * @method Phaser.Input.Gamepad.Gamepad#destroy
     * @since 3.10.0
     */
    destroy(): void
    {
        this.removeAllListeners();

        this.manager = null;
        this.pad = null;

        let i;

        for (i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].destroy();
        }

        for (i = 0; i < this.axes.length; i++)
        {
            this.axes[i].destroy();
        }

        this.buttons = [];
        this.axes = [];
    }

    /**
     * Is this Gamepad currently connected or not?
     *
     * @name Phaser.Input.Gamepad.Gamepad#connected
     * @type {boolean}
     * @default true
     * @since 3.0.0
     */
    get connected(): boolean
    {
        return this.pad.connected;
    }

    /**
     * A timestamp containing the most recent time this Gamepad was updated.
     *
     * @name Phaser.Input.Gamepad.Gamepad#timestamp
     * @type {number}
     * @since 3.0.0
     */
    get timestamp(): number
    {
        return this.pad.timestamp;
    }

    /**
     * Is the Gamepad's Left button being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * This is the d-pad left button under standard Gamepad mapping.
     *
     * @name Phaser.Input.Gamepad.Gamepad#left
     * @type {boolean}
     * @since 3.10.0
     */
    get left(): boolean
    {
        return this._LCLeft.pressed;
    }

    /**
     * Is the Gamepad's Right button being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * This is the d-pad right button under standard Gamepad mapping.
     *
     * @name Phaser.Input.Gamepad.Gamepad#right
     * @type {boolean}
     * @since 3.10.0
     */
    get right(): boolean
    {
        return this._LCRight.pressed;
    }

    /**
     * Is the Gamepad's Up button being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * This is the d-pad up button under standard Gamepad mapping.
     *
     * @name Phaser.Input.Gamepad.Gamepad#up
     * @type {boolean}
     * @since 3.10.0
     */
    get up(): boolean
    {
        return this._LCTop.pressed;
    }

    /**
     * Is the Gamepad's Down button being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * This is the d-pad down button under standard Gamepad mapping.
     *
     * @name Phaser.Input.Gamepad.Gamepad#down
     * @type {boolean}
     * @since 3.10.0
     */
    get down(): boolean
    {
        return this._LCBottom.pressed;
    }

    /**
     * Is the Gamepad's bottom button in the right button cluster being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * On a Dual Shock controller it's the X button.
     * On an XBox controller it's the A button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#A
     * @type {boolean}
     * @since 3.10.0
     */
    get A(): boolean
    {
        return this._RCBottom.pressed;
    }

    /**
     * Is the Gamepad's top button in the right button cluster being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * On a Dual Shock controller it's the Triangle button.
     * On an XBox controller it's the Y button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#Y
     * @type {boolean}
     * @since 3.10.0
     */
    get Y(): boolean
    {
        return this._RCTop.pressed;
    }

    /**
     * Is the Gamepad's left button in the right button cluster being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * On a Dual Shock controller it's the Square button.
     * On an XBox controller it's the X button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#X
     * @type {boolean}
     * @since 3.10.0
     */
    get X(): boolean
    {
        return this._RCLeft.pressed;
    }

    /**
     * Is the Gamepad's right button in the right button cluster being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * On a Dual Shock controller it's the Circle button.
     * On an XBox controller it's the B button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#B
     * @type {boolean}
     * @since 3.10.0
     */
    get B(): boolean
    {
        return this._RCRight.pressed;
    }

    /**
     * Returns the value of the Gamepad's top left shoulder button.
     * If the Gamepad doesn't have this button it will always return zero.
     * The value is a float between 0 and 1, corresponding to how depressed the button is.
     * On a Dual Shock controller it's the L1 button.
     * On an XBox controller it's the LB button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#L1
     * @type {number}
     * @since 3.10.0
     */
    get L1(): number
    {
        return this._FBLeftTop.value;
    }

    /**
     * Returns the value of the Gamepad's bottom left shoulder button.
     * If the Gamepad doesn't have this button it will always return zero.
     * The value is a float between 0 and 1, corresponding to how depressed the button is.
     * On a Dual Shock controller it's the L2 button.
     * On an XBox controller it's the LT button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#L2
     * @type {number}
     * @since 3.10.0
     */
    get L2(): number
    {
        return this._FBLeftBottom.value;
    }

    /**
     * Returns the value of the Gamepad's top right shoulder button.
     * If the Gamepad doesn't have this button it will always return zero.
     * The value is a float between 0 and 1, corresponding to how depressed the button is.
     * On a Dual Shock controller it's the R1 button.
     * On an XBox controller it's the RB button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#R1
     * @type {number}
     * @since 3.10.0
     */
    get R1(): number
    {
        return this._FBRightTop.value;
    }

    /**
     * Returns the value of the Gamepad's bottom right shoulder button.
     * If the Gamepad doesn't have this button it will always return zero.
     * The value is a float between 0 and 1, corresponding to how depressed the button is.
     * On a Dual Shock controller it's the R2 button.
     * On an XBox controller it's the RT button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#R2
     * @type {number}
     * @since 3.10.0
     */
    get R2(): number
    {
        return this._FBRightBottom.value;
    }

}
