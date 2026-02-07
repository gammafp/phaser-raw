/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const BlendModes = require('../../renderer/BlendModes');

/**
 * Provides methods used for setting the blend mode of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface BlendMode {
    _blendMode: number;
    blendMode: number | string;
    setBlendMode(value: number | string): this;
}

export const BlendMode = {

    _blendMode: BlendModes.NORMAL,

    blendMode: {
        get(this: any): number {
            return this._blendMode;
        },

        set(this: any, value: number | string): void {
            if (typeof value === 'string') {
                value = BlendModes[value];
            }
            value |= 0;
            if (value >= -1) {
                this._blendMode = value;
            }
        }
    },

    setBlendMode(this: any, value: number | string): any {
        this.blendMode = value;
        return this;
    }
};
