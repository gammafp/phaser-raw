/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../utils/object/GetFastValue';
import { Vector2 } from '../../math/Vector2';
import { Mixin } from '../../utils/MixinTS';
import { Sprite } from '../../gameobjects/sprite/Sprite';

const Components = require('./components');

/**
 * A Matter Physics Sprite Game Object.
 */
export class MatterSprite extends Sprite
{
    world: any;
    _tempVec2: Vector2;

    static
    {
        Mixin(this, [
            Components.Bounce,
            Components.Collision,
            Components.Force,
            Components.Friction,
            Components.Gravity,
            Components.Mass,
            Components.Sensor,
            Components.SetBody,
            Components.Sleep,
            Components.Static,
            Components.Transform,
            Components.Velocity
        ]);
    }

    constructor (world: any, x: number, y: number, texture: string | any, frame?: string | number, options?: any)
    {
        super(world.scene, x, y, texture, frame);

        this.setOrigin();

        this.world = world;
        this._tempVec2 = new Vector2(x, y);

        const shape = GetFastValue(options, 'shape', null);

        if (shape)
        {
            this.setBody(shape, options);
        }
        else
        {
            this.setRectangle(this.width, this.height, options);
        }

        this.setPosition(x, y);
    }
}
