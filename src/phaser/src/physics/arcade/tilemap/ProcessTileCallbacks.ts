/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const ProcessTileCallbacks = (tile: any, sprite: any): boolean =>
{
    //  Tile callbacks take priority over layer level callbacks
    if (tile.collisionCallback)
    {
        return !tile.collisionCallback.call(tile.collisionCallbackContext, sprite, tile);
    }
    else if (tile.layer.callbacks[tile.index])
    {
        return !tile.layer.callbacks[tile.index].callback.call(
            tile.layer.callbacks[tile.index].callbackContext, sprite, tile
        );
    }

    return true;
};
