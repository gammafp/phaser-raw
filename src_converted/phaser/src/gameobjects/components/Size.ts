/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the size of a Game Object.
 */
export interface Size {
    _sizeComponent: boolean;
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
    scaleX: number;
    scaleY: number;
    frame: any;
    input: any;
    setSizeToFrame(frame?: any): this;
    setSize(width: number, height: number): this;
    setDisplaySize(width: number, height: number): this;
}

export const Size = {

    _sizeComponent: true,
    width: 0,
    height: 0,

    displayWidth: {
        get(this: any): number {
            return Math.abs(this.scaleX * this.frame.realWidth);
        },

        set(this: any, value: number): void {
            this.scaleX = value / this.frame.realWidth;
        }
    },

    displayHeight: {
        get(this: any): number {
            return Math.abs(this.scaleY * this.frame.realHeight);
        },

        set(this: any, value: number): void {
            this.scaleY = value / this.frame.realHeight;
        }
    },

    setSizeToFrame(this: any, frame?: any): any {
        if (!frame) { frame = this.frame; }
        this.width = frame.realWidth;
        this.height = frame.realHeight;

        const input = this.input;
        if (input && !input.customHitArea) {
            input.hitArea.width = this.width;
            input.hitArea.height = this.height;
        }
        return this;
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
