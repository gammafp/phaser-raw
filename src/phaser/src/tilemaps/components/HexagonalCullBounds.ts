/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { SnapCeil } from '../../math/snap/SnapCeil';
import { SnapFloor } from '../../math/snap/SnapFloor';
import type { LayerData } from '../typedefs';

/**
 * Returns the bounds in the given layer that are within the camera's viewport.
 * This is used internally by the cull tiles function.
 *
 * @function Phaser.Tilemaps.Components.HexagonalCullBounds
 * @since 3.50.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to run the cull check against.
 *
 * @return {object} An object containing the `left`, `right`, `top` and `bottom` bounds.
 */
export const HexagonalCullBounds = (layer: LayerData, camera: any): { left: number; right: number; top: number; bottom: number } => {
    var tilemap = layer.tilemapLayer.tilemap;
    var tilemapLayer = layer.tilemapLayer;

    //  We need to use the tile sizes defined for the map as a whole, not the layer,
    //  in order to calculate the bounds correctly. As different sized tiles may be
    //  placed on the grid and we cannot trust layer.baseTileWidth to give us the true size.
    var tileW = Math.floor(tilemap.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(tilemap.tileHeight * tilemapLayer.scaleY);

    var len = layer.hexSideLength;

    var boundsLeft;
    var boundsRight;
    var boundsTop;
    var boundsBottom;

    if (layer.staggerAxis === 'y')
    {
        var rowH = ((tileH - len) / 2 + len);

        boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, tileW, 0, true) - tilemapLayer.cullPaddingX;
        boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, tileW, 0, true) + tilemapLayer.cullPaddingX;

        boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, rowH, 0, true) - tilemapLayer.cullPaddingY;
        boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, rowH, 0, true) + tilemapLayer.cullPaddingY;
    }
    else
    {
        var rowW = ((tileW - len) / 2 + len);

        boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, rowW, 0, true) - tilemapLayer.cullPaddingX;
        boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, rowW, 0, true) + tilemapLayer.cullPaddingX;

        boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, tileH, 0, true) - tilemapLayer.cullPaddingY;
        boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, tileH, 0, true) + tilemapLayer.cullPaddingY;
    }

    return {
        left: boundsLeft,
        right: boundsRight,
        top: boundsTop,
        bottom: boundsBottom
    };
};
