/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Contains as CircleContains } from '../../geom/circle/Contains';
import { Contains as RectangleContains } from '../../geom/rectangle/Contains';
import { Vector2 } from '../../math/Vector2';
import { Mixin } from '../../utils/MixinTS';
import { Collision } from './components/Collision';
import { STATIC_BODY } from './const';
import { SetCollisionObject } from './SetCollisionObject';

/**
 * @classdesc
 * A Static Arcade Physics Body.
 *
 * A Static Body never moves, and isn't automatically synchronized with its parent Game Object.
 * That means if you make any change to the parent's origin, position, or scale after creating or adding the body, you'll need to update the Static Body manually.
 *
 * A Static Body can collide with other Bodies, but is never moved by collisions.
 *
 * Its dynamic counterpart is {@link Phaser.Physics.Arcade.Body}.
 */
export interface StaticBody extends Collision {}

export class StaticBody
{
    static {
        Mixin(this, [
            Collision
        ]);
    }

    world: any;
    gameObject: any;
    isBody: boolean;
    debugShowBody: boolean;
    debugBodyColor: number;
    enable: boolean;
    isCircle: boolean;
    radius: number;
    offset: any;
    position: any;
    width: number;
    height: number;
    halfWidth: number;
    halfHeight: number;
    center: any;
    velocity: any;
    allowGravity: boolean;
    gravity: any;
    bounce: any;
    onWorldBounds: boolean;
    onCollide: boolean;
    onOverlap: boolean;
    mass: number;
    immovable: boolean;
    pushable: boolean;
    customSeparateX: boolean;
    customSeparateY: boolean;
    overlapX: number;
    overlapY: number;
    overlapR: number;
    embedded: boolean;
    collideWorldBounds: boolean;
    checkCollision: any;
    touching: any;
    wasTouching: any;
    blocked: any;
    physicsType: number;
    collisionCategory: number;
    collisionMask: number;
    _dx: number;
    _dy: number;

    constructor (world: any, gameObject?: any)
    {
        let width = 64;
        let height = 64;

        const dummyGameObject = {
            x: 0,
            y: 0,
            angle: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            displayOriginX: 0,
            displayOriginY: 0,
            originX: 0,
            originY: 0
        };

        const hasGameObject = (gameObject !== undefined);

        if (hasGameObject && gameObject.displayWidth)
        {
            width = gameObject.displayWidth;
            height = gameObject.displayHeight;
        }

        if (!hasGameObject)
        {
            gameObject = dummyGameObject;
        }

        this.world = world;
        this.gameObject = (hasGameObject) ? gameObject : undefined;
        this.isBody = true;
        this.debugShowBody = world.defaults.debugShowStaticBody;
        this.debugBodyColor = world.defaults.staticBodyDebugColor;
        this.enable = true;
        this.isCircle = false;
        this.radius = 0;
        this.offset = new Vector2();
        this.position = new Vector2(gameObject.x - (width * (gameObject.originX || 0)), gameObject.y - (height * (gameObject.originY || 0)));
        this.width = width;
        this.height = height;
        this.halfWidth = Math.abs(this.width / 2);
        this.halfHeight = Math.abs(this.height / 2);
        this.center = new Vector2(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
        this.velocity = Vector2.ZERO;
        this.allowGravity = false;
        this.gravity = Vector2.ZERO;
        this.bounce = Vector2.ZERO;
        this.onWorldBounds = false;
        this.onCollide = false;
        this.onOverlap = false;
        this.mass = 1;
        this.immovable = true;
        this.pushable = false;
        this.customSeparateX = false;
        this.customSeparateY = false;
        this.overlapX = 0;
        this.overlapY = 0;
        this.overlapR = 0;
        this.embedded = false;
        this.collideWorldBounds = false;
        this.checkCollision = SetCollisionObject(false);
        this.touching = SetCollisionObject(true);
        this.wasTouching = SetCollisionObject(true);
        this.blocked = SetCollisionObject(true);
        this.physicsType = STATIC_BODY;
        this.collisionCategory = 0x0001;
        this.collisionMask = 1;
        this._dx = 0;
        this._dy = 0;
    }

    setGameObject (gameObject: any, update?: boolean, enable?: boolean): this
    {
        if (update === undefined) { update = true; }
        if (enable === undefined) { enable = true; }

        if (!gameObject || !gameObject.hasTransformComponent)
        {
            return this;
        }

        const world = this.world;

        if (this.gameObject && this.gameObject.body)
        {
            world.disable(this.gameObject);
            this.gameObject.body = null;
        }

        if (gameObject.body)
        {
            world.disable(gameObject);
        }

        this.gameObject = gameObject;
        gameObject.body = this;

        this.setSize();

        if (update)
        {
            this.updateFromGameObject();
        }

        this.enable = enable;

        return this;
    }

    updateFromGameObject (): this
    {
        this.world.staticTree.remove(this);

        const gameObject = this.gameObject;

        gameObject.getTopLeft(this.position);

        this.width = gameObject.displayWidth;
        this.height = gameObject.displayHeight;

        this.halfWidth = Math.abs(this.width / 2);
        this.halfHeight = Math.abs(this.height / 2);

        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);

        this.world.staticTree.insert(this);

        return this;
    }

