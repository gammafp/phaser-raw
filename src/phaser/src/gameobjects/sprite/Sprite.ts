/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import type { Alpha } from '../components/Alpha';
import type { BlendMode } from '../components/BlendMode';
import type { Depth } from '../components/Depth';
import type { Flip } from '../components/Flip';
import type { GetBounds } from '../components/GetBounds';
import type { Mask } from '../components/Mask';
import type { Origin } from '../components/Origin';
import type { Pipeline } from '../components/Pipeline';
import type { PostPipeline } from '../components/PostPipeline';
import type { ScrollFactor } from '../components/ScrollFactor';
import type { Size } from '../components/Size';
import type { TextureCrop } from '../components/TextureCrop';
import type { Tint } from '../components/Tint';
import type { Transform } from '../components/Transform';
import type { Visible } from '../components/Visible';

import { AnimationState } from '../../animations/AnimationState';
const Components = require('../components');
import { GameObject } from '../GameObject';
import { renderWebGL, renderCanvas } from './SpriteRender';
const SpriteRender = { renderWebGL, renderCanvas };

/**
 * @classdesc
 * A Sprite Game Object.
 *
 * A Sprite Game Object is used for the display of both static and animated images in your game.
 * Sprites can have input events and physics bodies. They can also be tweened, tinted, scrolled
 * and animated.
 *
 * The main difference between a Sprite and an Image Game Object is that you cannot animate Images.
 * As such, Sprites take a fraction longer to process and have a larger API footprint due to the Animation
 * Component. If you do not require animation then you can safely use Images to replace Sprites in all cases.
 *
 * @class Sprite
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.PostPipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */

// Interface merging - Sprite has all component methods/properties with full TypeScript support
export interface Sprite extends 
    Alpha,
    BlendMode,
    Depth,
    Flip,
    GetBounds,
    Mask,
    Origin,
    Pipeline,
    PostPipeline,
    ScrollFactor,
    Size,
    TextureCrop,
    Tint,
    Transform,
    Visible {}

export class Sprite extends GameObject {

    _crop: any;
    anims: any;

    static
    {
        Mixin(this, [
            Components.Alpha,
            Components.BlendMode,
            Components.Depth,
            Components.Flip,
            Components.GetBounds,
            Components.Mask,
            Components.Origin,
            Components.Pipeline,
            Components.PostPipeline,
            Components.ScrollFactor,
            Components.Size,
            Components.TextureCrop,
            Components.Tint,
            Components.Transform,
            Components.Visible,
            SpriteRender
        ]);
    }

    constructor(scene: any, x: number, y: number, texture: string | any, frame?: string | number)
    {
        super(scene, 'Sprite');

        this._crop = this.resetCropObject();
        this.anims = new AnimationState(this);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOriginFromFrame();
        this.initPipeline();
        this.initPostPipeline(true);
    }

    addedToScene(): void
    {
        this.scene.sys.updateList.add(this);
    }

    removedFromScene(): void
    {
        this.scene.sys.updateList.remove(this);
    }

    preUpdate(time: number, delta: number): void
    {
        this.anims.update(time, delta);
    }

    play(key: string | any, ignoreIfPlaying?: boolean): this
    {
        return this.anims.play(key, ignoreIfPlaying);
    }

    playReverse(key: string | any, ignoreIfPlaying?: boolean): this
    {
        return this.anims.playReverse(key, ignoreIfPlaying);
    }

    playAfterDelay(key: string | any, delay: number): this
    {
        return this.anims.playAfterDelay(key, delay);
    }

    playAfterRepeat(key: string | any, repeatCount?: number): this
    {
        return this.anims.playAfterRepeat(key, repeatCount);
    }

    chain(key?: string | any | any[]): this
    {
        return this.anims.chain(key);
    }

    stop(): this
    {
        return this.anims.stop();
    }

    stopAfterDelay(delay: number): this
    {
        return this.anims.stopAfterDelay(delay);
    }

    stopAfterRepeat(repeatCount?: number): this
    {
        return this.anims.stopAfterRepeat(repeatCount);
    }

    stopOnFrame(frame: any): this
    {
        return this.anims.stopOnFrame(frame);
    }

    toJSON(): any
    {
        return Components.ToJSON(this);
    }

    preDestroy(): void
    {
        this.anims.destroy();
        this.anims = undefined;
    }

}

