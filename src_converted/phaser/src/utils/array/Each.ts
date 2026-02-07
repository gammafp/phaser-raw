/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Passes each element in the array to the given callback.
 *
 * @function Phaser.Utils.Array.Each
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {function} callback - A callback to be invoked for each item in the array.
 * @param {object} context - The context in which the callback is invoked.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the current array item.
 *
 * @return {array} The input array.
 */
export const Each = <T>(array: T[], callback: Function, context: any, ...args: any[]): T[] =>
{
    let i: number;
    const callbackArgs: any[] = [ null ];

    for (i = 0; i < args.length; i++)
    {
        callbackArgs.push(args[i]);
    }

    for (i = 0; i < array.length; i++)
    {
        callbackArgs[0] = array[i];

        callback.apply(context, callbackArgs);
    }

    return array;
};
