/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../math/Vector2';
import { Mixin } from '../utils/MixinTS';
import * as TilemapComponents from './components';

const CollisionComponent = require('../physics/arcade/components/Collision');
const Components = require('../gameobjects/components');
const GameObject = require('../gameobjects/GameObject');

export interface TilemapLayerBase {}

/**
 * @classdesc
 * A TilemapLayer is a Game Object that renders LayerData from a Tilemap
 * when used in combination with one, or more, Tilesets.
 * This is a generic base class that is extended by the TilemapLayer classes.
 * It is not used directly and should not be instantiated.
 *
 * @see Phaser.Tilemaps.TilemapLayer
 * @see Phaser.Tilemaps.TilemapGPULayer
 *
 * @class TilemapLayerBase
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 4.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.ElapseTimer
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.Physics.Arcade.Components.Collision
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {number} layerIndex - The index of the LayerData associated with this layer.
 * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
 * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
 */
export class TilemapLayerBase extends GameObject {

    static
    {
        Mixin(this, [
            Components.Alpha,
            Components.BlendMode,
            Components.ComputedSize,
            Components.Depth,
            Components.ElapseTimer,
            Components.Flip,
            Components.GetBounds,
            Components.Lighting,
            Components.Mask,
            Components.Origin,
            Components.RenderNodes,
            Components.Transform,
            Components.Visible,
            Components.ScrollFactor,
            CollisionComponent
        ]);
    }

    isTilemap: boolean;
    tilemap: any;
    layerIndex: number;
    layer: any;
    gidMap: any[];
    tempVec: Vector2;
    collisionCategory: number;
    collisionMask: number;

    constructor(type: string, scene: any, tilemap: any, layerIndex: number, x?: number, y?: number)
    {
        super(scene, type);

        this.isTilemap = true;
        this.tilemap = tilemap;
        this.layerIndex = layerIndex;
        this.layer = tilemap.layers[layerIndex];

        this.layer.tilemapLayer = this;

        this.gidMap = [];
        this.tempVec = new Vector2();
        this.collisionCategory = 0x0001;
        this.collisionMask = 1;

        this.setAlpha(this.layer.alpha);
        this.setPosition(x ?? 0, y ?? 0);
        this.setOrigin(0, 0);
        this.setSize(tilemap.tileWidth * this.layer.width, tilemap.tileHeight * this.layer.height);
    }

    addedToScene(): void
    {
        this.scene.sys.updateList.add(this);
    }

    removedFromScene(): void
    {
        this.scene.sys.updateList.remove(this);
    }

    preUpdate(time: number, delta: number): void
    {
        this.updateTimer(time, delta);
    }

    calculateFacesAt(tileX: number, tileY: number): this
    {
        TilemapComponents.CalculateFacesAt(tileX, tileY, this.layer);

        return this;
    }

    calculateFacesWithin(tileX?: number, tileY?: number, width?: number, height?: number): this
    {
        TilemapComponents.CalculateFacesWithin(tileX, tileY, width, height, this.layer);

        return this;
    }

    createFromTiles(indexes: number | number[], replacements?: number | number[] | null, spriteConfig?: any, scene?: any, camera?: any): any[]
    {
        return TilemapComponents.CreateFromTiles(indexes, replacements, spriteConfig, scene, camera, this.layer);
    }

    copy(srcTileX: number, srcTileY: number, width: number, height: number, destTileX: number, destTileY: number, recalculateFaces?: boolean): this
    {
        TilemapComponents.Copy(srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, this.layer);

        return this;
    }

    fill(index: number, tileX?: number, tileY?: number, width?: number, height?: number, recalculateFaces?: boolean): this
    {
        TilemapComponents.Fill(index, tileX, tileY, width, height, recalculateFaces, this.layer);

        return this;
    }

