/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
