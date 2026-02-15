/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Rectangle } from '../../geom/rectangle/Rectangle';
import { RotateAround } from '../../math/RotateAround';
import { Vector2 } from '../../math/Vector2';

/**
 * Provides methods used for obtaining the bounds of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.GetBounds
 * @since 3.0.0
 */

export interface GetBounds {
    x: number;
    y: number;
    rotation: number;
    displayWidth: number;
    displayHeight: number;
    originX: number;
    originY: number;
    parentContainer: any;
    prepareBoundsOutput(output: any, includeParent?: boolean): any;
    getCenter(output?: any, includeParent?: boolean): any;
    getTopLeft(output?: any, includeParent?: boolean): any;
    getTopCenter(output?: any, includeParent?: boolean): any;
    getTopRight(output?: any, includeParent?: boolean): any;
    getLeftCenter(output?: any, includeParent?: boolean): any;
    getRightCenter(output?: any, includeParent?: boolean): any;
    getBottomLeft(output?: any, includeParent?: boolean): any;
    getBottomCenter(output?: any, includeParent?: boolean): any;
    getBottomRight(output?: any, includeParent?: boolean): any;
    getBounds(output?: any): any;
}

export const GetBounds = {

    /**
     * Processes the bounds output vector before returning it.
     *
     * @method Phaser.GameObjects.Components.GetBounds#prepareBoundsOutput
     * @private
     * @since 3.18.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} output - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    prepareBoundsOutput(this: any, output: any, includeParent?: boolean): any
    {
        if (includeParent === undefined) { includeParent = false; }

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            const parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    /**
     * Gets the center coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getCenter
     * @since 3.0.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getCenter(this: any, output?: any, includeParent?: boolean): any
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX) + (this.displayWidth / 2);
        output.y = this.y - (this.displayHeight * this.originY) + (this.displayHeight / 2);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the top-left corner coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getTopLeft
     * @since 3.0.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getTopLeft(this: any, output?: any, includeParent?: boolean): any
    {
        if (!output) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = this.y - (this.displayHeight * this.originY);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the top-center coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getTopCenter
     * @since 3.18.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getTopCenter(this: any, output?: any, includeParent?: boolean): any
    {
        if (!output) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + (this.displayWidth / 2);
        output.y = this.y - (this.displayHeight * this.originY);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the top-right corner coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getTopRight
     * @since 3.0.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getTopRight(this: any, output?: any, includeParent?: boolean): any
    {
        if (!output) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = this.y - (this.displayHeight * this.originY);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the left-center coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getLeftCenter
     * @since 3.18.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getLeftCenter(this: any, output?: any, includeParent?: boolean): any
    {
        if (!output) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + (this.displayHeight / 2);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the right-center coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getRightCenter
     * @since 3.18.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getRightCenter(this: any, output?: any, includeParent?: boolean): any
    {
        if (!output) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + (this.displayHeight / 2);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the bottom-left corner coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBottomLeft
     * @since 3.0.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getBottomLeft(this: any, output?: any, includeParent?: boolean): any
    {
        if (!output) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the bottom-center coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBottomCenter
     * @since 3.18.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getBottomCenter(this: any, output?: any, includeParent?: boolean): any
    {
        if (!output) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + (this.displayWidth / 2);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the bottom-right corner coordinate of this Game Object, regardless of origin.
     *
     * The returned point is calculated in local space and does not factor in any parent Containers,
     * unless the `includeParent` argument is set to `true`.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBottomRight
     * @since 3.0.0
     *
     * @generic {Phaser.Types.Math.Vector2Like} O - [output,$return]
     *
     * @param {Phaser.Types.Math.Vector2Like} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {Phaser.Types.Math.Vector2Like} The values stored in the output object.
     */
    getBottomRight(this: any, output?: any, includeParent?: boolean): any
    {
        if (!output) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the bounds of this Game Object, regardless of origin.
     *
     * The values are stored and returned in a Rectangle, or Rectangle-like, object.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBounds
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Rectangle} O - [output,$return]
     *
     * @param {(Phaser.Geom.Rectangle|object)} [output] - An object to store the values in. If not provided a new Rectangle will be created.
     *
     * @return {(Phaser.Geom.Rectangle|object)} The values stored in the output object.
     */
    getBounds(this: any, output?: any): any
    {
        if (output === undefined) { output = new Rectangle(); }

        //  We can use the output object to temporarily store the x/y coords in:

        let TLx: number, TLy: number, TRx: number, TRy: number, BLx: number, BLy: number, BRx: number, BRy: number;

        // Instead of doing a check if parent container is
        // defined per corner we only do it once.
        if (this.parentContainer)
        {
            const parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            this.getTopLeft(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            TLx = output.x;
            TLy = output.y;

            this.getTopRight(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            TRx = output.x;
            TRy = output.y;

            this.getBottomLeft(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            BLx = output.x;
            BLy = output.y;

            this.getBottomRight(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            BRx = output.x;
            BRy = output.y;
        }
        else
        {
            this.getTopLeft(output);

            TLx = output.x;
            TLy = output.y;

            this.getTopRight(output);

            TRx = output.x;
            TRy = output.y;

            this.getBottomLeft(output);

            BLx = output.x;
            BLy = output.y;

            this.getBottomRight(output);

            BRx = output.x;
            BRy = output.y;
        }

        output.x = Math.min(TLx, TRx, BLx, BRx);
        output.y = Math.min(TLy, TRy, BLy, BRy);
        output.width = Math.max(TLx, TRx, BLx, BRx) - output.x;
        output.height = Math.max(TLy, TRy, BLy, BRy) - output.y;

        return output;
    }

};