    filterTiles(callback: (tile: any) => boolean, context?: any, tileX?: number, tileY?: number, width?: number, height?: number, filteringOptions?: any): any[]
    {
        return TilemapComponents.FilterTiles(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    }

    findByIndex(findIndex: number, skip?: number, reverse?: boolean): any
    {
        return TilemapComponents.FindByIndex(findIndex, skip, reverse, this.layer);
    }

    findTile(callback: (tile: any) => boolean, context?: any, tileX?: number, tileY?: number, width?: number, height?: number, filteringOptions?: any): any
    {
        return TilemapComponents.FindTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    }

    forEachTile(callback: (tile: any) => void, context?: any, tileX?: number, tileY?: number, width?: number, height?: number, filteringOptions?: any): this
    {
        TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);

        return this;
    }

    getTileAt(tileX: number, tileY: number, nonNull?: boolean): any
    {
        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, this.layer);
    }

    getTileAtWorldXY(worldX: number, worldY: number, nonNull?: boolean, camera?: any): any
    {
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, this.layer);
    }

    getIsoTileAtWorldXY(worldX: number, worldY: number, originTop?: boolean, nonNull?: boolean, camera?: any): any
    {
        if (originTop === undefined) { originTop = true; }

        const point = this.tempVec;

        TilemapComponents.IsometricWorldToTileXY(worldX, worldY, true, point, camera, this.layer, originTop);

        return this.getTileAt(point.x, point.y, nonNull);
    }

    getTilesWithin(tileX?: number, tileY?: number, width?: number, height?: number, filteringOptions?: any): any[]
    {
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, filteringOptions, this.layer);
    }

    getTilesWithinShape(shape: any, filteringOptions?: any, camera?: any): any[]
    {
        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, this.layer);
    }

    getTilesWithinWorldXY(worldX: number, worldY: number, width: number, height: number, filteringOptions?: any, camera?: any): any[]
    {
        return TilemapComponents.GetTilesWithinWorldXY(worldX, worldY, width, height, filteringOptions, camera, this.layer);
    }

    hasTileAt(tileX: number, tileY: number): boolean
    {
        return TilemapComponents.HasTileAt(tileX, tileY, this.layer);
    }

    hasTileAtWorldXY(worldX: number, worldY: number, camera?: any): boolean
    {
        return TilemapComponents.HasTileAtWorldXY(worldX, worldY, camera, this.layer);
    }

    putTileAt(tile: number | any, tileX: number, tileY: number, recalculateFaces?: boolean): any
    {
        return TilemapComponents.PutTileAt(tile, tileX, tileY, recalculateFaces, this.layer);
    }

    putTileAtWorldXY(tile: number | any, worldX: number, worldY: number, recalculateFaces?: boolean, camera?: any): any
    {
        return TilemapComponents.PutTileAtWorldXY(tile, worldX, worldY, recalculateFaces, camera, this.layer);
    }

    putTilesAt(tilesArray: any, tileX: number, tileY: number, recalculateFaces?: boolean): this
    {
        TilemapComponents.PutTilesAt(tilesArray, tileX, tileY, recalculateFaces, this.layer);

        return this;
    }

    randomize(tileX?: number, tileY?: number, width?: number, height?: number, indexes?: number[]): this
    {
        TilemapComponents.Randomize(tileX, tileY, width, height, indexes, this.layer);

        return this;
    }

    removeTileAt(tileX: number, tileY: number, replaceWithNull?: boolean, recalculateFaces?: boolean): any
    {
        return TilemapComponents.RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, this.layer);
    }

    removeTileAtWorldXY(worldX: number, worldY: number, replaceWithNull?: boolean, recalculateFaces?: boolean, camera?: any): any
    {
        return TilemapComponents.RemoveTileAtWorldXY(worldX, worldY, replaceWithNull, recalculateFaces, camera, this.layer);
    }

    renderDebug(graphics: any, styleConfig?: any): this
    {
        TilemapComponents.RenderDebug(graphics, styleConfig, this.layer);

        return this;
    }

    replaceByIndex(findIndex: number, newIndex: number, tileX?: number, tileY?: number, width?: number, height?: number): this
    {
        TilemapComponents.ReplaceByIndex(findIndex, newIndex, tileX, tileY, width, height, this.layer);

        return this;
    }

    setCollision(indexes: number | number[], collides?: boolean, recalculateFaces?: boolean, updateLayer?: boolean): this
    {
        TilemapComponents.SetCollision(indexes, collides, recalculateFaces, this.layer, updateLayer);

        return this;
    }

    setCollisionBetween(start: number, stop: number, collides?: boolean, recalculateFaces?: boolean): this
    {
        TilemapComponents.SetCollisionBetween(start, stop, collides, recalculateFaces, this.layer);

        return this;
    }

    setCollisionByProperty(properties: any, collides?: boolean, recalculateFaces?: boolean): this
    {
        TilemapComponents.SetCollisionByProperty(properties, collides, recalculateFaces, this.layer);

        return this;
    }

    setCollisionByExclusion(indexes: number[], collides?: boolean, recalculateFaces?: boolean): this
    {
        TilemapComponents.SetCollisionByExclusion(indexes, collides, recalculateFaces, this.layer);

        return this;
    }

    setCollisionFromCollisionGroup(collides?: boolean, recalculateFaces?: boolean): this
    {
        TilemapComponents.SetCollisionFromCollisionGroup(collides, recalculateFaces, this.layer);

        return this;
    }

    setTileIndexCallback(indexes: number | number[], callback: (tile: any) => void, callbackContext: any): this
    {
        TilemapComponents.SetTileIndexCallback(indexes, callback, callbackContext, this.layer);

        return this;
    }

    setTileLocationCallback(tileX?: number, tileY?: number, width?: number, height?: number, callback?: (tile: any) => void, callbackContext?: any): this
    {
        TilemapComponents.SetTileLocationCallback(tileX, tileY, width, height, callback, callbackContext, this.layer);

        return this;
    }

    shuffle(tileX?: number, tileY?: number, width?: number, height?: number): this
    {
        TilemapComponents.Shuffle(tileX, tileY, width, height, this.layer);

        return this;
    }

    swapByIndex(indexA: number, indexB: number, tileX?: number, tileY?: number, width?: number, height?: number): this
    {
        TilemapComponents.SwapByIndex(indexA, indexB, tileX, tileY, width, height, this.layer);

        return this;
    }

    tileToWorldX(tileX: number, camera?: any): number
    {
        return this.tilemap.tileToWorldX(tileX, camera, this);
    }

    tileToWorldY(tileY: number, camera?: any): number
    {
        return this.tilemap.tileToWorldY(tileY, camera, this);
    }

    tileToWorldXY(tileX: number, tileY: number, point?: Vector2, camera?: any): Vector2
    {
        return this.tilemap.tileToWorldXY(tileX, tileY, point, camera, this);
    }

    getTileCorners(tileX: number, tileY: number, camera?: any): Vector2[] | null
    {
        return this.tilemap.getTileCorners(tileX, tileY, camera, this);
    }

    weightedRandomize(weightedIndexes: any[], tileX?: number, tileY?: number, width?: number, height?: number): this
    {
        TilemapComponents.WeightedRandomize(tileX, tileY, width, height, weightedIndexes, this.layer);

        return this;
    }

    worldToTileX(worldX: number, snapToFloor?: boolean, camera?: any): number
    {
        return this.tilemap.worldToTileX(worldX, snapToFloor, camera, this);
    }

    worldToTileY(worldY: number, snapToFloor?: boolean, camera?: any): number
    {
        return this.tilemap.worldToTileY(worldY, snapToFloor, camera, this);
    }

    worldToTileXY(worldX: number, worldY: number, snapToFloor?: boolean, point?: Vector2, camera?: any): Vector2
    {
        return this.tilemap.worldToTileXY(worldX, worldY, snapToFloor, point, camera, this);
    }

    destroy(removeFromTilemap?: boolean): void
    {
        if (removeFromTilemap === undefined) { removeFromTilemap = true; }

        if (!this.tilemap)
        {
            return;
        }

        if (this.layer.tilemapLayer === this)
        {
            this.layer.tilemapLayer = undefined;
        }

        if (removeFromTilemap)
        {
            this.tilemap.removeLayer(this);
        }

        this.tilemap = undefined;
        this.layer = undefined;

        this.gidMap = [];
        (this as any).tileset = [];

        GameObject.prototype.destroy.call(this);
    }

}

export default TilemapLayerBase;
