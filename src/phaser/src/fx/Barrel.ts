/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Controller } from './Controller';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The Barrel FX Controller.
 *
 * This FX controller manages the barrel distortion effect for a Game Object.
 *
 * A barrel effect allows you to apply either a 'pinch' or 'expand' distortion to
 * a Game Object. The amount of the effect can be modified in real-time.
 *
 * A Barrel effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addBarrel();
 * sprite.postFX.addBarrel();
 * ```
 *
 * @class Barrel
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [amount=1] - The amount of distortion applied to the barrel effect. A value of 1 is no distortion. Typically keep this within +- 1.
 */
export class Barrel extends Controller {

    /**
     * The amount of distortion applied to the barrel effect.
     *
     * Typically keep this within the range 1 (no distortion) to +- 1.
     *
     * @name Phaser.FX.Barrel#amount
     * @type {number}
     * @since 3.60.0
     */
    amount: number;

    constructor(gameObject: any, amount: number = 1)
    {
        super(FX_CONST.BARREL, gameObject);

        this.amount = amount;
    }

}
