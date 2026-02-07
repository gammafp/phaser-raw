/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for calculating and setting the size of a non-Frame based Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface ComputedSize {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
    scaleX: number;
    scaleY: number;
    setSize(width: number, height: number): this;
    setDisplaySize(width: number, height: number): this;
}

export const ComputedSize = {

    width: 0,
    height: 0,

    displayWidth: {
        get(this: any): number {
            return this.scaleX * this.width;
        },

        set(this: any, value: number): void {
            this.scaleX = value / this.width;
        }
    },

    displayHeight: {
        get(this: any): number {
            return this.scaleY * this.height;
        },

        set(this: any, value: number): void {
            this.scaleY = value / this.height;
        }
    },

    setSize(this: any, width: number, height: number): any {
        this.width = width;
        this.height = height;
        return this;
    },

    setDisplaySize(this: any, width: number, height: number): any {
        this.displayWidth = width;
        this.displayHeight = height;
        return this;
    }
};
