/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Controller } from './Controller';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The Blur FX Controller.
 *
 * This FX controller manages the blur effect for a Game Object.
 *
 * A Gaussian blur is the result of blurring an image by a Gaussian function. It is a widely used effect,
 * typically to reduce image noise and reduce detail. The visual effect of this blurring technique is a
 * smooth blur resembling that of viewing the image through a translucent screen, distinctly different
 * from the bokeh effect produced by an out-of-focus lens or the shadow of an object under usual illumination.
 *
 * A Blur effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addBlur();
 * sprite.postFX.addBlur();
 * ```
 *
 * @class Blur
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [quality=0] - The quality of the blur effect. Can be either 0 for Low Quality, 1 for Medium Quality or 2 for High Quality.
 * @param {number} [x=2] - The horizontal offset of the blur effect.
 * @param {number} [y=2] - The vertical offset of the blur effect.
 * @param {number} [strength=1] - The strength of the blur effect.
 * @param {number} [color=0xffffff] - The color of the blur, as a hex value.
 * @param {number} [steps=4] - The number of steps to run the blur effect for. This value should always be an integer.
 */
export class Blur extends Controller {

    /**
     * The quality of the blur effect.
     *
     * This can be:
     *
     * 0 for Low Quality
     * 1 for Medium Quality
     * 2 for High Quality
     *
     * The higher the quality, the more complex shader is used
     * and the more processing time is spent on the GPU calculating
     * the final blur. This value is used in conjunction with the
     * `steps` value, as one has a direct impact on the other.
     *
     * Keep this value as low as you can, while still achieving the
     * desired effect you need for your game.
     *
     * @name Phaser.FX.Blur#quality
     * @type {number}
     * @since 3.60.0
     */
    quality: number;

    /**
     * The horizontal offset of the blur effect.
     *
     * @name Phaser.FX.Blur#x
     * @type {number}
     * @since 3.60.0
     */
    x: number;

    /**
     * The vertical offset of the blur effect.
     *
     * @name Phaser.FX.Blur#y
     * @type {number}
     * @since 3.60.0
     */
    y: number;

    /**
     * The number of steps to run the Blur effect for.
     *
     * This value should always be an integer.
     *
     * It defaults to 4. The higher the value, the smoother the blur,
     * but at the cost of exponentially more gl operations.
     *
     * Keep this to the lowest possible number you can have it, while
     * still looking correct for your game.
     *
     * @name Phaser.FX.Blur#steps
     * @type {number}
     * @since 3.60.0
     */
    steps: number;

    /**
     * The strength of the blur effect.
     *
     * @name Phaser.FX.Blur#strength
     * @type {number}
     * @since 3.60.0
     */
    strength: number;

    /**
     * The internal gl color array.
     *
     * @name Phaser.FX.Blur#glcolor
     * @type {number[]}
     * @since 3.60.0
     */
    glcolor: number[];

    constructor(gameObject: any, quality: number = 0, x: number = 2, y: number = 2, strength: number = 1, color?: number, steps: number = 4)
    {
        super(FX_CONST.BLUR, gameObject);

        this.quality = quality;
        this.x = x;
        this.y = y;
        this.steps = steps;
        this.strength = strength;
        this.glcolor = [ 1, 1, 1 ];

        if (color !== undefined && color !== null)
        {
            this.color = color;
        }
    }

    /**
     * The color of the blur as a number value.
     *
     * @name Phaser.FX.Blur#color
     * @type {number}
     * @since 3.60.0
     */
    get color(): number
    {
        const color = this.glcolor;

        return (((color[0] * 255) << 16) + ((color[1] * 255) << 8) + (color[2] * 255 | 0));
    }

    set color(value: number)
    {
        const color = this.glcolor;

        color[0] = ((value >> 16) & 0xFF) / 255;
        color[1] = ((value >> 8) & 0xFF) / 255;
        color[2] = (value & 0xFF) / 255;
    }

}
