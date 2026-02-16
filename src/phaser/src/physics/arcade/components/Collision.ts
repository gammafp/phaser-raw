/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetCollidesWith } from '../GetCollidesWith';

/**
 * Provides methods used for setting the collision category and mask of an Arcade Physics Body.
 */
export interface Collision {
    setCollisionCategory(category: number): this;
    willCollideWith(category: number): boolean;
    addCollidesWith(category: number): this;
    removeCollidesWith(category: number): this;
    setCollidesWith(categories: number | number[]): this;
    resetCollisionCategory(): this;
}

export const Collision = {

    setCollisionCategory(this: any, category: number): any
    {
        const target = (this.body) ? this.body : this;

        target.collisionCategory = category;

        return this;
    },

    willCollideWith(this: any, category: number): boolean
    {
        const target = (this.body) ? this.body : this;

        return (target.collisionMask & category) !== 0;
    },

    addCollidesWith(this: any, category: number): any
    {
        const target = (this.body) ? this.body : this;

        target.collisionMask = target.collisionMask | category;

        return this;
    },

    removeCollidesWith(this: any, category: number): any
    {
        const target = (this.body) ? this.body : this;

        target.collisionMask = target.collisionMask & ~category;

        return this;
    },

    setCollidesWith(this: any, categories: number | number[]): any
    {
        const target = (this.body) ? this.body : this;

        target.collisionMask = GetCollidesWith(categories);

        return this;
    },

    resetCollisionCategory(this: any): any
    {
        const target = (this.body) ? this.body : this;

        target.collisionCategory = 0x0001;
        target.collisionMask = 2147483647;

        return this;
    }

};
