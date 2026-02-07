/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for visually flipping a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface Flip {
    flipX: boolean;
    flipY: boolean;
    toggleFlipX(): this;
    toggleFlipY(): this;
    setFlipX(value: boolean): this;
    setFlipY(value: boolean): this;
    setFlip(x: boolean, y: boolean): this;
    resetFlip(): this;
}

export const Flip = {

    flipX: false,
    flipY: false,

    toggleFlipX(this: any): any {
        this.flipX = !this.flipX;
        return this;
    },

    toggleFlipY(this: any): any {
        this.flipY = !this.flipY;
        return this;
    },

    setFlipX(this: any, value: boolean): any {
        this.flipX = value;
        return this;
    },

    setFlipY(this: any, value: boolean): any {
        this.flipY = value;
        return this;
    },

    setFlip(this: any, x: boolean, y: boolean): any {
        this.flipX = x;
        this.flipY = y;
        return this;
    },

    resetFlip(this: any): any {
        this.flipX = false;
        this.flipY = false;
        return this;
    }
};
