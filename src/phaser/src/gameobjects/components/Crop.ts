/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for cropping a texture-based Game Object.
 * Note: This is rarely used directly - most GameObjects use TextureCrop instead.
 */
export interface Crop {
    isCropped: boolean;
    _crop: any;
    setCrop(x?: number | any, y?: number, width?: number, height?: number): this;
    resetCropObject(): any;
}

export const Crop = {

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

    resetCropObject(this: any): any {
        return { u0: 0, v0: 0, u1: 0, v1: 0, width: 0, height: 0, x: 0, y: 0, flipX: false, flipY: false, cx: 0, cy: 0, cw: 0, ch: 0 };
    }
};
