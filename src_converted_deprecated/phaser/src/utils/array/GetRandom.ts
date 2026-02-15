/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a Random element from the array.
 *
 * @function Phaser.Utils.Array.GetRandom
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[]} - [array]
 * @genericUse {T} - [$return]
 *
 * @param {T[]} array - The array to select the random entry from.
 * @param {number} [startIndex=0] - An optional start index.
 * @param {number} [length=array.length] - An optional length, the total number of elements (from the startIndex) to choose from.
 *
 * @return {T} A random element from the array, or `null` if no element could be found in the range given.
 */
export const GetRandom = <T>(array: T[], startIndex: number = 0, length?: number): T | null =>
{
    if (length === undefined) { length = array.length; }

    const randomIndex = startIndex + Math.floor(Math.random() * length);

    return (array[randomIndex] === undefined) ? null : array[randomIndex];
};
