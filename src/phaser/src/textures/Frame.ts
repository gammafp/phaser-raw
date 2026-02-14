/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Clamp } from '../math/Clamp';
import { Extend } from '../utils/object/Extend';

/**
 * @classdesc
 * A Frame is a section of a Texture.
 *
 * @class Frame
 * @memberof Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture this Frame is a part of.
 * @param {(number|string)} name - The name of this Frame. The name is unique within the Texture.
 * @param {number} sourceIndex - The index of the TextureSource that this Frame is a part of.
 * @param {number} x - The x coordinate of the top-left of this Frame.
 * @param {number} y - The y coordinate of the top-left of this Frame.
 * @param {number} width - The width of this Frame.
 * @param {number} height - The height of this Frame.
 */
export class Frame {

    texture: any;
    name: string | number;
    source: any;
    sourceIndex: number;
    cutX: number;
    cutY: number;
    cutWidth: number;
    cutHeight: number;
    x: number;
    y: number;
    width: number;
    height: number;
    halfWidth: number;
    halfHeight: number;
    centerX: number;
    centerY: number;
    pivotX: number;
    pivotY: number;
    customPivot: boolean;
    rotated: boolean;
    autoRound: number;
    customData: any;
    u0: number;
    v0: number;
    u1: number;
    v1: number;
    data: any;

