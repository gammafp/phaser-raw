/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Rectangle } from '../../../geom/rectangle/Rectangle';
import { Clamp } from '../../../math/Clamp';
import { Mixin } from '../../../utils/MixinTS';
import { Alpha } from '../../components/Alpha';
import { BlendMode } from '../../components/BlendMode';
import { Depth } from '../../components/Depth';
import { GetBounds } from '../../components/GetBounds';
import { Lighting } from '../../components/Lighting';
import { Mask } from '../../components/Mask';
import { Origin } from '../../components/Origin';
import { RenderNodes } from '../../components/RenderNodes';
import { ScrollFactor } from '../../components/ScrollFactor';
import { Texture } from '../../components/Texture';
import { Tint } from '../../components/Tint';
import { Transform } from '../../components/Transform';
import { Visible } from '../../components/Visible';
import { renderWebGL, renderCanvas } from './BitmapTextRender';
import { GetBitmapTextSize } from '../GetBitmapTextSize';
import { ParseFromAtlas } from '../ParseFromAtlas';
import { ParseXMLBitmapFont } from '../ParseXMLBitmapFont';

import { DefaultBitmapTextNodes } from '../../../renderer/webgl/renderNodes/defaults/DefaultBitmapTextNodes';
import { GameObject } from '../../GameObject';
var Components = require('../../components');
import { TintModes } from '../../../renderer/TintModes';

/**
 * @classdesc
 * BitmapText objects work by taking a texture file and an XML or JSON file that describes the font structure.
 *
 * During rendering for each letter of the text is rendered to the display, proportionally spaced out and aligned to
 * match the font structure.
 *
 * BitmapText objects are less flexible than Text objects, in that they have less features such as shadows, fills and the ability
 * to use Web Fonts, however you trade this flexibility for rendering speed. You can also create visually compelling BitmapTexts by
 * processing the font texture in an image editor, applying fills and any other effects required.
 *
 * To create multi-line text insert \r, \n or \r\n escape codes into the text string.
 *
 * @class BitmapText
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. It can only belong to one Scene at any given time.
 * @param {number} x - The x coordinate of this Game Object in world space.
 * @param {number} y - The y coordinate of this Game Object in world space.
 * @param {string} font - The key of the font to use from the Bitmap Font cache.
 * @param {(string|string[])} [text] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @param {number} [size] - The font size of this Bitmap Text.
 * @param {number} [align=0] - The alignment of the text in a multi-line BitmapText object.
 */

export interface BitmapText extends
    Alpha,
    BlendMode,
    Depth,
    GetBounds,
    Lighting,
    Mask,
    Origin,
    RenderNodes,
    ScrollFactor,
    Texture,
    Tint,
    Transform,
    Visible {}

export class BitmapText extends GameObject
{
    static
    {
        Mixin(this, [
            Alpha,
            BlendMode,
            Depth,
            GetBounds,
            Lighting,
            Mask,
            Origin,
            RenderNodes,
            ScrollFactor,
            Texture,
            Tint,
            Transform,
            Visible,
            { renderWebGL, renderCanvas }
        ]);
    }

    /**
     * Left align the text characters in a multi-line BitmapText object.
     *
     * @name Phaser.GameObjects.BitmapText.ALIGN_LEFT
     * @type {number}
     * @since 3.11.0
     */
    static ALIGN_LEFT: number = 0;

    /**
     * Center align the text characters in a multi-line BitmapText object.
     *
     * @name Phaser.GameObjects.BitmapText.ALIGN_CENTER
     * @type {number}
     * @since 3.11.0
     */
    static ALIGN_CENTER: number = 1;

    /**
     * Right align the text characters in a multi-line BitmapText object.
     *
     * @name Phaser.GameObjects.BitmapText.ALIGN_RIGHT
     * @type {number}
     * @since 3.11.0
     */
    static ALIGN_RIGHT: number = 2;

    /**
     * Parse an XML Bitmap Font from an Atlas.
     *
     * @method Phaser.GameObjects.BitmapText.ParseFromAtlas
     * @since 3.0.0
     */
    static ParseFromAtlas = ParseFromAtlas;

