/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


import type { ColorSpectrum } from './ColorSpectrum';
import type { ColorToRGBA } from './ColorToRGBA';
import type { ComponentToHex } from './ComponentToHex';


import { GetColor } from './GetColor';
import { GetColor32 } from './GetColor32';
import type { HexStringToColor } from './HexStringToColor';
import type { HSLToColor } from './HSLToColor';
import type { HSVColorWheel } from './HSVColorWheel';
import { HSVToRGB } from './HSVToRGB';
import type { HueToComponent } from './HueToComponent';
import type { IntegerToColor } from './IntegerToColor';
import type { IntegerToRGB } from './IntegerToRGB';
import { RGBToHSV } from './RGBToHSV';
import * as Interpolate from './Interpolate';
import type { ObjectToColor } from './ObjectToColor';
import type { RandomRGB } from './RandomRGB';
import type { RGBStringToColor } from './RGBStringToColor';
import type { RGBToString } from './RGBToString';
import type { ValueToColor } from './ValueToColor';

/**
 * @namespace Phaser.Display.Color
 */

/**
 * @classdesc
 * The Color class holds a single color value and allows for easy modification and reading of it.
 *
 * @class Color
 * @memberof Phaser.Display
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [red=0] - The red color value. A number between 0 and 255.
 * @param {number} [green=0] - The green color value. A number between 0 and 255.
 * @param {number} [blue=0] - The blue color value. A number between 0 and 255.
 * @param {number} [alpha=255] - The alpha value. A number between 0 and 255.
 */
export class Color
{
    /**
     * The internal red color value.
     *
     * @name Phaser.Display.Color#r
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    r: number;

    /**
     * The internal green color value.
     *
     * @name Phaser.Display.Color#g
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    g;

    /**
     * The internal blue color value.
     *
     * @name Phaser.Display.Color#b
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    b;

    /**
     * The internal alpha color value.
     *
     * @name Phaser.Display.Color#a
     * @type {number}
     * @private
     * @default 255
     * @since 3.0.0
     */
    a;

    /**
     * The hue color value. A number between 0 and 1.
     * This is the base color.
     *
     * @name Phaser.Display.Color#_h
     * @type {number}
     * @default 0
     * @private
     * @since 3.13.0
     */
    _h: number;

    /**
     * The saturation color value. A number between 0 and 1.
     * This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
     *
     * @name Phaser.Display.Color#_s
     * @type {number}
     * @default 0
     * @private
     * @since 3.13.0
     */
    _s: number;

    /**
     * The lightness color value. A number between 0 and 1.
     * This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
     *
     * @name Phaser.Display.Color#_v
     * @type {number}
     * @default 0
     * @private
     * @since 3.13.0
     */
    _v: number;

    /**
     * Is this color update locked?
     *
     * @name Phaser.Display.Color#_locked
     * @type {boolean}
     * @private
     * @since 3.13.0
     */
    private _locked: boolean;

    /**
     * An array containing the calculated color values for WebGL use.
     *
     * @name Phaser.Display.Color#gl
     * @type {number[]}
     * @since 3.0.0
     */
    gl: number[];

    /**
     * Pre-calculated internal color value.
     *
     * @name Phaser.Display.Color#_color
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    _color = 0;

    /**
     * Pre-calculated internal color32 value.
     *
     * @name Phaser.Display.Color#_color32
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    _color32: number;

    /**
     * Pre-calculated internal color rgb string value.
     *
     * @name Phaser.Display.Color#_rgba
     * @type {string}
     * @private
     * @default ''
     * @since 3.0.0
     */
    _rgba: string;

    static ColorSpectrum: typeof ColorSpectrum;
    static ColorToRGBA: typeof ColorToRGBA;
    static ComponentToHex: typeof ComponentToHex;
    static GetColor: typeof GetColor;
    static GetColor32: typeof GetColor32;
    static HexStringToColor: typeof HexStringToColor;
    static HSLToColor: typeof HSLToColor;
    static HSVColorWheel: typeof HSVColorWheel;
    static HSVToRGB: typeof HSVToRGB;
    static HueToComponent: typeof HueToComponent;
    static IntegerToColor: typeof IntegerToColor;
    static IntegerToRGB: typeof IntegerToRGB;
    static Interpolate: typeof Interpolate;
    static ObjectToColor: typeof ObjectToColor;
    static RandomRGB: typeof RandomRGB;
    static RGBStringToColor: typeof RGBStringToColor;
    static RGBToHSV: typeof RGBToHSV;
    static RGBToString: typeof RGBToString;
    static ValueToColor: typeof ValueToColor;

