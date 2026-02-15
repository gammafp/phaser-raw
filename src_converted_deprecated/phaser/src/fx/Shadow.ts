/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Controller } from './Controller';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The Shadow FX Controller.
 *
 * This FX controller manages the shadow effect for a Game Object.
 *
 * The shadow effect is a visual technique used to create the illusion of depth and realism by adding darker,
 * offset silhouettes or shapes beneath game objects, characters, or environments. These simulated shadows
 * help to enhance the visual appeal and immersion, making the 2D game world appear more dynamic and three-dimensional.
 *
 * A Shadow effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addShadow();
 * sprite.postFX.addShadow();
 * ```
 *
 * @class Shadow
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [x=0] - The horizontal offset of the shadow effect.
 * @param {number} [y=0] - The vertical offset of the shadow effect.
 * @param {number} [decay=0.1] - The amount of decay for shadow effect.
 * @param {number} [power=1] - The power of the shadow effect.
 * @param {number} [color=0x000000] - The color of the shadow.
 * @param {number} [samples=6] - The number of samples that the shadow effect will run for. An integer between 1 and 12.
 * @param {number} [intensity=1] - The intensity of the shadow effect.
 */
export class Shadow extends Controller {

    /**
     * The horizontal offset of the shadow effect.
     *
     * @name Phaser.FX.Shadow#x
     * @type {number}
     * @since 3.60.0
     */
    x: number;

    /**
     * The vertical offset of the shadow effect.
     *
     * @name Phaser.FX.Shadow#y
     * @type {number}
     * @since 3.60.0
     */
    y: number;

    /**
     * The amount of decay for the shadow effect.
     *
     * @name Phaser.FX.Shadow#decay
     * @type {number}
     * @since 3.60.0
     */
    decay: number;

    /**
     * The power of the shadow effect.
     *
     * @name Phaser.FX.Shadow#power
     * @type {number}
     * @since 3.60.0
     */
    power: number;

    /**
     * The internal gl color array.
     *
     * @name Phaser.FX.Shadow#glcolor
     * @type {number[]}
     * @since 3.60.0
     */
    glcolor: number[];

    /**
     * The number of samples that the shadow effect will run for.
     *
     * This should be an integer with a minimum value of 1 and a maximum of 12.
     *
     * @name Phaser.FX.Shadow#samples
     * @type {number}
     * @since 3.60.0
     */
    samples: number;

    /**
     * The intensity of the shadow effect.
     *
     * @name Phaser.FX.Shadow#intensity
     * @type {number}
     * @since 3.60.0
     */
    intensity: number;

    constructor(gameObject: any, x: number = 0, y: number = 0, decay: number = 0.1, power: number = 1, color?: number, samples: number = 6, intensity: number = 1)
    {
        super(FX_CONST.SHADOW, gameObject);

        this.x = x;
        this.y = y;
        this.decay = decay;
        this.power = power;
        this.glcolor = [ 0, 0, 0, 1 ];
        this.samples = samples;
        this.intensity = intensity;

        if (color !== undefined)
        {
            this.color = color;
        }
    }

    /**
     * The color of the shadow.
     *
     * @name Phaser.FX.Shadow#color
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
