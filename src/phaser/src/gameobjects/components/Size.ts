/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the size of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Size
 * @since 3.0.0
 */

export interface Size {
    _sizeComponent: boolean;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
    frame: any;
    input: any;
    displayWidth: number;
    displayHeight: number;
    setSizeToFrame(frame?: any): this;
    setSize(width: number, height: number): this;
    setDisplaySize(width: number, height: number): this;
}

export const Size = {

    /**
     * A property indicating that a Game Object has this component.
     *
     * @name Phaser.GameObjects.Components.Size#_sizeComponent
     * @type {boolean}
     * @private
     * @default true
     * @since 3.2.0
     */
    _sizeComponent: true,

    /**
     * The native (un-scaled) width of this Game Object.
     *
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayWidth` property.
     *
     * @name Phaser.GameObjects.Components.Size#width
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
     * @name Phaser.GameObjects.Components.Size#height
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
     * @name Phaser.GameObjects.Components.Size#displayWidth
     * @type {number}
     * @since 3.0.0
     */
    get displayWidth(): number
    {
        return Math.abs(this.scaleX * this.frame.realWidth);
    },

    set displayWidth(value: number)
    {
        this.scaleX = value / this.frame.realWidth;
    },

    /**
     * The displayed height of this Game Object.
     *
     * This value takes into account the scale factor.
     *
     * Setting this value will adjust the Game Object's scale property.
     *
     * @name Phaser.GameObjects.Components.Size#displayHeight
     * @type {number}
     * @since 3.0.0
     */
    get displayHeight(): number
    {
        return Math.abs(this.scaleY * this.frame.realHeight);
    },

    set displayHeight(value: number)
    {
        this.scaleY = value / this.frame.realHeight;
    },

    /**
     * Sets the size of this Game Object to be that of the given Frame.
     *
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     *
     * If you have enabled this Game Object for input, changing the size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
     *
     * @method Phaser.GameObjects.Components.Size#setSizeToFrame
     * @since 3.0.0
     *
     * @param {Phaser.Textures.Frame|boolean} [frame] - The frame to base the size of this Game Object on.
     *
     * @return {this} This Game Object instance.
     */
    setSizeToFrame(this: any, frame?: any): any
    {
        if (!frame) { frame = this.frame; }

        this.width = frame.realWidth;
        this.height = frame.realHeight;

        const input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = this.width;
            input.hitArea.height = this.height;
        }

        return this;
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
     * @method Phaser.GameObjects.Components.Size#setSize
     * @since 3.0.0
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
     * @method Phaser.GameObjects.Components.Size#setDisplaySize
     * @since 3.0.0
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