    constructor (red: number = 0, green: number = 0, blue: number = 0, alpha: number = 255)
    {
        /**
         * The internal red color value.
         *
         * @name Phaser.Display.Color#r
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.r = 0;

        /**
         * The internal green color value.
         *
         * @name Phaser.Display.Color#g
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.g = 0;

        /**
         * The internal blue color value.
         *
         * @name Phaser.Display.Color#b
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.b = 0;

        /**
         * The internal alpha color value.
         *
         * @name Phaser.Display.Color#a
         * @type {number}
         * @private
         * @default 255
         * @since 3.0.0
         */
        this.a = 255;

        /**
         * The hue color value. A number between 0 and 1.
         * This is the base color.
         *
         * @name Phaser.Display.Color#_h
         * @type {number}
         * @default 0
         * @private
         * @since 3.13.0
         */
        this._h = 0;

        /**
         * The saturation color value. A number between 0 and 1.
         * This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
         *
         * @name Phaser.Display.Color#_s
         * @type {number}
         * @default 0
         * @private
         * @since 3.13.0
         */
        this._s = 0;

        /**
         * The lightness color value. A number between 0 and 1.
         * This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
         *
         * @name Phaser.Display.Color#_v
         * @type {number}
         * @default 0
         * @private
         * @since 3.13.0
         */
        this._v = 0;

        /**
         * Is this color update locked?
         *
         * @name Phaser.Display.Color#_locked
         * @type {boolean}
         * @private
         * @since 3.13.0
         */
        this._locked = false;

        /**
         * An array containing the calculated color values for WebGL use.
         *
         * @name Phaser.Display.Color#gl
         * @type {number[]}
         * @since 3.0.0
         */
        this.gl = [ 0, 0, 0, 1 ];

        /**
         * Pre-calculated internal color value.
         *
         * @name Phaser.Display.Color#_color
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._color = 0;

        /**
         * Pre-calculated internal color32 value.
         *
         * @name Phaser.Display.Color#_color32
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._color32 = 0;

        /**
         * Pre-calculated internal color rgb string value.
         *
         * @name Phaser.Display.Color#_rgba
         * @type {string}
         * @private
         * @default ''
         * @since 3.0.0
         */
        this._rgba = '';

        this.setTo(red, green, blue, alpha);
    }

    /**
     * Sets this color to be transparent. Sets all values to zero.
     *
     * @method Phaser.Display.Color#transparent
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    transparent ()
    {
        this._locked = true;

        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 0;

        this._locked = false;

        return this.update(true);
    }

    /**
     * Sets the color of this Color component.
     *
     * @method Phaser.Display.Color#setTo
     * @since 3.0.0
     *
     * @param {number} red - The red color value. A number between 0 and 255.
     * @param {number} green - The green color value. A number between 0 and 255.
     * @param {number} blue - The blue color value. A number between 0 and 255.
     * @param {number} [alpha=255] - The alpha value. A number between 0 and 255.
     * @param {boolean} [updateHSV=true] - Update the HSV values after setting the RGB values?
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setTo (red: number, green: number, blue: number, alpha: number = 255, updateHSV: boolean = true)
    {

        this._locked = true;

        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;

        this._locked = false;

        return this.update(updateHSV);
    }

    /**
     * Sets the red, green, blue and alpha GL values of this Color component.
     *
     * @method Phaser.Display.Color#setGLTo
     * @since 3.0.0
     *
     * @param {number} red - The red color value. A number between 0 and 1.
     * @param {number} green - The green color value. A number between 0 and 1.
     * @param {number} blue - The blue color value. A number between 0 and 1.
     * @param {number} [alpha=1] - The alpha value. A number between 0 and 1.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setGLTo (red: number, green: number, blue: number, alpha: number)
    {
        if (alpha === undefined) { alpha = 1; }

        this._locked = true;

        this.redGL = red;
        this.greenGL = green;
        this.blueGL = blue;
        this.alphaGL = alpha;

        this._locked = false;

        return this.update(true);
    }

    /**
     * Sets the color based on the color object given.
     *
     * @method Phaser.Display.Color#setFromRGB
     * @since 3.0.0
     *
     * @param {Phaser.Types.Display.InputColorObject} color - An object containing `r`, `g`, `b` and optionally `a` values in the range 0 to 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setFromRGB (color: { r: number, g: number, b: number, a?: number })
    {
        this._locked = true;

        this.red = color.r;
        this.green = color.g;
        this.blue = color.b;

        if (color.hasOwnProperty('a'))
        {
            this.alpha = color.a!;
        }

        this._locked = false;

        return this.update(true);
    }

    /**
     * Sets the color based on the hue, saturation and lightness values given.
     *
     * @method Phaser.Display.Color#setFromHSV
     * @since 3.13.0
     *
     * @param {number} h - The hue, in the range 0 - 1. This is the base color.
     * @param {number} s - The saturation, in the range 0 - 1. This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
     * @param {number} v - The value, in the range 0 - 1. This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setFromHSV (h: number, s: number, v: number)
    {
        return HSVToRGB(h, s, v, this);
    }

    /**
     * Updates the internal cache values.
     *
     * @method Phaser.Display.Color#update
     * @private
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    update (updateHSV: boolean = false)
    {
        if (this._locked)
        {
            return this;
        }

        var r = this.r;
        var g = this.g;
        var b = this.b;
        var a = this.a;

        this._color = GetColor(r, g, b);
        this._color32 = GetColor32(r, g, b, a);
        this._rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';

        if (updateHSV)
        {
            RGBToHSV(r, g, b, this);
        }

        return this;
    }

    /**
     * Updates the internal hsv cache values.
     *
     * @method Phaser.Display.Color#updateHSV
     * @private
     * @since 3.13.0
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    updateHSV ()
    {
        var r = this.r;
        var g = this.g;
        var b = this.b;

        RGBToHSV(r, g, b, this);

        return this;
    }

    /**
     * Returns a new Color component using the values from this one.
     *
     * @method Phaser.Display.Color#clone
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} A new Color object.
     */
    clone ()
    {
        return new Color(this.r, this.g, this.b, this.a);
    }

