/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates and returns the bitmask needed to determine if the given
 * categories will collide with each other or not.
 */
export const GetCollidesWith = function (categories: number | number[]): number
{
    let flags = 0;

    if (!Array.isArray(categories))
    {
        flags = categories;
    }
    else
    {
        for (let i = 0; i < categories.length; i++)
        {
            flags |= categories[i];
        }
    }

    return flags;
};
