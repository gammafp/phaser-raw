/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ORIENTATION_CONST as CONST } from '../const/ORIENTATION_CONST';

import { Vector2 } from '../../math/Vector2';
const Geom = require('../../geom/');
import { GetTilesWithin } from './GetTilesWithin';
const Intersects = require('../../geom/intersects/');
import { NOOP } from '../../utils/NOOP';
import type { LayerData, FilteringOptions } from '../typedefs';
import type { Tile } from '../Tile';

var TriangleToRectangle = function (triangle: any, rect: any): boolean
{
    return Intersects.RectangleToTriangle(rect, triangle);
};

var point = new Vector2();
var pointStart = new Vector2();
var pointEnd = new Vector2();

/**
 * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
 * Line, Rectangle or Triangle. The shape should be in world coordinates.
 * 
 * **Note:** This method currently only works with orthogonal tilemap layers.
 *
 * @function Phaser.Tilemaps.Components.GetTilesWithinShape
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
 * @param {Phaser.Types.Tilemaps.FilteringOptions} filteringOptions - Optional filters to apply when getting the tiles.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile[]} Array of Tile objects.
 */
export const GetTilesWithinShape = (shape: any, filteringOptions: FilteringOptions, camera: any, layer: LayerData): Tile[] => {
    if (layer.orientation !== CONST.ORTHOGONAL)
    {
        console.warn('GetTilesWithinShape only works with orthogonal tilemaps');
        return [];
    }

    if (shape === undefined) { return []; }

    // intersectTest is a function with parameters: shape, rect
    var intersectTest: Function = NOOP;

    if (shape instanceof Geom.Circle)
    {
        intersectTest = Intersects.CircleToRectangle;
    }
    else if (shape instanceof Geom.Rectangle)
    {
        intersectTest = Intersects.RectangleToRectangle;
    }
    else if (shape instanceof Geom.Triangle)
    {
        intersectTest = TriangleToRectangle;
    }
    else if (shape instanceof Geom.Line)
    {
        intersectTest = Intersects.LineToRectangle;
    }

    // Top left corner of the shapes's bounding box, rounded down to include partial tiles
    layer.tilemapLayer.worldToTileXY(shape.left, shape.top, true, pointStart, camera);

    var xStart = pointStart.x;
    var yStart = pointStart.y;

    // Bottom right corner of the shapes's bounding box, rounded up to include partial tiles
    layer.tilemapLayer.worldToTileXY(shape.right, shape.bottom, false, pointEnd, camera);

    var xEnd = Math.ceil(pointEnd.x);
    var yEnd = Math.ceil(pointEnd.y);

    // Tiles within bounding rectangle of shape. Bounds are forced to be at least 1 x 1 tile in size
    // to grab tiles for shapes that don't have a height or width (e.g. a horizontal line).
    var width = Math.max(xEnd - xStart, 1);
    var height = Math.max(yEnd - yStart, 1);

    var tiles = GetTilesWithin(xStart, yStart, width, height, filteringOptions, layer);

    var tileWidth = layer.tileWidth;
    var tileHeight = layer.tileHeight;

    if (layer.tilemapLayer)
    {
        tileWidth *= layer.tilemapLayer.scaleX;
        tileHeight *= layer.tilemapLayer.scaleY;
    }

    var results: Tile[] = [];
    var tileRect = new Geom.Rectangle(0, 0, tileWidth, tileHeight);

    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles[i];

        layer.tilemapLayer.tileToWorldXY(tile.x, tile.y, point, camera);

        tileRect.x = point.x;
        tileRect.y = point.y;

        if (intersectTest(shape, tileRect))
        {
            results.push(tile);
        }
    }

    return results;
};
