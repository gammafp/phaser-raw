/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TintModes = require('../../renderer/TintModes');

/**
 * Provides methods used for setting the tint of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Tint
 * @webglOnly
 * @since 3.0.0
 */

var Tint = {

    /**
     * The tint value being applied to the top-left vertice of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintTopLeft
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintTopLeft: 0xffffff,

    /**
     * The tint value being applied to the top-right vertice of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintTopRight
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintTopRight: 0xffffff,

    /**
     * The tint value being applied to the bottom-left vertice of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintBottomLeft
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintBottomLeft: 0xffffff,

    /**
     * The tint value being applied to the bottom-right vertice of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintBottomRight
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintBottomRight: 0xffffff,

    /**
     * The tint mode to use when applying the tint to the texture.
     *
     * Available modes are:
     * - Phaser.TintModes.MULTIPLY (default)
     * - Phaser.TintModes.FILL
     * - Phaser.TintModes.ADD
     * - Phaser.TintModes.SCREEN
     * - Phaser.TintModes.OVERLAY
     * - Phaser.TintModes.HARD_LIGHT
     *
     * Note that in Phaser 3, this was a boolean.
     * It is now a number, with MULTIPLY and FILL corresponding to false and true respectively.
     *
     * @name Phaser.GameObjects.Components.Tint#tintFill
     * @type {number}
     * @default Phaser.TintModes.MULTIPLY
     * @since 4.0.0
     */
    tintFill: TintModes.MULTIPLY,

    /**
     * Clears all tint values associated with this Game Object.
     *
     * Immediately sets the color values back to 0xffffff and the tint mode to `MULTIPLY`,
     * which results in no visible change to the texture.
     *
     * @method Phaser.GameObjects.Components.Tint#clearTint
     * @webglOnly
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    clearTint: function ()
    {
        this.setTint(0xffffff);
        this.setTintFill(TintModes.MULTIPLY);

        return this;
    },

    /**
     * Sets an additive tint on this Game Object.
     *
     * The tint works by taking the pixel color values from the Game Objects texture, and then
     * multiplying it by the color value of the tint. You can provide either one color value,
     * in which case the whole Game Object will be tinted in that color. Or you can provide a color
     * per corner. The colors are blended together across the extent of the Game Object.
     *
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property to set all colors at once. Or, use the properties `tintTopLeft`, `tintTopRight,
     * `tintBottomLeft` and `tintBottomRight` to set the corner color values independently.
     *
     * To remove a tint call `clearTint`.
     *
     * @method Phaser.GameObjects.Components.Tint#setTint
     * @webglOnly
     * @since 3.0.0
     *
     * @param {number} [topLeft=0xffffff] - The tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object.
     * @param {number} [topRight] - The tint being applied to the top-right of the Game Object.
     * @param {number} [bottomLeft] - The tint being applied to the bottom-left of the Game Object.
     * @param {number} [bottomRight] - The tint being applied to the bottom-right of the Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setTint: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 0xffffff; }

        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        this.tintTopLeft = topLeft;
        this.tintTopRight = topRight;
        this.tintBottomLeft = bottomLeft;
        this.tintBottomRight = bottomRight;

        return this;
    },

    /**
     * Sets the tint fill mode to use when applying the tint to the texture.
     *
     * Note that in Phaser 3, this set a boolean and set the tint colors.
     * It is now solely responsible for setting the tint fill mode.
     *
     * @method Phaser.GameObjects.Components.Tint#setTintFill
     * @webglOnly
     * @since 4.0.0
     *
     * @param {number} mode - The tint mode to use.
     * @returns {this} This Game Object instance.
     */
    setTintFill: function (mode)
    {
        this.tintFill = mode;
        return this;
    },

    /**
     * The tint value being applied to the whole of the Game Object.
     * Return `tintTopLeft` when read this tint property.
     *
     * @name Phaser.GameObjects.Components.Tint#tint
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    tint: {

        get: function ()
        {
            return this.tintTopLeft;
        },

        set: function (value)
        {
            this.setTint(value, value, value, value);
        }
    },

    /**
     * Does this Game Object have a tint applied?
     *
     * It checks to see if the 4 tint properties are set to the value 0xffffff
     * and that the `tintFill` property is `MULTIPLY`.
     * This indicates that a Game Object isn't tinted.
     *
     * @name Phaser.GameObjects.Components.Tint#isTinted
     * @type {boolean}
     * @webglOnly
     * @readonly
     * @since 3.11.0
     */
    isTinted: {

        get: function ()
        {
            var white = 0xffffff;

            return (
                this.tintFill === TintModes.MULTIPLY ||
                this.tintTopLeft !== white ||
                this.tintTopRight !== white ||
                this.tintBottomLeft !== white ||
                this.tintBottomRight !== white
            );
        }

    }

};

module.exports = Tint;
