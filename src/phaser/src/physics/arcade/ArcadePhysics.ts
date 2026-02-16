/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../utils/object/GetFastValue';
import { Merge } from '../../utils/object/Merge';
import { DegToRad } from '../../math/DegToRad';
import { DistanceBetween } from '../../math/distance/DistanceBetween';
import { DistanceSquared } from '../../math/distance/DistanceSquared';
import { Vector2 } from '../../math/Vector2';
import { PluginCache } from '../../plugins/PluginCache';
import { Factory } from './Factory';
import { OverlapCirc } from './components/OverlapCirc';
import { OverlapRect } from './components/OverlapRect';

import { World } from './World';

const SceneEvents = require('../../scene/events');

/**
 * @classdesc
 * The Arcade Physics Plugin belongs to a Scene and sets up and manages the Scene's physics simulation.
 * It also holds some useful methods for moving and rotating Arcade Physics Bodies.
 *
 * You can access it from within a Scene using `this.physics`.
 *
 * Arcade Physics uses the Projection Method of collision resolution and separation. While it's fast and suitable
 * for 'arcade' style games it lacks stability when multiple objects are in close proximity or resting upon each other.
 * The separation that stops two objects penetrating may create a new penetration against a different object. If you
 * require a high level of stability please consider using an alternative physics system, such as Matter.js.
 */
export class ArcadePhysics
{
    scene: any;
    systems: any;
    config: any;
    world: any;
    add: any;
    _category: number;

    constructor (scene: any)
    {
        this.scene = scene;
        this.systems = scene.sys;
        this.config = this.getConfig();
        this.world = undefined;
        this.add = undefined;
        this._category = 0x0001;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    }

    boot (): void
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    }

    start (): void
    {
        if (!this.world)
        {
            this.world = new World(this.scene, this.config);
            this.add = new Factory(this.world);
        }

        const eventEmitter = this.systems.events;

        if (!GetFastValue(this.config, 'customUpdate', false))
        {
            eventEmitter.on(SceneEvents.UPDATE, this.world.update, this.world);
        }

        eventEmitter.on(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    }

    enableUpdate (): void
    {
        this.systems.events.on(SceneEvents.UPDATE, this.world.update, this.world);
    }

    disableUpdate (): void
    {
        this.systems.events.off(SceneEvents.UPDATE, this.world.update, this.world);
    }

    getConfig (): any
    {
        const gameConfig = this.systems.game.config.physics;
        const sceneConfig = this.systems.settings.physics;

        const config = Merge(
            GetFastValue(sceneConfig, 'arcade', {}),
            GetFastValue(gameConfig, 'arcade', {})
        );

        return config;
    }

    nextCategory (): number
    {
        this._category = this._category << 1;

        return this._category;
    }

    overlap (object1: any, object2?: any, overlapCallback?: Function | null, processCallback?: Function | null, callbackContext?: any): boolean
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.world.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    }

    collide (object1: any, object2?: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any): boolean
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.world.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    }

    collideTiles (sprite: any, tiles: any[], collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean
    {
        return this.world.collideTiles(sprite, tiles, collideCallback, processCallback, callbackContext);
    }

    overlapTiles (sprite: any, tiles: any[], overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean
    {
        return this.world.overlapTiles(sprite, tiles, overlapCallback, processCallback, callbackContext);
    }

    pause (): any
    {
        return this.world.pause();
    }

    resume (): any
    {
        return this.world.resume();
    }

    accelerateTo (gameObject: any, x: number, y: number, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number
    {
        if (speed === undefined) { speed = 60; }

        const angle = Math.atan2(y - gameObject.y, x - gameObject.x);

        gameObject.body.acceleration.setToPolar(angle, speed);

        if (xSpeedMax !== undefined && ySpeedMax !== undefined)
        {
            gameObject.body.maxVelocity.set(xSpeedMax, ySpeedMax);
        }

        return angle;
    }

    accelerateToObject (gameObject: any, destination: any, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number
    {
        return this.accelerateTo(gameObject, destination.x, destination.y, speed, xSpeedMax, ySpeedMax);
    }

    closest (source: any, targets?: any[]): any
    {
        if (!targets)
        {
            targets = Array.from(this.world.bodies);
        }

        let min = Number.MAX_VALUE;
        let closest = null;
        const x = source.x;
        const y = source.y;
        const len = targets.length;

        for (let i = 0; i < len; i++)
        {
            const target = targets[i];
            const body = target.body || target;

            if (source === target || source === body || source === body.gameObject || source === body.center)
            {
                continue;
            }

            const distance = DistanceSquared(x, y, body.center.x, body.center.y);

            if (distance < min)
            {
                closest = target;
                min = distance;
            }
        }

        return closest;
    }

    furthest (source: any, targets?: any[]): any
    {
        if (!targets)
        {
            targets = Array.from(this.world.bodies);
        }

        let max = -1;
        let farthest = null;
        const x = source.x;
        const y = source.y;
        const len = targets.length;

        for (let i = 0; i < len; i++)
        {
            const target = targets[i];
            const body = target.body || target;

            if (source === target || source === body || source === body.gameObject || source === body.center)
            {
                continue;
            }

            const distance = DistanceSquared(x, y, body.center.x, body.center.y);

            if (distance > max)
            {
                farthest = target;
                max = distance;
            }
        }

        return farthest;
    }

    moveTo (gameObject: any, x: number, y: number, speed?: number, maxTime?: number): number
    {
        if (speed === undefined) { speed = 60; }
        if (maxTime === undefined) { maxTime = 0; }

        const angle = Math.atan2(y - gameObject.y, x - gameObject.x);

        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = DistanceBetween(gameObject.x, gameObject.y, x, y) / (maxTime / 1000);
        }

        gameObject.body.velocity.setToPolar(angle, speed);

        return angle;
    }

    moveToObject (gameObject: any, destination: any, speed?: number, maxTime?: number): number
    {
        return this.moveTo(gameObject, destination.x, destination.y, speed, maxTime);
    }

    velocityFromAngle (angle: number, speed?: number, vec2?: any): any
    {
        if (speed === undefined) { speed = 60; }
        if (vec2 === undefined) { vec2 = new Vector2(); }

        return vec2.setToPolar(DegToRad(angle), speed);
    }

    velocityFromRotation (rotation: number, speed?: number, vec2?: any): any
    {
        if (speed === undefined) { speed = 60; }
        if (vec2 === undefined) { vec2 = new Vector2(); }

        return vec2.setToPolar(rotation, speed);
    }

    overlapRect (x: number, y: number, width: number, height: number, includeDynamic?: boolean, includeStatic?: boolean): any[]
    {
        return OverlapRect(this.world, x, y, width, height, includeDynamic, includeStatic);
    }

    overlapCirc (x: number, y: number, radius: number, includeDynamic?: boolean, includeStatic?: boolean): any[]
    {
        return OverlapCirc(this.world, x, y, radius, includeDynamic, includeStatic);
    }

    shutdown (): void
    {
        if (!this.world)
        {
            //  Already destroyed
            return;
        }

        const eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.UPDATE, this.world.update, this.world);
        eventEmitter.off(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);

        this.add.destroy();
        this.world.destroy();

        this.add = null;
        this.world = null;
        this._category = 1;
    }

    destroy (): void
    {
        this.shutdown();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }
}

PluginCache.register('ArcadePhysics', ArcadePhysics, 'arcadePhysics');
