/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Controller } from './Controller';
import { FX_CONST } from './const';

/**
 * @classdesc
 * The Circle FX Controller.
 *
 * This FX controller manages the circle effect for a Game Object.
 *
 * This effect will draw a circle around the texture of the Game Object, effectively masking off
 * any area outside of the circle without the need for an actual mask. You can control the thickness
 * of the circle, the color of the circle and the color of the background, should the texture be
 * transparent. You can also control the feathering applied to the circle, allowing for a harsh or soft edge.
 *
 * Please note that adding this effect to a Game Object will not change the input area or physics body of
 * the Game Object, should it have one.
 *
 * A Circle effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addCircle();
 * sprite.postFX.addCircle();
 * ```
 *
 * @class Circle
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [thickness=8] - The width of the circle around the texture, in pixels.
 * @param {number} [color=0xfeedb6] - The color of the circular ring, given as a number value.
 * @param {number} [backgroundColor=0xff0000] - The color of the background, behind the texture, given as a number value.
 * @param {number} [scale=1] - The scale of the circle. The default scale is 1, which is a circle the full size of the underlying texture.
 * @param {number} [feather=0.005] - The amount of feathering to apply to the circle from the ring.
 */
export class Circle extends Controller {

    /**
     * The scale of the circle. The default scale is 1, which is a circle
     * the full size of the underlying texture. Reduce this value to create
     * a smaller circle, or increase it to create a circle that extends off
     * the edges of the texture.
     *
     * @name Phaser.FX.Circle#scale
     * @type {number}
     * @since 3.60.0
     */
    scale: number;

    /**
     * The amount of feathering to apply to the circle from the ring,
     * extending into the middle of the circle. The default is 0.005,
     * which is a very low amount of feathering just making sure the ring
     * has a smooth edge. Increase this amount to a value such as 0.5
     * or 0.025 for larger amounts of feathering.
     *
     * @name Phaser.FX.Circle#feather
     * @type {number}
     * @since 3.60.0
     */
    feather: number;

    /**
     * The width of the circle around the texture, in pixels. This value
     * doesn't factor in the feather, which can extend the thickness
     * internally depending on its value.
     *
     * @name Phaser.FX.Circle#thickness
     * @type {number}
     * @since 3.60.0
     */
    thickness: number;

    /**
     * The internal gl color array for the ring color.
     *
     * @name Phaser.FX.Circle#glcolor
     * @type {number[]}
     * @since 3.60.0
     */
    glcolor: number[];

    /**
     * The internal gl color array for the background color.
     *
     * @name Phaser.FX.Circle#glcolor2
     * @type {number[]}
     * @since 3.60.0
     */
    glcolor2: number[];

    constructor(gameObject: any, thickness: number = 8, color?: number, backgroundColor?: number, scale: number = 1, feather: number = 0.005)
    {
        super(FX_CONST.CIRCLE, gameObject);

        this.scale = scale;
        this.feather = feather;
        this.thickness = thickness;
        this.glcolor = [ 1, 0.2, 0.7 ];
        this.glcolor2 = [ 1, 0, 0, 0.4 ];

        if (color !== undefined && color !== null)
        {
            this.color = color;
        }

        if (backgroundColor !== undefined && backgroundColor !== null)
        {
            this.backgroundColor = backgroundColor;
        }
    }

    /**
     * The color of the circular ring, given as a number value.
     *
     * @name Phaser.FX.Circle#color
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

    /**
     * The color of the background, behind the texture, given as a number value.
     *
     * @name Phaser.FX.Circle#backgroundColor
     * @type {number}
     * @since 3.60.0
     */
    get backgroundColor(): number
    {
        const color = this.glcolor2;

        return (((color[0] * 255) << 16) + ((color[1] * 255) << 8) + (color[2] * 255 | 0));
    }

    set backgroundColor(value: number)
    {
        const color = this.glcolor2;

        color[0] = ((value >> 16) & 0xFF) / 255;
        color[1] = ((value >> 8) & 0xFF) / 255;
        color[2] = (value & 0xFF) / 255;
    }

    /**
     * The alpha of the background, behind the texture, given as a number value.
     *
     * @name Phaser.FX.Circle#backgroundAlpha
     * @type {number}
     * @since 3.70.0
     */
    get backgroundAlpha(): number
    {
        return this.glcolor2[3];
    }

    set backgroundAlpha(value: number)
    {
        this.glcolor2[3] = value;
    }
}
