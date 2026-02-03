/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { MATH_CONST } from '../../math/const';
import { Wrap as WrapAngle } from '../../math/angle/Wrap';
import { WrapDegrees as WrapAngleDegrees } from '../../math/angle/WrapDegrees';
import { TransformXY } from '../../math/TransformXY';
import { Vector2 } from '../../math/Vector2';

const TransformMatrix = require('./TransformMatrix');

const _FLAG = 4; // 0100 - bitmask flag for GameObject.renderMask

/**
 * Provides methods used for getting and setting the position, scale and rotation of a Game Object.
 */
export interface Transform {
    hasTransformComponent: boolean;
    _scaleX: number;
    _scaleY: number;
    _rotation: number;
    x: number;
    y: number;
    z: number;
    w: number;
    scale: number;
    scaleX: number;
    scaleY: number;
    angle: number;
    rotation: number;
    renderFlags: number;
    scene: any;
    parentContainer: any;
    scrollFactorX: number;
    scrollFactorY: number;
    setPosition(x?: number, y?: number, z?: number, w?: number): this;
    copyPosition(source: any): this;
    setRandomPosition(x?: number, y?: number, width?: number, height?: number): this;
    setRotation(radians?: number): this;
    setAngle(degrees?: number): this;
    setScale(x?: number, y?: number): this;
    setX(value?: number): this;
    setY(value?: number): this;
    setZ(value?: number): this;
    setW(value?: number): this;
    getLocalTransformMatrix(tempMatrix?: any): any;
    getWorldTransformMatrix(tempMatrix?: any, parentMatrix?: any): any;
    getLocalPoint(x: number, y: number, point?: Vector2, camera?: any): Vector2;
    getWorldPoint(point?: Vector2, tempMatrix?: any, parentMatrix?: any): Vector2;
    getParentRotation(): number;
}

export const Transform = {

    hasTransformComponent: true,
    _scaleX: 1,
    _scaleY: 1,
    _rotation: 0,
    x: 0,
    y: 0,
    z: 0,
    w: 0,

    scale: {
        get(this: any): number {
            return (this._scaleX + this._scaleY) / 2;
        },

        set(this: any, value: number): void {
            this._scaleX = value;
            this._scaleY = value;

            if (value === 0) {
                this.renderFlags &= ~_FLAG;
            } else {
                this.renderFlags |= _FLAG;
            }
        }
    },

    scaleX: {
        get(this: any): number {
            return this._scaleX;
        },

        set(this: any, value: number): void {
            this._scaleX = value;

            if (value === 0) {
                this.renderFlags &= ~_FLAG;
            } else if (this._scaleY !== 0) {
                this.renderFlags |= _FLAG;
            }
        }
    },

    scaleY: {
        get(this: any): number {
            return this._scaleY;
        },

        set(this: any, value: number): void {
            this._scaleY = value;

            if (value === 0) {
                this.renderFlags &= ~_FLAG;
            } else if (this._scaleX !== 0) {
                this.renderFlags |= _FLAG;
            }
        }
    },

    angle: {
        get(this: any): number {
            return WrapAngleDegrees(this._rotation * MATH_CONST.RAD_TO_DEG);
        },

        set(this: any, value: number): void {
            this.rotation = WrapAngleDegrees(value) * MATH_CONST.DEG_TO_RAD;
        }
    },

    rotation: {
        get(this: any): number {
            return this._rotation;
        },

        set(this: any, value: number): void {
            this._rotation = WrapAngle(value);
        }
    },

    setPosition(this: any, x: number = 0, y?: number, z: number = 0, w: number = 0): any {
        if (y === undefined) { y = x; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    },

    copyPosition(this: any, source: any): any {
        if (source.x !== undefined) { this.x = source.x; }
        if (source.y !== undefined) { this.y = source.y; }
        if (source.z !== undefined) { this.z = source.z; }
        if (source.w !== undefined) { this.w = source.w; }
        return this;
    },

    setRandomPosition(this: any, x: number = 0, y: number = 0, width?: number, height?: number): any {
        if (width === undefined) { width = this.scene.sys.scale.width; }
        if (height === undefined) { height = this.scene.sys.scale.height; }
        this.x = x + (Math.random() * width);
        this.y = y + (Math.random() * height);
        return this;
    },

    setRotation(this: any, radians: number = 0): any {
        this.rotation = radians;
        return this;
    },

    setAngle(this: any, degrees: number = 0): any {
        this.angle = degrees;
        return this;
    },

    setScale(this: any, x: number = 1, y?: number): any {
        if (y === undefined) { y = x; }
        this.scaleX = x;
        this.scaleY = y;
        return this;
    },

    setX(this: any, value: number = 0): any {
        this.x = value;
        return this;
    },

    setY(this: any, value: number = 0): any {
        this.y = value;
        return this;
    },

    setZ(this: any, value: number = 0): any {
        this.z = value;
        return this;
    },

    setW(this: any, value: number = 0): any {
        this.w = value;
        return this;
    },

    getLocalTransformMatrix(this: any, tempMatrix?: any): any {
        if (tempMatrix === undefined) { tempMatrix = new TransformMatrix(); }
        return tempMatrix.applyITRS(this.x, this.y, this._rotation, this._scaleX, this._scaleY);
    },

    getWorldTransformMatrix(this: any, tempMatrix?: any, parentMatrix?: any): any {
        if (tempMatrix === undefined) { tempMatrix = new TransformMatrix(); }

        let parent = this.parentContainer;

        if (!parent) {
            return this.getLocalTransformMatrix(tempMatrix);
        }

        let destroyParentMatrix = false;

        if (!parentMatrix) {
            parentMatrix = new TransformMatrix();
            destroyParentMatrix = true;
        }

        tempMatrix.applyITRS(this.x, this.y, this._rotation, this._scaleX, this._scaleY);

        while (parent) {
            parentMatrix.applyITRS(parent.x, parent.y, parent._rotation, parent._scaleX, parent._scaleY);
            parentMatrix.multiply(tempMatrix, tempMatrix);
            parent = parent.parentContainer;
        }

        if (destroyParentMatrix) {
            parentMatrix.destroy();
        }

        return tempMatrix;
    },

    getLocalPoint(this: any, x: number, y: number, point?: Vector2, camera?: any): Vector2 {
        if (!point) { point = new Vector2(); }
        if (!camera) { camera = this.scene.sys.cameras.main; }

        const csx = camera.scrollX;
        const csy = camera.scrollY;

        const px = x + (csx * this.scrollFactorX) - csx;
        const py = y + (csy * this.scrollFactorY) - csy;

        if (this.parentContainer) {
            this.getWorldTransformMatrix().applyInverse(px, py, point);
        } else {
            TransformXY(px, py, this.x, this.y, this.rotation, this.scaleX, this.scaleY, point);
        }

        if (this._originComponent) {
            point.x += this._displayOriginX;
            point.y += this._displayOriginY;
        }

        return point;
    },

    getWorldPoint(this: any, point?: Vector2, tempMatrix?: any, parentMatrix?: any): Vector2 {
        if (point === undefined) { point = new Vector2(); }

        const parent = this.parentContainer;

        if (!parent) {
            point.x = this.x;
            point.y = this.y;
            return point;
        }

        const worldTransform = this.getWorldTransformMatrix(tempMatrix, parentMatrix);
        point.x = worldTransform.tx;
        point.y = worldTransform.ty;

        return point;
    },

    getParentRotation(this: any): number {
        let rotation = 0;
        let parent = this.parentContainer;

        while (parent) {
            rotation += parent.rotation;
            parent = parent.parentContainer;
        }

        return rotation;
    }
};
