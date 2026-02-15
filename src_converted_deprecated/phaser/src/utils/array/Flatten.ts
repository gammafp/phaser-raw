/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array and flattens it, returning a shallow-copy flattened array.
 *
 * @function Phaser.Utils.Array.Flatten
 * @since 3.60.0
 *
 * @param {array} array - The array to flatten.
 * @param {array} [output] - An array to hold the results in.
 *
 * @return {array} The flattened output array.
 */
export const Flatten = (array: any[], output?: any[]): any[] =>
{
    if (output === undefined) { output = []; }

    for (let i = 0; i < array.length; i++)
    {
        if (Array.isArray(array[i]))
        {
            Flatten(array[i], output);
        }
        else
        {
            output.push(array[i]);
        }
    }

    return output;
};
