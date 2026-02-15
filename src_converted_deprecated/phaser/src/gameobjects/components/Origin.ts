/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the origin of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface Origin {
    _originComponent: boolean;
    originX: number;
    originY: number;
    _displayOriginX: number;
    _displayOriginY: number;
    displayOriginX: number;
    displayOriginY: number;
    width: number;
    height: number;
    frame: any;
    setOrigin(x?: number, y?: number): this;
    setOriginFromFrame(): this;
    setDisplayOrigin(x?: number, y?: number): this;
    updateDisplayOrigin(): this;
}

export const Origin = {

    _originComponent: true,
    originX: 0.5,
    originY: 0.5,
    _displayOriginX: 0,
    _displayOriginY: 0,

    displayOriginX: {
        get(this: any): number {
            return this._displayOriginX;
        },

        set(this: any, value: number): void {
            this._displayOriginX = value;
            this.originX = value / this.width;
        }
    },

    displayOriginY: {
        get(this: any): number {
            return this._displayOriginY;
        },

        set(this: any, value: number): void {
            this._displayOriginY = value;
            this.originY = value / this.height;
        }
    },

    setOrigin(this: any, x: number = 0.5, y?: number): any {
        if (y === undefined) { y = x; }
        this.originX = x;
        this.originY = y;
        return this.updateDisplayOrigin();
    },

    setOriginFromFrame(this: any): any {
        if (!this.frame || !this.frame.customPivot) {
            return this.setOrigin();
        } else {
            this.originX = this.frame.pivotX;
            this.originY = this.frame.pivotY;
        }
        return this.updateDisplayOrigin();
    },

    setDisplayOrigin(this: any, x: number = 0, y?: number): any {
        if (y === undefined) { y = x; }
        this.displayOriginX = x;
        this.displayOriginY = y;
        return this;
    },

    updateDisplayOrigin(this: any): any {
        this._displayOriginX = this.originX * this.width;
        this._displayOriginY = this.originY * this.height;
        return this;
    }
};
