/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Controller } from './Controller';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The Shine FX Controller.
 *
 * This FX controller manages the shift effect for a Game Object.
 *
 * The shine effect is a visual technique that simulates the appearance of reflective
 * or glossy surfaces by passing a light beam across a Game Object. This effect is used to
 * enhance visual appeal, emphasize certain features, and create a sense of depth or
 * material properties.
 *
 * A Shine effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addShine();
 * sprite.postFX.addShine();
 * ```
 *
 * @class Shine
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [speed=0.5] - The speed of the Shine effect.
 * @param {number} [lineWidth=0.5] - The line width of the Shine effect.
 * @param {number} [gradient=3] - The gradient of the Shine effect.
 * @param {boolean} [reveal=false] - Does this Shine effect reveal or get added to its target?
 */
export class Shine extends Controller {

    /**
     * The speed of the Shine effect.
     *
     * @name Phaser.FX.Shine#speed
     * @type {number}
     * @since 3.60.0
     */
    speed: number;

    /**
     * The line width of the Shine effect.
     *
     * @name Phaser.FX.Shine#lineWidth
     * @type {number}
     * @since 3.60.0
     */
    lineWidth: number;

    /**
     * The gradient of the Shine effect.
     *
     * @name Phaser.FX.Shine#gradient
     * @type {number}
     * @since 3.60.0
     */
    gradient: number;

    /**
     * Does this Shine effect reveal or get added to its target?
     *
     * @name Phaser.FX.Shine#reveal
     * @type {boolean}
     * @since 3.60.0
     */
    reveal: boolean;

    constructor(gameObject: any, speed: number = 0.5, lineWidth: number = 0.5, gradient: number = 3, reveal: boolean = false)
    {
        super(FX_CONST.SHINE, gameObject);

        this.speed = speed;
        this.lineWidth = lineWidth;
        this.gradient = gradient;
        this.reveal = reveal;
    }

}