    /**
     * Parse an XML font to Bitmap Font data for the Bitmap Font cache.
     *
     * @method Phaser.GameObjects.BitmapText.ParseXMLBitmapFont
     * @since 3.17.0
     */
    static ParseXMLBitmapFont = ParseXMLBitmapFont;

    /**
     * The key of the Bitmap Font used by this Bitmap Text.
     */
    font: string;

    /**
     * The data of the Bitmap Font used by this Bitmap Text.
     */
    fontData: any;

    /**
     * The text that this Bitmap Text object displays.
     */
    _text: string;

    /**
     * The font size of this Bitmap Text.
     */
    _fontSize: number;

    /**
     * Adds / Removes spacing between characters.
     */
    _letterSpacing: number;

    /**
     * Adds / Removes line spacing in a multiline BitmapText object.
     */
    _lineSpacing: number;

    /**
     * Controls the alignment of each line of text in this BitmapText object.
     */
    _align: number;

    /**
     * An object that describes the size of this Bitmap Text.
     */
    _bounds: any;

    /**
     * An internal dirty flag for bounds calculation.
     */
    _dirty: boolean;

    /**
     * Internal cache var holding the maxWidth.
     */
    _maxWidth: number;

    /**
     * The character code used to detect for word wrapping.
     * Defaults to 32 (a space character).
     */
    wordWrapCharCode: number;

    /**
     * Internal array holding the character tint color data.
     */
    charColors: any[];

    /**
     * The horizontal offset of the drop shadow.
     */
    dropShadowX: number;

    /**
     * The vertical offset of the drop shadow.
     */
    dropShadowY: number;

    /**
     * The color of the drop shadow.
     */
    dropShadowColor: number;

    /**
     * The alpha value of the drop shadow.
     */
    dropShadowAlpha: number;

    /**
     * Indicates whether the font texture is from an atlas or not.
     */
    fromAtlas: boolean;

    constructor (scene: any, x: number, y: number, font: string, text?: string | string[], size?: number, align?: number)
    {
        if (text === undefined) { text = ''; }
        if (align === undefined) { align = 0; }

        super(scene, 'BitmapText');

        this.font = font;

        var entry = this.scene.sys.cache.bitmapFont.get(font);

        if (!entry)
        {
            console.warn('Invalid BitmapText key: ' + font);
        }

        this.fontData = entry.data;
        this._text = '';
        this._fontSize = size || this.fontData.size;
        this._letterSpacing = 0;
        this._lineSpacing = 0;
        this._align = align;
        this._bounds = GetBitmapTextSize();
        this._dirty = true;
        this._maxWidth = 0;
        this.wordWrapCharCode = 32;
        this.charColors = [];
        this.dropShadowX = 0;
        this.dropShadowY = 0;
        this.dropShadowColor = 0x000000;
        this.dropShadowAlpha = 0.5;
        this.fromAtlas = entry.fromAtlas;

        this.setTexture(entry.texture, entry.frame);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initRenderNodes(this._defaultRenderNodesMap);

        this.setText(text);
    }

    /**
     * The default render nodes to initialize.
     */
    get _defaultRenderNodesMap (): any
    {
        return DefaultBitmapTextNodes;
    }

    /**
     * Set the lines of text in this BitmapText to be left-aligned.
     * This only has any effect if this BitmapText contains more than one line of text.
     *
     * @method Phaser.GameObjects.BitmapText#setLeftAlign
     * @since 3.11.0
     *
     * @return {this} This BitmapText Object.
     */
    setLeftAlign (): this
    {
        this._align = BitmapText.ALIGN_LEFT;

        this._dirty = true;

        return this;
    }

    /**
     * Set the lines of text in this BitmapText to be center-aligned.
     * This only has any effect if this BitmapText contains more than one line of text.
     *
     * @method Phaser.GameObjects.BitmapText#setCenterAlign
     * @since 3.11.0
     *
     * @return {this} This BitmapText Object.
     */
    setCenterAlign (): this
    {
        this._align = BitmapText.ALIGN_CENTER;

        this._dirty = true;

        return this;
    }

    /**
     * Set the lines of text in this BitmapText to be right-aligned.
     * This only has any effect if this BitmapText contains more than one line of text.
     *
     * @method Phaser.GameObjects.BitmapText#setRightAlign
     * @since 3.11.0
     *
     * @return {this} This BitmapText Object.
     */
    setRightAlign (): this
    {
        this._align = BitmapText.ALIGN_RIGHT;

        this._dirty = true;

        return this;
    }

