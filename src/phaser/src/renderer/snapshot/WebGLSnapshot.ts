/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../utils/object/GetFastValue';

import * as CanvasPool from '../../display/canvas/CanvasPool';
import { Color } from '../../display/color/Color';

/**
 * Takes a snapshot of an area from the current frame displayed by a WebGL canvas.
 *
 * This is then copied to an Image object. When this loads, the results are sent
 * to the callback provided in the Snapshot Configuration object.
 *
 * @function Phaser.Renderer.Snapshot.WebGL
 * @since 3.0.0
 *
 * @param {WebGLRenderingContext} sourceContext - The WebGL context to take a snapshot of.
 * @param {Phaser.Types.Renderer.Snapshot.SnapshotState} config - The snapshot configuration object.
 */
export const WebGLSnapshot = function (this: any, sourceContext: WebGLRenderingContext, config: any): void
{
    const gl = sourceContext;

    const callback = GetFastValue(config, 'callback');
    const type = GetFastValue(config, 'type', 'image/png');
    const encoderOptions = GetFastValue(config, 'encoder', 0.92);
    const x = Math.abs(Math.round(GetFastValue(config, 'x', 0)));
    const y = Math.abs(Math.round(GetFastValue(config, 'y', 0)));

    const getPixel = GetFastValue(config, 'getPixel', false);

    const isFramebuffer = GetFastValue(config, 'isFramebuffer', false);

    const bufferWidth = (isFramebuffer) ? GetFastValue(config, 'bufferWidth', 1) : gl.drawingBufferWidth;
    const bufferHeight = (isFramebuffer) ? GetFastValue(config, 'bufferHeight', 1) : gl.drawingBufferHeight;

    if (getPixel)
    {
        const pixel = new Uint8Array(4);

        const destY = bufferHeight - y - 1;

        gl.readPixels(x, destY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

        callback.call(null, new Color(pixel[0], pixel[1], pixel[2], pixel[3]));
    }
    else
    {
        const width = Math.floor(GetFastValue(config, 'width', bufferWidth));
        const height = Math.floor(GetFastValue(config, 'height', bufferHeight));

        const total = width * height * 4;

        const pixels = new Uint8Array(total);

        gl.readPixels(x, bufferHeight - y - height, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        const canvas = CanvasPool.createWebGL(this, width, height);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const imageData = ctx!.getImageData(0, 0, width, height);

        const data = imageData.data;

        for (let py = 0; py < height; py++)
        {
            for (let px = 0; px < width; px++)
            {
                const sourceIndex = ((height - py - 1) * width + px) * 4;
                const destIndex = (py * width + px) * 4;

                let r = pixels[sourceIndex + 0];
                let g = pixels[sourceIndex + 1];
                let b = pixels[sourceIndex + 2];
                const a = pixels[sourceIndex + 3];

                // Un-premultiplication.
                if (config.unpremultiplyAlpha && a !== 0)
                {
                    const ratio = 255 / a;

                    r = Math.floor(r * ratio);
                    g = Math.floor(g * ratio);
                    b = Math.floor(b * ratio);
                }

                data[destIndex + 0] = r;
                data[destIndex + 1] = g;
                data[destIndex + 2] = b;
                data[destIndex + 3] = a;
            }
        }

        ctx!.putImageData(imageData, 0, 0);

        const image = new Image();

        image.onerror = function ()
        {
            callback.call(null);

            CanvasPool.remove(canvas);
        };

        image.onload = function ()
        {
            callback.call(null, image);

            CanvasPool.remove(canvas);
        };

        image.src = canvas.toDataURL(type, encoderOptions);
    }
};
