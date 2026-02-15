/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const _FLAG = 1; // 0001 - bitmask flag for GameObject.renderMask

/**
 * Provides methods used for setting the visibility of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface Visible {
    _visible: boolean;
    visible: boolean;
    renderFlags: number;
    setVisible(value: boolean): this;
}

export const Visible = {

    _visible: true,

    visible: {
        get(this: any): boolean {
            return this._visible;
        },

        set(this: any, value: boolean): void {
            if (value) {
                this._visible = true;
                this.renderFlags |= _FLAG;
            } else {
                this._visible = false;
                this.renderFlags &= ~_FLAG;
            }
        }
    },

    setVisible(this: any, value: boolean): any {
        this.visible = value;
        return this;
    }
};
