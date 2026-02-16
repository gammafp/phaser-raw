/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import { PathFollower as PathFollowerComponent } from '../components/PathFollower';
import { Sprite } from '../sprite/Sprite';

export interface PathFollower extends PathFollowerComponent {}

/**
 * A PathFollower Game Object.
 */
export class PathFollower extends Sprite
{
    static
    {
        Mixin(this, [
            PathFollowerComponent
        ]);
    }

    path: any;

    constructor (scene: any, path: any, x: number, y: number, texture: string | any, frame?: string | number)
    {
        super(scene, x, y, texture, frame);

        this.path = path;
    }

    preUpdate (time: number, delta: number): void
    {
        this.anims.update(time, delta);
        this.pathUpdate(time);
    }
}
