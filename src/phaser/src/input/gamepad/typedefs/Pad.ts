/**
 * The Gamepad object, as extracted from GamepadEvent.
 * 
 * @typedef {object} Phaser.Types.Input.Gamepad.Pad
 * @since 3.10.0
 *
 * @property {string} id - The ID of the Gamepad.
 * @property {number} index - The index of the Gamepad.
 */
export interface Pad {
    id: string;
    index: number;
    buttons: { value: number; pressed: boolean }[];
    axes: number[];
    connected: boolean;
    timestamp: number;
    vibrationActuator?: any;
}
