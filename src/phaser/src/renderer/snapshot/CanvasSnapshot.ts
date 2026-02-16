/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../utils/object/GetFastValue';

import * as CanvasPool from '../../display/canvas/CanvasPool';
import { Color } from '../../display/color/Color';

/**
 * Takes a snapshot of an area from the current frame displayed by a canvas.
 *
 * This is then copied to an Image object. When this loads, the results are sent
 * to the callback provided in the Snapshot Configuration object.
 *
 * @function Phaser.Renderer.Snapshot.Canvas
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} sourceCanvas - The canvas to take a snapshot of.
 * @param {Phaser.Types.Renderer.Snapshot.SnapshotState} config - The snapshot configuration object.
 */
export const CanvasSnapshot = function (canvas: HTMLCanvasElement, config: any): void
{
    const callback = GetFastValue(config, 'callback');
    const type = GetFastValue(config, 'type', 'image/png');
    const encoderOptions = GetFastValue(config, 'encoder', 0.92);
    const x = Math.abs(Math.round(GetFastValue(config, 'x', 0)));
    const y = Math.abs(Math.round(GetFastValue(config, 'y', 0)));
    const width = Math.floor(GetFastValue(config, 'width', canvas.width));
    const height = Math.floor(GetFastValue(config, 'height', canvas.height));
    const getPixel = GetFastValue(config, 'getPixel', false);

    if (getPixel)
    {
        const context = canvas.getContext('2d', { willReadFrequently: false });
        const imageData = context.getImageData(x, y, 1, 1);
        const data = imageData.data;

        callback.call(null, new Color(data[0], data[1], data[2], data[3]));
    }
    else if (x !== 0 || y !== 0 || width !== canvas.width || height !== canvas.height)
    {
        //  Area Grab
        const copyCanvas = CanvasPool.createWebGL(this, width, height);
        const ctx = copyCanvas.getContext('2d', { willReadFrequently: true });

        if (width > 0 && height > 0)
        {
            ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
        }

        const image1 = new Image();

        image1.onerror = function ()
        {
            callback.call(null);

            CanvasPool.remove(copyCanvas);
        };

        image1.onload = function ()
        {
            callback.call(null, image1);

            CanvasPool.remove(copyCanvas);
        };

        image1.src = copyCanvas.toDataURL(type, encoderOptions);
    }
    else
    {
        //  Full Grab
        const image2 = new Image();

        image2.onerror = function ()
        {
            callback.call(null);
        };

        image2.onload = function ()
        {
            callback.call(null, image2);
        };

        image2.src = canvas.toDataURL(type, encoderOptions);
    }
};