    /**
     * Set the font size of this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#setFontSize
     * @since 3.0.0
     *
     * @param {number} size - The font size to set.
     *
     * @return {this} This BitmapText Object.
     */
    setFontSize (size: number): this
    {
        this._fontSize = size;

        this._dirty = true;

        return this;
    }

    /**
     * Sets the letter spacing between each character of this Bitmap Text.
     * Can be a positive value to increase the space, or negative to reduce it.
     * Spacing is applied after the kerning values have been set.
     *
     * @method Phaser.GameObjects.BitmapText#setLetterSpacing
     * @since 3.4.0
     *
     * @param {number} [spacing=0] - The amount of horizontal space to add between each character.
     *
     * @return {this} This BitmapText Object.
     */
    setLetterSpacing (spacing?: number): this
    {
        if (spacing === undefined) { spacing = 0; }

        this._letterSpacing = spacing;

        this._dirty = true;

        return this;
    }

    /**
     * Sets the line spacing value. This value is added to the font height to
     * calculate the overall line height.
     *
     * @method Phaser.GameObjects.BitmapText#setLineSpacing
     * @since 3.60.0
     *
     * @param {number} [spacing=0] - The amount of space to add between each line in multi-line text.
     *
     * @return {this} This BitmapText Object.
     */
    setLineSpacing (spacing?: number): this
    {
        if (spacing === undefined) { spacing = 0; }

        this.lineSpacing = spacing;

        return this;
    }

    /**
     * Set the textual content of this BitmapText.
     *
     * @method Phaser.GameObjects.BitmapText#setText
     * @since 3.0.0
     *
     * @param {(string|string[])} value - The string, or array of strings, to be set as the content of this BitmapText.
     *
     * @return {this} This BitmapText Object.
     */
    setText (value: string | string[]): this
    {
        if (!value && value !== (0 as any))
        {
            value = '';
        }

        if (Array.isArray(value))
        {
            value = value.join('\n');
        }

        if (value !== this.text)
        {
            this._text = value.toString();

            this._dirty = true;

            this.updateDisplayOrigin();
        }

        return this;
    }

    /**
     * Sets a drop shadow effect on this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#setDropShadow
     * @webglOnly
     * @since 3.50.0
     *
     * @param {number} [x=0] - The horizontal offset of the drop shadow.
     * @param {number} [y=0] - The vertical offset of the drop shadow.
     * @param {number} [color=0x000000] - The color of the drop shadow.
     * @param {number} [alpha=0.5] - The alpha of the drop shadow.
     *
     * @return {this} This BitmapText Object.
     */
    setDropShadow (x?: number, y?: number, color?: number, alpha?: number): this
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (color === undefined) { color = 0x000000; }
        if (alpha === undefined) { alpha = 0.5; }

        this.dropShadowX = x;
        this.dropShadowY = y;
        this.dropShadowColor = color;
        this.dropShadowAlpha = alpha;

