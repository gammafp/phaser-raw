/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for setting the size of an Arcade Physics Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface Size {
    setOffset(x: number, y?: number): this;
    setSize(width: number, height: number, center?: boolean): this;
    setBodySize(width: number, height: number, center?: boolean): this;
    setCircle(radius: number, offsetX?: number, offsetY?: number): this;
}

export const Size = {

    setOffset(this: any, x: number, y?: number): any
    {
        this.body.setOffset(x, y);

        return this;
    },

    setSize(this: any, width: number, height: number, center?: boolean): any
    {
        this.body.setSize(width, height, center);

        return this;
    },

    setBodySize(this: any, width: number, height: number, center?: boolean): any
    {
        this.body.setSize(width, height, center);

        return this;
    },

    setCircle(this: any, radius: number, offsetX?: number, offsetY?: number): any
    {
        this.body.setCircle(radius, offsetX, offsetY);

        return this;
    }

};