    setOffset (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }

        this.world.staticTree.remove(this);

        this.position.x -= this.offset.x;
        this.position.y -= this.offset.y;

        this.offset.set(x, y);

        this.position.x += this.offset.x;
        this.position.y += this.offset.y;

        this.updateCenter();

        this.world.staticTree.insert(this);

        return this;
    }

    setSize (width?: number, height?: number, center?: boolean): this
    {
        if (center === undefined) { center = true; }

        const gameObject = this.gameObject;

        if (gameObject && gameObject.frame)
        {
            if (!width)
            {
                width = gameObject.frame.realWidth;
            }

            if (!height)
            {
                height = gameObject.frame.realHeight;
            }
        }

        this.world.staticTree.remove(this);

        this.width = width!;
        this.height = height!;

        this.halfWidth = Math.floor(width! / 2);
        this.halfHeight = Math.floor(height! / 2);

        if (center && gameObject && gameObject.getCenter)
        {
            const ox = gameObject.displayWidth / 2;
            const oy = gameObject.displayHeight / 2;

            this.position.x -= this.offset.x;
            this.position.y -= this.offset.y;

            this.offset.set(ox - this.halfWidth, oy - this.halfHeight);

            this.position.x += this.offset.x;
            this.position.y += this.offset.y;
        }

        this.updateCenter();

        this.isCircle = false;
        this.radius = 0;

        this.world.staticTree.insert(this);

        return this;
    }

    setCircle (radius: number, offsetX?: number, offsetY?: number): this
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        if (radius > 0)
        {
            this.world.staticTree.remove(this);

            this.isCircle = true;

            this.radius = radius;

            this.width = radius * 2;
            this.height = radius * 2;

            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);

            this.offset.set(offsetX, offsetY);

            this.updateCenter();

            this.world.staticTree.insert(this);
        }
        else
        {
            this.isCircle = false;
        }

        return this;
    }

    updateCenter (): void
    {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    }

    reset (x?: number, y?: number): void
    {
        const gameObject = this.gameObject;

        if (x === undefined) { x = gameObject.x; }
        if (y === undefined) { y = gameObject.y; }

        this.world.staticTree.remove(this);

        gameObject.setPosition(x, y);

        gameObject.getTopLeft(this.position);

        this.position.x += this.offset.x;
        this.position.y += this.offset.y;

        this.updateCenter();

        this.world.staticTree.insert(this);
    }

    stop (): this
    {
        return this;
    }

    getBounds (obj: any): any
    {
        obj.x = this.x;
        obj.y = this.y;
        obj.right = this.right;
        obj.bottom = this.bottom;

        return obj;
    }

    hitTest (x: number, y: number): boolean
    {
        return (this.isCircle) ? CircleContains(this as any, x, y) : RectangleContains(this as any, x, y);
    }

    postUpdate (): void
    {
    }

    deltaAbsX (): number
    {
        return 0;
    }

    deltaAbsY (): number
    {
        return 0;
    }

    deltaX (): number
    {
        return 0;
    }

    deltaY (): number
    {
        return 0;
    }

    deltaZ (): number
    {
        return 0;
    }

    destroy (): void
    {
        this.enable = false;

        this.world.pendingDestroy.add(this);
    }

    drawDebug (graphic: any): void
    {
        const pos = this.position;

        const x = pos.x + this.halfWidth;
        const y = pos.y + this.halfHeight;

        if (this.debugShowBody)
        {
            graphic.lineStyle(graphic.defaultStrokeWidth, this.debugBodyColor, 1);

            if (this.isCircle)
            {
                graphic.strokeCircle(x, y, this.width / 2);
            }
            else
            {
                graphic.strokeRect(pos.x, pos.y, this.width, this.height);
            }
        }
    }

    willDrawDebug (): boolean
    {
        return this.debugShowBody;
    }

    setMass (value: number): this
    {
        if (value <= 0)
        {
            value = 0.1;
        }

        this.mass = value;

        return this;
    }

    get x (): number
    {
        return this.position.x;
    }

    set x (value: number)
    {
        this.world.staticTree.remove(this);

        this.position.x = value;

        this.world.staticTree.insert(this);
    }

    get y (): number
    {
        return this.position.y;
    }

    set y (value: number)
    {
        this.world.staticTree.remove(this);

        this.position.y = value;

        this.world.staticTree.insert(this);
    }

    get left (): number
    {
        return this.position.x;
    }

    get right (): number
    {
        return this.position.x + this.width;
    }

    get top (): number
    {
        return this.position.y;
    }

    get bottom (): number
    {
        return this.position.y + this.height;
    }
}
