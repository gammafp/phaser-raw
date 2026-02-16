/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Rectangle } from '../../geom/rectangle/Rectangle';
import { Contains as RectangleContains } from '../../geom/rectangle/Contains';

import { RadToDeg } from '../../math/RadToDeg';
import { Vector2 } from '../../math/Vector2';

import { Mixin } from '../../utils/MixinTS';
import { Collision } from './components/Collision';
import { CONST } from './const';
import * as Events from './events';
import { SetCollisionObject } from './SetCollisionObject';

/**
 * @classdesc
 * A Dynamic Arcade Body.
 *
 * Its static counterpart is {@link Phaser.Physics.Arcade.StaticBody}.
 *
 * @class Body
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.Physics.Arcade.Components.Collision
 *
 * @param {Phaser.Physics.Arcade.World} world - The Arcade Physics simulation this Body belongs to.
 * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object this Body belongs to. As of Phaser 3.60 this is now optional.
 */
export interface Body extends Collision {}

export class Body
{
    static
    {
        Mixin(this, [Collision]);
    }

    world: any;
    gameObject: any;
    readonly isBody: boolean = true;
    transform: {
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        displayOriginX: number;
        displayOriginY: number;
    };
    debugShowBody: boolean;
    debugShowVelocity: boolean;
    debugBodyColor: number;
    enable: boolean;
    isCircle: boolean;
    radius: number;
    offset: Vector2;
    position: Vector2;
    prev: Vector2;
    prevFrame: Vector2;
    allowRotation: boolean;
    rotation: number;
    preRotation: number;
    width: number;
    height: number;
    sourceWidth: number;
    sourceHeight: number;
    halfWidth: number;
    halfHeight: number;
    center: Vector2;
    velocity: Vector2;
    readonly newVelocity: Vector2;
    deltaMax: Vector2;
    acceleration: Vector2;
    allowDrag: boolean;
    drag: Vector2;
    allowGravity: boolean;
    gravity: Vector2;
    bounce: Vector2;
    worldBounce: Vector2 | null;
    customBoundsRectangle: Rectangle;
    onWorldBounds: boolean;
    onCollide: boolean;
    onOverlap: boolean;
    maxVelocity: Vector2;
    maxSpeed: number;
    friction: Vector2;
    useDamping: boolean;
    angularVelocity: number;
    angularAcceleration: number;
    angularDrag: number;
    maxAngular: number;
    mass: number;
    angle: number;
    speed: number;
    facing: number;
    immovable: boolean;
    pushable: boolean;
    slideFactor: Vector2;
    moves: boolean;
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
    syncBounds: boolean;
    readonly physicsType: number;
    collisionCategory: number;
    collisionMask: number;
    _sx: number;
    _sy: number;
    _dx: number;
    _dy: number;
    _tx: number;
    _ty: number;
    _bounds: Rectangle;
    directControl: boolean;
    autoFrame: Vector2;

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
            displayOriginY: 0
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

        this.transform = {
            x: gameObject.x,
            y: gameObject.y,
            rotation: gameObject.angle,
            scaleX: gameObject.scaleX,
            scaleY: gameObject.scaleY,
            displayOriginX: gameObject.displayOriginX,
            displayOriginY: gameObject.displayOriginY
        };

        this.debugShowBody = world.defaults.debugShowBody;

        this.debugShowVelocity = world.defaults.debugShowVelocity;

        this.debugBodyColor = world.defaults.bodyDebugColor;

        this.enable = true;

        this.isCircle = false;

        this.radius = 0;

        this.offset = new Vector2();

        this.position = new Vector2(
            gameObject.x - gameObject.scaleX * gameObject.displayOriginX,
            gameObject.y - gameObject.scaleY * gameObject.displayOriginY
        );

        this.prev = this.position.clone();

        this.prevFrame = this.position.clone();

        this.allowRotation = true;

        this.rotation = gameObject.angle;

        this.preRotation = gameObject.angle;

        this.width = width;

        this.height = height;

        this.sourceWidth = width;

        this.sourceHeight = height;

        if (gameObject.frame)
        {
            this.sourceWidth = gameObject.frame.realWidth;
            this.sourceHeight = gameObject.frame.realHeight;
        }

        this.halfWidth = Math.abs(width / 2);

        this.halfHeight = Math.abs(height / 2);

        this.center = new Vector2(this.position.x + this.halfWidth, this.position.y + this.halfHeight);

        this.velocity = new Vector2();

        this.newVelocity = new Vector2();

        this.deltaMax = new Vector2();

        this.acceleration = new Vector2();

        this.allowDrag = true;

        this.drag = new Vector2();

        this.allowGravity = true;

        this.gravity = new Vector2();

        this.bounce = new Vector2();

        this.worldBounce = null;

        this.customBoundsRectangle = world.bounds;

        this.onWorldBounds = false;

        this.onCollide = false;

        this.onOverlap = false;

        this.maxVelocity = new Vector2(10000, 10000);

        this.maxSpeed = -1;

        this.friction = new Vector2(1, 0);

        this.useDamping = false;

        this.angularVelocity = 0;

        this.angularAcceleration = 0;

        this.angularDrag = 0;

        this.maxAngular = 1000;

        this.mass = 1;

        this.angle = 0;

        this.speed = 0;

        this.facing = CONST.FACING_NONE;

        this.immovable = false;

        this.pushable = true;

        this.slideFactor = new Vector2(1, 1);

        this.moves = true;

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

        this.syncBounds = false;

        this.physicsType = CONST.DYNAMIC_BODY;

        this.collisionCategory = 0x0001;

        this.collisionMask = 1;

        this._sx = gameObject.scaleX;

