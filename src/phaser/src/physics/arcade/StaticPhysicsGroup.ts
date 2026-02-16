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
import { STATIC_BODY } from './const';

import { Group } from '../../gameobjects/group/Group';

/**
 * @classdesc
 * An Arcade Physics Static Group object.
 *
 * All Game Objects created by or added to this Group will automatically be given static Arcade Physics bodies, if they have no body.
 *
 * Its dynamic counterpart is {@link Phaser.Physics.Arcade.Group}.
 */
export interface StaticPhysicsGroup extends Collision {}

export class StaticPhysicsGroup extends Group
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

    constructor (world: any, scene: any, children?: any, config?: any)
    {
        if (!children && !config)
        {
            config = {
                internalCreateCallback: null,
                internalRemoveCallback: null,
                createMultipleCallback: null,
                classType: ArcadeSprite
            };
        }
        else if (IsPlainObject(children))
        {
            //  children is a plain object, so swizzle them:
            config = children;
            children = null;

            config.internalCreateCallback = null;
            config.internalRemoveCallback = null;
            config.createMultipleCallback = null;
            config.classType = GetFastValue(config, 'classType', ArcadeSprite);
        }
        else if (Array.isArray(children) && IsPlainObject(children[0]))
        {
            //  children is an array of plain objects
            config = children;
            children = null;

            (config as any[]).forEach((singleConfig: any) =>
            {
                singleConfig.internalCreateCallback = null;
                singleConfig.internalRemoveCallback = null;
                singleConfig.createMultipleCallback = null;
                singleConfig.classType = GetFastValue(singleConfig, 'classType', ArcadeSprite);
            });
        }
        else
        {
            config = {
                internalCreateCallback: null,
                internalRemoveCallback: null
            };
        }

        this.world = world;
        this.physicsType = STATIC_BODY;
        this.collisionCategory = 0x0001;
        this.collisionMask = 1;

        // Set callbacks after properties are ready
        if (config && !Array.isArray(config))
        {
            config.internalCreateCallback = (...args: any[]) => this.createCallbackHandler(...args);
            config.internalRemoveCallback = (...args: any[]) => this.removeCallbackHandler(...args);
            config.createMultipleCallback = (...args: any[]) => this.createMultipleCallbackHandler(...args);
        }

        super(scene, children, config);

        this.type = 'StaticPhysicsGroup';
    }

    createCallbackHandler (child: any): void
    {
        if (!child.body || child.body.physicsType !== STATIC_BODY)
        {
            if (child.body)
            {
                child.body.destroy();
                child.body = null;
            }

            this.world.enableBody(child, STATIC_BODY);
        }
    }

    removeCallbackHandler (child: any): void
    {
        if (child.body)
        {
            this.world.disableBody(child);
        }
    }

    createMultipleCallbackHandler (): void
    {
        this.refresh();
    }

    refresh (): this
    {
        const children = Array.from(this.children);

        for (let i = 0; i < children.length; i++)
        {
            (children[i] as any).body.reset();
        }

        return this;
    }
}
