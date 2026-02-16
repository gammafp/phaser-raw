/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Rectangle } from '../../geom/rectangle/Rectangle';

import { Clamp } from '../../math/Clamp';
import { DegToRad } from '../../math/DegToRad';
import { RotateAround } from '../../math/RotateAround';
import { Vector2 } from '../../math/Vector2';
import { AnimationState } from '../../animations/AnimationState';

/**
 * @classdesc
 * A Particle is a simple object owned and controlled by a Particle Emitter.
 *
 * It encapsulates all of the properties required to move and update according
 * to the Emitters operations.
 *
 * @class Particle
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 */
export class Particle
{
    /**
     * The Emitter to which this Particle belongs.
     */
    emitter: any;

    /**
     * The texture used by this Particle when it renders.
     */
    texture: any;

    /**
     * The texture frame used by this Particle when it renders.
     */
    frame: any;

    /**
     * The x coordinate of this Particle.
     */
    x: number;

    /**
     * The y coordinate of this Particle.
     */
    y: number;

    /**
     * The coordinates of this Particle in world space.
     */
    worldPosition: Vector2;

    /**
     * The x velocity of this Particle.
     */
    velocityX: number;

    /**
     * The y velocity of this Particle.
     */
    velocityY: number;

    /**
     * The x acceleration of this Particle.
     */
    accelerationX: number;

    /**
     * The y acceleration of this Particle.
     */
    accelerationY: number;

    /**
     * The maximum horizontal velocity this Particle can travel at.
     */
    maxVelocityX: number;

    /**
     * The maximum vertical velocity this Particle can travel at.
     */
    maxVelocityY: number;

    /**
     * The bounciness, or restitution, of this Particle.
     */
    bounce: number;

    /**
     * The horizontal scale of this Particle.
     */
    scaleX: number;

    /**
     * The vertical scale of this Particle.
     */
    scaleY: number;

    /**
     * The alpha value of this Particle.
     */
    alpha: number;

    /**
     * The angle of this Particle in degrees.
     */
    angle: number;

    /**
     * The angle of this Particle in radians.
     */
    rotation: number;

    /**
     * The tint applied to this Particle.
     */
    tint: number;

    /**
     * The lifespan of this Particle in ms.
     */
    life: number;

    /**
     * The current life of this Particle in ms.
     */
    lifeCurrent: number;

    /**
     * The delay applied to this Particle upon emission, in ms.
     */
    delayCurrent: number;

    /**
     * The hold applied to this Particle before it expires, in ms.
     */
    holdCurrent: number;

    /**
     * The normalized lifespan T value, where 0 is the start and 1 is the end.
     */
    lifeT: number;

    /**
     * The data used by the ease equation.
     */
    data: any;

    /**
     * Internal private value.
     */
    isCropped: boolean;

    /**
     * A reference to the Scene to which this Game Object belongs.
     */
    scene: any;

    /**
     * The Animation State component of this Particle.
     */
    anims: any;

    /**
     * A rectangle that holds the bounds of this Particle.
     */
    bounds: any;

    constructor (emitter: any)
    {
        this.emitter = emitter;
        this.texture = null;
        this.frame = null;
        this.x = 0;
        this.y = 0;
        this.worldPosition = new Vector2();
        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.maxVelocityX = 10000;
        this.maxVelocityY = 10000;
        this.bounce = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.angle = 0;
        this.rotation = 0;
        this.tint = 0xffffff;
        this.life = 1000;
        this.lifeCurrent = 1000;
        this.delayCurrent = 0;
        this.holdCurrent = 0;
        this.lifeT = 0;

        this.data = {
            tint: { min: 0xffffff, max: 0xffffff },
            alpha: { min: 1, max: 1 },
            rotate: { min: 0, max: 0 },
            scaleX: { min: 1, max: 1 },
            scaleY: { min: 1, max: 1 },
            x: { min: 0, max: 0 },
            y: { min: 0, max: 0 },
            accelerationX: { min: 0, max: 0 },
            accelerationY: { min: 0, max: 0 },
            maxVelocityX: { min: 0, max: 0 },
            maxVelocityY: { min: 0, max: 0 },
            moveToX: { min: 0, max: 0 },
            moveToY: { min: 0, max: 0 },
            bounce: { min: 0, max: 0 }
        };

        this.isCropped = false;
        this.scene = emitter.scene;
        this.anims = null;

        if (this.emitter.anims.length > 0)
        {
            this.anims = new AnimationState(this);
        }

        this.bounds = new Rectangle();
    }

    /**
     * The Event Emitter proxy.
     * Passes on all parameters to the `ParticleEmitter` to emit directly.
     */
    emit (event: string | symbol, a1?: any, a2?: any, a3?: any, a4?: any, a5?: any): boolean
    {
        return this.emitter.emit(event, a1, a2, a3, a4, a5);
    }

    /**
     * Checks to see if this Particle is alive and updating.
     */
    isAlive (): boolean
    {
        return (this.lifeCurrent > 0);
    }

