/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for setting the gravity properties of an Arcade Physics Game Object.
 * Should be applied as a mixin and not used directly.
 */
export interface Gravity {
    setGravity(x: number, y?: number): this;
    setGravityX(x: number): this;
    setGravityY(y: number): this;
}

export const Gravity = {

    setGravity(this: any, x: number, y?: number): any
    {
        this.body.gravity.set(x, y);

        return this;
    },

    setGravityX(this: any, x: number): any
    {
        this.body.gravity.x = x;

        return this;
    },

    setGravityY(this: any, y: number): any
    {
        this.body.gravity.y = y;

        return this;
    }

};
