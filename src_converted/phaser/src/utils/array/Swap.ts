/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Swaps the position of two elements in the given array.
 * The elements must exist in the same array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.Swap
 * @since 3.4.0
 *
 * @param {array} array - The input array.
 * @param {*} item1 - The first element to swap.
 * @param {*} item2 - The second element to swap.
 *
 * @return {array} The input array.
 */
export const Swap = <T>(array: T[], item1: T, item2: T): T[] =>
{
    if (item1 === item2)
    {
        return array;
    }

    const index1 = array.indexOf(item1);
    const index2 = array.indexOf(item2);

    if (index1 < 0 || index2 < 0)
    {
        throw new Error('Supplied items must be elements of the same array');
    }

    array[index1] = item2;
    array[index2] = item1;

    return array;
};
