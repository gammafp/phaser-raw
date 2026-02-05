/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const Drag = {

    setDrag(this: any, x: number, y?: number): any
    {
        this.body.drag.set(x, y);

        return this;
    },

    setDragX(this: any, value: number): any
    {
        this.body.drag.x = value;

        return this;
    },

    setDragY(this: any, value: number): any
    {
        this.body.drag.y = value;

        return this;
    },

    setDamping(this: any, value: boolean): any
    {
        this.body.useDamping = value;

        return this;
    }

};
