/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Adds an element to the DOM. If a parent is provided the element is added as a child of the parent, providing it was able to access it.
 * If no parent is given it will be added to `document.body` instead.
 *
 * @function Phaser.DOM.AddToDOM
 * @since 3.0.0
 *
 * @param {HTMLElement} element - The element to be added to the DOM.
 * @param {string|HTMLElement} [parent] - The parent to add the element to. If not provided it will be added to `document.body`.
 *
 * @return {HTMLElement} The element that was added to the DOM.
 */
export const AddToDOM = (element: HTMLElement, parent?: string | HTMLElement): HTMLElement =>
{

    if (element.parentElement && !parent)
    {
        return element;
    }

    let target: HTMLElement = document.body;

    if (parent)
    {
        if (typeof parent === 'string')
        {
            const foundElement = document.getElementById(parent);
            if (foundElement)
            {
                target = foundElement;
            }
        } 
        else if (typeof parent === 'object' && parent.nodeType === 1)
        {
            target = parent;
        }
        
    }

    target.appendChild(element);

    return element;
}; 