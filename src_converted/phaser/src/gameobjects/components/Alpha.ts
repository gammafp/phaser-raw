/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Clamp } from '../../math/Clamp';

const _FLAG = 2; // 0010 - bitmask flag for GameObject.renderMask

/**
 * Provides methods used for setting the alpha properties of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface Alpha {
    _alpha: number;
    _alphaTL: number;
    _alphaTR: number;
    _alphaBL: number;
    _alphaBR: number;
    alpha: number;
    alphaTopLeft: number;
    alphaTopRight: number;
    alphaBottomLeft: number;
    alphaBottomRight: number;
    renderFlags: number;
    clearAlpha(): this;
    setAlpha(topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this;
}

export const Alpha = {

    _alpha: 1,
    _alphaTL: 1,
    _alphaTR: 1,
    _alphaBL: 1,
    _alphaBR: 1,

    clearAlpha(this: any): any {
        return this.setAlpha(1);
    },

    setAlpha(this: any, topLeft: number = 1, topRight?: number, bottomLeft?: number, bottomRight?: number): any {
        if (topRight === undefined) {
            this.alpha = topLeft;
        } else {
            this._alphaTL = Clamp(topLeft, 0, 1);
            this._alphaTR = Clamp(topRight, 0, 1);
            this._alphaBL = Clamp(bottomLeft!, 0, 1);
            this._alphaBR = Clamp(bottomRight!, 0, 1);
        }
        return this;
    },

    alpha: {
        get(this: any): number {
            return this._alpha;
        },

        set(this: any, value: number): void {
            const v = Clamp(value, 0, 1);
            this._alpha = v;
            this._alphaTL = v;
            this._alphaTR = v;
            this._alphaBL = v;
            this._alphaBR = v;

            if (v === 0) {
                this.renderFlags &= ~_FLAG;
            } else {
                this.renderFlags |= _FLAG;
            }
        }
    },

    alphaTopLeft: {
        get(this: any): number {
            return this._alphaTL;
        },

        set(this: any, value: number): void {
            const v = Clamp(value, 0, 1);
            this._alphaTL = v;
            if (v !== 0) {
                this.renderFlags |= _FLAG;
            }
        }
    },

    alphaTopRight: {
        get(this: any): number {
            return this._alphaTR;
        },

        set(this: any, value: number): void {
            const v = Clamp(value, 0, 1);
            this._alphaTR = v;
            if (v !== 0) {
                this.renderFlags |= _FLAG;
            }
        }
    },

    alphaBottomLeft: {
        get(this: any): number {
            return this._alphaBL;
        },

        set(this: any, value: number): void {
            const v = Clamp(value, 0, 1);
            this._alphaBL = v;
            if (v !== 0) {
                this.renderFlags |= _FLAG;
            }
        }
    },

    alphaBottomRight: {
        get(this: any): number {
            return this._alphaBR;
        },

        set(this: any, value: number): void {
            const v = Clamp(value, 0, 1);
            this._alphaBR = v;
            if (v !== 0) {
                this.renderFlags |= _FLAG;
            }
        }
    }
};
