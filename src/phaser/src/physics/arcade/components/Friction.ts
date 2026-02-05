/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const Friction = {

    setFriction(this: any, x: number, y?: number): any
    {
        this.body.friction.set(x, y);

        return this;
    },

    setFrictionX(this: any, x: number): any
    {
        this.body.friction.x = x;

        return this;
    },

    setFrictionY(this: any, y: number): any
    {
        this.body.friction.y = y;

        return this;
    }

};
