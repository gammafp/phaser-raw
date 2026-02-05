/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import { Image } from '../../gameobjects/image/Image';
import * as Components from './components';

// Interface merging para tipos
export interface ArcadeImage extends
    Components.Acceleration,
    Components.Angular,
    Components.Bounce,
    Components.Debug,
    Components.Drag,
    Components.Enable,
    Components.Friction,
    Components.Gravity,
    Components.Immovable,
    Components.Mass,
    Components.Pushable,
    Components.Size,
    Components.Velocity {}

export class ArcadeImage extends Image {

    body: any;

    static {
        Mixin(this, [
            Components.Acceleration,
            Components.Angular,
            Components.Bounce,
            Components.Collision,
            Components.Debug,
            Components.Drag,
            Components.Enable,
            Components.Friction,
            Components.Gravity,
            Components.Immovable,
            Components.Mass,
            Components.Pushable,
            Components.Size,
            Components.Velocity
        ]);
    }

    constructor(scene: any, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame);

        this.body = null;
    }

}
