/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import { Sprite } from '../sprite/Sprite';
import { PathFollower as PathFollowerComponent } from '../components/PathFollower';

export interface PathFollower extends PathFollowerComponent {}

export class PathFollower extends Sprite {

    path: any;

    static {
        Mixin(this, [
            PathFollowerComponent
        ]);
    }

    constructor(scene: any, path: any, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame);

        this.path = path;
    }

    preUpdate(time: number, delta: number): void
    {
        this.anims.update(time, delta);
        (this as any).pathUpdate(time);
    }

}
