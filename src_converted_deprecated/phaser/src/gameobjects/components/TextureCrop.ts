/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Frame } from '../../textures/Frame';

const _FLAG = 8; // 1000 - bitmask flag for GameObject.renderMask

/**
 * Provides methods used for getting and setting the texture of a Game Object with crop support.
 */
export interface TextureCrop {
    texture: any;
    frame: any;
    isCropped: boolean;
    _crop: any;
    renderFlags: number;
    scene: any;
    setCrop(x?: number | any, y?: number, width?: number, height?: number): this;
    setTexture(key: string, frame?: string | number): this;
    setFrame(frame: string | number | any, updateSize?: boolean, updateOrigin?: boolean): this;
    resetCropObject(): any;
}

export const TextureCrop = {

    texture: null,
    frame: null,
    isCropped: false,

    setCrop(this: any, x?: number | any, y?: number, width?: number, height?: number): any {
        if (x === undefined) {
            this.isCropped = false;
        } else if (this.frame) {
            if (typeof x === 'number') {
                this.frame.setCropUVs(this._crop, x, y, width, height, this.flipX, this.flipY);
            } else {
                const rect = x;
                this.frame.setCropUVs(this._crop, rect.x, rect.y, rect.width, rect.height, this.flipX, this.flipY);
            }
            this.isCropped = true;
        }
        return this;
    },

    setTexture(this: any, key: string, frame?: string | number): any {
        this.texture = this.scene.sys.textures.get(key);
        return this.setFrame(frame);
    },

    setFrame(this: any, frame?: string | number | any, updateSize: boolean = true, updateOrigin: boolean = true): any {
        if (frame instanceof Frame) {
            this.texture = this.scene.sys.textures.get(frame.texture.key);
            this.frame = frame;
        } else {
            this.frame = this.texture.get(frame);
        }

        if (!this.frame.cutWidth || !this.frame.cutHeight) {
            this.renderFlags &= ~_FLAG;
        } else {
            this.renderFlags |= _FLAG;
        }

        if (this._sizeComponent && updateSize) {
            this.setSizeToFrame();
        }

        if (this._originComponent && updateOrigin) {
            if (this.frame.customPivot) {
                this.setOrigin(this.frame.pivotX, this.frame.pivotY);
            } else {
                this.updateDisplayOrigin();
            }
        }

        if (this.isCropped) {
            this.frame.updateCropUVs(this._crop, this.flipX, this.flipY);
        }

        return this;
    },

    resetCropObject(this: any): any {
        return { u0: 0, v0: 0, u1: 0, v1: 0, width: 0, height: 0, x: 0, y: 0, flipX: false, flipY: false, cx: 0, cy: 0, cw: 0, ch: 0 };
    }
};
