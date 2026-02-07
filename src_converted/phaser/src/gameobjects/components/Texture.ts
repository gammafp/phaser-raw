/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Frame } from '../../textures/Frame';

const _FLAG = 8; // 1000 - bitmask flag for GameObject.renderMask

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 */
export interface Texture {
    texture: any;
    frame: any;
    isCropped: boolean;
    renderFlags: number;
    scene: any;
    setTexture(key: string | any, frame?: string | number, updateSize?: boolean, updateOrigin?: boolean): this;
    setFrame(frame: string | number | any, updateSize?: boolean, updateOrigin?: boolean): this;
}

export const Texture = {

    texture: null,
    frame: null,
    isCropped: false,

    setTexture(this: any, key: string | any, frame?: string | number, updateSize?: boolean, updateOrigin?: boolean): any {
        this.texture = this.scene.sys.textures.get(key);
        return this.setFrame(frame, updateSize, updateOrigin);
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

        return this;
    }
};
