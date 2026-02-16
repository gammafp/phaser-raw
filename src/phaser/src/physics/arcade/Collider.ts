/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @classdesc
 * An Arcade Physics Collider will automatically check for collision, or overlaps, between two objects
 * every step. If a collision, or overlap, occurs it will invoke the given callbacks.
 *
 * Note, if setting `overlapOnly` to `true`, and one of the objects is a `TilemapLayer`, every tile in the layer, regardless of tile ID, will be checked for collision.
 * Even if the layer has had only a subset of tile IDs enabled for collision, all tiles will still be checked for overlap.
 */
export class Collider
{
    world: any;
    name: string;
    active: boolean;
    overlapOnly: boolean;
    object1: any;
    object2: any;
    collideCallback: Function | null;
    processCallback: Function | null;
    callbackContext: any;

    constructor (world: any, overlapOnly: boolean, object1: any, object2: any, collideCallback: Function, processCallback: Function, callbackContext: any)
    {
        this.world = world;
        this.name = '';
        this.active = true;
        this.overlapOnly = overlapOnly;
        this.object1 = object1;
        this.object2 = object2;
        this.collideCallback = collideCallback;
        this.processCallback = processCallback;
        this.callbackContext = callbackContext;
    }

    setName (name: string): this
    {
        this.name = name;

        return this;
    }

    update (): void
    {
        this.world.collideObjects(
            this.object1,
            this.object2,
            this.collideCallback,
            this.processCallback,
            this.callbackContext,
            this.overlapOnly
        );
    }

    destroy (): void
    {
        this.world.removeCollider(this);

        this.active = false;

        this.world = null;

        this.object1 = null;
        this.object2 = null;

        this.collideCallback = null;
        this.processCallback = null;
        this.callbackContext = null;
    }
}
