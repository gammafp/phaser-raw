/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
