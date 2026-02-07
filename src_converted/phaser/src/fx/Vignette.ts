/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Controller } from './Controller';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The Vignette FX Controller.
 *
 * This FX controller manages the vignette effect for a Game Object.
 *
 * The vignette effect is a visual technique where the edges of the screen, or a Game Object, gradually darken or blur,
 * creating a frame-like appearance. This effect is used to draw the player's focus towards the central action or subject,
 * enhance immersion, and provide a cinematic or artistic quality to the game's visuals.
 *
 * A Vignette effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addVignette();
 * sprite.postFX.addVignette();
 * ```
 *
 * @class Vignette
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [x=0.5] - The horizontal offset of the vignette effect. This value is normalized to the range 0 to 1.
 * @param {number} [y=0.5] - The vertical offset of the vignette effect. This value is normalized to the range 0 to 1.
 * @param {number} [radius=0.5] - The radius of the vignette effect. This value is normalized to the range 0 to 1.
 * @param {number} [strength=0.5] - The strength of the vignette effect.
 */
export class Vignette extends Controller {

    /**
     * The horizontal offset of the vignette effect. This value is normalized to the range 0 to 1.
     *
     * @name Phaser.FX.Vignette#x
     * @type {number}
     * @since 3.60.0
     */
    x: number;

    /**
     * The vertical offset of the vignette effect. This value is normalized to the range 0 to 1.
     *
     * @name Phaser.FX.Vignette#y
     * @type {number}
     * @since 3.60.0
     */
    y: number;

    /**
     * The radius of the vignette effect. This value is normalized to the range 0 to 1.
     *
     * @name Phaser.FX.Vignette#radius
     * @type {number}
     * @since 3.60.0
     */
    radius: number;

    /**
     * The strength of the vignette effect.
     *
     * @name Phaser.FX.Vignette#strength
     * @type {number}
     * @since 3.60.0
     */
    strength: number;

    constructor(gameObject: any, x: number = 0.5, y: number = 0.5, radius: number = 0.5, strength: number = 0.5)
    {
        super(FX_CONST.VIGNETTE, gameObject);

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strength = strength;
    }

}
