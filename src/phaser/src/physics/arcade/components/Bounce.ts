/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const Bounce = {

    setBounce(this: any, x: number, y?: number): any
    {
        this.body.bounce.set(x, y);

        return this;
    },

    setBounceX(this: any, value: number): any
    {
        this.body.bounce.x = value;

        return this;
    },

    setBounceY(this: any, value: number): any
    {
        this.body.bounce.y = value;

        return this;
    },

    setCollideWorldBounds(this: any, value?: boolean, bounceX?: number, bounceY?: number, onWorldBounds?: boolean): any
    {
        this.body.setCollideWorldBounds(value, bounceX, bounceY, onWorldBounds);

        return this;
    }

};
