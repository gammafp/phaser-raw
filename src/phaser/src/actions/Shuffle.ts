/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const ArrayShuffle = require('../utils/array/Shuffle');

/**
 * Shuffles the array in place. The shuffled array is both modified and returned.
 *
 * @function Phaser.Actions.Shuffle
 * @since 3.0.0
 * @see Phaser.Utils.Array.Shuffle
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
export const Shuffle = <G extends any[]>(items: G): G =>
{
    return ArrayShuffle(items);
};
