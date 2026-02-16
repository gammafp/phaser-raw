/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the angular acceleration properties of an Arcade Physics Body.
 */
export interface Angular {
    setAngularVelocity(value: number): this;
    setAngularAcceleration(value: number): this;
    setAngularDrag(value: number): this;
}

export const Angular = {

    setAngularVelocity(this: any, value: number): any
    {
        this.body.angularVelocity = value;

        return this;
    },

    setAngularAcceleration(this: any, value: number): any
    {
        this.body.angularAcceleration = value;

        return this;
    },

    setAngularDrag(this: any, value: number): any
    {
        this.body.angularDrag = value;

        return this;
    }

};
