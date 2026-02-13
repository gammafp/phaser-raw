/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets the CSS image-rendering property on the given canvas to be 'crisp' (aka 'optimize contrast' on webkit).
 *
 * @function Phaser.Display.Canvas.CanvasInterpolation.setCrisp
 * @since 3.0.0
 * 
 * @param {HTMLCanvasElement} canvas - The canvas object to have the style set on.
 * 
 * @return {HTMLCanvasElement} The canvas.
 */
export const setCrisp = (canvas: HTMLCanvasElement): HTMLCanvasElement =>
{
    const types = [ 'optimizeSpeed', '-moz-crisp-edges', '-o-crisp-edges', '-webkit-optimize-contrast', 'optimize-contrast', 'crisp-edges', 'pixelated' ];

    types.forEach((type) =>
    {
        (canvas.style as any)['image-rendering'] = type;
    });

    (canvas.style as any).msInterpolationMode = 'nearest-neighbor';

    return canvas;
};

/**
 * Sets the CSS image-rendering property on the given canvas to be 'bicubic' (aka 'auto').
 *
 * @function Phaser.Display.Canvas.CanvasInterpolation.setBicubic
 * @since 3.0.0
 * 
 * @param {HTMLCanvasElement} canvas - The canvas object to have the style set on.
 * 
 * @return {HTMLCanvasElement} The canvas.
 */
export const setBicubic = (canvas: HTMLCanvasElement): HTMLCanvasElement =>
{
    canvas.style['image-rendering'] = 'auto';
    (canvas.style as any).msInterpolationMode = 'bicubic';

    return canvas;
};
