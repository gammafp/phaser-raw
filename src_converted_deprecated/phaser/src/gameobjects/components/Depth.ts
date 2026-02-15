/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const ArrayUtils = require('../../utils/array');

/**
 * Provides methods used for setting the depth of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface Depth {
    _depth: number;
    depth: number;
    displayList: any;
    setDepth(value: number): this;
    setToTop(): this;
    setToBack(): this;
    setAbove(gameObject: any): this;
    setBelow(gameObject: any): this;
    getDisplayList(): any;
}

export const Depth = {

    _depth: 0,

    depth: {
        get(this: any): number {
            return this._depth;
        },

        set(this: any, value: number): void {
            if (this.displayList) {
                this.displayList.queueDepthSort();
            }
            this._depth = value;
        }
    },

    setDepth(this: any, value: number = 0): any {
        this.depth = value;
        return this;
    },

    setToTop(this: any): any {
        const list = this.getDisplayList();
        if (list) {
            ArrayUtils.BringToTop(list, this);
        }
        return this;
    },

    setToBack(this: any): any {
        const list = this.getDisplayList();
        if (list) {
            ArrayUtils.SendToBack(list, this);
        }
        return this;
    },

    setAbove(this: any, gameObject: any): any {
        const list = this.getDisplayList();
        if (list && gameObject) {
            ArrayUtils.MoveAbove(list, this, gameObject);
        }
        return this;
    },

    setBelow(this: any, gameObject: any): any {
        const list = this.getDisplayList();
        if (list && gameObject) {
            ArrayUtils.MoveBelow(list, this, gameObject);
        }
        return this;
    }
};
