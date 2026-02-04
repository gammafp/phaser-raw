/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { CanvasPool } from '../../display/canvas/CanvasPool';

/**
 * Calculates the ascent, descent and fontSize of a given font style.
 *
 * @function Phaser.GameObjects.MeasureText
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.TextStyle} textStyle - The TextStyle object to measure.
 *
 * @return {Phaser.Types.GameObjects.Text.TextMetrics} An object containing the ascent, descent and fontSize of the TextStyle.
 */
export const MeasureText = (textStyle: any): any => {
    const canvas = CanvasPool.create(this);
    const context = canvas.getContext('2d', { willReadFrequently: true });

    textStyle.syncFont(canvas, context);

    const metrics = context.measureText(textStyle.testString);

    if ('actualBoundingBoxAscent' in metrics)
    {
        const ascent = metrics.actualBoundingBoxAscent;
        const descent = metrics.actualBoundingBoxDescent;

        CanvasPool.remove(canvas);

        return {
            ascent: ascent,
            descent: descent,
            fontSize: ascent + descent
        };
    }

    let width = Math.ceil(metrics.width * textStyle.baselineX);
    let baseline = width;
    let height = 2 * baseline;

    baseline = baseline * textStyle.baselineY | 0;

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = '#f00';
    context.fillRect(0, 0, width, height);

    context.font = textStyle._font;

    context.textBaseline = 'alphabetic';
    context.fillStyle = '#000';
    context.fillText(textStyle.testString, 0, baseline);

    const output = {
        ascent: 0,
        descent: 0,
        fontSize: 0
    };

    const imagedata = context.getImageData(0, 0, width, height);

    if (!imagedata)
    {
        output.ascent = baseline;
        output.descent = baseline + 6;
        output.fontSize = output.ascent + output.descent;

        CanvasPool.remove(canvas);

        return output;
    }

    const pixels = imagedata.data;
    const numPixels = pixels.length;
    const line = width * 4;
    let i: number;
    let j: number;
    let idx = 0;
    let stop = false;

    // ascent. scan from top to bottom until we find a non red pixel
    for (i = 0; i < baseline; i++)
    {
        for (j = 0; j < line; j += 4)
        {
            if (pixels[idx + j] !== 255)
            {
                stop = true;
                break;
            }
        }

        if (!stop)
        {
            idx += line;
        }
        else
        {
            break;
        }
    }

    output.ascent = baseline - i;

    idx = numPixels - line;
    stop = false;

    // descent. scan from bottom to top until we find a non red pixel
    for (i = height; i > baseline; i--)
    {
        for (j = 0; j < line; j += 4)
        {
            if (pixels[idx + j] !== 255)
            {
                stop = true;
                break;
            }
        }

        if (!stop)
        {
            idx -= line;
        }
        else
        {
            break;
        }
    }

    output.descent = (i - baseline);
    output.fontSize = output.ascent + output.descent;

    CanvasPool.remove(canvas);

    return output;
};
