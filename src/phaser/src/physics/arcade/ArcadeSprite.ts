/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import { Acceleration } from './components/Acceleration';
import { Angular } from './components/Angular';
import { Bounce } from './components/Bounce';
import { Collision } from './components/Collision';
import { Debug } from './components/Debug';
import { Drag } from './components/Drag';
import { Enable } from './components/Enable';
import { Friction } from './components/Friction';
import { Gravity } from './components/Gravity';
import { Immovable } from './components/Immovable';
import { Mass } from './components/Mass';
import { Pushable } from './components/Pushable';
import { Size } from './components/Size';
import { Velocity } from './components/Velocity';

const Sprite = require('../../gameobjects/sprite/Sprite');

/**
 * @classdesc
 * An Arcade Physics Sprite is a Sprite with an Arcade Physics body and related components.
 * The body can be dynamic or static.
 *
 * The main difference between an Arcade Sprite and an Arcade Image is that you cannot animate an Arcade Image.
 * If you do not require animation then you can safely use Arcade Images instead of Arcade Sprites.
 */
export interface ArcadeSprite extends Acceleration, Angular, Bounce, Collision, Debug, Drag, Enable, Friction, Gravity, Immovable, Mass, Pushable, Size, Velocity {}

export class ArcadeSprite extends Sprite
{
    static {
        Mixin(this, [
            Acceleration,
            Angular,
            Bounce,
            Collision,
            Debug,
            Drag,
            Enable,
            Friction,
            Gravity,
            Immovable,
            Mass,
            Pushable,
            Size,
            Velocity
        ]);
    }

    body: any;

    constructor (scene: any, x: number, y: number, texture: string | any, frame?: string | number)
    {
        super(scene, x, y, texture, frame);

        this.body = null;
    }
}
