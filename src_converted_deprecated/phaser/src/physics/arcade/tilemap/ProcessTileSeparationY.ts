/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const ProcessTileSeparationY = (body: any, y: number): void =>
{
    if (y < 0)
    {
        body.blocked.none = false;
        body.blocked.up = true;
    }
    else if (y > 0)
    {
        body.blocked.none = false;
        body.blocked.down = true;
    }

    body.position.y -= y;
    body.updateCenter();

    if (body.bounce.y === 0)
    {
        body.velocity.y = 0;
    }
    else
    {
        body.velocity.y = -body.velocity.y * body.bounce.y;
    }
};
