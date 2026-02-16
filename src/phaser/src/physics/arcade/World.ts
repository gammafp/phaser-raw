/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { EventEmitter } from 'eventemitter3';

import { TransformMatrix } from '../../gameobjects/components/TransformMatrix';
import { GetTilesWithinWorldXY } from '../../tilemaps/components/GetTilesWithinWorldXY';
import { GetValue } from '../../utils/object/GetValue';
import { Rectangle } from '../../geom/rectangle/Rectangle';
import { BetweenPoints as AngleBetweenPoints } from '../../math/angle/BetweenPoints';
import { Clamp } from '../../math/Clamp';
import { DistanceBetween } from '../../math/distance/DistanceBetween';
import { DistanceBetweenPoints } from '../../math/distance/DistanceBetweenPoints';
import { Equal as FuzzyEqual } from '../../math/fuzzy/Equal';
import { GreaterThan as FuzzyGreaterThan } from '../../math/fuzzy/GreaterThan';
import { LessThan as FuzzyLessThan } from '../../math/fuzzy/LessThan';
import { MATH_CONST } from '../../math/const';
import { Vector2 } from '../../math/Vector2';
import { Wrap } from '../../math/Wrap';
import RTree from '../../structs/RTree';
import { ProcessQueue } from '../../structs/ProcessQueue';

import { Body } from './Body';
import { StaticBody } from './StaticBody';
import { Collider } from './Collider';
import { CONST } from './const';
import * as Events from './events';
import { GetOverlapX } from './GetOverlapX';
import { GetOverlapY } from './GetOverlapY';
import { ProcessTileCallbacks } from './tilemap/ProcessTileCallbacks';
import { SeparateTile } from './tilemap/SeparateTile';
import { SeparateX } from './SeparateX';
import { SeparateY } from './SeparateY';
import { TileIntersectsBody } from './tilemap/TileIntersectsBody';

/**
 * @classdesc
 * The Arcade Physics World.
 *
 * The World is responsible for creating, managing, colliding and updating all of the bodies within it.
 *
 * An instance of the World belongs to a Phaser.Scene and is accessed via the property `physics.world`.
 *
 * @class World
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this World instance belongs.
 * @param {Phaser.Types.Physics.Arcade.ArcadeWorldConfig} config - An Arcade Physics Configuration object.
 */
export class World extends EventEmitter
{
    scene: any;
    bodies: Set<any>;
    staticBodies: Set<any>;
    pendingDestroy: Set<any>;
    colliders: ProcessQueue;
    gravity: Vector2;
    bounds: Rectangle;
    checkCollision: { up: boolean; down: boolean; left: boolean; right: boolean };
    fps: number;
    fixedStep: boolean;
    _elapsed: number;
    _frameTime: number;
    _frameTimeMS: number;
    stepsLastFrame: number;
    timeScale: number;
    OVERLAP_BIAS: number;
    TILE_BIAS: number;
    forceX: boolean;
    isPaused: boolean;
    _total: number;
    drawDebug: boolean;
    debugGraphic: any;
    defaults: any;
    maxEntries: number;
    useTree: boolean;
    tree: RTree;
    staticTree: RTree;
    treeMinMax: { minX: number; minY: number; maxX: number; maxY: number };
    _tempMatrix: TransformMatrix;
    _tempMatrix2: TransformMatrix;
    tileFilterOptions: any;