    /**
     * Sets this Color object to be grayscaled based on the shade value given.
     *
     * @method Phaser.Display.Color#gray
     * @since 3.13.0
     * 
     * @param {number} shade - A value between 0 and 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    gray (shade: number)
    {
        return this.setTo(shade, shade, shade);
    }

    /**
     * Sets this Color object to be a random color between the `min` and `max` values given.
     *
     * @method Phaser.Display.Color#random
     * @since 3.13.0
     * 
     * @param {number} [min=0] - The minimum random color value. Between 0 and 255.
     * @param {number} [max=255] - The maximum random color value. Between 0 and 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    random (min: number, max: number)
    {
        if (min === undefined) { min = 0; }
        if (max === undefined) { max = 255; }

        var r = Math.floor(min + Math.random() * (max - min));
        var g = Math.floor(min + Math.random() * (max - min));
        var b = Math.floor(min + Math.random() * (max - min));

        return this.setTo(r, g, b);
    }

    /**
     * Sets this Color object to be a random grayscale color between the `min` and `max` values given.
     *
     * @method Phaser.Display.Color#randomGray
     * @since 3.13.0
     * 
     * @param {number} [min=0] - The minimum random color value. Between 0 and 255.
     * @param {number} [max=255] - The maximum random color value. Between 0 and 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    randomGray (min: number, max: number)
    {
        if (min === undefined) { min = 0; }
        if (max === undefined) { max = 255; }

        var s = Math.floor(min + Math.random() * (max - min));

        return this.setTo(s, s, s);
    }

    /**
     * Increase the saturation of this Color by the percentage amount given.
     * The saturation is the amount of the base color in the hue.
     *
     * @method Phaser.Display.Color#saturate
     * @since 3.13.0
     * 
     * @param {number} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    saturate (amount: number)
    {
        this.s += amount / 100;

        return this;
    }

    /**
     * Decrease the saturation of this Color by the percentage amount given.
     * The saturation is the amount of the base color in the hue.
     *
     * @method Phaser.Display.Color#desaturate
     * @since 3.13.0
     * 
     * @param {number} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    desaturate (amount: number)
    {
        this.s -= amount / 100;

        return this;
    }

    /**
     * Increase the lightness of this Color by the percentage amount given.
     *
     * @method Phaser.Display.Color#lighten
     * @since 3.13.0
     * 
     * @param {number} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    lighten (amount: number)
    {
        this.v += amount / 100;

        return this;
    }

    /**
     * Decrease the lightness of this Color by the percentage amount given.
     *
     * @method Phaser.Display.Color#darken
     * @since 3.13.0
     * 
     * @param {number} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    darken (amount: number)
    {
        this.v -= amount / 100;

        return this;
    }

    /**
     * Brighten this Color by the percentage amount given.
     *
     * @method Phaser.Display.Color#brighten
     * @since 3.13.0
     * 
     * @param {number} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    brighten (amount: number)
    {
        var r = this.r;
        var g = this.g;
        var b = this.b;

        r = Math.max(0, Math.min(255, r - Math.round(255 * - (amount / 100))));
        g = Math.max(0, Math.min(255, g - Math.round(255 * - (amount / 100))));
        b = Math.max(0, Math.min(255, b - Math.round(255 * - (amount / 100))));

        return this.setTo(r, g, b);
    }

    /**
     * The color of this Color component, not including the alpha channel.
     *
     * @name Phaser.Display.Color#color
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get color(): number
    {
        return this._color;
    }

    /**
     * The color of this Color component, including the alpha channel.
     *
     * @name Phaser.Display.Color#color32
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get color32(): number
    {
        return this._color32;
    }

    /**
     * The color of this Color component as a string which can be used in CSS color values.
     *
     * @name Phaser.Display.Color#rgba
     * @type {string}
     * @readonly
     * @since 3.0.0
     */
    get rgba(): string
    {
        return this._rgba;
    }

