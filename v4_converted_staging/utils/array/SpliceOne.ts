/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Removes a single item from an array and returns it without creating gc, like the native splice does.
 * Based on code by Mike Reinstein.
 *
 * @function Phaser.Utils.Array.SpliceOne
 * @since 3.0.0
 *
 * @param {array} array - The array to splice from.
 * @param {number} index - The index of the item which should be spliced.
 *
 * @return {*} The item which was spliced (removed).
 */
export const SpliceOne = <T>(array: T[], index: number): T | undefined =>
{
    if (index >= array.length)
    {
        return;
    }

    const len = array.length - 1;

    const item = array[index];

    for (let i = index; i < len; i++)
    {
        array[i] = array[i + 1];
    }

    array.length = len;

    return item;
};
