/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const TileIntersectsBody = (tileWorldRect: any, body: any): boolean =>
{
    // Currently, all bodies are treated as rectangles when colliding with a Tile.

    return !(
        body.right <= tileWorldRect.left ||
        body.bottom <= tileWorldRect.top ||
        body.position.x >= tileWorldRect.right ||
        body.position.y >= tileWorldRect.bottom
    );
};
