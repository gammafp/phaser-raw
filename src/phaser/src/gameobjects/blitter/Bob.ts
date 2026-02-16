// @ts-nocheck

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Frame } from '../../textures/Frame';

/**
 * @classdesc
 * A Bob Game Object.
 *
 * A Bob belongs to a Blitter Game Object. The Blitter is responsible for managing and rendering this object.
 *
 * A Bob has a position, alpha value and a frame from a texture that it uses to render with. You can also toggle
 * the flipped and visible state of the Bob. The Frame the Bob uses to render can be changed dynamically, but it
 * must be a Frame within the Texture used by the parent Blitter.
 *
 * Bob positions are relative to the Blitter parent. So if you move the Blitter parent, all Bob children will
 * have their positions impacted by this change as well.
 *
 * You can manipulate Bob objects directly from your game code, but the creation and destruction of them should be
 * handled via the Blitter parent.
 *
 * @class Bob
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Blitter} blitter - The parent Blitter object is responsible for updating this Bob.
 * @param {number} x - The horizontal position of this Game Object in the world, relative to the parent Blitter position.
 * @param {number} y - The vertical position of this Game Object in the world, relative to the parent Blitter position.
 * @param {(string|number)} frame - The Frame this Bob will render with, as defined in the Texture the parent Blitter is using.
 * @param {boolean} visible - Should the Bob render visible or not to start with?
 */
export class Bob {
    parent: any;
    x: number;
    y: number;
    frame: any;
    data: any;
    tint: number;
    _visible: boolean;
    _alpha: number;
    flipX: boolean;
    flipY: boolean;
    hasTransformComponent: boolean;

    constructor(blitter: any, x: number, y: number, frame: any, visible: boolean)
    {
        this.parent = blitter;
        this.x = x;
        this.y = y;
        this.frame = frame;
        this.data = {};
        this.tint = 0xffffff;
        this._visible = visible;
        this._alpha = 1;
        this.flipX = false;
        this.flipY = false;
        this.hasTransformComponent = true;
    }

    setFrame(frame?: string | number | any): this
    {
        if (frame === undefined)
        {
            this.frame = this.parent.frame;
        }
        else if (frame instanceof Frame && frame.texture === this.parent.texture)
        {
            this.frame = frame;
        }
        else
        {
            this.frame = this.parent.texture.get(frame);
        }

        return this;
    }

    resetFlip(): this
    {
        this.flipX = false;
        this.flipY = false;

        return this;
    }

    reset(x: number, y: number, frame?: string | number | any): this
    {
        this.x = x;
        this.y = y;

        this.flipX = false;
        this.flipY = false;

        this._alpha = 1;
        this._visible = true;

        this.parent.dirty = true;

        if (frame)
        {
            this.setFrame(frame);
        }

        return this;
    }

    setPosition(x: number, y: number): this
    {
        this.x = x;
        this.y = y;

        return this;
    }

    setFlipX(value: boolean): this
    {
        this.flipX = value;

        return this;
    }

    setFlipY(value: boolean): this
    {
        this.flipY = value;

        return this;
    }

    setFlip(x: boolean, y: boolean): this
    {
        this.flipX = x;
        this.flipY = y;

        return this;
    }

    setVisible(value: boolean): this
    {
        this.visible = value;

        return this;
    }

    setAlpha(value: number): this
    {
        this.alpha = value;

        return this;
    }

    setTint(value: number): this
    {
        this.tint = value;

        return this;
    }

    destroy(): void
    {
        this.parent.dirty = true;
        this.parent.children.remove(this);

        this.parent = undefined;
        this.frame = undefined;
        this.data = undefined;
    }

    get visible(): boolean
    {
        return this._visible;
    }

    set visible(value: boolean)
    {
        this.parent.dirty = this.parent.dirty || (this._visible !== value);
        this._visible = value;
    }

    get alpha(): number
    {
        return this._alpha;
    }

    set alpha(value: number)
    {
        this.parent.dirty = this.parent.dirty || ((this._alpha > 0) !== (value > 0));
        this._alpha = value;
    }
}
