/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../scale/const');

/**
 * Attempts to determine the screen orientation using the Orientation API.
 *
 * @function Phaser.DOM.GetScreenOrientation
 * @since 3.16.0
 *
 * @param {number} width - The width of the viewport.
 * @param {number} height - The height of the viewport.
 *
 * @return {string} The orientation.
 */
export const GetScreenOrientation = (width: number, height: number) =>
{
    const screen: any = window.screen;

    // TODO: Maybe this is deprecated (mozOrientation and msOrientation)
    const orientation = (screen) ? screen.orientation || screen.mozOrientation || screen.msOrientation : false;

    if (orientation && typeof orientation.type === 'string')
    {
        //  Screen Orientation API specification
        return orientation.type;
    }
    else if (typeof orientation === 'string')
    {
        //  moz / ms-orientation are strings
        return orientation;
    }

    if (typeof window.orientation === 'number')
    {
        //  Do this check first, as iOS supports this, but also has an incomplete window.screen implementation
        //  This may change by device based on "natural" orientation.
        return (window.orientation === 0 || window.orientation === 180) ? CONST.ORIENTATION.PORTRAIT : CONST.ORIENTATION.LANDSCAPE;
    }
    else if (window.matchMedia)
    {
        if (window.matchMedia('(orientation: portrait)').matches)
        {
            return CONST.ORIENTATION.PORTRAIT;
        }
        else if (window.matchMedia('(orientation: landscape)').matches)
        {
            return CONST.ORIENTATION.LANDSCAPE;
        }
    }
    else
    {
        return (height > width) ? CONST.ORIENTATION.PORTRAIT : CONST.ORIENTATION.LANDSCAPE;
    }
}
