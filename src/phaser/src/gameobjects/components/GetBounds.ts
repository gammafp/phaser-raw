/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RotateAround } from '../../math/RotateAround';
import { Vector2 } from '../../math/Vector2';

import { Rectangle } from '../../geom/rectangle/Rectangle';

/**
 * Provides methods used for obtaining the bounds of a Game Object.
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
    getCenter(output?: Vector2, includeParent?: boolean): Vector2;
    getTopLeft(output?: Vector2, includeParent?: boolean): Vector2;
    getTopCenter(output?: Vector2, includeParent?: boolean): Vector2;
    getTopRight(output?: Vector2, includeParent?: boolean): Vector2;
    getLeftCenter(output?: Vector2, includeParent?: boolean): Vector2;
    getRightCenter(output?: Vector2, includeParent?: boolean): Vector2;
    getBottomLeft(output?: Vector2, includeParent?: boolean): Vector2;
    getBottomCenter(output?: Vector2, includeParent?: boolean): Vector2;
    getBottomRight(output?: Vector2, includeParent?: boolean): Vector2;
    getBounds(output?: any): any;
}

export const GetBounds = {

    prepareBoundsOutput(this: any, output: any, includeParent: boolean = false): any {
        if (this.rotation !== 0) {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer) {
            const parentMatrix = this.parentContainer.getBoundsTransformMatrix();
            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    getCenter(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (output === undefined) { output = new Vector2(); }
        output.x = this.x - (this.displayWidth * this.originX) + (this.displayWidth / 2);
        output.y = this.y - (this.displayHeight * this.originY) + (this.displayHeight / 2);
        return this.prepareBoundsOutput(output, includeParent);
    },

    getTopLeft(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (!output) { output = new Vector2(); }
        output.x = this.x - (this.displayWidth * this.originX);
        output.y = this.y - (this.displayHeight * this.originY);
        return this.prepareBoundsOutput(output, includeParent);
    },

    getTopCenter(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (!output) { output = new Vector2(); }
        output.x = (this.x - (this.displayWidth * this.originX)) + (this.displayWidth / 2);
        output.y = this.y - (this.displayHeight * this.originY);
        return this.prepareBoundsOutput(output, includeParent);
    },

    getTopRight(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (!output) { output = new Vector2(); }
        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = this.y - (this.displayHeight * this.originY);
        return this.prepareBoundsOutput(output, includeParent);
    },

    getLeftCenter(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (!output) { output = new Vector2(); }
        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + (this.displayHeight / 2);
        return this.prepareBoundsOutput(output, includeParent);
    },

    getRightCenter(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (!output) { output = new Vector2(); }
        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + (this.displayHeight / 2);
        return this.prepareBoundsOutput(output, includeParent);
    },

    getBottomLeft(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (!output) { output = new Vector2(); }
        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;
        return this.prepareBoundsOutput(output, includeParent);
    },

    getBottomCenter(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (!output) { output = new Vector2(); }
        output.x = (this.x - (this.displayWidth * this.originX)) + (this.displayWidth / 2);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;
        return this.prepareBoundsOutput(output, includeParent);
    },

    getBottomRight(this: any, output?: Vector2, includeParent?: boolean): Vector2 {
        if (!output) { output = new Vector2(); }
        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;
        return this.prepareBoundsOutput(output, includeParent);
    },

    getBounds(this: any, output?: any): any {
        if (output === undefined) { output = new Rectangle(); }

        let TLx, TLy, TRx, TRy, BLx, BLy, BRx, BRy;

        if (this.parentContainer) {
            const parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            this.getTopLeft(output);
            parentMatrix.transformPoint(output.x, output.y, output);
            TLx = output.x; TLy = output.y;

            this.getTopRight(output);
            parentMatrix.transformPoint(output.x, output.y, output);
            TRx = output.x; TRy = output.y;

            this.getBottomLeft(output);
            parentMatrix.transformPoint(output.x, output.y, output);
            BLx = output.x; BLy = output.y;

            this.getBottomRight(output);
            parentMatrix.transformPoint(output.x, output.y, output);
            BRx = output.x; BRy = output.y;
        } else {
            this.getTopLeft(output);
            TLx = output.x; TLy = output.y;

            this.getTopRight(output);
            TRx = output.x; TRy = output.y;

            this.getBottomLeft(output);
            BLx = output.x; BLy = output.y;

            this.getBottomRight(output);
            BRx = output.x; BRy = output.y;
        }

        output.x = Math.min(TLx, TRx, BLx, BRx);
        output.y = Math.min(TLy, TRy, BLy, BRy);
        output.width = Math.max(TLx, TRx, BLx, BRx) - output.x;
        output.height = Math.max(TLy, TRy, BLy, BRy) - output.y;

        return output;
    }
};
