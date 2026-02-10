/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Moves the given array element down one place in the array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.MoveDown
 * @since 3.4.0
 *
 * @param {array} array - The input array.
 * @param {*} item - The element to move down the array.
 *
 * @return {array} The input array.
 */
export const MoveDown = <T>(array: T[], item: T): T[] =>
{
    const currentIndex = array.indexOf(item);

    if (currentIndex > 0)
    {
        const item2 = array[currentIndex - 1];

        const index2 = array.indexOf(item2);

        array[currentIndex] = item2;
        array[index2] = item;
    }

    return array;
};
