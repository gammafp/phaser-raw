/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks for intersection between the given tile rectangle-like object and an Arcade Physics body.
 */
export const TileIntersectsBody = function (tileWorldRect: { left: number; right: number; top: number; bottom: number }, body: any): boolean
{
    // Currently, all bodies are treated as rectangles when colliding with a Tile.

    return !(
        body.right <= tileWorldRect.left ||
        body.bottom <= tileWorldRect.top ||
        body.position.x >= tileWorldRect.right ||
        body.position.y >= tileWorldRect.bottom
    );
};
