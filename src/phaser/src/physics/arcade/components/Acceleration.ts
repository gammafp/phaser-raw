/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the acceleration properties of an Arcade Physics Body.
 */
export interface Acceleration {
    setAcceleration(x: number, y?: number): this;
    setAccelerationX(value: number): this;
    setAccelerationY(value: number): this;
}

export const Acceleration = {

    setAcceleration(this: any, x: number, y?: number): any
    {
        this.body.acceleration.set(x, y);

        return this;
    },

    setAccelerationX(this: any, value: number): any
    {
        this.body.acceleration.x = value;

        return this;
    },

    setAccelerationY(this: any, value: number): any
    {
        this.body.acceleration.y = value;

        return this;
    }

};
