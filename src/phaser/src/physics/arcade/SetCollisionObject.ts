/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Either sets or creates the Arcade Body Collision object.
 *
 * Mostly only used internally.
 */
export const SetCollisionObject = function (noneFlip: boolean, data?: any): any
{
    if (data === undefined) { data = {}; }

    data.none = noneFlip;
    data.up = false;
    data.down = false;
    data.left = false;
    data.right = false;

    if (!noneFlip)
    {
        data.up = true;
        data.down = true;
        data.left = true;
        data.right = true;
    }

    return data;
};
