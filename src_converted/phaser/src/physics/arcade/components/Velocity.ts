/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for modifying the velocity of an Arcade Physics body.
 *
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.Physics.Arcade.Components.Velocity
 * @since 3.0.0
 */
export const Velocity = {

    setVelocity(this: any, x: number, y?: number): any
    {
        this.body.setVelocity(x, y);

        return this;
    },

    setVelocityX(this: any, x: number): any
    {
        this.body.setVelocityX(x);

        return this;
    },

    setVelocityY(this: any, y: number): any
    {
        this.body.setVelocityY(y);

        return this;
    },

    setMaxVelocity(this: any, x: number, y?: number): any
    {
        this.body.maxVelocity.set(x, y);

        return this;
    }

};
