/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Internal function to process the separation of a physics body from a tile.
 */
export const ProcessTileSeparationX = function (body: any, x: number): void
{
    if (x < 0)
    {
        body.blocked.none = false;
        body.blocked.left = true;
    }
    else if (x > 0)
    {
        body.blocked.none = false;
        body.blocked.right = true;
    }

    body.position.x -= x;
    body.updateCenter();

    if (body.bounce.x === 0)
    {
        body.velocity.x = 0;
    }
    else
    {
        body.velocity.x = -body.velocity.x * body.bounce.x;
    }
};
