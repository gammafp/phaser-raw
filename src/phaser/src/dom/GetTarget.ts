/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Attempts to get the target DOM element based on the given value, which can be either
 * a string, in which case it will be looked-up by ID, or an element node. If nothing
 * can be found it will return a reference to the document.body.
 *
 * @function Phaser.DOM.GetTarget
 * @since 3.16.0
 *
 * @param {HTMLElement|string} element - The DOM element to look-up, or a string ID of the element.
 */
export const GetTarget = (element: HTMLElement | string) =>
{
    let target: HTMLElement | null = null;

    if (element !== '')
    {
        if (typeof element === 'string')
        {
            //  Hopefully an element ID
            target = document.getElementById(element);
        }
        else if (element && element.nodeType === 1)
        {
            //  Quick test for a HTMLElement
            target = element;
        }
    }

    //  Fallback to the document body. Covers an invalid ID and a non HTMLElement object.
    if (!target)
    {
        //  Use the full window
        target = document.body;
    }

    return target;
}