    /**
     * Kills this particle.
     */
    kill (): void
    {
        this.lifeCurrent = 0;
    }

    /**
     * Sets the position of this particle to the given x/y coordinates.
     */
    setPosition (x: number = 0, y: number = 0): void
    {
        this.x = x;
        this.y = y;
    }

    /**
     * Starts this Particle from the given coordinates.
     */
    fire (x?: number, y?: number): boolean
    {
        var emitter = this.emitter;
        var ops = emitter.ops;

        var anim = emitter.getAnim();

        if (anim)
        {
            this.anims.play(anim);
        }
        else
        {
            this.frame = emitter.getFrame();
            this.texture = this.frame.texture;
        }

        if (!this.frame)
        {
            throw new Error('Particle has no texture frame');
        }

        //  Updates particle.x and particle.y during this call
        emitter.getEmitZone(this);

        if (x === undefined)
        {
            this.x += ops.x.onEmit(this, 'x');
        }
        else if (ops.x.steps > 0)
        {
            //  EmitterOp is stepped but x was forced (follower?) so use it
            this.x += x + ops.x.onEmit(this, 'x');
        }
        else
        {
            this.x += x;
        }

        if (y === undefined)
        {
            this.y += ops.y.onEmit(this, 'y');
        }
        else if (ops.y.steps > 0)
        {
            //  EmitterOp is stepped but y was forced (follower?) so use it
            this.y += y + ops.y.onEmit(this, 'y');
        }
        else
        {
            this.y += y;
        }

        this.life = ops.lifespan.onEmit(this, 'lifespan');
        this.lifeCurrent = this.life;
        this.lifeT = 0;

        this.delayCurrent = ops.delay.onEmit(this, 'delay');
        this.holdCurrent = ops.hold.onEmit(this, 'hold');

        this.scaleX = ops.scaleX.onEmit(this, 'scaleX');
        this.scaleY = (ops.scaleY.active) ? ops.scaleY.onEmit(this, 'scaleY') : this.scaleX;

        this.angle = ops.rotate.onEmit(this, 'rotate');

        this.rotation = DegToRad(this.angle);

        emitter.worldMatrix.transformPoint(this.x, this.y, this.worldPosition);

        //  Check we didn't spawn in the middle of a DeathZone
        if (this.delayCurrent === 0 && emitter.getDeathZone(this))
        {
            this.lifeCurrent = 0;

            return false;
        }

        var sx = ops.speedX.onEmit(this, 'speedX');
        var sy = (ops.speedY.active) ? ops.speedY.onEmit(this, 'speedY') : sx;

        if (emitter.radial)
        {
            var rad = DegToRad(ops.angle.onEmit(this, 'angle'));

            this.velocityX = Math.cos(rad) * Math.abs(sx);
            this.velocityY = Math.sin(rad) * Math.abs(sy);
        }
        else if (emitter.moveTo)
        {
            var mx = ops.moveToX.onEmit(this, 'moveToX');
            var my = ops.moveToY.onEmit(this, 'moveToY');
            var lifeS = this.life / 1000;

            this.velocityX = (mx - this.x) / lifeS;
            this.velocityY = (my - this.y) / lifeS;
        }
        else
        {
            this.velocityX = sx;
            this.velocityY = sy;
        }

        if (emitter.acceleration)
        {
            this.accelerationX = ops.accelerationX.onEmit(this, 'accelerationX');
            this.accelerationY = ops.accelerationY.onEmit(this, 'accelerationY');
        }

        this.maxVelocityX = ops.maxVelocityX.onEmit(this, 'maxVelocityX');
        this.maxVelocityY = ops.maxVelocityY.onEmit(this, 'maxVelocityY');

        this.bounce = ops.bounce.onEmit(this, 'bounce');

        this.alpha = ops.alpha.onEmit(this, 'alpha');

        if (ops.color.active)
        {
            this.tint = ops.color.onEmit(this, 'tint');
        }
        else
        {
            this.tint = ops.tint.onEmit(this, 'tint');
        }

        return true;
    }

