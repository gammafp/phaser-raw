/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for calculating and setting the size of a non-Frame based Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.ComputedSize
 * @since 3.0.0
 */

export interface ComputedSize {
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
    displayWidth: number;
    displayHeight: number;
    setSize(width: number, height: number): this;
    setDisplaySize(width: number, height: number): this;
}

export const ComputedSize = {

    /**
     * The native (un-scaled) width of this Game Object.
     *
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayWidth` property.
     *
     * @name Phaser.GameObjects.Components.ComputedSize#width
     * @type {number}
     * @since 3.0.0
     */
    width: 0,

    /**
     * The native (un-scaled) height of this Game Object.
     *
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayHeight` property.
     *
     * @name Phaser.GameObjects.Components.ComputedSize#height
     * @type {number}
     * @since 3.0.0
     */
    height: 0,

    /**
     * The displayed width of this Game Object.
     *
     * This value takes into account the scale factor.
     *
     * Setting this value will adjust the Game Object's scale property.
     *
     * @name Phaser.GameObjects.Components.ComputedSize#displayWidth
     * @type {number}
     * @since 3.0.0
     */
    get displayWidth(): number
    {
        return this.scaleX * this.width;
    },

    set displayWidth(value: number)
    {
        this.scaleX = value / this.width;
    },

    /**
     * The displayed height of this Game Object.
     *
     * This value takes into account the scale factor.
     *
     * Setting this value will adjust the Game Object's scale property.
     *
     * @name Phaser.GameObjects.Components.ComputedSize#displayHeight
     * @type {number}
     * @since 3.0.0
     */
    get displayHeight(): number
    {
        return this.scaleY * this.height;
    },

    set displayHeight(value: number)
    {
        this.scaleY = value / this.height;
    },

    /**
     * Sets the internal size of this Game Object, as used for frame or physics body creation.
     *
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     *
     * If you have enabled this Game Object for input, changing the size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
     *
     * @method Phaser.GameObjects.Components.ComputedSize#setSize
     * @since 3.4.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setSize(this: any, width: number, height: number): any
    {
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Sets the display size of this Game Object.
     *
     * Calling this will adjust the scale.
     *
     * @method Phaser.GameObjects.Components.ComputedSize#setDisplaySize
     * @since 3.4.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setDisplaySize(this: any, width: number, height: number): any
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

};
