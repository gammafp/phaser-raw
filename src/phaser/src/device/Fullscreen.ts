/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Determines the full screen support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.fullscreen` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Fullscreen
 * @since 3.0.0
 *
 * @property {boolean} available - Does the browser support the Full Screen API?
 * @property {boolean} keyboard - Does the browser support access to the Keyboard during Full Screen mode?
 * @property {string} cancel - If the browser supports the Full Screen API this holds the call you need to use to cancel it.
 * @property {string} request - If the browser supports the Full Screen API this holds the call you need to use to activate it.
 */
const Fullscreen: any = {

    available: false,
    cancel: '',
    keyboard: false,
    request: ''

};

/**
* Checks for support of the Full Screen API.
*
* @ignore
*/
const init = (): typeof Fullscreen =>
{
    if (typeof importScripts === 'function')
    {
        return Fullscreen;
    }

    let i: number;

    const suffix1 = 'Fullscreen';
    const suffix2 = 'FullScreen';

    const fs = [
        'request' + suffix1,
        'request' + suffix2,
        'webkitRequest' + suffix1,
        'webkitRequest' + suffix2,
        'msRequest' + suffix1,
        'msRequest' + suffix2,
        'mozRequest' + suffix2,
        'mozRequest' + suffix1
    ];

    for (i = 0; i < fs.length; i++)
    {
        if ((document.documentElement as any)[fs[i]])
        {
            Fullscreen.available = true;
            Fullscreen.request = fs[i];
            break;
        }
    }

    const cfs = [
        'cancel' + suffix2,
        'exit' + suffix1,
        'webkitCancel' + suffix2,
        'webkitExit' + suffix1,
        'msCancel' + suffix2,
        'msExit' + suffix1,
        'mozCancel' + suffix2,
        'mozExit' + suffix1
    ];

    if (Fullscreen.available)
    {
        for (i = 0; i < cfs.length; i++)
        {
            if ((document as any)[cfs[i]])
            {
                Fullscreen.cancel = cfs[i];
                break;
            }
        }
    }

    //  Keyboard Input?
    //  Safari 5.1 says it supports fullscreen keyboard, but is lying.
    if (window['Element'] && (Element as any)['ALLOW_KEYBOARD_INPUT'] && !(/ Version\/5\.1(?:\.\d+)? Safari\//).test(navigator.userAgent))
    {
        Fullscreen.keyboard = true;
    }

    Object.defineProperty(Fullscreen, 'active', { get: function () { return !!((document as any).fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement); } });

    return Fullscreen;
};

export const FULLSCREEN_DEVICE = init();
