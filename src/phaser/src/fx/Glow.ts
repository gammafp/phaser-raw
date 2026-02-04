/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Controller } from './Controller';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The Glow FX Controller.
 *
 * This FX controller manages the glow effect for a Game Object.
 *
 * The glow effect is a visual technique that creates a soft, luminous halo around game objects,
 * characters, or UI elements. This effect is used to emphasize importance, enhance visual appeal,
 * or convey a sense of energy, magic, or otherworldly presence. The effect can also be set on
 * the inside of the Game Object. The color and strength of the glow can be modified.
 *
 * A Glow effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addGlow();
 * sprite.postFX.addGlow();
 * ```
 *
 * @class Glow
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [color=0xffffff] - The color of the glow effect as a number value.
 * @param {number} [outerStrength=4] - The strength of the glow outward from the edge of the Sprite.
 * @param {number} [innerStrength=0] - The strength of the glow inward from the edge of the Sprite.
 * @param {boolean} [knockout=false] - If `true` only the glow is drawn, not the texture itself.
 */
export class Glow extends Controller {

    /**
     * The strength of the glow outward from the edge of the Sprite.
     *
     * @name Phaser.FX.Glow#outerStrength
     * @type {number}
     * @since 3.60.0
     */
    outerStrength: number;

    /**
     * The strength of the glow inward from the edge of the Sprite.
     *
     * @name Phaser.FX.Glow#innerStrength
     * @type {number}
     * @since 3.60.0
     */
    innerStrength: number;

    /**
     * If `true` only the glow is drawn, not the texture itself.
     *
     * @name Phaser.FX.Glow#knockout
     * @type {number}
     * @since 3.60.0
     */
    knockout: boolean;

    /**
     * A 4 element array of gl color values.
     *
     * @name Phaser.FX.Glow#glcolor
     * @type {number[]}
     * @since 3.60.0
     */
    glcolor: number[];

    constructor(gameObject: any, color?: number, outerStrength: number = 4, innerStrength: number = 0, knockout: boolean = false)
    {
        super(FX_CONST.GLOW, gameObject);

        this.outerStrength = outerStrength;
        this.innerStrength = innerStrength;
        this.knockout = knockout;
        this.glcolor = [ 1, 1, 1, 1 ];

        if (color !== undefined)
        {
            this.color = color;
        }
    }

    /**
     * The color of the glow as a number value.
     *
     * @name Phaser.FX.Glow#color
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
