/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Clamp } from '../../math/Clamp';

const _FLAG = 2; // 0010 - bitmask flag for GameObject.renderMask

/**
 * Provides methods used for setting the alpha property of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface AlphaSingle {
    _alpha: number;
    alpha: number;
    renderFlags: number;
    clearAlpha(): this;
    setAlpha(value?: number): this;
}

export const AlphaSingle = {

    _alpha: 1,

    clearAlpha(this: any): any {
        return this.setAlpha(1);
    },

    setAlpha(this: any, value: number = 1): any {
        this.alpha = value;
        return this;
    },

    alpha: {
        get(this: any): number {
            return this._alpha;
        },

        set(this: any, value: number): void {
            const v = Clamp(value, 0, 1);
            this._alpha = v;

            if (v === 0) {
                this.renderFlags &= ~_FLAG;
            } else {
                this.renderFlags |= _FLAG;
            }
        }
    }
};
