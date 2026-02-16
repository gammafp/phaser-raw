/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../utils/object/GetFastValue';
import { IsPlainObject } from '../../utils/object/IsPlainObject';
import { Mixin } from '../../utils/MixinTS';
import { ArcadeSprite } from './ArcadeSprite';
import { Collision } from './components/Collision';
import { DYNAMIC_BODY } from './const';

const Group = require('../../gameobjects/group/Group');

/**
 * @classdesc
 * An Arcade Physics Group object.
 *
 * The primary use of a Physics Group is a way to collect together physics enable objects
 * that share the same intrinsic structure into a single pool. They can then be easily
 * compared against other Groups, or Game Objects.
 *
 * All Game Objects created by, or added to this Group will automatically be given **dynamic**
 * Arcade Physics bodies (if they have no body already) and the bodies will receive the
 * Groups {@link Phaser.Physics.Arcade.Group#defaults default values}.
 *
 * If you wish to create a Group filled with Static Bodies, please see {@link Phaser.Physics.Arcade.StaticGroup}.
 */
export interface PhysicsGroup extends Collision {}

export class PhysicsGroup extends Group
{
    static {
        Mixin(this, [
            Collision
        ]);
    }

    world: any;
    physicsType: number;
    collisionCategory: number;
    collisionMask: number;
    defaults: any;

    constructor (world: any, scene: any, children?: any, config?: any)
    {
        if (!children && !config)
        {
            config = {
                internalCreateCallback: null,
                internalRemoveCallback: null
            };
        }
        else if (IsPlainObject(children))
        {
            //  children is a plain object, so swizzle them:
            config = children;
            children = null;

            config.internalCreateCallback = null;
            config.internalRemoveCallback = null;
            config.classType = GetFastValue(config, 'classType', ArcadeSprite);
        }
        else if (Array.isArray(children) && IsPlainObject(children[0]))
        {
            //  children is an array of plain objects (i.e., configs)
            children.forEach(function (singleConfig: any)
            {
                singleConfig.internalCreateCallback = null;
                singleConfig.internalRemoveCallback = null;
                singleConfig.classType = GetFastValue(singleConfig, 'classType', ArcadeSprite);
            });

            config = null;
        }
        else
        {
            config = {
                internalCreateCallback: null,
                internalRemoveCallback: null
            };
        }

        this.world = world;

        if (config)
        {
            config.classType = GetFastValue(config, 'classType', ArcadeSprite);
        }

        this.physicsType = DYNAMIC_BODY;

        this.collisionCategory = 0x0001;
        this.collisionMask = 2147483647;

        this.defaults = {
            setCollideWorldBounds: GetFastValue(config, 'collideWorldBounds', false),
            setBoundsRectangle: GetFastValue(config, 'customBoundsRectangle', null),
            setAccelerationX: GetFastValue(config, 'accelerationX', 0),
            setAccelerationY: GetFastValue(config, 'accelerationY', 0),
            setAllowDrag: GetFastValue(config, 'allowDrag', true),
            setAllowGravity: GetFastValue(config, 'allowGravity', true),
            setAllowRotation: GetFastValue(config, 'allowRotation', true),
            setDamping: GetFastValue(config, 'useDamping', false),
            setBounceX: GetFastValue(config, 'bounceX', 0),
            setBounceY: GetFastValue(config, 'bounceY', 0),
            setDragX: GetFastValue(config, 'dragX', 0),
            setDragY: GetFastValue(config, 'dragY', 0),
            setEnable: GetFastValue(config, 'enable', true),
            setGravityX: GetFastValue(config, 'gravityX', 0),
            setGravityY: GetFastValue(config, 'gravityY', 0),
            setFrictionX: GetFastValue(config, 'frictionX', 0),
            setFrictionY: GetFastValue(config, 'frictionY', 0),
            setMaxSpeed: GetFastValue(config, 'maxSpeed', -1),
            setMaxVelocityX: GetFastValue(config, 'maxVelocityX', 10000),
            setMaxVelocityY: GetFastValue(config, 'maxVelocityY', 10000),
            setVelocityX: GetFastValue(config, 'velocityX', 0),
            setVelocityY: GetFastValue(config, 'velocityY', 0),
            setAngularVelocity: GetFastValue(config, 'angularVelocity', 0),
            setAngularAcceleration: GetFastValue(config, 'angularAcceleration', 0),
            setAngularDrag: GetFastValue(config, 'angularDrag', 0),
            setMass: GetFastValue(config, 'mass', 1),
            setImmovable: GetFastValue(config, 'immovable', false)
        };

        // Set callbacks after defaults are ready
        if (config)
        {
            config.internalCreateCallback = this.createCallbackHandler.bind(this);
            config.internalRemoveCallback = this.removeCallbackHandler.bind(this);
        }

        super(scene, children, config);

        this.type = 'PhysicsGroup';
    }

    createCallbackHandler (child: any): void
    {
        if (!child.body || child.body.physicsType !== DYNAMIC_BODY)
        {
            if (child.body)
            {
                child.body.destroy();
                child.body = null;
            }

            this.world.enableBody(child, DYNAMIC_BODY);
        }

        const body = child.body;

        for (const key in this.defaults)
        {
            body[key](this.defaults[key]);
        }
    }

    removeCallbackHandler (child: any): void
    {
        if (child.body)
        {
            this.world.disableBody(child);
        }
    }

    setVelocity (x: number, y: number, step?: number): this
    {
        if (step === undefined) { step = 0; }

        const items = this.getChildren();

        for (let i = 0; i < items.length; i++)
        {
            (items[i] as any).body.velocity.set(x + (i * step), y + (i * step));
        }

        return this;
    }

    setVelocityX (value: number, step?: number): this
    {
        if (step === undefined) { step = 0; }

        const items = this.getChildren();

        for (let i = 0; i < items.length; i++)
        {
            (items[i] as any).body.velocity.x = value + (i * step);
        }

        return this;
    }

    setVelocityY (value: number, step?: number): this
    {
        if (step === undefined) { step = 0; }

        const items = this.getChildren();

        for (let i = 0; i < items.length; i++)
        {
            (items[i] as any).body.velocity.y = value + (i * step);
        }

        return this;
    }
}
