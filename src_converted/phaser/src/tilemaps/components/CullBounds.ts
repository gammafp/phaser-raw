/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this file to TypeScript

import { SnapCeil } from '../../math/snap/SnapCeil';
import { SnapFloor } from '../../math/snap/SnapFloor';

import { Rectangle } from '../../geom/rectangle/Rectangle';
import type { Cameras, Tilemaps } from 'phaser';

var bounds = new Rectangle();

/**
 * Returns the bounds in the given orthogonal layer that are within the cameras viewport.
 * This is used internally by the cull tiles function.
 *
 * @function Phaser.Tilemaps.Components.CullBounds
 * @since 3.50.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to run the cull check against.
 *
 * @return {Phaser.Geom.Rectangle} A rectangle containing the culled bounds. If you wish to retain this object, clone it, as it's recycled internally.
 */
export const CullBounds = (layer: Tilemaps.LayerData, camera: Cameras.Scene2D.Camera): any =>
{
    var tilemap = layer.tilemapLayer.tilemap;
    var tilemapLayer = layer.tilemapLayer;

    //  We need to use the tile sizes defined for the map as a whole, not the layer,
    //  in order to calculate the bounds correctly. As different sized tiles may be
    //  placed on the grid and we cannot trust layer.baseTileWidth to give us the true size.
    var tileW = Math.floor(tilemap.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(tilemap.tileHeight * tilemapLayer.scaleY);

    var boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, tileW, 0, true) - tilemapLayer.cullPaddingX;
    var boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, tileW, 0, true) + tilemapLayer.cullPaddingX;

    var boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, tileH, 0, true) - tilemapLayer.cullPaddingY;
    var boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, tileH, 0, true) + tilemapLayer.cullPaddingY;

    return bounds.setTo(
        boundsLeft,
        boundsTop,
        (boundsRight - boundsLeft),
        (boundsBottom - boundsTop)
    );
};



