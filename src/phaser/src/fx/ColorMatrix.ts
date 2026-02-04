/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ColorMatrix as BaseColorMatrix } from '../display/ColorMatrix';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The ColorMatrix FX Controller.
 *
 * This FX controller manages the color matrix effect for a Game Object.
 *
 * The color matrix effect is a visual technique that involves manipulating the colors of an image
 * or scene using a mathematical matrix. This process can adjust hue, saturation, brightness, and contrast,
 * allowing developers to create various stylistic appearances or mood settings within the game.
 * Common applications include simulating different lighting conditions, applying color filters,
 * or achieving a specific visual style.
 *
 * A ColorMatrix effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addColorMatrix();
 * sprite.postFX.addColorMatrix();
 * ```
 *
 * @class ColorMatrix
 * @extends Phaser.Display.ColorMatrix
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
export class ColorMatrix extends BaseColorMatrix {

    /**
     * The FX_CONST type of this effect.
     *
     * @name Phaser.FX.ColorMatrix#type
     * @type {number}
     * @since 3.60.0
     */
    type: number;

    /**
     * A reference to the Game Object that owns this effect.
     *
     * @name Phaser.FX.ColorMatrix#gameObject
     * @type {Phaser.GameObjects.GameObject}
     * @since 3.60.0
     */
    gameObject: any;

    /**
     * Toggle this boolean to enable or disable this effect,
     * without removing and adding it from the Game Object.
     *
     * @name Phaser.FX.ColorMatrix#active
     * @type {boolean}
     * @since 3.60.0
     */
    active: boolean;

    constructor(gameObject: any)
    {
        super();

        this.type = FX_CONST.COLOR_MATRIX;
        this.gameObject = gameObject;
        this.active = true;
    }

    destroy(): void
    {
        this.gameObject = null;
        this._matrix = null;
        this._data = null;
    }

}
