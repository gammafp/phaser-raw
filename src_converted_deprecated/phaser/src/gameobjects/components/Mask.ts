/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BitmapMask } from '../../display/mask/BitmapMask';
import { GeometryMask } from '../../display/mask/GeometryMask';

/**
 * Provides methods used for getting and setting the mask of a Game Object.
 */
export interface Mask {
    mask: BitmapMask | GeometryMask | null;
    scene: any;
    setMask(mask: BitmapMask | GeometryMask): this;
    clearMask(destroyMask?: boolean): this;
    createBitmapMask(maskObject?: any, x?: number, y?: number, texture?: string | any, frame?: string | number): BitmapMask;
    createGeometryMask(graphics?: any): GeometryMask;
}

export const Mask = {

    mask: null,

    setMask(this: any, mask: BitmapMask | GeometryMask): any {
        this.mask = mask;
        return this;
    },

    clearMask(this: any, destroyMask: boolean = false): any {
        if (destroyMask && this.mask) {
            this.mask.destroy();
        }
        this.mask = null;
        return this;
    },

    createBitmapMask(this: any, maskObject?: any, x?: number, y?: number, texture?: string | any, frame?: string | number): BitmapMask {
        if (maskObject === undefined && (this.texture || this.shader || this.geom)) {
            maskObject = this;
        }
        return new BitmapMask(this.scene, maskObject, x, y, texture, frame);
    },

    createGeometryMask(this: any, graphics?: any): GeometryMask {
        if (graphics === undefined && (this.type === 'Graphics' || this.geom)) {
            graphics = this;
        }
        return new GeometryMask(this.scene, graphics);
    }
};