    constructor (scene: any, config: any)
    {
        super();

        this.scene = scene;
        this.bodies = new Set();
        this.staticBodies = new Set();
        this.pendingDestroy = new Set();
        this.colliders = new ProcessQueue();
        this.gravity = new Vector2(GetValue(config, 'gravity.x', 0), GetValue(config, 'gravity.y', 0));
        this.bounds = new Rectangle(
            GetValue(config, 'x', 0),
            GetValue(config, 'y', 0),
            GetValue(config, 'width', scene.sys.scale.width),
            GetValue(config, 'height', scene.sys.scale.height)
        );
        this.checkCollision = {
            up: GetValue(config, 'checkCollision.up', true),
            down: GetValue(config, 'checkCollision.down', true),
            left: GetValue(config, 'checkCollision.left', true),
            right: GetValue(config, 'checkCollision.right', true)
        };
        this.fps = GetValue(config, 'fps', 60);
        this.fixedStep = GetValue(config, 'fixedStep', true);
        this._elapsed = 0;
        this._frameTime = 1 / this.fps;
        this._frameTimeMS = 1000 * this._frameTime;
        this.stepsLastFrame = 0;
        this.timeScale = GetValue(config, 'timeScale', 1);
        this.OVERLAP_BIAS = GetValue(config, 'overlapBias', 4);
        this.TILE_BIAS = GetValue(config, 'tileBias', 16);
        this.forceX = GetValue(config, 'forceX', false);
        this.isPaused = GetValue(config, 'isPaused', false);
        this._total = 0;
        this.drawDebug = GetValue(config, 'debug', false);
        this.debugGraphic = undefined;
        this.defaults = {
            debugShowBody: GetValue(config, 'debugShowBody', true),
            debugShowStaticBody: GetValue(config, 'debugShowStaticBody', true),
            debugShowVelocity: GetValue(config, 'debugShowVelocity', true),
            bodyDebugColor: GetValue(config, 'debugBodyColor', 0xff00ff),
            staticBodyDebugColor: GetValue(config, 'debugStaticBodyColor', 0x0000ff),
            velocityDebugColor: GetValue(config, 'debugVelocityColor', 0x00ff00)
        };
        this.maxEntries = GetValue(config, 'maxEntries', 16);
        this.useTree = GetValue(config, 'useTree', true);
        this.tree = new RTree(this.maxEntries);
        this.staticTree = new RTree(this.maxEntries);
        this.treeMinMax = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        this._tempMatrix = new TransformMatrix();
        this._tempMatrix2 = new TransformMatrix();
        this.tileFilterOptions = { isColliding: true, isNotEmpty: true, hasInterestingFace: true };

        if (this.drawDebug)
        {
            this.createDebugGraphic();
        }
    }

    enable (object: any, bodyType?: number): void
    {
        if (bodyType === undefined) { bodyType = CONST.DYNAMIC_BODY; }

        if (!Array.isArray(object))
        {
            object = [ object ];
        }

        for (let i = 0; i < object.length; i++)
        {
            const entry = object[i];

            if (entry.isParent)
            {
                const children = entry.getChildren();

                for (let c = 0; c < children.length; c++)
                {
                    const child = children[c];

                    if (child.isParent)
                    {
                        this.enable(child, bodyType);
                    }
                    else
                    {
                        this.enableBody(child, bodyType);
                    }
                }
            }
            else
            {
                this.enableBody(entry, bodyType);
            }
        }
    }

    enableBody (object: any, bodyType?: number): any
    {
        if (bodyType === undefined) { bodyType = CONST.DYNAMIC_BODY; }

        if (object.hasTransformComponent)
        {
            if (!object.body)
            {
                if (bodyType === CONST.DYNAMIC_BODY)
                {
                    object.body = new Body(this, object);
                }
                else if (bodyType === CONST.STATIC_BODY)
                {
                    object.body = new StaticBody(this, object);
                }
            }

            this.add(object.body);
        }

        return object;
    }

    add (body: any): any
    {
        if (body.physicsType === CONST.DYNAMIC_BODY)
        {
            this.bodies.add(body);
        }
        else if (body.physicsType === CONST.STATIC_BODY)
        {
            this.staticBodies.add(body);
            this.staticTree.insert(body);
        }

        body.enable = true;

        return body;
    }

    disable (object: any): void
    {
        if (!Array.isArray(object))
        {
            object = [ object ];
        }

        for (let i = 0; i < object.length; i++)
        {
            const entry = object[i];

            if (entry.isParent)
            {
                const children = entry.getChildren();

                for (let c = 0; c < children.length; c++)
                {
                    const child = children[c];

                    if (child.isParent)
                    {
                        this.disable(child);
                    }
                    else
                    {
                        this.disableBody(child.body);
                    }
                }
            }
            else
            {
                this.disableBody(entry.body);
            }
        }
    }

    disableBody (body: any): void
    {
        this.remove(body);
        body.enable = false;
    }

    remove (body: any): void
    {
        if (body.physicsType === CONST.DYNAMIC_BODY)
        {
            this.tree.remove(body);
            this.bodies.delete(body);
        }
        else if (body.physicsType === CONST.STATIC_BODY)
        {
            this.staticBodies.delete(body);
            this.staticTree.remove(body);
        }
    }

    createDebugGraphic (): any
    {
        const graphic = this.scene.sys.add.graphics({ x: 0, y: 0 });
        graphic.setDepth(Number.MAX_VALUE);
        this.debugGraphic = graphic;
        this.drawDebug = true;
        return graphic;
    }

    setBounds (x: number, y: number, width: number, height: number, checkLeft?: boolean, checkRight?: boolean, checkUp?: boolean, checkDown?: boolean): this
    {
        this.bounds.setTo(x, y, width, height);

        if (checkLeft !== undefined)
        {
            this.setBoundsCollision(checkLeft, checkRight, checkUp, checkDown);
        }

        return this;
    }

