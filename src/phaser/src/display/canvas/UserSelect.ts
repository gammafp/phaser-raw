/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets the user-select property on the canvas style. Can be used to disable default browser selection actions.
 *
 * @function Phaser.Display.Canvas.UserSelect
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to have the style applied to.
 * @param {string} [value='none'] - The touch callout value to set on the canvas. Set to `none` to disable touch callouts.
 *
 * @return {HTMLCanvasElement} The canvas element.
 */
export const UserSelect = (canvas: HTMLCanvasElement, value: string = 'none'): HTMLCanvasElement =>
{
    const vendors = [
        '-webkit-',
        '-khtml-',
        '-moz-',
        '-ms-',
        ''
    ];

    vendors.forEach((vendor) =>
    {
        (canvas.style as any)[vendor + 'user-select'] = value;
    });

    (canvas.style as any)['-webkit-touch-callout'] = value;
    (canvas.style as any)['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)';

    return canvas;
};