        this._sy = gameObject.scaleY;

        this._dx = 0;

        this._dy = 0;

        this._tx = 0;

        this._ty = 0;

        this._bounds = new Rectangle();

        this.directControl = false;

        this.autoFrame = this.position.clone();
    }

    /**
     * Updates the Body's `transform`, `width`, `height`, and `center` from its Game Object.
     * The Body's `position` isn't changed.
     *
     * @method Phaser.Physics.Arcade.Body#updateBounds
     * @since 3.0.0
     */
    updateBounds (): void
    {
        const sprite = this.gameObject;

        const transform = this.transform;

        if (sprite.parentContainer)
        {
            const matrix = sprite.getWorldTransformMatrix(this.world._tempMatrix, this.world._tempMatrix2);

            transform.x = matrix.tx;
            transform.y = matrix.ty;
            transform.rotation = RadToDeg(matrix.rotation);
            transform.scaleX = matrix.scaleX;
            transform.scaleY = matrix.scaleY;
            transform.displayOriginX = sprite.displayOriginX;
            transform.displayOriginY = sprite.displayOriginY;
        }
        else
        {
            transform.x = sprite.x;
            transform.y = sprite.y;
            transform.rotation = sprite.angle;
            transform.scaleX = sprite.scaleX;
            transform.scaleY = sprite.scaleY;
            transform.displayOriginX = sprite.displayOriginX;
            transform.displayOriginY = sprite.displayOriginY;
        }

        let recalc = false;

        if (this.syncBounds)
        {
            const b = sprite.getBounds(this._bounds);

            this.width = b.width;
            this.height = b.height;
            recalc = true;
        }
        else
        {
            const asx = Math.abs(transform.scaleX);
            const asy = Math.abs(transform.scaleY);

            if (this._sx !== asx || this._sy !== asy)
            {
                this.width = this.sourceWidth * asx;
                this.height = this.sourceHeight * asy;
                this._sx = asx;
                this._sy = asy;
                recalc = true;
            }
        }

        if (recalc)
        {
            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);
            this.updateCenter();
        }
    }

    /**
     * Updates the Body's `center` from its `position`, `width`, and `height`.
     *
     * @method Phaser.Physics.Arcade.Body#updateCenter
     * @since 3.0.0
     */
    updateCenter (): void
    {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    }

    /**
     * Updates the Body's `position`, `width`, `height`, and `center` from its Game Object and `offset`.
     *
     * You don't need to call this for Dynamic Bodies, as it happens automatically during the physics step.
     * But you could use it if you have modified the Body offset or Game Object transform and need to immediately
     * read the Body's new `position` or `center`.
     *
     * To resynchronize the Body with its Game Object, use `reset()` instead.
     *
     * @method Phaser.Physics.Arcade.Body#updateFromGameObject
     * @since 3.24.0
     */
    updateFromGameObject (): void
    {
        this.updateBounds();

        const transform = this.transform;

        this.position.x = transform.x + transform.scaleX * (this.offset.x - transform.displayOriginX);
        this.position.y = transform.y + transform.scaleY * (this.offset.y - transform.displayOriginY);

        this.updateCenter();
    }

    /**
     * Prepares the Body for a physics step by resetting the `wasTouching`, `touching` and `blocked` states.
     *
     * This method is only called if the physics world is going to run a step this frame.
     *
     * @method Phaser.Physics.Arcade.Body#resetFlags
     * @since 3.18.0
     *
     * @param {boolean} [clear=false] - Set the `wasTouching` values to their defaults.
     */
    resetFlags (clear?: boolean): void
    {
        if (clear === undefined)
        {
            clear = false;
        }

        const wasTouching = this.wasTouching;
        const touching = this.touching;
        const blocked = this.blocked;

        if (clear)
        {
            SetCollisionObject(true, wasTouching);
        }
        else
        {
            wasTouching.none = touching.none;
            wasTouching.up = touching.up;
            wasTouching.down = touching.down;
            wasTouching.left = touching.left;
            wasTouching.right = touching.right;
        }

        SetCollisionObject(true, touching);
        SetCollisionObject(true, blocked);

        this.overlapR = 0;
        this.overlapX = 0;
        this.overlapY = 0;

        this.embedded = false;
    }

    /**
     * Syncs the position body position with the parent Game Object.
     *
     * This method is called every game frame, regardless if the world steps or not.
     *
     * @method Phaser.Physics.Arcade.Body#preUpdate
     * @since 3.17.0
     *
     * @param {boolean} willStep - Will this Body run an update as well?
     * @param {number} delta - The delta time, in seconds, elapsed since the last frame.
     */
    preUpdate (willStep: boolean, delta: number): void
    {
        if (willStep)
        {
            this.resetFlags();
        }

        if (this.gameObject)
        {
            this.updateFromGameObject();
        }

        this.rotation = this.transform.rotation;
        this.preRotation = this.rotation;

        if (this.moves)
        {
            const pos = this.position;

            this.prev.x = pos.x;
            this.prev.y = pos.y;

            this.prevFrame.x = pos.x;
            this.prevFrame.y = pos.y;
        }

        if (willStep)
        {
            this.update(delta);
        }
    }

    /**
     * Performs a single physics step and updates the body velocity, angle, speed and other properties.
     *
     * This method can be called multiple times per game frame, depending on the physics step rate.
     *
     * The results are synced back to the Game Object in `postUpdate`.
     *
     * @method Phaser.Physics.Arcade.Body#update
     * @fires Phaser.Physics.Arcade.Events#WORLD_BOUNDS
     * @since 3.0.0
     *
     * @param {number} delta - The delta time, in seconds, elapsed since the last frame.
     */
    update (delta: number): void
    {
        const prev = this.prev;
        const pos = this.position;
        const vel = this.velocity;

        prev.set(pos.x, pos.y);

        if (!this.moves)
        {
            this._dx = pos.x - prev.x;
            this._dy = pos.y - prev.y;

            return;
        }

        if (this.directControl)
        {
            const autoFrame = this.autoFrame;

            vel.set(
                (pos.x - autoFrame.x) / delta,
                (pos.y - autoFrame.y) / delta
            );

            this.world.updateMotion(this, delta);

            this._dx = pos.x - autoFrame.x;
            this._dy = pos.y - autoFrame.y;
        }
        else
        {
            this.world.updateMotion(this, delta);

            this.newVelocity.set(vel.x * delta, vel.y * delta);

            pos.add(this.newVelocity);

            this._dx = pos.x - prev.x;
            this._dy = pos.y - prev.y;
        }

        const vx = vel.x;
        const vy = vel.y;

        this.updateCenter();

        this.angle = Math.atan2(vy, vx);
        this.speed = Math.sqrt(vx * vx + vy * vy);

        if (this.collideWorldBounds && this.checkWorldBounds() && this.onWorldBounds)
        {
            const blocked = this.blocked;

            this.world.emit(Events.WORLD_BOUNDS, this, blocked.up, blocked.down, blocked.left, blocked.right);
        }
    }

    /**
     * Feeds the Body results back into the parent Game Object.
     *
     * This method is called every game frame, regardless if the world steps or not.
     *
     * @method Phaser.Physics.Arcade.Body#postUpdate
     * @since 3.0.0
     */
    postUpdate (): void
    {
        const pos = this.position;

        let dx = pos.x - this.prevFrame.x;
        let dy = pos.y - this.prevFrame.y;

        const gameObject = this.gameObject;

        if (this.moves)
        {
            const mx = this.deltaMax.x;
            const my = this.deltaMax.y;

            if (mx !== 0 && dx !== 0)
            {
                if (dx < 0 && dx < -mx)
                {
                    dx = -mx;
                }
                else if (dx > 0 && dx > mx)
                {
                    dx = mx;
                }
            }

            if (my !== 0 && dy !== 0)
            {
                if (dy < 0 && dy < -my)
                {
                    dy = -my;
                }
                else if (dy > 0 && dy > my)
                {
                    dy = my;
                }
            }

            if (gameObject)
            {
                gameObject.x += dx;
                gameObject.y += dy;
            }
        }

        if (dx < 0)
        {
            this.facing = CONST.FACING_LEFT;
        }
        else if (dx > 0)
        {
            this.facing = CONST.FACING_RIGHT;
        }

        if (dy < 0)
        {
            this.facing = CONST.FACING_UP;
        }
        else if (dy > 0)
        {
            this.facing = CONST.FACING_DOWN;
        }

        if (this.allowRotation && gameObject)
        {
            gameObject.angle += this.deltaZ();
        }

        this._tx = dx;
        this._ty = dy;

        this.autoFrame.set(pos.x, pos.y);
    }

    /**
     * Sets a custom collision boundary rectangle. Use if you want to have a custom
     * boundary instead of the world boundaries.
     *
     * @method Phaser.Physics.Arcade.Body#setBoundsRectangle
     * @since 3.20
     *
     * @param {?Phaser.Geom.Rectangle} [bounds] - The new boundary rectangle. Pass `null` to use the World bounds.
     *
     * @return {this} This Body object.
     */
    setBoundsRectangle (bounds?: Rectangle | null): this
    {
        this.customBoundsRectangle = (!bounds) ? this.world.bounds : bounds;

        return this;
    }

    /**
     * Checks for collisions between this Body and the world boundary and separates them.
     *
     * @method Phaser.Physics.Arcade.Body#checkWorldBounds
     * @since 3.0.0
     *
     * @return {boolean} True if this Body is colliding with the world boundary.
     */
    checkWorldBounds (): boolean
    {
        const pos = this.position;
        const vel = this.velocity;
        const blocked = this.blocked;
        const bounds = this.customBoundsRectangle;
        const check = this.world.checkCollision;

        const bx = (this.worldBounce) ? -this.worldBounce.x : -this.bounce.x;
        const by = (this.worldBounce) ? -this.worldBounce.y : -this.bounce.y;

        let wasSet = false;

        if (pos.x < bounds.x && check.left)
        {
            pos.x = bounds.x;
            vel.x *= bx;
            blocked.left = true;
            wasSet = true;
        }
        else if (this.right > bounds.right && check.right)
        {
            pos.x = bounds.right - this.width;
            vel.x *= bx;
            blocked.right = true;
            wasSet = true;
        }

        if (pos.y < bounds.y && check.up)
        {
            pos.y = bounds.y;
            vel.y *= by;
            blocked.up = true;
            wasSet = true;
        }
        else if (this.bottom > bounds.bottom && check.down)
        {
            pos.y = bounds.bottom - this.height;
            vel.y *= by;
            blocked.down = true;
            wasSet = true;
        }

        if (wasSet)
        {
            this.blocked.none = false;
            this.updateCenter();
        }

        return wasSet;
    }

    /**
     * Sets the offset of the Body's position from its Game Object's position.
     * The Body's `position` isn't changed until the next `preUpdate`.
     *
     * @method Phaser.Physics.Arcade.Body#setOffset
     * @since 3.0.0
     *
     * @param {number} x - The horizontal offset, in source pixels.
     * @param {number} [y=x] - The vertical offset, in source pixels.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setOffset (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }

        this.offset.set(x, y);

        return this;
    }

    /**
     * Assign this Body to a new Game Object.
     *
     * Removes this body from the Physics World, assigns to the new Game Object, calls `setSize` and then
     * adds this body back into the World again, setting it enabled, unless the `enable` argument is set to `false`.
     *
     * If this body already has a Game Object, then it will remove itself from that Game Object first.
     *
     * If the given `gameObject` doesn't have a `body` property, it is created and this Body is assigned to it.
     *
     * @method Phaser.Physics.Arcade.Body#setGameObject
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to assign this Body to.
     * @param {boolean} [enable=true] - Automatically enable this Body for physics.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGameObject (gameObject: any, enable?: boolean): this
    {
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

        this.enable = enable;

        return this;
    }

    /**
     * Sizes and positions this Body, as a rectangle.
     * Modifies the Body `offset` if `center` is true (the default).
     * Resets the width and height to match current frame, if no width and height provided and a frame is found.
     *
     * @method Phaser.Physics.Arcade.Body#setSize
     * @since 3.0.0
     *
     * @param {number} [width] - The width of the Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame width.
     * @param {number} [height] - The height of the Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame height.
     * @param {boolean} [center=true] - Modify the Body's `offset`, placing the Body's center on its Game Object's center. Only works if the Game Object has the `getCenter` method.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setSize (width?: number, height?: number, center?: boolean): this
    {
        if (center === undefined) { center = true; }

        const gameObject = this.gameObject;

        if (gameObject)
        {
            if (!width && gameObject.frame)
            {
                width = gameObject.frame.realWidth;
            }

            if (!height && gameObject.frame)
            {
                height = gameObject.frame.realHeight;
            }
        }

        if (width === undefined) { width = this.sourceWidth; }
        if (height === undefined) { height = this.sourceHeight; }

        this.sourceWidth = width;
        this.sourceHeight = height;

        this.width = this.sourceWidth * this._sx;
        this.height = this.sourceHeight * this._sy;

        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);

        this.updateCenter();

        if (center && gameObject && gameObject.getCenter)
        {
            const ox = (gameObject.width - width) / 2;
            const oy = (gameObject.height - height) / 2;

            this.offset.set(ox, oy);
        }

        this.isCircle = false;
        this.radius = 0;

        return this;
    }

    /**
     * Sizes and positions this Body, as a circle.
     *
     * @method Phaser.Physics.Arcade.Body#setCircle
     * @since 3.0.0
     *
     * @param {number} radius - The radius of the Body, in source pixels.
     * @param {number} [offsetX] - The horizontal offset of the Body from its Game Object, in source pixels.
     * @param {number} [offsetY] - The vertical offset of the Body from its Game Object, in source pixels.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setCircle (radius: number, offsetX?: number, offsetY?: number): this
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        if (radius > 0)
        {
            this.isCircle = true;
            this.radius = radius;

            this.sourceWidth = radius * 2;
            this.sourceHeight = radius * 2;

            this.width = this.sourceWidth * this._sx;
            this.height = this.sourceHeight * this._sy;

            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);

            this.offset.set(offsetX, offsetY);

            this.updateCenter();
        }
        else
        {
            this.isCircle = false;
        }

        return this;
    }

    /**
     * Sets this Body's parent Game Object to the given coordinates and resets this Body at the new coordinates.
     * If the Body had any velocity or acceleration it is lost as a result of calling this.
     *
     * @method Phaser.Physics.Arcade.Body#reset
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position to place the Game Object.
     * @param {number} y - The vertical position to place the Game Object.
     */
    reset (x: number, y: number): void
    {
        this.stop();

        const gameObject = this.gameObject;

        if (gameObject)
        {
            gameObject.setPosition(x, y);

            this.rotation = gameObject.angle;
            this.preRotation = gameObject.angle;
        }

        const pos = this.position;

        if (gameObject && gameObject.getTopLeft)
        {
            gameObject.getTopLeft(pos);
        }
        else
        {
            pos.set(x, y);
        }

        this.prev.copy(pos);
        this.prevFrame.copy(pos);
        this.autoFrame.copy(pos);

        if (gameObject)
        {
            this.updateBounds();
        }

        this.updateCenter();

        if (this.collideWorldBounds)
        {
            this.checkWorldBounds();
        }

        this.resetFlags(true);
    }

    /**
     * Sets acceleration, velocity, and speed to zero.
     *
     * @method Phaser.Physics.Arcade.Body#stop
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    stop (): this
    {
        this.velocity.set(0);
        this.acceleration.set(0);
        this.speed = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;

        return this;
    }

    /**
     * Copies the coordinates of this Body's edges into an object.
     *
     * @method Phaser.Physics.Arcade.Body#getBounds
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeBodyBounds} obj - An object to copy the values into.
     *
     * @return {Phaser.Types.Physics.Arcade.ArcadeBodyBounds} - An object with {x, y, right, bottom}.
     */
    getBounds (obj: any): any
    {
        obj.x = this.x;
        obj.y = this.y;
        obj.right = this.right;
        obj.bottom = this.bottom;

        return obj;
    }

    /**
     * Tests if the coordinates are within this Body.
     *
     * @method Phaser.Physics.Arcade.Body#hitTest
     * @since 3.0.0
     *
     * @param {number} x - The horizontal coordinate.
     * @param {number} y - The vertical coordinate.
     *
     * @return {boolean} True if (x, y) is within this Body.
     */
    hitTest (x: number, y: number): boolean
    {
        if (!this.isCircle)
        {
            return RectangleContains(this, x, y);
        }

        if (this.radius > 0 && x >= this.left && x <= this.right && y >= this.top && y <= this.bottom)
        {
            const dx = (this.center.x - x) * (this.center.x - x);
            const dy = (this.center.y - y) * (this.center.y - y);

            return (dx + dy) <= (this.radius * this.radius);
        }

        return false;
    }

    /**
     * Whether this Body is touching a tile or the world boundary while moving down.
     *
     * @method Phaser.Physics.Arcade.Body#onFloor
     * @since 3.0.0
     * @see Phaser.Physics.Arcade.Body#blocked
     *
     * @return {boolean} True if touching.
     */
    onFloor (): boolean
    {
        return this.blocked.down;
    }

    /**
     * Whether this Body is touching a tile or the world boundary while moving up.
     *
     * @method Phaser.Physics.Arcade.Body#onCeiling
     * @since 3.0.0
     * @see Phaser.Physics.Arcade.Body#blocked
     *
     * @return {boolean} True if touching.
     */
    onCeiling (): boolean
    {
        return this.blocked.up;
    }

    /**
     * Whether this Body is touching a tile or the world boundary while moving left or right.
     *
     * @method Phaser.Physics.Arcade.Body#onWall
     * @since 3.0.0
     * @see Phaser.Physics.Arcade.Body#blocked
     *
     * @return {boolean} True if touching.
     */
    onWall (): boolean
    {
        return (this.blocked.left || this.blocked.right);
    }

    /**
     * The absolute (non-negative) change in this Body's horizontal position from the previous step.
     *
     * @method Phaser.Physics.Arcade.Body#deltaAbsX
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaAbsX (): number
    {
        return (this._dx > 0) ? this._dx : -this._dx;
    }

    /**
     * The absolute (non-negative) change in this Body's vertical position from the previous step.
     *
     * @method Phaser.Physics.Arcade.Body#deltaAbsY
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaAbsY (): number
    {
        return (this._dy > 0) ? this._dy : -this._dy;
    }

    /**
     * The change in this Body's horizontal position from the previous step.
     * This value is set during the Body's update phase.
     *
     * As a Body can update multiple times per step this may not hold the final
     * delta value for the Body. In this case, please see the `deltaXFinal` method.
     *
     * @method Phaser.Physics.Arcade.Body#deltaX
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaX (): number
    {
        return this._dx;
    }

    /**
     * The change in this Body's vertical position from the previous step.
     * This value is set during the Body's update phase.
     *
     * As a Body can update multiple times per step this may not hold the final
     * delta value for the Body. In this case, please see the `deltaYFinal` method.
     *
     * @method Phaser.Physics.Arcade.Body#deltaY
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaY (): number
    {
        return this._dy;
    }

    /**
     * The change in this Body's horizontal position from the previous game update.
     *
     * This value is set during the `postUpdate` phase and takes into account the
     * `deltaMax` and final position of the Body.
     *
     * Because this value is not calculated until `postUpdate`, you must listen for it
     * during a Scene `POST_UPDATE` or `RENDER` event, and not in `update`, as it will
     * not be calculated by that point. If you _do_ use these values in `update` they
     * will represent the delta from the _previous_ game frame.
     *
     * @method Phaser.Physics.Arcade.Body#deltaXFinal
     * @since 3.22.0
     *
     * @return {number} The final delta x value.
     */
    deltaXFinal (): number
    {
        return this._tx;
    }

    /**
     * The change in this Body's vertical position from the previous game update.
     *
     * This value is set during the `postUpdate` phase and takes into account the
     * `deltaMax` and final position of the Body.
     *
     * Because this value is not calculated until `postUpdate`, you must listen for it
     * during a Scene `POST_UPDATE` or `RENDER` event, and not in `update`, as it will
     * not be calculated by that point. If you _do_ use these values in `update` they
     * will represent the delta from the _previous_ game frame.
     *
     * @method Phaser.Physics.Arcade.Body#deltaYFinal
     * @since 3.22.0
     *
     * @return {number} The final delta y value.
     */
    deltaYFinal (): number
    {
        return this._ty;
    }

    /**
     * The change in this Body's rotation from the previous step, in degrees.
     *
     * @method Phaser.Physics.Arcade.Body#deltaZ
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaZ (): number
    {
        return this.rotation - this.preRotation;
    }

    /**
     * Disables this Body and marks it for deletion by the simulation.
     *
     * @method Phaser.Physics.Arcade.Body#destroy
     * @since 3.0.0
     */
    destroy (): void
    {
        this.enable = false;

        if (this.world)
        {
            this.world.pendingDestroy.add(this);
        }
    }

    /**
     * Draws this Body and its velocity, if enabled.
     *
     * @method Phaser.Physics.Arcade.Body#drawDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphic - The Graphics object to draw on.
     */
    drawDebug (graphic: any): void
    {
        const pos = this.position;

        const x = pos.x + this.halfWidth;
        const y = pos.y + this.halfHeight;

        if (this.debugShowBody)
        {
            graphic.lineStyle(graphic.defaultStrokeWidth, this.debugBodyColor);

            if (this.isCircle)
            {
                graphic.strokeCircle(x, y, this.width / 2);
            }
            else
            {
                if (this.checkCollision.up)
                {
                    graphic.lineBetween(pos.x, pos.y, pos.x + this.width, pos.y);
                }

                if (this.checkCollision.right)
                {
                    graphic.lineBetween(pos.x + this.width, pos.y, pos.x + this.width, pos.y + this.height);
                }

                if (this.checkCollision.down)
                {
                    graphic.lineBetween(pos.x, pos.y + this.height, pos.x + this.width, pos.y + this.height);
                }

                if (this.checkCollision.left)
                {
                    graphic.lineBetween(pos.x, pos.y, pos.x, pos.y + this.height);
                }
            }
        }

        if (this.debugShowVelocity)
        {
            graphic.lineStyle(graphic.defaultStrokeWidth, this.world.defaults.velocityDebugColor, 1);
            graphic.lineBetween(x, y, x + this.velocity.x / 2, y + this.velocity.y / 2);
        }
    }

    /**
     * Whether this Body will be drawn to the debug display.
     *
     * @method Phaser.Physics.Arcade.Body#willDrawDebug
     * @since 3.0.0
     *
     * @return {boolean} True if either `debugShowBody` or `debugShowVelocity` are enabled.
     */
    willDrawDebug (): boolean
    {
        return (this.debugShowBody || this.debugShowVelocity);
    }

    /**
     * Sets whether this Body should calculate its velocity based on its change in
     * position every frame. The default, which is to not do this, means that you
     * make this Body move by setting the velocity directly. However, if you are
     * trying to move this Body via a Tween, or have it follow a Path, then you
     * should enable this instead. This will allow it to still collide with other
     * bodies, something that isn't possible if you're just changing its position directly.
     *
     * @method Phaser.Physics.Arcade.Body#setDirectControl
     * @since 3.70.0
     *
     * @param {boolean} [value=true] - `true` if the Body calculate velocity based on changes in position, otherwise `false`.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDirectControl (value?: boolean): this
    {
        if (value === undefined) { value = true; }

        this.directControl = value;

        return this;
    }

    /**
     * Sets whether this Body collides with the world boundary.
     *
     * Optionally also sets the World Bounce and `onWorldBounds` values.
     *
     * @method Phaser.Physics.Arcade.Body#setCollideWorldBounds
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - `true` if the Body should collide with the world bounds, otherwise `false`.
     * @param {number} [bounceX] - If given this replaces the Body's `worldBounce.x` value.
     * @param {number} [bounceY] - If given this replaces the Body's `worldBounce.y` value.
     * @param {boolean} [onWorldBounds] - If given this replaces the Body's `onWorldBounds` value.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setCollideWorldBounds (value?: boolean, bounceX?: number, bounceY?: number, onWorldBounds?: boolean): this
    {
        if (value === undefined) { value = true; }

        this.collideWorldBounds = value;

        const setBounceX = (bounceX !== undefined);
        const setBounceY = (bounceY !== undefined);

        if (setBounceX || setBounceY)
        {
            if (!this.worldBounce)
            {
                this.worldBounce = new Vector2();
            }

            if (setBounceX)
            {
                this.worldBounce.x = bounceX;
            }

            if (setBounceY)
            {
                this.worldBounce.y = bounceY;
            }
        }

        if (onWorldBounds !== undefined)
        {
            this.onWorldBounds = onWorldBounds;
        }

        return this;
    }

    /**
     * Sets the Body's velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - The horizontal velocity, in pixels per second.
     * @param {number} [y=x] - The vertical velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocity (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.velocity.set(x, y);

        x = this.velocity.x;
        y = this.velocity.y;

        this.speed = Math.sqrt(x * x + y * y);

        return this;
    }

    /**
     * Sets the Body's horizontal velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setVelocityX
     * @since 3.0.0
     *
     * @param {number} value - The velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocityX (value: number): this
    {
        return this.setVelocity(value, this.velocity.y);
    }

    /**
     * Sets the Body's vertical velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setVelocityY
     * @since 3.0.0
     *
     * @param {number} value - The velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocityY (value: number): this
    {
        return this.setVelocity(this.velocity.x, value);
    }

    /**
     * Sets the Body's maximum velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setMaxVelocity
     * @since 3.10.0
     *
     * @param {number} x - The horizontal velocity, in pixels per second.
     * @param {number} [y=x] - The vertical velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMaxVelocity (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.maxVelocity.set(x, y);

        return this;
    }

    /**
     * Sets the Body's maximum horizontal velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setMaxVelocityX
     * @since 3.50.0
     *
     * @param {number} value - The maximum horizontal velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMaxVelocityX (value: number): this
    {
        this.maxVelocity.x = value;

        return this;
    }

    /**
     * Sets the Body's maximum vertical velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setMaxVelocityY
     * @since 3.50.0
     *
     * @param {number} value - The maximum vertical velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMaxVelocityY (value: number): this
    {
        this.maxVelocity.y = value;

        return this;
    }

    /**
     * Sets the maximum speed the Body can move.
     *
     * @method Phaser.Physics.Arcade.Body#setMaxSpeed
     * @since 3.16.0
     *
     * @param {number} value - The maximum speed value, in pixels per second. Set to a negative value to disable.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMaxSpeed (value: number): this
    {
        this.maxSpeed = value;

        return this;
    }

    /**
     * Sets the Slide Factor of this Body.
     *
     * The Slide Factor controls how much velocity is preserved when
     * this Body is pushed by another Body.
     *
     * The default value is 1, which means that it will take on all
     * velocity given in the push. You can adjust this value to control
     * how much velocity is retained by this Body when the push ends.
     *
     * A value of 0, for example, will allow this Body to be pushed
     * but then remain completely still after the push ends, such as
     * you see in a game like Sokoban.
     *
     * Or you can set a mid-point, such as 0.25 which will allow it
     * to keep 25% of the original velocity when the push ends. You
     * can combine this with the `setDrag()` method to create deceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setSlideFactor
     * @since 3.70.0
     *
     * @param {number} x - The horizontal slide factor. A value between 0 and 1.
     * @param {number} [y=x] - The vertical slide factor. A value between 0 and 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setSlideFactor (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.slideFactor.set(x, y);

        return this;
    }

    /**
     * Sets the Body's bounce.
     *
     * @method Phaser.Physics.Arcade.Body#setBounce
     * @since 3.0.0
     *
     * @param {number} x - The horizontal bounce, relative to 1.
     * @param {number} [y=x] - The vertical bounce, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounce (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.bounce.set(x, y);

        return this;
    }

    /**
     * Sets the Body's horizontal bounce.
     *
     * @method Phaser.Physics.Arcade.Body#setBounceX
     * @since 3.0.0
     *
     * @param {number} value - The bounce, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounceX (value: number): this
    {
        this.bounce.x = value;

        return this;
    }

    /**
     * Sets the Body's vertical bounce.
     *
     * @method Phaser.Physics.Arcade.Body#setBounceY
     * @since 3.0.0
     *
     * @param {number} value - The bounce, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounceY (value: number): this
    {
        this.bounce.y = value;

        return this;
    }

    /**
     * Sets the Body's acceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setAcceleration
     * @since 3.0.0
     *
     * @param {number} x - The horizontal component, in pixels per second squared.
     * @param {number} [y=x] - The vertical component, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAcceleration (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.acceleration.set(x, y);

        return this;
    }

    /**
     * Sets the Body's horizontal acceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setAccelerationX
     * @since 3.0.0
     *
     * @param {number} value - The acceleration, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAccelerationX (value: number): this
    {
        this.acceleration.x = value;

        return this;
    }

    /**
     * Sets the Body's vertical acceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setAccelerationY
     * @since 3.0.0
     *
     * @param {number} value - The acceleration, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAccelerationY (value: number): this
    {
        this.acceleration.y = value;

        return this;
    }

    /**
     * Enables or disables drag.
     *
     * @method Phaser.Physics.Arcade.Body#setAllowDrag
     * @since 3.9.0
     * @see Phaser.Physics.Arcade.Body#allowDrag
     *
     * @param {boolean} [value=true] - `true` to allow drag on this body, or `false` to disable it.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAllowDrag (value?: boolean): this
    {
        if (value === undefined) { value = true; }

        this.allowDrag = value;

        return this;
    }

    /**
     * Enables or disables gravity's effect on this Body.
     *
     * @method Phaser.Physics.Arcade.Body#setAllowGravity
     * @since 3.9.0
     * @see Phaser.Physics.Arcade.Body#allowGravity
     *
     * @param {boolean} [value=true] - `true` to allow gravity on this body, or `false` to disable it.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAllowGravity (value?: boolean): this
    {
        if (value === undefined) { value = true; }

        this.allowGravity = value;

        return this;
    }

    /**
     * Enables or disables rotation.
     *
     * @method Phaser.Physics.Arcade.Body#setAllowRotation
     * @since 3.9.0
     * @see Phaser.Physics.Arcade.Body#allowRotation
     *
     * @param {boolean} [value=true] - `true` to allow rotation on this body, or `false` to disable it.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAllowRotation (value?: boolean): this
    {
        if (value === undefined) { value = true; }

        this.allowRotation = value;

        return this;
    }

    /**
     * Sets the Body's drag.
     *
     * @method Phaser.Physics.Arcade.Body#setDrag
     * @since 3.0.0
     *
     * @param {number} x - The horizontal component, in pixels per second squared.
     * @param {number} [y=x] - The vertical component, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDrag (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.drag.set(x, y);

        return this;
    }

    /**
     * If this Body is using `drag` for deceleration this property controls how the drag is applied.
     * If set to `true` drag will use a damping effect rather than a linear approach. If you are
     * creating a game where the Body moves freely at any angle (i.e. like the way the ship moves in
     * the game Asteroids) then you will get a far smoother and more visually correct deceleration
     * by using damping, avoiding the axis-drift that is prone with linear deceleration.
     *
     * If you enable this property then you should use far smaller `drag` values than with linear, as
     * they are used as a multiplier on the velocity. Values such as 0.95 will give a nice slow
     * deceleration, where-as smaller values, such as 0.5 will stop an object almost immediately.
     *
     * @method Phaser.Physics.Arcade.Body#setDamping
     * @since 3.50.0
     *
     * @param {boolean} value - `true` to use damping, or `false` to use drag.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDamping (value: boolean): this
    {
        this.useDamping = value;

        return this;
    }

    /**
     * Sets the Body's horizontal drag.
     *
     * @method Phaser.Physics.Arcade.Body#setDragX
     * @since 3.0.0
     *
     * @param {number} value - The drag, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDragX (value: number): this
    {
        this.drag.x = value;

        return this;
    }

    /**
     * Sets the Body's vertical drag.
     *
     * @method Phaser.Physics.Arcade.Body#setDragY
     * @since 3.0.0
     *
     * @param {number} value - The drag, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDragY (value: number): this
    {
        this.drag.y = value;

        return this;
    }

    /**
     * Sets the Body's gravity.
     *
     * @method Phaser.Physics.Arcade.Body#setGravity
     * @since 3.0.0
     *
     * @param {number} x - The horizontal component, in pixels per second squared.
     * @param {number} [y=x] - The vertical component, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravity (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.gravity.set(x, y);

        return this;
    }

    /**
     * Sets the Body's horizontal gravity.
     *
     * @method Phaser.Physics.Arcade.Body#setGravityX
     * @since 3.0.0
     *
     * @param {number} value - The gravity, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravityX (value: number): this
    {
        this.gravity.x = value;

        return this;
    }

    /**
     * Sets the Body's vertical gravity.
     *
     * @method Phaser.Physics.Arcade.Body#setGravityY
     * @since 3.0.0
     *
     * @param {number} value - The gravity, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravityY (value: number): this
    {
        this.gravity.y = value;

        return this;
    }

    /**
     * Sets the Body's friction.
     *
     * @method Phaser.Physics.Arcade.Body#setFriction
     * @since 3.0.0
     *
     * @param {number} x - The horizontal component, relative to 1.
     * @param {number} [y=x] - The vertical component, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFriction (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.friction.set(x, y);

        return this;
    }

    /**
     * Sets the Body's horizontal friction.
     *
     * @method Phaser.Physics.Arcade.Body#setFrictionX
     * @since 3.0.0
     *
     * @param {number} value - The friction value, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFrictionX (value: number): this
    {
        this.friction.x = value;

        return this;
    }

    /**
     * Sets the Body's vertical friction.
     *
     * @method Phaser.Physics.Arcade.Body#setFrictionY
     * @since 3.0.0
     *
     * @param {number} value - The friction value, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFrictionY (value: number): this
    {
        this.friction.y = value;

        return this;
    }

    /**
     * Sets the Body's angular velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setAngularVelocity
     * @since 3.0.0
     *
     * @param {number} value - The velocity, in degrees per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularVelocity (value: number): this
    {
        this.angularVelocity = value;

        return this;
    }

    /**
     * Sets the Body's angular acceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setAngularAcceleration
     * @since 3.0.0
     *
     * @param {number} value - The acceleration, in degrees per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularAcceleration (value: number): this
    {
        this.angularAcceleration = value;

        return this;
    }

    /**
     * Sets the Body's angular drag.
     *
     * @method Phaser.Physics.Arcade.Body#setAngularDrag
     * @since 3.0.0
     *
     * @param {number} value - The drag, in degrees per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularDrag (value: number): this
    {
        this.angularDrag = value;

        return this;
    }

    /**
     * Sets the Body's mass.
     *
     * @method Phaser.Physics.Arcade.Body#setMass
     * @since 3.0.0
     *
     * @param {number} value - The mass value, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMass (value: number): this
    {
        this.mass = value;

        return this;
    }

    /**
     * Sets the Body's `immovable` property.
     *
     * @method Phaser.Physics.Arcade.Body#setImmovable
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - The value to assign to `immovable`.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setImmovable (value?: boolean): this
    {
        if (value === undefined) { value = true; }

        this.immovable = value;

        return this;
    }

    /**
     * Sets the Body's `enable` property.
     *
     * @method Phaser.Physics.Arcade.Body#setEnable
     * @since 3.15.0
     *
     * @param {boolean} [value=true] - The value to assign to `enable`.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setEnable (value?: boolean): this
    {
        if (value === undefined) { value = true; }

        this.enable = value;

        return this;
    }

    /**
     * This is an internal handler, called by the `ProcessX` function as part
     * of the collision step. You should almost never call this directly.
     *
     * @method Phaser.Physics.Arcade.Body#processX
     * @since 3.50.0
     *
     * @param {number} x - The amount to add to the Body position.
     * @param {number} [vx] - The amount to add to the Body velocity.
     * @param {boolean} [left] - Set the blocked.left value?
     * @param {boolean} [right] - Set the blocked.right value?
     */
    processX (x: number, vx?: number | null, left?: boolean, right?: boolean): void
    {
        this.x += x;

        this.updateCenter();

        if (vx != null)
        {
            this.velocity.x = vx * this.slideFactor.x;
        }

        const blocked = this.blocked;

        if (left)
        {
            blocked.left = true;
            blocked.none = false;
        }

        if (right)
        {
            blocked.right = true;
            blocked.none = false;
        }
    }

    /**
     * This is an internal handler, called by the `ProcessY` function as part
     * of the collision step. You should almost never call this directly.
     *
     * @method Phaser.Physics.Arcade.Body#processY
     * @since 3.50.0
     *
     * @param {number} y - The amount to add to the Body position.
     * @param {number} [vy] - The amount to add to the Body velocity.
     * @param {boolean} [up] - Set the blocked.up value?
     * @param {boolean} [down] - Set the blocked.down value?
     */
    processY (y: number, vy?: number | null, up?: boolean, down?: boolean): void
    {
        this.y += y;

        this.updateCenter();

        if (vy != null)
        {
            this.velocity.y = vy * this.slideFactor.y;
        }

        const blocked = this.blocked;

        if (up)
        {
            blocked.up = true;
            blocked.none = false;
        }

        if (down)
        {
            blocked.down = true;
            blocked.none = false;
        }
    }

    /**
     * The Bodys horizontal position (left edge).
     *
     * @name Phaser.Physics.Arcade.Body#x
     * @type {number}
     * @since 3.0.0
     */
    get x (): number
    {
        return this.position.x;
    }

    set x (value: number)
    {
        this.position.x = value;
    }

    /**
     * The Bodys vertical position (top edge).
     *
     * @name Phaser.Physics.Arcade.Body#y
     * @type {number}
     * @since 3.0.0
     */
    get y (): number
    {
        return this.position.y;
    }

    set y (value: number)
    {
        this.position.y = value;
    }

    /**
     * The left edge of the Body. Identical to x.
     *
     * @name Phaser.Physics.Arcade.Body#left
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get left (): number
    {
        return this.position.x;
    }

    /**
     * The right edge of the Body.
     *
     * @name Phaser.Physics.Arcade.Body#right
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get right (): number
    {
        return this.position.x + this.width;
    }

    /**
     * The top edge of the Body. Identical to y.
     *
     * @name Phaser.Physics.Arcade.Body#top
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get top (): number
    {
        return this.position.y;
    }

    /**
     * The bottom edge of this Body.
     *
     * @name Phaser.Physics.Arcade.Body#bottom
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    get bottom (): number
    {
        return this.position.y + this.height;
    }
}
