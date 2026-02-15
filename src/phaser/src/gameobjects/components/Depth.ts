/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import * as ArrayUtils from '../../utils/array';

/**
 * Provides methods used for setting the depth of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Depth
 * @since 3.0.0
 */

export interface Depth {
    _depth: number;
    displayList: any;
    depth: number;
    setDepth(value?: number): this;
    setToTop(): this;
    setToBack(): this;
    setAbove(gameObject: any): this;
    setBelow(gameObject: any): this;
    getDisplayList(): any;
}

export const Depth = {

    /**
     * Private internal value. Holds the depth of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Depth#_depth
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    _depth: 0,

    /**
     * The depth of this Game Object within the Scene. Ensure this value is only ever set to a number data-type.
     *
     * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
     * of Game Objects, without actually moving their position in the display list.
     *
     * The default depth is zero. A Game Object with a higher depth
     * value will always render in front of one with a lower value.
     *
     * Setting the depth will queue a depth sort event within the Scene.
     *
     * @name Phaser.GameObjects.Components.Depth#depth
     * @type {number}
     * @since 3.0.0
     */
    get depth(): number
    {
        return this._depth;
    },

    set depth(value: number)
    {
        if (this.displayList)
        {
            this.displayList.queueDepthSort();
        }

        this._depth = value;
    },

    /**
     * The depth of this Game Object within the Scene.
     *
     * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
     * of Game Objects, without actually moving their position in the display list.
     *
     * The default depth is zero. A Game Object with a higher depth
     * value will always render in front of one with a lower value.
     *
     * Setting the depth will queue a depth sort event within the Scene.
     *
     * @method Phaser.GameObjects.Components.Depth#setDepth
     * @since 3.0.0
     *
     * @param {number} value - The depth of this Game Object. Ensure this value is only ever a number data-type.
     *
     * @return {this} This Game Object instance.
     */
    setDepth(this: any, value?: number): any
    {
        if (value === undefined) { value = 0; }

        this.depth = value;

        return this;
    },

    /**
     * Sets this Game Object to be at the top of the display list, or the top of its parent container.
     * 
     * Being at the top means it will render on-top of everything else.
     * 
     * This method does not change this Game Objects `depth` value, it simply alters its list position.
     *
     * @method Phaser.GameObjects.Components.Depth#setToTop
     * @since 3.85.0
     * 
     * @return {this} This Game Object instance.
     */
    setToTop(this: any): any
    {
        const list = this.getDisplayList();

        if (list)
        {
            ArrayUtils.BringToTop(list, this);
        }

        return this;
    },

    /**
     * Sets this Game Object to the back of the display list, or the back of its parent container.
     * 
     * Being at the back means it will render below everything else.
     * 
     * This method does not change this Game Objects `depth` value, it simply alters its list position.
     *
     * @method Phaser.GameObjects.Components.Depth#setToBack
     * @since 3.85.0
     * 
     * @return {this} This Game Object instance.
     */
    setToBack(this: any): any
    {
        const list = this.getDisplayList();

        if (list)
        {
            ArrayUtils.SendToBack(list, this);
        }

        return this;
    },

    /**
     * Move this Game Object so that it appears above the given Game Object.
     * 
     * This means it will render immediately after the other object in the display list.
     * 
     * Both objects must belong to the same display list, or parent container.
     * 
     * This method does not change this Game Objects `depth` value, it simply alters its list position.
     *
     * @method Phaser.GameObjects.Components.Depth#setAbove
     * @since 3.85.0
     * 
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that this Game Object will be moved to be above.
     * 
     * @return {this} This Game Object instance.
     */
    setAbove(this: any, gameObject: any): any
    {
        const list = this.getDisplayList();

        if (list && gameObject)
        {
            ArrayUtils.MoveAbove(list, this, gameObject);
        }

        return this;
    },

    /**
     * Move this Game Object so that it appears below the given Game Object.
     * 
     * This means it will render immediately under the other object in the display list.
     * 
     * Both objects must belong to the same display list, or parent container.
     * 
     * This method does not change this Game Objects `depth` value, it simply alters its list position.
     *
     * @method Phaser.GameObjects.Components.Depth#setBelow
     * @since 3.85.0
     * 
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that this Game Object will be moved to be below.
     * 
     * @return {this} This Game Object instance.
     */
    setBelow(this: any, gameObject: any): any
    {
        const list = this.getDisplayList();

        if (list && gameObject)
        {
            ArrayUtils.MoveBelow(list, this, gameObject);
        }

        return this;
    }

};