    setBoundsCollision (left?: boolean, right?: boolean, up?: boolean, down?: boolean): this
    {
        if (left === undefined) { left = true; }
        if (right === undefined) { right = true; }
        if (up === undefined) { up = true; }
        if (down === undefined) { down = true; }

        this.checkCollision.left = left;
        this.checkCollision.right = right;
        this.checkCollision.up = up;
        this.checkCollision.down = down;

        return this;
    }

    pause (): this
    {
        this.isPaused = true;
        this.emit(Events.PAUSE);
        return this;
    }

    resume (): this
    {
        this.isPaused = false;
        this.emit(Events.RESUME);
        return this;
    }

    addCollider (object1: any, object2: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any): Collider
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        const collider = new Collider(this, false, object1, object2, collideCallback as any, processCallback as any, callbackContext);
        this.colliders.add(collider);
        return collider;
    }

    addOverlap (object1: any, object2: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any): Collider
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        const collider = new Collider(this, true, object1, object2, collideCallback as any, processCallback as any, callbackContext);
        this.colliders.add(collider);
        return collider;
    }

    removeCollider (collider: Collider): this
    {
        this.colliders.remove(collider);
        return this;
    }

    setFPS (framerate: number): this
    {
        this.fps = framerate;
        this._frameTime = 1 / this.fps;
        this._frameTimeMS = 1000 * this._frameTime;
        return this;
    }

    update (time: number, delta: number): void
    {
        if (this.isPaused || this.bodies.size === 0)
        {
            return;
        }

        let fixedDelta = this._frameTime;
        const msPerFrame = this._frameTimeMS * this.timeScale;

        this._elapsed += delta;

        const bodies = this.bodies;
        let willStep = (this._elapsed >= msPerFrame);

        if (!this.fixedStep)
        {
            fixedDelta = delta * 0.001;
            willStep = true;
            this._elapsed = 0;
        }

        bodies.forEach((body: any) =>
        {
            if (body.enable)
            {
                body.preUpdate(willStep, fixedDelta);
            }
        });

        if (willStep)
        {
            this._elapsed -= msPerFrame;
            this.stepsLastFrame = 1;

            if (this.useTree)
            {
                this.tree.clear();
                this.tree.load(Array.from(bodies));
            }

            const colliders = this.colliders.update();

            for (let i = 0; i < colliders.length; i++)
            {
                const collider = colliders[i];

                if (collider.active)
                {
                    collider.update();
                }
            }

            this.emit(Events.WORLD_STEP, fixedDelta);
        }

        while (this._elapsed >= msPerFrame)
        {
            this._elapsed -= msPerFrame;
            this.step(fixedDelta);
        }
    }

    step (delta: number): void
    {
        const bodies = this.bodies;

        bodies.forEach((body: any) =>
        {
            if (body.enable)
            {
                body.update(delta);
            }
        });

        if (this.useTree)
        {
            this.tree.clear();
            this.tree.load(Array.from(bodies));
        }

        const colliders = this.colliders.update();

        for (let i = 0; i < colliders.length; i++)
        {
            const collider = colliders[i];

            if (collider.active)
            {
                collider.update();
            }
        }

        this.emit(Events.WORLD_STEP, delta);
        this.stepsLastFrame++;
    }

    singleStep (): void
    {
        this.update(0, this._frameTimeMS);
        this.postUpdate();
    }

    postUpdate (): void
    {
        const dynamic = this.bodies;
        const staticBodies = this.staticBodies;

        if (this.stepsLastFrame)
        {
            this.stepsLastFrame = 0;

            dynamic.forEach((body: any) =>
            {
                if (body.enable)
                {
                    body.postUpdate();
                }
            });
        }

        if (this.drawDebug)
        {
            const graphics = this.debugGraphic;
            graphics.clear();

            dynamic.forEach((body: any) =>
            {
                if (body.willDrawDebug())
                {
                    body.drawDebug(graphics);
                }
            });

            staticBodies.forEach((body: any) =>
            {
                if (body.willDrawDebug())
                {
                    body.drawDebug(graphics);
                }
            });
        }

        const pending = this.pendingDestroy;

        if (pending.size > 0)
        {
            const dynamicTree = this.tree;
            const staticTree = this.staticTree;

            pending.forEach((body: any) =>
            {
                if (body.physicsType === CONST.DYNAMIC_BODY)
                {
                    dynamicTree.remove(body);
                    dynamic.delete(body);
                }
                else if (body.physicsType === CONST.STATIC_BODY)
                {
                    staticTree.remove(body);
                    staticBodies.delete(body);
                }

                body.world = undefined;
                body.gameObject = undefined;
            });

            pending.clear();
        }
    }

    updateMotion (body: any, delta: number): void
    {
        if (body.allowRotation)
        {
            this.computeAngularVelocity(body, delta);
        }

        this.computeVelocity(body, delta);
    }

    computeAngularVelocity (body: any, delta: number): void
    {
        let velocity = body.angularVelocity;
        const acceleration = body.angularAcceleration;
        let drag = body.angularDrag;
        const max = body.maxAngular;

        if (acceleration)
        {
            velocity += acceleration * delta;
        }
        else if (body.allowDrag && drag)
        {
            drag *= delta;

            if (FuzzyGreaterThan(velocity - drag, 0, 0.1))
            {
                velocity -= drag;
            }
            else if (FuzzyLessThan(velocity + drag, 0, 0.1))
            {
                velocity += drag;
            }
            else
            {
                velocity = 0;
            }
        }

        velocity = Clamp(velocity, -max, max);

        const velocityDelta = velocity - body.angularVelocity;

        body.angularVelocity += velocityDelta;
        body.rotation += (body.angularVelocity * delta);
    }

    computeVelocity (body: any, delta: number): void
    {
        let velocityX = body.velocity.x;
        const accelerationX = body.acceleration.x;
        let dragX = body.drag.x;
        const maxX = body.maxVelocity.x;

        let velocityY = body.velocity.y;
        const accelerationY = body.acceleration.y;
        let dragY = body.drag.y;
        const maxY = body.maxVelocity.y;

        let speed = body.speed;
        const maxSpeed = body.maxSpeed;
        const allowDrag = body.allowDrag;
        const useDamping = body.useDamping;

        if (body.allowGravity)
        {
            velocityX += (this.gravity.x + body.gravity.x) * delta;
            velocityY += (this.gravity.y + body.gravity.y) * delta;
        }

        if (accelerationX)
        {
            velocityX += accelerationX * delta;
        }
        else if (allowDrag && dragX)
        {
            if (useDamping)
            {
                dragX = Math.pow(dragX, delta);
                velocityX *= dragX;
                speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

                if (FuzzyEqual(speed, 0, 0.001))
                {
                    velocityX = 0;
                }
            }
            else
            {
                dragX *= delta;

                if (FuzzyGreaterThan(velocityX - dragX, 0, 0.01))
                {
                    velocityX -= dragX;
                }
                else if (FuzzyLessThan(velocityX + dragX, 0, 0.01))
                {
                    velocityX += dragX;
                }
                else
                {
                    velocityX = 0;
                }
            }
        }

        if (accelerationY)
        {
            velocityY += accelerationY * delta;
        }
        else if (allowDrag && dragY)
        {
            if (useDamping)
            {
                dragY = Math.pow(dragY, delta);
                velocityY *= dragY;
                speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

                if (FuzzyEqual(speed, 0, 0.001))
                {
                    velocityY = 0;
                }
            }
            else
            {
                dragY *= delta;

                if (FuzzyGreaterThan(velocityY - dragY, 0, 0.01))
                {
                    velocityY -= dragY;
                }
                else if (FuzzyLessThan(velocityY + dragY, 0, 0.01))
                {
                    velocityY += dragY;
                }
                else
                {
                    velocityY = 0;
                }
            }
        }

        velocityX = Clamp(velocityX, -maxX, maxX);
        velocityY = Clamp(velocityY, -maxY, maxY);

        body.velocity.set(velocityX, velocityY);

        if (maxSpeed > -1 && body.velocity.length() > maxSpeed)
        {
            body.velocity.normalize().scale(maxSpeed);
            speed = maxSpeed;
        }

        body.speed = speed;
    }

    separate (body1: any, body2: any, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean): boolean
    {
        let overlapX: number | undefined;
        let overlapY: number | undefined;

        let result = false;
        let runSeparation = true;

        if (
            !body1.enable ||
            !body2.enable ||
            body1.checkCollision.none ||
            body2.checkCollision.none ||
            !this.intersects(body1, body2))
        {
            return result;
        }

        if (processCallback && processCallback.call(callbackContext, (body1.gameObject || body1), (body2.gameObject || body2)) === false)
        {
            return result;
        }

        if (body1.isCircle || body2.isCircle)
        {
            const circleResults = this.separateCircle(body1, body2, overlapOnly);

            if (circleResults.result)
            {
                result = true;
                runSeparation = false;
            }
            else
            {
                overlapX = circleResults.x;
                overlapY = circleResults.y;
                runSeparation = true;
            }
        }

        if (runSeparation)
        {
            let resultX = false;
            let resultY = false;
            const bias = this.OVERLAP_BIAS;

            if (overlapOnly)
            {
                resultX = SeparateX(body1, body2, overlapOnly, bias, overlapX);
                resultY = SeparateY(body1, body2, overlapOnly, bias, overlapY);
            }
            else if (this.forceX || Math.abs(this.gravity.y + body1.gravity.y) < Math.abs(this.gravity.x + body1.gravity.x))
            {
                resultX = SeparateX(body1, body2, overlapOnly, bias, overlapX);

                if (this.intersects(body1, body2))
                {
                    resultY = SeparateY(body1, body2, overlapOnly, bias, overlapY);
                }
            }
            else
            {
                resultY = SeparateY(body1, body2, overlapOnly, bias, overlapY);

                if (this.intersects(body1, body2))
                {
                    resultX = SeparateX(body1, body2, overlapOnly, bias, overlapX);
                }
            }

            result = (resultX || resultY);
        }

        if (result)
        {
            if (overlapOnly)
            {
                if (body1.onOverlap || body2.onOverlap)
                {
                    this.emit(Events.OVERLAP, body1.gameObject, body2.gameObject, body1, body2);
                }
            }
            else if (body1.onCollide || body2.onCollide)
            {
                this.emit(Events.COLLIDE, body1.gameObject, body2.gameObject, body1, body2);
            }
        }

        return result;
    }

    separateCircle (body1: any, body2: any, overlapOnly?: boolean): { overlap: number; result: boolean; x?: number; y?: number }
    {
        GetOverlapX(body1, body2, false, 0);
        GetOverlapY(body1, body2, false, 0);

        const body1IsCircle = body1.isCircle;
        const body2IsCircle = body2.isCircle;
        const body1Center = body1.center;
        const body2Center = body2.center;
        const body1Immovable = body1.immovable;
        const body2Immovable = body2.immovable;
        const body1Velocity = body1.velocity;
        const body2Velocity = body2.velocity;

        let overlap = 0;
        let twoCircles = true;

        if (body1IsCircle !== body2IsCircle)
        {
            twoCircles = false;

            let circleX = body1Center.x;
            let circleY = body1Center.y;
            let circleRadius = body1.halfWidth;

            let rectX = body2.position.x;
            let rectY = body2.position.y;
            let rectRight = body2.right;
            let rectBottom = body2.bottom;

            if (body2IsCircle)
            {
                circleX = body2Center.x;
                circleY = body2Center.y;
                circleRadius = body2.halfWidth;

                rectX = body1.position.x;
                rectY = body1.position.y;
                rectRight = body1.right;
                rectBottom = body1.bottom;
            }

            if (circleY < rectY)
            {
                if (circleX < rectX)
                {
                    overlap = DistanceBetween(circleX, circleY, rectX, rectY) - circleRadius;
                }
                else if (circleX > rectRight)
                {
                    overlap = DistanceBetween(circleX, circleY, rectRight, rectY) - circleRadius;
                }
            }
            else if (circleY > rectBottom)
            {
                if (circleX < rectX)
                {
                    overlap = DistanceBetween(circleX, circleY, rectX, rectBottom) - circleRadius;
                }
                else if (circleX > rectRight)
                {
                    overlap = DistanceBetween(circleX, circleY, rectRight, rectBottom) - circleRadius;
                }
            }

            overlap *= -1;
        }
        else
        {
            overlap = (body1.halfWidth + body2.halfWidth) - DistanceBetweenPoints(body1Center, body2Center);
        }

        body1.overlapR = overlap;
        body2.overlapR = overlap;

        const angle = AngleBetweenPoints(body1Center, body2Center);
        let overlapX = (overlap + MATH_CONST.EPSILON) * Math.cos(angle);
        let overlapY = (overlap + MATH_CONST.EPSILON) * Math.sin(angle);

        const results: { overlap: number; result: boolean; x?: number; y?: number } = { overlap, result: false, x: overlapX, y: overlapY };

        if (overlapOnly && (!twoCircles || (twoCircles && overlap !== 0)))
        {
            results.result = true;
            return results;
        }

        if ((!twoCircles && overlap === 0) || (body1Immovable && body2Immovable) || body1.customSeparateX || body2.customSeparateX)
        {
            results.x = undefined;
            results.y = undefined;
            return results;
        }

        const deadlock = (!body1.pushable && !body2.pushable);

        if (twoCircles)
        {
            const dx = body1Center.x - body2Center.x;
            const dy = body1Center.y - body2Center.y;
            const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            const nx = ((body2Center.x - body1Center.x) / d) || 0;
            const ny = ((body2Center.y - body1Center.y) / d) || 0;
            let p = 2 * (body1Velocity.x * nx + body1Velocity.y * ny - body2Velocity.x * nx - body2Velocity.y * ny) / (body1.mass + body2.mass);

            if (body1Immovable || body2Immovable || !body1.pushable || !body2.pushable)
            {
                p *= 2;
            }

            if (!body1Immovable && body1.pushable)
            {
                body1Velocity.x = (body1Velocity.x - p / body1.mass * nx);
                body1Velocity.y = (body1Velocity.y - p / body1.mass * ny);
                body1Velocity.multiply(body1.bounce);
            }

            if (!body2Immovable && body2.pushable)
            {
                body2Velocity.x = (body2Velocity.x + p / body2.mass * nx);
                body2Velocity.y = (body2Velocity.y + p / body2.mass * ny);
                body2Velocity.multiply(body2.bounce);
            }

            if (!body1Immovable && !body2Immovable)
            {
                overlapX *= 0.5;
                overlapY *= 0.5;
            }

            if (!body1Immovable || body1.pushable || deadlock)
            {
                body1.x -= overlapX;
                body1.y -= overlapY;
                body1.updateCenter();
            }

            if (!body2Immovable || body2.pushable || deadlock)
            {
                body2.x += overlapX;
                body2.y += overlapY;
                body2.updateCenter();
            }

            results.result = true;
        }
        else
        {
            if (!body1Immovable || body1.pushable || deadlock)
            {
                body1.x -= overlapX;
                body1.y -= overlapY;
                body1.updateCenter();
            }

            if (!body2Immovable || body2.pushable || deadlock)
            {
                body2.x += overlapX;
                body2.y += overlapY;
                body2.updateCenter();
            }

            results.x = undefined;
            results.y = undefined;
        }

        return results;
    }

    intersects (body1: any, body2: any): boolean
    {
        if (body1 === body2)
        {
            return false;
        }

        if (!body1.isCircle && !body2.isCircle)
        {
            return !(
                body1.right <= body2.left ||
                body1.bottom <= body2.top ||
                body1.left >= body2.right ||
                body1.top >= body2.bottom
            );
        }
        else if (body1.isCircle)
        {
            if (body2.isCircle)
            {
                return DistanceBetweenPoints(body1.center, body2.center) <= (body1.halfWidth + body2.halfWidth);
            }
            else
            {
                return this.circleBodyIntersects(body1, body2);
            }
        }
        else
        {
            return this.circleBodyIntersects(body2, body1);
        }
    }

    circleBodyIntersects (circle: any, body: any): boolean
    {
        const x = Clamp(circle.center.x, body.left, body.right);
        const y = Clamp(circle.center.y, body.top, body.bottom);

        const dx = (circle.center.x - x) * (circle.center.x - x);
        const dy = (circle.center.y - y) * (circle.center.y - y);

        return (dx + dy) <= (circle.halfWidth * circle.halfWidth);
    }

    overlap (object1: any, object2?: any, overlapCallback?: Function | null, processCallback?: Function | null, callbackContext?: any): boolean
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    }

    collide (object1: any, object2?: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any): boolean
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    }

    collideObjects (object1: any, object2?: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean): boolean
    {
        let i: number;
        let j: number;

        if (object1.isParent && (object1.physicsType === undefined || object2 === undefined || object1 === object2))
        {
            object1 = Array.from(object1.children);
        }

        if (object2 && object2.isParent && object2.physicsType === undefined)
        {
            object2 = Array.from(object2.children);
        }

        const object1isArray = Array.isArray(object1);
        const object2isArray = Array.isArray(object2);

        this._total = 0;

        if (!object1isArray && !object2isArray)
        {
            this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
        else if (!object1isArray && object2isArray)
        {
            for (i = 0; i < object2.length; i++)
            {
                this.collideHandler(object1, object2[i], collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
        else if (object1isArray && !object2isArray)
        {
            if (!object2)
            {
                for (i = 0; i < object1.length; i++)
                {
                    const child = object1[i];

                    for (j = i + 1; j < object1.length; j++)
                    {
                        if (i === j)
                        {
                            continue;
                        }

                        this.collideHandler(child, object1[j], collideCallback, processCallback, callbackContext, overlapOnly);
                    }
                }
            }
            else
            {
                for (i = 0; i < object1.length; i++)
                {
                    this.collideHandler(object1[i], object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }
        else
        {
            for (i = 0; i < object1.length; i++)
            {
                for (j = 0; j < object2.length; j++)
                {
                    this.collideHandler(object1[i], object2[j], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

        return (this._total > 0);
    }

    collideHandler (object1: any, object2?: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean): boolean | void
    {
        if (object2 === undefined && object1.isParent)
        {
            return this.collideGroupVsGroup(object1, object1, collideCallback, processCallback, callbackContext, overlapOnly);
        }

        if (!object1 || !object2)
        {
            return false;
        }

        if (object1.body || object1.isBody)
        {
            if (object2.body || object2.isBody)
            {
                return this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isParent)
            {
                return this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isTilemap)
            {
                return this.collideSpriteVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
        else if (object1.isParent)
        {
            if (object2.body || object2.isBody)
            {
                return this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isParent)
            {
                return this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isTilemap)
            {
                return this.collideGroupVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
        else if (object1.isTilemap)
        {
            if (object2.body || object2.isBody)
            {
                return this.collideSpriteVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
            }
            else if (object2.isParent)
            {
                return this.collideGroupVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
    }

    canCollide (body1: any, body2: any): boolean
    {
        return (
            (body1 && body2) &&
            (body1.collisionMask & body2.collisionCategory) !== 0 &&
            (body2.collisionMask & body1.collisionCategory) !== 0
        );
    }

    collideSpriteVsSprite (sprite1: any, sprite2: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean): boolean
    {
        const body1 = (sprite1.isBody) ? sprite1 : sprite1.body;
        const body2 = (sprite2.isBody) ? sprite2 : sprite2.body;

        if (!this.canCollide(body1, body2))
        {
            return false;
        }

        if (this.separate(body1, body2, processCallback, callbackContext, overlapOnly))
        {
            if (collideCallback)
            {
                collideCallback.call(callbackContext, sprite1, sprite2);
            }

            this._total++;
        }

        return true;
    }

    collideSpriteVsGroup (sprite: any, group: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean): void
    {
        const bodyA = (sprite.isBody) ? sprite : sprite.body;

        if (group.getLength() === 0 || !bodyA || !bodyA.enable || bodyA.checkCollision.none || !this.canCollide(bodyA, group))
        {
            return;
        }

        let i: number;
        let len: number;
        let bodyB: any;

        if (this.useTree || group.physicsType === CONST.STATIC_BODY)
        {
            const minMax = this.treeMinMax;

            minMax.minX = bodyA.left;
            minMax.minY = bodyA.top;
            minMax.maxX = bodyA.right;
            minMax.maxY = bodyA.bottom;

            const results = (group.physicsType === CONST.DYNAMIC_BODY) ? this.tree.search(minMax) : this.staticTree.search(minMax);

            len = results.length;

            for (i = 0; i < len; i++)
            {
                bodyB = results[i];

                if (bodyA === bodyB || !bodyB.enable || bodyB.checkCollision.none || !group.contains(bodyB.gameObject))
                {
                    continue;
                }

                if (this.separate(bodyA, bodyB, processCallback, callbackContext, overlapOnly))
                {
                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, bodyA.gameObject, bodyB.gameObject);
                    }

                    this._total++;
                }
            }
        }
        else
        {
            const children = group.getChildren();
            const skipIndex = children.indexOf(sprite);

            len = children.length;

            for (i = 0; i < len; i++)
            {
                bodyB = children[i].body;

                if (!bodyB || i === skipIndex || !bodyB.enable)
                {
                    continue;
                }

                if (this.separate(bodyA, bodyB, processCallback, callbackContext, overlapOnly))
                {
                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, bodyA.gameObject, bodyB.gameObject);
                    }

                    this._total++;
                }
            }
        }
    }

    collideGroupVsTilemapLayer (group: any, tilemapLayer: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean): boolean
    {
        if (!this.canCollide(group, tilemapLayer))
        {
            return false;
        }

        const children = group.getChildren();

        if (children.length === 0)
        {
            return false;
        }

        let didCollide = false;

        for (let i = 0; i < children.length; i++)
        {
            if (children[i].body || children[i].isBody)
            {
                if (this.collideSpriteVsTilemapLayer(children[i], tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly))
                {
                    didCollide = true;
                }
            }
        }

        return didCollide;
    }

    collideTiles (sprite: any, tiles: any[], collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any): boolean
    {
        if (tiles.length === 0 || (sprite.body && !sprite.body.enable) || (sprite.isBody && !sprite.enable))
        {
            return false;
        }
        else
        {
            return this.collideSpriteVsTilesHandler(sprite, tiles, collideCallback, processCallback, callbackContext, false, false);
        }
    }

    overlapTiles (sprite: any, tiles: any[], overlapCallback?: Function | null, processCallback?: Function | null, callbackContext?: any): boolean
    {
        if (tiles.length === 0 || (sprite.body && !sprite.body.enable) || (sprite.isBody && !sprite.enable))
        {
            return false;
        }
        else
        {
            return this.collideSpriteVsTilesHandler(sprite, tiles, overlapCallback, processCallback, callbackContext, true, false);
        }
    }

    collideSpriteVsTilemapLayer (sprite: any, tilemapLayer: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean): boolean
    {
        const body = (sprite.isBody) ? sprite : sprite.body;

        if (!body.enable || body.checkCollision.none || !this.canCollide(body, tilemapLayer))
        {
            return false;
        }

        const layerData = tilemapLayer.layer;

        const x = body.x - (layerData.tileWidth * tilemapLayer.scaleX);
        const y = body.y - (layerData.tileHeight * tilemapLayer.scaleY);
        const w = body.width + (layerData.tileWidth * tilemapLayer.scaleX);
        const h = body.height + layerData.tileHeight * tilemapLayer.scaleY;

        const options = (overlapOnly) ? null : this.tileFilterOptions;

        const mapData = GetTilesWithinWorldXY(x, y, w, h, options, tilemapLayer.scene.cameras.main, tilemapLayer.layer);

        if (mapData.length === 0)
        {
            return false;
        }
        else
        {
            return this.collideSpriteVsTilesHandler(sprite, mapData, collideCallback, processCallback, callbackContext, overlapOnly, true);
        }
    }

    collideSpriteVsTilesHandler (sprite: any, tiles: any[], collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean, isLayer?: boolean): boolean
    {
        const body = (sprite.isBody) ? sprite : sprite.body;

        let tile: any;
        const tileWorldRect = { left: 0, right: 0, top: 0, bottom: 0 };
        let tilemapLayer: any;
        let collision = false;

        for (let i = 0; i < tiles.length; i++)
        {
            tile = tiles[i];

            tilemapLayer = tile.tilemapLayer;

            const point = tilemapLayer.tileToWorldXY(tile.x, tile.y);

            tileWorldRect.left = point.x;
            tileWorldRect.top = point.y;

            tileWorldRect.right = tileWorldRect.left + tile.width * tilemapLayer.scaleX;
            tileWorldRect.bottom = tileWorldRect.top + tile.height * tilemapLayer.scaleY;

            if (
                TileIntersectsBody(tileWorldRect, body) &&
                (!processCallback || processCallback.call(callbackContext, sprite, tile)) &&
                ProcessTileCallbacks(tile, sprite) &&
                (overlapOnly || SeparateTile(i, body, tile, tileWorldRect, tilemapLayer, this.TILE_BIAS, isLayer)))
            {
                this._total++;

                collision = true;

                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite, tile);
                }

                if (overlapOnly && body.onOverlap)
                {
                    this.emit(Events.TILE_OVERLAP, sprite, tile, body);
                }
                else if (body.onCollide)
                {
                    this.emit(Events.TILE_COLLIDE, sprite, tile, body);
                }
            }
        }

        return collision;
    }

    collideGroupVsGroup (group1: any, group2: any, collideCallback?: Function | null, processCallback?: Function | null, callbackContext?: any, overlapOnly?: boolean): void
    {
        if (group1.getLength() === 0 || group2.getLength() === 0 || !this.canCollide(group1, group2))
        {
            return;
        }

        const children = group1.getChildren();

        for (let i = 0; i < children.length; i++)
        {
            this.collideSpriteVsGroup(children[i], group2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
    }

    wrap (object: any, padding?: number): void
    {
        if (object.body)
        {
            this.wrapObject(object, padding);
        }
        else if (object.getChildren)
        {
            this.wrapArray(object.getChildren(), padding);
        }
        else if (Array.isArray(object))
        {
            this.wrapArray(object, padding);
        }
        else
        {
            this.wrapObject(object, padding);
        }
    }

    wrapArray (objects: any[], padding?: number): void
    {
        for (let i = 0; i < objects.length; i++)
        {
            this.wrapObject(objects[i], padding);
        }
    }

    wrapObject (object: any, padding?: number): void
    {
        if (padding === undefined) { padding = 0; }

        object.x = Wrap(object.x, this.bounds.left - padding, this.bounds.right + padding);
        object.y = Wrap(object.y, this.bounds.top - padding, this.bounds.bottom + padding);
    }

    shutdown (): void
    {
        this.tree.clear();
        this.staticTree.clear();
        this.bodies.clear();
        this.staticBodies.clear();
        this.colliders.destroy();

        this.removeAllListeners();
    }

    destroy (): void
    {
        this.shutdown();

        this.scene = null;

        if (this.debugGraphic)
        {
            this.debugGraphic.destroy();
            this.debugGraphic = null;
        }
    }
}
