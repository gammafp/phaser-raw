/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { PropertyValueSet } from './PropertyValueSet';

/**
 * Takes an array of Game Objects, or any objects that have the public properties `x` and `y`
 * and then sets them to the given values.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetXY(group.getChildren(), x, y, stepX, stepY)`
 *
 * @function Phaser.Actions.SetXY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} x - The amount to set the `x` property to.
 * @param {number} [y=x] - The amount to set the `y` property to. If `undefined` or `null` it uses the `x` value.
 * @param {number} [stepX=0] - This is added to the `x` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `y` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
export const SetXY = <G extends any[]>(
    items: G,
    x: number,
    y?: number,
    stepX?: number,
    stepY?: number,
    index?: number,
    direction?: number
): G =>
{
    if (y === undefined || y === null) { y = x; }

    PropertyValueSet(items, 'x', x, stepX, index, direction);

    return PropertyValueSet(items, 'y', y, stepY, index, direction);
};
