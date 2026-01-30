/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of objects and passes each of them to the given callback.
 *
 * @function Phaser.Actions.Call
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {Phaser.Types.Actions.CallCallback} callback - The callback to be invoked. It will be passed just one argument: the item from the array.
 * @param {*} context - The scope in which the callback will be invoked.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that was passed to this Action.
 */
export const Call = <G extends any[]>(
    items: G,
    callback: (item: G[number]) => void,
    context?: any
): G =>
{
    for (let i = 0; i < items.length; i++)
    {
        const item = items[i];

        callback.call(context, item);
    }

    return items;
};