    /**
     * The red color value, normalized to the range 0 to 1.
     *
     * @name Phaser.Display.Color#redGL
     * @type {number}
     * @since 3.0.0
     */
    get redGL(): number 
    {
        return this.gl[0];
    }

    set redGL(value: number)
    {
        this.gl[0] = Math.min(Math.abs(value), 1);
        this.r = Math.floor(this.gl[0] * 255);
        this.update(true);
    }

    /**
     * The green color value, normalized to the range 0 to 1.
     *
     * @name Phaser.Display.Color#greenGL
     * @type {number}
     * @since 3.0.0
     */
    get greenGL(): number
    {
        return this.gl[1];
    }

    set greenGL(value: number)
    {
        this.gl[1] = Math.min(Math.abs(value), 1);
        this.g = Math.floor(this.gl[1] * 255);
        this.update(true);
    }

    /**
     * The blue color value, normalized to the range 0 to 1.
     *
     * @name Phaser.Display.Color#blueGL
     * @type {number}
     * @since 3.0.0
     */
    get blueGL(): number
    {
        return this.gl[2];
    }

    set blueGL(value: number)
    {
        this.gl[2] = Math.min(Math.abs(value), 1);
        this.b = Math.floor(this.gl[2] * 255);
        this.update(true);
    }

    /**
     * The alpha color value, normalized to the range 0 to 1.
     *
     * @name Phaser.Display.Color#alphaGL
     * @type {number}
     * @since 3.0.0
     */
    get alphaGL(): number
    {
        return this.gl[3];
    }

    set alphaGL(value: number)
    {
        this.gl[3] = Math.min(Math.abs(value), 1);
        this.a = Math.floor(this.gl[3] * 255);
        this.update();
    }

    /**
     * The red color value, normalized to the range 0 to 255.
     *
     * @name Phaser.Display.Color#red
     * @type {number}
     * @since 3.0.0
     */
    get red(): number
    {
        return this.r;
    }

    set red(value: number)
    {
        value = Math.floor(Math.abs(value));

        this.r = Math.min(value, 255);

        this.gl[0] = value / 255;

        this.update(true);
    }

    /**
     * The green color value, normalized to the range 0 to 255.
     *
     * @name Phaser.Display.Color#green
     * @type {number}
     * @since 3.0.0
     */
    get green(): number
    {
        return this.g;
    }

    set green(value: number)
    {
        value = Math.floor(Math.abs(value));

        this.g = Math.min(value, 255);

        this.gl[1] = value / 255;

        this.update(true);
    }

    /**
     * The blue color value, normalized to the range 0 to 255.
     *
     * @name Phaser.Display.Color#blue
     * @type {number}
     * @since 3.0.0
     */
    get blue(): number
    {
        return this.b;
    }

    set blue(value: number)
    {
        value = Math.floor(Math.abs(value));

        this.b = Math.min(value, 255);

        this.gl[2] = value / 255;

        this.update(true);
    }

    /**
     * The alpha color value, normalized to the range 0 to 255.
     *
     * @name Phaser.Display.Color#alpha
     * @type {number}
     * @since 3.0.0
     */
    get alpha(): number
    {
        return this.a;
    }

    set alpha(value: number)
    {
        value = Math.floor(Math.abs(value));

        this.a = Math.min(value, 255);

        this.gl[3] = value / 255;

        this.update();
    }

    /**
     * The hue color value. A number between 0 and 1.
     * This is the base color.
     *
     * @name Phaser.Display.Color#h
     * @type {number}
     * @since 3.13.0
     */
    get h(): number
    {
        return this._h;
    }

    set h(value: number)
    {
        this._h = value;
        HSVToRGB(value, this._s, this._v, this);
    }

    /**
     * The saturation color value. A number between 0 and 1.
     * This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
     *
     * @name Phaser.Display.Color#s
     * @type {number}
     * @since 3.13.0
     */
    get s(): number
    {
        return this._s;
    }

    set s(value: number)
    {
        this._s = value;
        HSVToRGB(this._h, value, this._v, this);
    }

    /**
     * The lightness color value. A number between 0 and 1.
     * This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
     *
     * @name Phaser.Display.Color#v
     * @type {number}
     * @since 3.13.0
     */
    get v(): number
    {
        return this._v;
    }

    set v(value: number)
    {
        this._v = value;
        HSVToRGB(this._h, this._s, value, this);
    }

}