        return this;
    }

    /**
     * Sets a tint on a range of characters in this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#setCharacterTint
     * @webglOnly
     * @since 3.50.0
     *
     * @param {number} [start=0] - The starting character to begin the tint at.
     * @param {number} [length=1] - The number of characters to tint.
     * @param {number} [tintFill=Phaser.TintModes.MULTIPLY] - The tint fill mode to use.
     * @param {number} [topLeft=0xffffff] - The tint being applied to the top-left of the character.
     * @param {number} [topRight] - The tint being applied to the top-right of the character.
     * @param {number} [bottomLeft] - The tint being applied to the bottom-left of the character.
     * @param {number} [bottomRight] - The tint being applied to the bottom-right of the character.
     *
     * @return {this} This BitmapText Object.
     */
    setCharacterTint (start?: number, length?: number, tintFill?: number, topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this
    {
        if (start === undefined) { start = 0; }
        if (length === undefined) { length = 1; }
        if (tintFill === undefined) { tintFill = TintModes.MULTIPLY; }
        if (topLeft === undefined) { topLeft = -1; }

        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        var len = this.text.length;

        if (length === -1)
        {
            length = len;
        }

        if (start < 0)
        {
            start = len + start;
        }

        start = Clamp(start, 0, len - 1);

        var end = Clamp(start + length, start, len);

        var charColors = this.charColors;

        for (var i = start; i < end; i++)
        {
            var color = charColors[i];

            if (topLeft === -1)
            {
                charColors[i] = null;
            }
            else
            {
                var tintEffect = tintFill;

                if (color)
                {
                    color.tintEffect = tintEffect;
                    color.tintTL = topLeft;
                    color.tintTR = topRight;
                    color.tintBL = bottomLeft;
                    color.tintBR = bottomRight;
                }
                else
                {
                    charColors[i] = {
                        tintEffect: tintEffect,
                        tintTL: topLeft,
                        tintTR: topRight,
                        tintBL: bottomLeft,
                        tintBR: bottomRight
                    };
                }
            }
        }

        return this;
    }

    /**
     * Sets a tint on a matching word within this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#setWordTint
     * @webglOnly
     * @since 3.50.0
     *
     * @param {(string|number)} word - The word to search for.
     * @param {number} [count=1] - The number of matching words to tint.
     * @param {number} [tintFill=Phaser.TintModes.MULTIPLY] - The tint fill mode to use.
     * @param {number} [topLeft=0xffffff] - The tint being applied to the top-left of the word.
     * @param {number} [topRight] - The tint being applied to the top-right of the word.
     * @param {number} [bottomLeft] - The tint being applied to the bottom-left of the word.
     * @param {number} [bottomRight] - The tint being applied to the bottom-right of the word.
     *
     * @return {this} This BitmapText Object.
     */
    setWordTint (word: string | number, count?: number, tintFill?: number, topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this
    {
        if (count === undefined) { count = 1; }

        var bounds = this.getTextBounds();

        var words = bounds.words;

        var wordIsNumber = (typeof (word) === 'number');

        var total = 0;

        for (var i = 0; i < words.length; i++)
        {
            var lineword = words[i];

            if ((wordIsNumber && i === word) || (!wordIsNumber && lineword.word === word))
            {
                this.setCharacterTint(lineword.i, lineword.word.length, tintFill, topLeft, topRight, bottomLeft, bottomRight);

                total++;

                if (total === count)
                {
                    return this;
                }
            }
        }

        return this;
    }

    /**
     * Calculate the bounds of this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#getTextBounds
     * @since 3.0.0
     *
     * @param {boolean} [round=false] - Whether to round the results up to the nearest integer.
     *
     * @return {Phaser.Types.GameObjects.BitmapText.BitmapTextSize} An object that describes the size of this Bitmap Text.
     */
    getTextBounds (round?: boolean): any
    {
        var bounds = this._bounds;

        if (this._dirty || round || this.scaleX !== bounds.scaleX || this.scaleY !== bounds.scaleY)
        {
            GetBitmapTextSize(this, round, true, bounds);

            this._dirty = false;
        }

        return bounds;
    }

    /**
     * Gets the character located at the given x/y coordinate within this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#getCharacterAt
     * @since 3.50.0
     *
     * @param {number} x - The x position to check.
     * @param {number} y - The y position to check.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera which is being tested against.
     *
     * @return {Phaser.Types.GameObjects.BitmapText.BitmapTextCharacter} The character object at the given position, or `null`.
     */
    getCharacterAt (x: number, y: number, camera?: any): any
    {
        var point = this.getLocalPoint(x, y, null, camera);

        var bounds = this.getTextBounds();

        var chars = bounds.characters;

        var tempRect = new Rectangle();

        for (var i = 0; i < chars.length; i++)
        {
            var char = chars[i];

            tempRect.setTo(char.x, char.t, char.r - char.x, char.b);

            if (tempRect.contains(point.x, point.y))
            {
                return char;
            }
        }

        return null;
    }

    /**
     * Updates the Display Origin cached values internally stored on this Game Object.
     *
     * @method Phaser.GameObjects.BitmapText#updateDisplayOrigin
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    updateDisplayOrigin (): this
    {
        this._dirty = true;

        this.getTextBounds(false);

        return this;
    }

    /**
     * Changes the font this BitmapText is using to render.
     *
     * @method Phaser.GameObjects.BitmapText#setFont
     * @since 3.11.0
     *
     * @param {string} key - The key of the font to use from the Bitmap Font cache.
     * @param {number} [size] - The font size of this Bitmap Text.
     * @param {number} [align=0] - The alignment of the text in a multi-line BitmapText object.
     *
     * @return {this} This BitmapText Object.
     */
    setFont (key: string, size?: number, align?: number): this
    {
        if (size === undefined) { size = this._fontSize; }
        if (align === undefined) { align = this._align; }

        var entry = this.scene.sys.cache.bitmapFont.get(key);

        if (entry)
        {
            this.font = key;
            this.fontData = entry.data;
            this._fontSize = size;
            this._align = align;
            this.fromAtlas = entry.fromAtlas === true;

            this.setTexture(entry.texture, entry.frame);

            GetBitmapTextSize(this, false, true, this._bounds);
        }

        return this;
    }

    /**
     * Sets the maximum display width of this BitmapText in pixels.
     *
     * @method Phaser.GameObjects.BitmapText#setMaxWidth
     * @since 3.21.0
     *
     * @param {number} value - The maximum display width of this BitmapText in pixels.
     * @param {number} [wordWrapCharCode] - The character code to check for when word wrapping.
     *
     * @return {this} This BitmapText Object.
     */
    setMaxWidth (value: number, wordWrapCharCode?: number): this
    {
        this._maxWidth = value;

        this._dirty = true;

        if (wordWrapCharCode !== undefined)
        {
            this.wordWrapCharCode = wordWrapCharCode;
        }

        return this;
    }

    /**
     * Controls the alignment of each line of text in this BitmapText object.
     */
    get align (): number
    {
        return this._align;
    }

    set align (value: number)
    {
        this._align = value;
        this._dirty = true;
    }

    /**
     * The text that this Bitmap Text object displays.
     */
    get text (): string
    {
        return this._text;
    }

    set text (value: string)
    {
        this.setText(value);
    }

    /**
     * The font size of this Bitmap Text.
     */
    get fontSize (): number
    {
        return this._fontSize;
    }

    set fontSize (value: number)
    {
        this._fontSize = value;
        this._dirty = true;
    }

    /**
     * Adds / Removes spacing between characters.
     */
    get letterSpacing (): number
    {
        return this._letterSpacing;
    }

    set letterSpacing (value: number)
    {
        this._letterSpacing = value;
        this._dirty = true;
    }

    /**
     * Adds / Removes spacing between lines.
     */
    get lineSpacing (): number
    {
        return this._lineSpacing;
    }

    set lineSpacing (value: number)
    {
        this._lineSpacing = value;
        this._dirty = true;
    }

    /**
     * The maximum display width of this BitmapText in pixels.
     */
    get maxWidth (): number
    {
        return this._maxWidth;
    }

    set maxWidth (value: number)
    {
        this._maxWidth = value;
        this._dirty = true;
    }

    /**
     * The width of this Bitmap Text.
     */
    get width (): number
    {
        this.getTextBounds(false);

        return this._bounds.global.width;
    }

    /**
     * The height of this Bitmap text.
     */
    get height (): number
    {
        this.getTextBounds(false);

        return this._bounds.global.height;
    }

    /**
     * The displayed width of this Bitmap Text.
     */
    get displayWidth (): number
    {
        return this.width;
    }

    /**
     * The displayed height of this Bitmap Text.
     */
    get displayHeight (): number
    {
        return this.height;
    }

    /**
     * Build a JSON representation of this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.GameObjects.BitmapText.JSONBitmapText} A JSON representation of this Bitmap Text.
     */
    toJSON (): any
    {
        var out = Components.ToJSON(this);

        var data = {
            font: this.font,
            text: this.text,
            fontSize: this.fontSize,
            letterSpacing: this.letterSpacing,
            lineSpacing: this.lineSpacing,
            align: this.align
        };

        out.data = data;

        return out;
    }

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.BitmapText#preDestroy
     * @protected
     * @since 3.50.0
     */
    preDestroy (): void
    {
        this.charColors.length = 0;
        this._bounds = null;
        this.fontData = null;
    }
}
