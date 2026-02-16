/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Methods for setting the friction of an Arcade Physics Body.
 *
 * In Arcade Physics, friction is a special case of motion transfer from an "immovable" body to a riding body.
 */
export interface Friction {
    setFriction(x: number, y?: number): this;
    setFrictionX(x: number): this;
    setFrictionY(y: number): this;
}

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