    constructor (texture: any, name: string | number, sourceIndex: number, x?: number, y?: number, width?: number, height?: number)
    {
        this.texture = texture;
        this.name = name;
        this.source = texture.source[sourceIndex];
        this.sourceIndex = sourceIndex;

        this.cutX = 0;
        this.cutY = 0;
        this.cutWidth = 0;
        this.cutHeight = 0;

        this.x = 0;
        this.y = 0;

        this.width = 0;
        this.height = 0;
        this.halfWidth = 0;
        this.halfHeight = 0;
        this.centerX = 0;
        this.centerY = 0;

        this.pivotX = 0;
        this.pivotY = 0;
        this.customPivot = false;
        this.rotated = false;
        this.autoRound = -1;
        this.customData = {};

        this.u0 = 0;
        this.v0 = 0;
        this.u1 = 0;
        this.v1 = 0;

        this.data = {
            cut: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                r: 0,
                b: 0
            },
            trim: false,
            sourceSize: {
                w: 0,
                h: 0
            },
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                r: 0,
                b: 0
            },
            radius: 0,
            drawImage: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            is3Slice: false,
            scale9: false,
            scale9Borders: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }
        };

        this.setSize(width ?? 0, height ?? 0, x ?? 0, y ?? 0);
    }

    /**
     * Sets the x and y position within the source image to cut from.
     *
     * @method Phaser.Textures.Frame#setCutPosition
     * @since 3.85.0
     *
     * @param {number} [x=0] - X position within the source image to cut from.
     * @param {number} [y=0] - Y position within the source image to cut from.
     *
     * @return {this} This Frame object.
     */
    setCutPosition (x?: number, y?: number): this
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        this.cutX = x;
        this.cutY = y;

        return this.updateUVs();
    }

    /**
     * Sets the width, and height of the area in the source image to cut.
     *
     * @method Phaser.Textures.Frame#setCutSize
     * @since 3.85.0
     *
     * @param {number} width - The width of the area in the source image to cut.
     * @param {number} height - The height of the area in the source image to cut.
     *
     * @return {this} This Frame object.
     */
    setCutSize (width: number, height: number): this
    {
        this.cutWidth = width;
        this.cutHeight = height;

        return this.updateUVs();
    }

    /**
     * Sets the width, height, x and y of this Frame.
     *
     * This is called automatically by the constructor
     * and should rarely be changed on-the-fly.
     *
     * @method Phaser.Textures.Frame#setSize
     * @since 3.7.0
     *
     * @param {number} width - The width of the frame before being trimmed.
     * @param {number} height - The height of the frame before being trimmed.
     * @param {number} [x=0] - The x coordinate of the top-left of this Frame.
     * @param {number} [y=0] - The y coordinate of the top-left of this Frame.
     *
     * @return {this} This Frame object.
     */
    setSize (width: number, height: number, x?: number, y?: number): this
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        this.setCutPosition(x, y);
        this.setCutSize(width, height);

        this.width = width;
        this.height = height;

        this.halfWidth = Math.floor(width * 0.5);
        this.halfHeight = Math.floor(height * 0.5);

        this.centerX = Math.floor(width / 2);
        this.centerY = Math.floor(height / 2);

        const data = this.data;
        const cut = data.cut;

        cut.x = x;
        cut.y = y;
        cut.w = width;
        cut.h = height;
        cut.r = x + width;
        cut.b = y + height;

        data.sourceSize.w = width;
        data.sourceSize.h = height;

        data.spriteSourceSize.w = width;
        data.spriteSourceSize.h = height;

        data.radius = 0.5 * Math.sqrt(width * width + height * height);

        const drawImage = data.drawImage;

        drawImage.x = x;
        drawImage.y = y;
        drawImage.width = width;
        drawImage.height = height;

        return this.updateUVs();
    }

    /**
     * If the frame was trimmed when added to the Texture Atlas, this records the trim and source data.
     *
     * @method Phaser.Textures.Frame#setTrim
     * @since 3.0.0
     *
     * @param {number} actualWidth - The width of the frame before being trimmed.
     * @param {number} actualHeight - The height of the frame before being trimmed.
     * @param {number} destX - The destination X position of the trimmed frame for display.
     * @param {number} destY - The destination Y position of the trimmed frame for display.
     * @param {number} destWidth - The destination width of the trimmed frame for display.
     * @param {number} destHeight - The destination height of the trimmed frame for display.
     *
     * @return {this} This Frame object.
     */
    setTrim (actualWidth: number, actualHeight: number, destX: number, destY: number, destWidth: number, destHeight: number): this
    {
        const data = this.data;
        const ss = data.spriteSourceSize;

        data.trim = true;

        data.sourceSize.w = actualWidth;
        data.sourceSize.h = actualHeight;

        ss.x = destX;
        ss.y = destY;
        ss.w = destWidth;
        ss.h = destHeight;
        ss.r = destX + destWidth;
        ss.b = destY + destHeight;

        this.x = destX;
        this.y = destY;

        this.width = destWidth;
        this.height = destHeight;

        this.halfWidth = destWidth * 0.5;
        this.halfHeight = destHeight * 0.5;

        this.centerX = Math.floor(destWidth / 2);
        this.centerY = Math.floor(destHeight / 2);

        return this.updateUVs();
    }

    /**
     * Sets the scale9 center rectangle values.
     *
     * Scale9 is a feature of Texture Packer, allowing you to define a nine-slice scaling grid.
     *
     * This is set automatically by the JSONArray and JSONHash parsers.
     *
     * @method Phaser.Textures.Frame#setScale9
     * @since 3.70.0
     *
     * @param {number} x - The left coordinate of the center scale9 rectangle.
     * @param {number} y - The top coordinate of the center scale9 rectangle.
     * @param {number} width - The width of the center scale9 rectangle.
     * @param {number} height - The height coordinate of the center scale9 rectangle.
     *
     * @return {this} This Frame object.
     */
    setScale9 (x: number, y: number, width: number, height: number): this
    {
        const data = this.data;

        data.scale9 = true;
        data.is3Slice = (y === 0 && height === this.height);

        data.scale9Borders.x = x;
        data.scale9Borders.y = y;
        data.scale9Borders.w = width;
        data.scale9Borders.h = height;

        return this;
    }

    /**
     * Takes a crop data object and, based on the rectangular region given, calculates the
     * required UV coordinates in order to crop this Frame for WebGL and Canvas rendering.
     *
     * The crop size as well as coordinates can not exceed the the size of the frame.
     *
     * This is called directly by the Game Object Texture Components `setCrop` method.
     * Please use that method to crop a Game Object.
     *
     * @method Phaser.Textures.Frame#setCropUVs
     * @since 3.11.0
     *
     * @param {object} crop - The crop data object. This is the `GameObject._crop` property.
     * @param {number} x - The x coordinate to start the crop from. Cannot be negative or exceed the Frame width.
     * @param {number} y - The y coordinate to start the crop from. Cannot be negative or exceed the Frame height.
     * @param {number} width - The width of the crop rectangle. Cannot exceed the Frame width.
     * @param {number} height - The height of the crop rectangle. Cannot exceed the Frame height.
     * @param {boolean} flipX - Does the parent Game Object have flipX set?
     * @param {boolean} flipY - Does the parent Game Object have flipY set?
     *
     * @return {object} The updated crop data object.
     */
    setCropUVs (crop: any, x: number, y: number, width: number, height: number, flipX: boolean, flipY: boolean): any
    {
        const cx = this.cutX;
        const cy = this.cutY;
        const cw = this.cutWidth;
        const ch = this.cutHeight;
        const rw = this.realWidth;
        const rh = this.realHeight;

        x = Clamp(x, 0, rw);
        y = Clamp(y, 0, rh);

        width = Clamp(width, 0, rw - x);
        height = Clamp(height, 0, rh - y);

        let ox = cx + x;
        let oy = cy + y;
        let ow = width;
        let oh = height;

        const data = this.data;

        if (data.trim)
        {
            const ss = data.spriteSourceSize;

            width = Clamp(width, 0, ss.x + cw - x);
            height = Clamp(height, 0, ss.y + ch - y);

            const cropRight = x + width;
            const cropBottom = y + height;

            const intersects = !(ss.r < x || ss.b < y || ss.x > cropRight || ss.y > cropBottom);

            if (intersects)
            {
                const ix = Math.max(ss.x, x);
                const iy = Math.max(ss.y, y);
                const iw = Math.min(ss.r, cropRight) - ix;
                const ih = Math.min(ss.b, cropBottom) - iy;

                ow = iw;
                oh = ih;

                if (flipX)
                {
                    ox = cx + (cw - (ix - ss.x) - iw);
                }
                else
                {
                    ox = cx + (ix - ss.x);
                }

                if (flipY)
                {
                    oy = cy + (ch - (iy - ss.y) - ih);
                }
                else
                {
                    oy = cy + (iy - ss.y);
                }

                x = ix;
                y = iy;

                width = iw;
                height = ih;
            }
            else
            {
                ox = 0;
                oy = 0;
                ow = 0;
                oh = 0;
            }
        }
        else
        {
            if (flipX)
            {
                ox = cx + (cw - x - width);
            }

            if (flipY)
            {
                oy = cy + (ch - y - height);
            }
        }

        const tw = this.source.width;
        const th = this.source.height;

        crop.u0 = Math.max(0, ox / tw);
        crop.v0 = 1 - Math.max(0, oy / th);
        crop.u1 = Math.min(1, (ox + ow) / tw);
        crop.v1 = 1 - Math.min(1, (oy + oh) / th);

        crop.x = x;
        crop.y = y;

        crop.cx = ox;
        crop.cy = oy;
        crop.cw = ow;
        crop.ch = oh;

        crop.width = width;
        crop.height = height;

        crop.flipX = flipX;
        crop.flipY = flipY;

        return crop;
    }

    /**
     * Takes a crop data object and recalculates the UVs based on the dimensions inside the crop object.
     * Called automatically by `setFrame`.
     *
     * @method Phaser.Textures.Frame#updateCropUVs
     * @since 3.11.0
     *
     * @param {object} crop - The crop data object. This is the `GameObject._crop` property.
     * @param {boolean} flipX - Does the parent Game Object have flipX set?
     * @param {boolean} flipY - Does the parent Game Object have flipY set?
     *
     * @return {object} The updated crop data object.
     */
    updateCropUVs (crop: any, flipX: boolean, flipY: boolean): any
    {
        return this.setCropUVs(crop, crop.x, crop.y, crop.width, crop.height, flipX, flipY);
    }

    /**
     * Directly sets the canvas and WebGL UV data for this frame.
     *
     * Use this if you need to override the values that are generated automatically
     * when the Frame is created.
     *
     * @method Phaser.Textures.Frame#setUVs
     * @since 3.50.0
     *
     * @param {number} width - Width of this frame for the Canvas data.
     * @param {number} height - Height of this frame for the Canvas data.
     * @param {number} u0 - UV u0 value.
     * @param {number} v0 - UV v0 value.
     * @param {number} u1 - UV u1 value.
     * @param {number} v1 - UV v1 value.
     *
     * @return {this} This Frame object.
     */
    setUVs (width: number, height: number, u0: number, v0: number, u1: number, v1: number): this
    {
        const cd = this.data.drawImage;

        cd.width = width;
        cd.height = height;

        this.u0 = u0;
        this.v0 = v0;

        this.u1 = u1;
        this.v1 = v1;

        return this;
    }

    /**
     * Updates the internal WebGL UV cache and the drawImage cache.
     *
     * @method Phaser.Textures.Frame#updateUVs
     * @since 3.0.0
     *
     * @return {this} This Frame object.
     */
    updateUVs (): this
    {
        const cx = this.cutX;
        const cy = this.cutY;
        const cw = this.cutWidth;
        const ch = this.cutHeight;

        const cd = this.data.drawImage;

        cd.width = cw;
        cd.height = ch;

        const tw = this.source.width;
        const th = this.source.height;

        this.u0 = cx / tw;
        this.v0 = 1 - cy / th;

        this.u1 = (cx + cw) / tw;
        this.v1 = 1 - (cy + ch) / th;

        return this;
    }

    /**
     * Updates the internal WebGL UV cache.
     *
     * @method Phaser.Textures.Frame#updateUVsInverted
     * @since 3.0.0
     *
     * @return {this} This Frame object.
     */
    updateUVsInverted (): this
    {
        const tw = this.source.width;
        const th = this.source.height;

        this.u0 = (this.cutX + this.cutHeight) / tw;
        this.v0 = 1 - this.cutY / th;

        this.u1 = this.cutX / tw;
        this.v1 = 1 - (this.cutY + this.cutWidth) / th;

        return this;
    }

    /**
     * Clones this Frame into a new Frame object.
     *
     * @method Phaser.Textures.Frame#clone
     * @since 3.0.0
     *
     * @return {Phaser.Textures.Frame} A clone of this Frame.
     */
    clone (): Frame
    {
        const clone = new Frame(this.texture, this.name, this.sourceIndex);

        clone.cutX = this.cutX;
        clone.cutY = this.cutY;
        clone.cutWidth = this.cutWidth;
        clone.cutHeight = this.cutHeight;

        clone.x = this.x;
        clone.y = this.y;

        clone.width = this.width;
        clone.height = this.height;

        clone.halfWidth = this.halfWidth;
        clone.halfHeight = this.halfHeight;

        clone.centerX = this.centerX;
        clone.centerY = this.centerY;

        clone.rotated = this.rotated;

        clone.data = Extend(true, clone.data, this.data);

        clone.updateUVs();

        return clone;
    }

    /**
     * Destroys this Frame by nulling its reference to the parent Texture and and data objects.
     *
     * @method Phaser.Textures.Frame#destroy
     * @since 3.0.0
     */
    destroy (): void
    {
        this.texture = null;
        this.source = null;
        this.customData = null;
        this.data = null;
    }

    /**
     * A reference to the Texture Source WebGL Texture that this Frame is using.
     *
     * @name Phaser.Textures.Frame#glTexture
     * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
     * @readonly
     * @since 3.11.0
     */
    get glTexture (): any
    {
        return this.source.glTexture;
    }

    /**
     * The width of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
     * before being packed.
     *
     * @name Phaser.Textures.Frame#realWidth
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get realWidth (): number
    {
        return this.data.sourceSize.w;
    }

    /**
     * The height of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
     * before being packed.
     *
     * @name Phaser.Textures.Frame#realHeight
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get realHeight (): number
    {
        return this.data.sourceSize.h;
    }

    /**
     * The radius of the Frame (derived from sqrt(w * w + h * h) / 2)
     *
     * @name Phaser.Textures.Frame#radius
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get radius (): number
    {
        return this.data.radius;
    }

    /**
     * Is the Frame trimmed or not?
     *
     * @name Phaser.Textures.Frame#trimmed
     * @type {boolean}
     * @readonly
     * @since 3.0.0
     */
    get trimmed (): boolean
    {
        return this.data.trim;
    }

    /**
     * Does the Frame have scale9 border data?
     *
     * @name Phaser.Textures.Frame#scale9
     * @type {boolean}
     * @readonly
     * @since 3.70.0
     */
    get scale9 (): boolean
    {
        return this.data.scale9;
    }

    /**
     * If the Frame has scale9 border data, is it 3-slice or 9-slice data?
     *
     * @name Phaser.Textures.Frame#is3Slice
     * @type {boolean}
     * @readonly
     * @since 3.70.0
     */
    get is3Slice (): boolean
    {
        return this.data.is3Slice;
    }

    /**
     * The Canvas drawImage data object.
     *
     * @name Phaser.Textures.Frame#canvasData
     * @type {object}
     * @readonly
     * @since 3.0.0
     */
    get canvasData (): any
    {
        return this.data.drawImage;
    }

}
