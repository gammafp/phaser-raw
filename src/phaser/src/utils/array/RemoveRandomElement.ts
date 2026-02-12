/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { SpliceOne } from './SpliceOne';

/**
 * Removes a random object from the given array and returns it.
 * Will return null if there are no array items that fall within the specified range or if there is no item for the randomly chosen index.
 *
 * @function Phaser.Utils.Array.RemoveRandomElement
 * @since 3.0.0
 *
 * @param {array} array - The array to removed a random element from.
 * @param {number} [start=0] - The array index to start the search from.
 * @param {number} [length=array.length] - Optional restriction on the number of elements to randomly select from.
 *
 * @return {object} The random element that was removed, or `null` if there were no array elements that fell within the given range.
 */
export const RemoveRandomElement = <T>(array: T[], start: number = 0, length?: number): T | undefined =>
{
    if (length === undefined) { length = array.length; }

    const randomIndex = start + Math.floor(Math.random() * length);

    return SpliceOne(array, randomIndex);
};
