/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const GetCollidesWith = require('../GetCollidesWith');

export const Collision = {

    setCollisionCategory(this: any, category: number): any
    {
        var target = (this.body) ? this.body : this;

        target.collisionCategory = category;

        return this;
    },

    willCollideWith(this: any, category: number): boolean
    {
        var target = (this.body) ? this.body : this;

        return (target.collisionMask & category) !== 0;
    },

    addCollidesWith(this: any, category: number): any
    {
        var target = (this.body) ? this.body : this;

        target.collisionMask = target.collisionMask | category;

        return this;
    },

    removeCollidesWith(this: any, category: number): any
    {
        var target = (this.body) ? this.body : this;

        target.collisionMask = target.collisionMask & ~category;

        return this;
    },

    setCollidesWith(this: any, categories: number | number[]): any
    {
        var target = (this.body) ? this.body : this;

        target.collisionMask = GetCollidesWith(categories);

        return this;
    },

    resetCollisionCategory(this: any): any
    {
        var target = (this.body) ? this.body : this;

        target.collisionCategory = 0x0001;
        target.collisionMask = 2147483647;

        return this;
    }

};
