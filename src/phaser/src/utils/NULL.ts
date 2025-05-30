/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A NULL OP callback function.
 *
 * This function always returns `null`.
 *
 * Used internally by Phaser when it's more expensive to determine if a callback exists
 * than it is to just invoke an empty function.
 *
 * @function Phaser.Utils.NULL
 * @since 3.60.0
 */
export const NULL = function ()
{
    return null;
}
