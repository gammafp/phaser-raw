/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Attempts to determine the document inner height across iOS and standard devices.
 * Based on code by @tylerjpeterson
 *
 * @function Phaser.DOM.GetInnerHeight
 * @since 3.16.0
 *
 * @param {boolean} iOS - Is this running on iOS?
 *
 * @return {number} The inner height value.
 */
export const GetInnerHeight = (iOS: boolean): number =>
{

    if (!iOS)
    {
        return window.innerHeight;
    }

    const axis = Math.abs(window.orientation);

    const size = { w: 0, h: 0 };

    // TODO: Replace let with const when we have a form to test this
    let ruler: HTMLDivElement | null = document.createElement('div');

    ruler.setAttribute('style', 'position: fixed; height: 100vh; width: 0; top: 0');

    document.documentElement.appendChild(ruler);

    size.w = (axis === 90) ? ruler.offsetHeight : window.innerWidth;
    size.h = (axis === 90) ? window.innerWidth : ruler.offsetHeight;

    document.documentElement.removeChild(ruler);

    ruler = null;

    if (Math.abs(window.orientation) !== 90)
    {
        return size.h;
    }
    else
    {
        return size.w;
    }
}
