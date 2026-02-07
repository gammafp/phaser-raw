/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const SetCollisionObject = (noneFlip: boolean, data: any = {}): any =>
{
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
