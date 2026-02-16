/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { IsSizePowerOfTwo } from '../../../math/pow2/IsSizePowerOfTwo';

/**
 * @classdesc
 * Wrapper for a WebGL texture, containing all the information that was used
 * to create it.
 *
 * A WebGLTexture should never be exposed outside the WebGLRenderer,
 * so the WebGLRenderer can handle context loss and other events
 * without other systems having to be aware of it.
 * Always use WebGLTextureWrapper instead.
 *
 * @class WebGLTextureWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 3.80.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {number} mipLevel - Mip level of the texture.
 * @param {number} minFilter - Filtering of the texture.
 * @param {number} magFilter - Filtering of the texture.
 * @param {number} wrapT - Wrapping mode of the texture.
 * @param {number} wrapS - Wrapping mode of the texture.
 * @param {number} format - Which format does the texture use.
 * @param {?object} pixels - pixel data.
 * @param {number} width - Width of the texture in pixels.
 * @param {number} height - Height of the texture in pixels.
 * @param {boolean} [pma=true] - Does the texture have premultiplied alpha?
 * @param {boolean} [forceSize=false] - If `true` it will use the width and height passed to this method, regardless of the pixels dimension.
 * @param {boolean} [flipY=true] - Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
 */
export class WebGLTextureWrapper {

    renderer: any;
    webGLTexture: WebGLTexture | null;
    isRenderTexture: boolean;
    mipLevel: number;
    minFilter: number;
    magFilter: number;
    wrapT: number;
    wrapS: number;
    format: number;
    pixels: any;
    width: number;
    height: number;
    pma: boolean;
    forceSize: boolean;
    flipY: boolean;
    __SPECTOR_Metadata: any;
    batchUnit: number;

    constructor(renderer: any, mipLevel: number, minFilter: number, magFilter: number, wrapT: number, wrapS: number, format: number, pixels: any, width: number, height: number, pma?: boolean, forceSize?: boolean, flipY?: boolean)
    {
        if (flipY === undefined) { flipY = true; }

        this.renderer = renderer;
        this.webGLTexture = null;
        this.isRenderTexture = false;
        this.mipLevel = mipLevel;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.wrapT = wrapT;
        this.wrapS = wrapS;
        this.format = format;
        this.pixels = pixels;
        this.width = width;
        this.height = height;
        this.pma = (pma === undefined || pma === null) ? true : pma;
        this.forceSize = !!forceSize;
        this.flipY = !!flipY;
        this.__SPECTOR_Metadata = {};
        this.batchUnit = -1;

        this.createResource();
    }

    createResource(): void
    {
        const gl = this.renderer.gl;

        if (gl.isContextLost())
        {
            return;
        }

        if (this.pixels instanceof WebGLTextureWrapper)
        {
            this.webGLTexture = this.pixels.webGLTexture;
            return;
        }

        const texture = gl.createTexture();

        (texture as any).__SPECTOR_Metadata = this.__SPECTOR_Metadata;

        this.webGLTexture = texture;

        this._processTexture();
    }

    resize(width: number, height: number): void
    {
        if (this.width === width && this.height === height)
        {
            return;
        }

        this.width = width;
        this.height = height;

        this._processTexture();
    }

    update(source: any, width: number, height: number, flipY: boolean, wrapS: number, wrapT: number, minFilter: number, magFilter: number, format: number): void
    {
        if (width === 0 || height === 0)
        {
            return;
        }

        this.pixels = source;
        this.width = width;
        this.height = height;
        this.flipY = flipY;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.format = format;

        this._processTexture();
    }

    _processTexture(): void
    {
        const gl = this.renderer.gl;

        this.renderer.glTextureUnits.bind(this, 0);
        this.renderer.glWrapper.updateTexturing({
            texturing:
            {
                flipY: this.flipY,
                premultiplyAlpha: this.pma
            }
        });

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);

        let pixels = this.pixels;
        const mipLevel = this.mipLevel;
        let width = this.width;
        let height = this.height;
        const format = this.format;

        let generateMipmap = false;

        if (pixels === null || pixels === undefined)
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);

            generateMipmap = IsSizePowerOfTwo(width, height);
        }
        else if (pixels.compressed)
        {
            width = pixels.width;
            height = pixels.height;
            generateMipmap = pixels.generateMipmap;

            for (let i = 0; i < pixels.mipmaps.length; i++)
            {
                gl.compressedTexImage2D(gl.TEXTURE_2D, i, pixels.internalFormat, pixels.mipmaps[i].width, pixels.mipmaps[i].height, 0, pixels.mipmaps[i].data);
            }
        }
        else if (pixels instanceof Uint8Array)
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, width, height, 0, format, gl.UNSIGNED_BYTE, pixels);

            generateMipmap = IsSizePowerOfTwo(width, height);
        }
        else
        {
            if (!this.forceSize)
            {
                width = pixels.width;
                height = pixels.height;
            }

            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, format, gl.UNSIGNED_BYTE, pixels);

            generateMipmap = IsSizePowerOfTwo(width, height);
        }

        if (generateMipmap)
        {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
    }

    get spectorMetadata(): any
    {
        return this.__SPECTOR_Metadata;
    }

    set spectorMetadata(value: any)
    {
        this.__SPECTOR_Metadata = value;

        if (this.webGLTexture)
        {
            (this.webGLTexture as any).__SPECTOR_Metadata = value;
        }
    }

    destroy(): void
    {
        if (this.webGLTexture === null)
        {
            return;
        }

        if (!(this.pixels instanceof WebGLTextureWrapper))
        {
            this.renderer.gl.deleteTexture(this.webGLTexture);
        }

        this.pixels = null;
        this.webGLTexture = null;
        this.renderer = null;
    }
}