    /**
     * The main update method for this Particle.
     */
    update (delta: number, step: number, processors: any[]): boolean
    {
        if (this.lifeCurrent <= 0)
        {
            //  Particle is dead via `Particle.kill` method, or being held
            if (this.holdCurrent > 0)
            {
                this.holdCurrent -= delta;

                return (this.holdCurrent <= 0);
            }
            else
            {
                return true;
            }
        }

        if (this.delayCurrent > 0)
        {
            this.delayCurrent -= delta;

            return false;
        }

        if (this.anims)
        {
            this.anims.update(0, delta);
        }

        var emitter = this.emitter;
        var ops = emitter.ops;

        //  How far along in life is this particle? (t = 0 to 1)
        var t = 1 - (this.lifeCurrent / this.life);

        this.lifeT = t;

        this.x = ops.x.onUpdate(this, 'x', t, this.x);
        this.y = ops.y.onUpdate(this, 'y', t, this.y);

        if (emitter.moveTo)
        {
            var mx = ops.moveToX.onUpdate(this, 'moveToX', t, emitter.moveToX);
            var my = ops.moveToY.onUpdate(this, 'moveToY', t, emitter.moveToY);
            var lifeS = this.lifeCurrent / 1000;

            this.velocityX = (mx - this.x) / lifeS;
            this.velocityY = (my - this.y) / lifeS;
        }

        this.computeVelocity(emitter, delta, step, processors, t);

        this.scaleX = ops.scaleX.onUpdate(this, 'scaleX', t, this.scaleX);

        if (ops.scaleY.active)
        {
            this.scaleY = ops.scaleY.onUpdate(this, 'scaleY', t, this.scaleY);
        }
        else
        {
            this.scaleY = this.scaleX;
        }

        this.angle = ops.rotate.onUpdate(this, 'rotate', t, this.angle);

        this.rotation = DegToRad(this.angle);

        if (emitter.getDeathZone(this))
        {
            this.lifeCurrent = 0;

            //  No need to go any further, particle has been killed
            return true;
        }

        this.alpha = Clamp(ops.alpha.onUpdate(this, 'alpha', t, this.alpha), 0, 1);

        if (ops.color.active)
        {
            this.tint = ops.color.onUpdate(this, 'color', t, this.tint);
        }
        else
        {
            this.tint = ops.tint.onUpdate(this, 'tint', t, this.tint);
        }

        this.lifeCurrent -= delta;

        return (this.lifeCurrent <= 0 && this.holdCurrent <= 0);
    }

    /**
     * An internal method that calculates the velocity of the Particle and
     * its world position.
     */
    computeVelocity (emitter: any, delta: number, step: number, processors: any[], t: number): void
    {
        var ops = emitter.ops;

        var vx = this.velocityX;
        var vy = this.velocityY;

        var ax = ops.accelerationX.onUpdate(this, 'accelerationX', t, this.accelerationX);
        var ay = ops.accelerationY.onUpdate(this, 'accelerationY', t, this.accelerationY);

        var mx = ops.maxVelocityX.onUpdate(this, 'maxVelocityX', t, this.maxVelocityX);
        var my = ops.maxVelocityY.onUpdate(this, 'maxVelocityY', t, this.maxVelocityY);

        this.bounce = ops.bounce.onUpdate(this, 'bounce', t, this.bounce);

        vx += (emitter.gravityX * step) + (ax * step);
        vy += (emitter.gravityY * step) + (ay * step);

        vx = Clamp(vx, -mx, mx);
        vy = Clamp(vy, -my, my);

        this.velocityX = vx;
        this.velocityY = vy;

        //  Integrate back in to the position
        this.x += vx * step;
        this.y += vy * step;

        emitter.worldMatrix.transformPoint(this.x, this.y, this.worldPosition);

        //  Apply any additional processors (these can update velocity and/or position)
        for (var i = 0; i < processors.length; i++)
        {
            var processor = processors[i];

            if (processor.active)
            {
                processor.update(this, delta, step, t);
            }
        }
    }

    /**
     * This is a NOOP method and does nothing when called.
     */
    setSizeToFrame (): void
    {
        //  NOOP
    }

    /**
     * Gets the bounds of this particle as a Geometry Rectangle, factoring in any
     * transforms of the parent emitter and anything else above it in the display list.
     */
    getBounds (matrix?: any): any
    {
        if (matrix === undefined) { matrix = this.emitter.getWorldTransformMatrix(); }

        var sx = Math.abs(matrix.scaleX) * this.scaleX;
        var sy = Math.abs(matrix.scaleY) * this.scaleY;

        var x = this.x;
        var y = this.y;
        var rotation = this.rotation;
        var width = (this.frame.width * sx) / 2;
        var height = (this.frame.height * sy) / 2;

        var bounds = this.bounds;

        var topLeft = new Vector2(x - width, y - height);
        var topRight = new Vector2(x + width, y - height);
        var bottomLeft = new Vector2(x - width, y + height);
        var bottomRight = new Vector2(x + width, y + height);

        if (rotation !== 0)
        {
            RotateAround(topLeft, x, y, rotation);
            RotateAround(topRight, x, y, rotation);
            RotateAround(bottomLeft, x, y, rotation);
            RotateAround(bottomRight, x, y, rotation);
        }

        matrix.transformPoint(topLeft.x, topLeft.y, topLeft);
        matrix.transformPoint(topRight.x, topRight.y, topRight);
        matrix.transformPoint(bottomLeft.x, bottomLeft.y, bottomLeft);
        matrix.transformPoint(bottomRight.x, bottomRight.y, bottomRight);

        bounds.x = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
        bounds.y = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
        bounds.width = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x) - bounds.x;
        bounds.height = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y) - bounds.y;

        return bounds;
    }

    /**
     * Destroys this Particle.
     */
    destroy (): void
    {
        if (this.anims)
        {
            this.anims.destroy();
        }

        this.anims = null;
        this.emitter = null;
        this.texture = null;
        this.frame = null;
        this.scene = null;
    }
}
