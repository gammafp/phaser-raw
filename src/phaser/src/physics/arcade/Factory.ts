/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ArcadeImage } from './ArcadeImage';
import { ArcadeSprite } from './ArcadeSprite';
import { Body } from './Body';
import { StaticBody } from './StaticBody';
import { DYNAMIC_BODY, STATIC_BODY } from './const';
import { PhysicsGroup } from './PhysicsGroup';
import { StaticPhysicsGroup } from './StaticPhysicsGroup';

/**
 * @classdesc
 * The Arcade Physics Factory allows you to easily create Arcade Physics enabled Game Objects.
 * Objects that are created by this Factory are automatically added to the physics world.
 */
export class Factory
{
    world: any;
    scene: any;
    sys: any;

    constructor (world: any)
    {
        this.world = world;
        this.scene = world.scene;
        this.sys = world.scene.sys;
    }

    collider (object1: any, object2: any, collideCallback?: Function, processCallback?: Function, callbackContext?: any): any
    {
        return this.world.addCollider(object1, object2, collideCallback, processCallback, callbackContext);
    }

    overlap (object1: any, object2: any, collideCallback?: Function, processCallback?: Function, callbackContext?: any): any
    {
        return this.world.addOverlap(object1, object2, collideCallback, processCallback, callbackContext);
    }

    existing (gameObject: any, isStatic?: boolean): any
    {
        const type = (isStatic) ? STATIC_BODY : DYNAMIC_BODY;

        this.world.enableBody(gameObject, type);

        return gameObject;
    }

    staticImage (x: number, y: number, key: string | any, frame?: string | number): any
    {
        const image = new ArcadeImage(this.scene, x, y, key, frame);

        this.sys.displayList.add(image);

        this.world.enableBody(image, STATIC_BODY);

        return image;
    }

    image (x: number, y: number, key: string | any, frame?: string | number): any
    {
        const image = new ArcadeImage(this.scene, x, y, key, frame);

        this.sys.displayList.add(image);

        this.world.enableBody(image, DYNAMIC_BODY);

        return image;
    }

    staticSprite (x: number, y: number, key: string | any, frame?: string | number): any
    {
        const sprite = new ArcadeSprite(this.scene, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        this.world.enableBody(sprite, STATIC_BODY);

        return sprite;
    }

    sprite (x: number, y: number, key: string, frame?: string | number): any
    {
        const sprite = new ArcadeSprite(this.scene, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        this.world.enableBody(sprite, DYNAMIC_BODY);

        return sprite;
    }

    staticGroup (children?: any, config?: any): any
    {
        return this.sys.updateList.add(new StaticPhysicsGroup(this.world, this.world.scene, children, config));
    }

    group (children?: any, config?: any): any
    {
        return this.sys.updateList.add(new PhysicsGroup(this.world, this.world.scene, children, config));
    }

    body (x: number, y: number, width?: number, height?: number): any
    {
        const body = new Body(this.world);

        body.position.set(x, y);

        if (width && height)
        {
            body.setSize(width, height);
        }

        this.world.add(body, DYNAMIC_BODY);

        return body;
    }

    staticBody (x: number, y: number, width?: number, height?: number): any
    {
        const body = new StaticBody(this.world);

        body.position.set(x, y);

        if (width && height)
        {
            body.setSize(width, height);
        }

        this.world.add(body, STATIC_BODY);

        return body;
    }

    destroy (): void
    {
        this.world = null;
        this.scene = null;
        this.sys = null;
    }
}
