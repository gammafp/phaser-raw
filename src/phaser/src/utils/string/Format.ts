/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes a string and replaces instances of markers with values in the given array.
 * The markers take the form of `%1`, `%2`, etc. I.e.:
 *
 * `Format("The %1 is worth %2 gold", [ 'Sword', 500 ])`
 *
 * @function Phaser.Utils.String.Format
 * @since 3.0.0
 *
 * @param {string} string - The string containing the replacement markers.
 * @param {array} values - An array containing values that will replace the markers. If no value exists an empty string is inserted instead.
 *
 * @return {string} The string containing replaced values.
 */
export const Format = (string: string, values: any[]) =>
{
    return string.replace(/%([0-9]+)/g, (_s, n) =>
    {
        return values[Number(n) - 1];
    });
}
