/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Moves the element at the end of the array to the start, shifting all items in the process.
 * The "rotation" happens to the right.
 *
 * @function Phaser.Utils.Array.RotateRight
 * @since 3.0.0
 *
 * @param {array} array - The array to shift to the right. This array is modified in place.
 * @param {number} [total=1] - The number of times to shift the array.
 *
 * @return {*} The most recently shifted element.
 */
export const RotateRight = <T>(array: T[], total: number = 1): T | null =>
{
    let element: T | null = null;

    for (let i = 0; i < total; i++)
    {
        element = array.pop()!;
        array.unshift(element);
    }

    return element;
};
