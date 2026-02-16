/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../../utils/MixinTS';
import { BitmapText } from '../static/BitmapText';
import { renderWebGL, renderCanvas } from './DynamicBitmapTextRender';

/**
 * @classdesc
 * BitmapText objects work by taking a texture file and an XML or JSON file that describes the font structure.
 *
 * During rendering for each letter of the text is rendered to the display, proportionally spaced out and aligned to
 * match the font structure.
 *
 * Dynamic Bitmap Text objects are different from Static Bitmap Text in that they invoke a callback for each
 * letter being rendered during the render pass. This callback allows you to manipulate the properties of
 * each letter being rendered, such as its position, scale or tint, allowing you to create interesting effects
 * like jiggling text, which can't be done with Static text. This means that Dynamic Text takes more processing
 * time, so only use them if you require the callback ability they have.
 *
 * @class DynamicBitmapText
 * @extends Phaser.GameObjects.BitmapText
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {number} x - The x coordinate of this Game Object in world space.
 * @param {number} y - The y coordinate of this Game Object in world space.
 * @param {string} font - The key of the font to use from the Bitmap Font cache.
 * @param {(string|string[])} [text] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @param {number} [size] - The font size of this Bitmap Text.
 * @param {number} [align=0] - The alignment of the text in a multi-line BitmapText object.
 */
export class DynamicBitmapText extends BitmapText
{
    static
    {
        Mixin(this, [
            { renderWebGL, renderCanvas }
        ]);
    }

    /**
     * The horizontal scroll position of the Bitmap Text.
     */
    scrollX: number;

    /**
     * The vertical scroll position of the Bitmap Text.
     */
    scrollY: number;

    /**
     * The crop width of the Bitmap Text.
     */
    cropWidth: number;

    /**
     * The crop height of the Bitmap Text.
     */
    cropHeight: number;

    /**
     * A callback that alters how each character of the Bitmap Text is rendered.
     */
    displayCallback: any;

    /**
     * The data object that is populated during rendering, then passed to the displayCallback.
     */
    callbackData: any;

    constructor (scene: any, x: number, y: number, font: string, text?: string | string[], size?: number, align?: number)
    {
        super(scene, x, y, font, text, size, align);

        this.type = 'DynamicBitmapText';

        this.scrollX = 0;
        this.scrollY = 0;
        this.cropWidth = 0;
        this.cropHeight = 0;
        this.displayCallback;
        this.callbackData = {
            parent: this,
            color: 0,
            tint: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0
            },
            index: 0,
            charCode: 0,
            x: 0,
            y: 0,
            scale: 0,
            rotation: 0,
            data: 0
        };
    }

    /**
     * Set the crop size of this Bitmap Text.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of the crop.
     * @param {number} height - The height of the crop.
     *
     * @return {this} This Game Object.
     */
    setSize (width: number, height: number): this
    {
        this.cropWidth = width;
        this.cropHeight = height;

        return this;
    }

    /**
     * Set a callback that alters how each character of the Bitmap Text is rendered.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setDisplayCallback
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.BitmapText.DisplayCallback} callback - The display callback to set.
     *
     * @return {this} This Game Object.
     */
    setDisplayCallback (callback: any): this
    {
        this.displayCallback = callback;

        return this;
    }

    /**
     * Set the horizontal scroll position of this Bitmap Text.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setScrollX
     * @since 3.0.0
     *
     * @param {number} value - The horizontal scroll position to set.
     *
     * @return {this} This Game Object.
     */
    setScrollX (value: number): this
    {
        this.scrollX = value;

        return this;
    }

    /**
     * Set the vertical scroll position of this Bitmap Text.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setScrollY
     * @since 3.0.0
     *
     * @param {number} value - The vertical scroll position to set.
     *
     * @return {this} This Game Object.
     */
    setScrollY (value: number): this
    {
        this.scrollY = value;

        return this;
    }
}
