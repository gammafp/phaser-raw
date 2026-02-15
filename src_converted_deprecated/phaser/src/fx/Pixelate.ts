/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Controller } from './Controller';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The Pixelate FX Controller.
 *
 * This FX controller manages the pixelate effect for a Game Object.
 *
 * The pixelate effect is a visual technique that deliberately reduces the resolution or detail of an image,
 * creating a blocky or mosaic appearance composed of large, visible pixels. This effect can be used for stylistic
 * purposes, as a homage to retro gaming, or as a means to obscure certain elements within the game, such as
 * during a transition or to censor specific content.
 *
 * A Pixelate effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addPixelate();
 * sprite.postFX.addPixelate();
 * ```
 *
 * @class Pixelate
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [amount=1] - The amount of pixelation to apply.
 */
export class Pixelate extends Controller {

    /**
     * The amount of pixelation to apply.
     *
     * @name Phaser.FX.Pixelate#amount
     * @type {number}
     * @since 3.60.0
     */
    amount: number;

    constructor(gameObject: any, amount: number = 1)
    {
        super(FX_CONST.PIXELATE, gameObject);

        this.amount = amount;
    }

}
