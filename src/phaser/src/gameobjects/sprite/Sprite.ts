/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { AnimationState } from '../../animations/AnimationState';
import { DefaultImageNodes } from '../../renderer/webgl/renderNodes/defaults/DefaultImageNodes';
import { Mixin } from '../../utils/MixinTS';
import { Alpha } from '../components/Alpha';
import { BlendMode } from '../components/BlendMode';
import { Depth } from '../components/Depth';
import { Flip } from '../components/Flip';
import { GetBounds } from '../components/GetBounds';
import { Lighting } from '../components/Lighting';
import { Mask } from '../components/Mask';
import { Origin } from '../components/Origin';
import { RenderNodes } from '../components/RenderNodes';
import { ScrollFactor } from '../components/ScrollFactor';
import { Size } from '../components/Size';
import { TextureCrop } from '../components/TextureCrop';
import { Tint } from '../components/Tint';
import { ToJSON } from '../components/ToJSON';
import { Transform } from '../components/Transform';
import { Visible } from '../components/Visible';
import { renderWebGL, renderCanvas } from './SpriteRender';

const GameObject = require('../GameObject');

export interface Sprite extends
    Alpha,
    BlendMode,
    Depth,
    Flip,
    GetBounds,
    Lighting,
    Mask,
    Origin,
    RenderNodes,
    ScrollFactor,
    Size,
    TextureCrop,
    Tint,
    Transform,
    Visible {}

/**
 * A Sprite Game Object.
 */
export class Sprite extends GameObject
{
    _crop: any;
    anims: any;

    static
    {
        Mixin(this, [
            Alpha,
            BlendMode,
            Depth,
            Flip,
            GetBounds,
            Lighting,
            Mask,
            Origin,
            RenderNodes,
            ScrollFactor,
            Size,
            TextureCrop,
            Tint,
            Transform,
            Visible,
            { renderWebGL, renderCanvas }
        ]);
    }

    constructor (scene: any, x: number, y: number, texture: string | any, frame?: string | number)
    {
        super(scene, 'Sprite');

        this._crop = this.resetCropObject();
        this.anims = new AnimationState(this);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOriginFromFrame();
        this.initRenderNodes(this._defaultRenderNodesMap);
    }

    get _defaultRenderNodesMap (): any
    {
        return DefaultImageNodes;
    }

    //  Overrides Game Object method
    addedToScene (): void
    {
        this.scene.sys.updateList.add(this);
    }

    //  Overrides Game Object method
    removedFromScene (): void
    {
        this.scene.sys.updateList.remove(this);
    }

    preUpdate (time: number, delta: number): void
    {
        this.anims.update(time, delta);
    }

    play (key: any, ignoreIfPlaying?: boolean): this
    {
        return this.anims.play(key, ignoreIfPlaying);
    }

    playReverse (key: any, ignoreIfPlaying?: boolean): this
    {
        return this.anims.playReverse(key, ignoreIfPlaying);
    }

    playAfterDelay (key: any, delay: number): this
    {
        return this.anims.playAfterDelay(key, delay);
    }

    playAfterRepeat (key: any, repeatCount?: number): this
    {
        return this.anims.playAfterRepeat(key, repeatCount);
    }

    chain (key?: any): this
    {
        return this.anims.chain(key);
    }

    stop (): this
    {
        return this.anims.stop();
    }

    stopAfterDelay (delay: number): this
    {
        return this.anims.stopAfterDelay(delay);
    }

    stopAfterRepeat (repeatCount?: number): this
    {
        return this.anims.stopAfterRepeat(repeatCount);
    }

    stopOnFrame (frame: any): this
    {
        return this.anims.stopOnFrame(frame);
    }

    toJSON (): any
    {
        return ToJSON(this);
    }

    preDestroy (): void
    {
        this.anims.destroy();
        this.anims = undefined;
    }
}
