/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { MATH_CONST } from '../../math/const';
import { TransformXY } from '../../math/TransformXY';
import { Wrap as WrapAngle } from '../../math/angle/Wrap';
import { WrapDegrees as WrapAngleDegrees } from '../../math/angle/WrapDegrees';
import { Vector2 } from '../../math/Vector2';
import { TransformMatrix } from './TransformMatrix';

//  global bitmask flag for GameObject.renderMask (used by Scale)
const _FLAG = 4; // 0100

/**
 * Provides methods used for getting and setting the position, scale and rotation of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Transform
 * @since 3.0.0
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
    _originComponent: boolean;
    _displayOriginX: number;
    _displayOriginY: number;
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
    getLocalPoint(x: number, y: number, point?: any, camera?: any): any;
    getWorldPoint(point?: any, tempMatrix?: any, parentMatrix?: any): any;
    getParentRotation(): number;
}

export const Transform = {

    /**
     * A property indicating that a Game Object has this component.
     *
     * @name Phaser.GameObjects.Components.Transform#hasTransformComponent
     * @type {boolean}
     * @readonly
     * @default true
     * @since 3.60.0
     */
    hasTransformComponent: true,

    /**
     * Private internal value. Holds the horizontal scale value.
     *
     * @name Phaser.GameObjects.Components.Transform#_scaleX
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _scaleX: 1,

    /**
     * Private internal value. Holds the vertical scale value.
     *
     * @name Phaser.GameObjects.Components.Transform#_scaleY
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _scaleY: 1,

    /**
     * Private internal value. Holds the rotation value in radians.
     *
     * @name Phaser.GameObjects.Components.Transform#_rotation
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    _rotation: 0,

    /**
     * The x position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#x
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    x: 0,

    /**
     * The y position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#y
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    y: 0,

    /**
     * The z position of this Game Object.
     *
     * Note: The z position does not control the rendering order of 2D Game Objects. Use
     * {@link Phaser.GameObjects.Components.Depth#depth} instead.
     *
     * @name Phaser.GameObjects.Components.Transform#z
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    z: 0,

    /**
     * The w position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#w
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    w: 0,

    /**
     * This is a special setter that allows you to set both the horizontal and vertical scale of this Game Object
     * to the same value, at the same time. When reading this value the result returned is `(scaleX + scaleY) / 2`.
     *
     * Use of this property implies you wish the horizontal and vertical scales to be equal to each other. If this
     * isn't the case, use the `scaleX` or `scaleY` properties instead.
     *
     * @name Phaser.GameObjects.Components.Transform#scale
     * @type {number}
     * @default 1
     * @since 3.18.0
     */
    get scale(): number
    {
        return (this._scaleX + this._scaleY) / 2;
    },

    set scale(value: number)
    {
        this._scaleX = value;
        this._scaleY = value;

        if (value === 0)
        {
            this.renderFlags &= ~_FLAG;
        }
        else
        {
            this.renderFlags |= _FLAG;
        }
    },

    /**
     * The horizontal scale of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#scaleX
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    get scaleX(): number
    {
        return this._scaleX;
    },

    set scaleX(value: number)
    {
        this._scaleX = value;

        if (value === 0)
        {
            this.renderFlags &= ~_FLAG;
        }
        else if (this._scaleY !== 0)
        {
            this.renderFlags |= _FLAG;
        }
    },

    /**
     * The vertical scale of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#scaleY
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    get scaleY(): number
    {
        return this._scaleY;
    },

    set scaleY(value: number)
    {
        this._scaleY = value;

        if (value === 0)
        {
            this.renderFlags &= ~_FLAG;
        }
        else if (this._scaleX !== 0)
        {
            this.renderFlags |= _FLAG;
        }
    },

    /**
     * The angle of this Game Object as expressed in degrees.
     *
     * Phaser uses a right-hand clockwise rotation system, where 0 is right, 90 is down, 180/-180 is left
     * and -90 is up.
     *
     * If you prefer to work in radians, see the `rotation` property instead.
     *
     * @name Phaser.GameObjects.Components.Transform#angle
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    get angle(): number
    {
        return WrapAngleDegrees(this._rotation * MATH_CONST.RAD_TO_DEG);
    },

    set angle(value: number)
    {
        //  value is in degrees
        this.rotation = WrapAngleDegrees(value) * MATH_CONST.DEG_TO_RAD;
    },

    /**
     * The angle of this Game Object in radians.
     *
     * Phaser uses a right-hand clockwise rotation system, where 0 is right, PI/2 is down, +-PI is left
     * and -PI/2 is up.
     *
     * If you prefer to work in degrees, see the `angle` property instead.
     *
     * @name Phaser.GameObjects.Components.Transform#rotation
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    get rotation(): number
    {
        return this._rotation;
    },

    set rotation(value: number)
    {
        //  value is in radians
        this._rotation = WrapAngle(value);
    },

    /**
     * Sets the position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setPosition
     * @since 3.0.0
     *
     * @param {number} [x=0] - The x position of this Game Object.
     * @param {number} [y=x] - The y position of this Game Object. If not set it will use the `x` value.
     * @param {number} [z=0] - The z position of this Game Object.
     * @param {number} [w=0] - The w position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setPosition(this: any, x?: number, y?: number, z?: number, w?: number): any
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }
        if (z === undefined) { z = 0; }
        if (w === undefined) { w = 0; }

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    },

    /**
     * Copies an object's coordinates to this Game Object's position.
     *
     * @method Phaser.GameObjects.Components.Transform#copyPosition
     * @since 3.50.0
     *
     * @param {(Phaser.Types.Math.Vector2Like|Phaser.Types.Math.Vector3Like|Phaser.Types.Math.Vector4Like)} source - An object with numeric 'x', 'y', 'z', or 'w' properties. Undefined values are not copied.
     *
     * @return {this} This Game Object instance.
     */
    copyPosition(this: any, source: any): any
    {
        if (source.x !== undefined) { this.x = source.x; }
        if (source.y !== undefined) { this.y = source.y; }
        if (source.z !== undefined) { this.z = source.z; }
        if (source.w !== undefined) { this.w = source.w; }

        return this;
    },

    /**
     * Sets the position of this Game Object to be a random position within the confines of
     * the given area.
     *
     * If no area is specified a random position between 0 x 0 and the game width x height is used instead.
     *
     * The position does not factor in the size of this Game Object, meaning that only the origin is
     * guaranteed to be within the area.
     *
     * @method Phaser.GameObjects.Components.Transform#setRandomPosition
     * @since 3.8.0
     *
     * @param {number} [x=0] - The x position of the top-left of the random area.
     * @param {number} [y=0] - The y position of the top-left of the random area.
     * @param {number} [width] - The width of the random area.
     * @param {number} [height] - The height of the random area.
     *
     * @return {this} This Game Object instance.
     */
    setRandomPosition(this: any, x?: number, y?: number, width?: number, height?: number): any
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.scene.sys.scale.width; }
        if (height === undefined) { height = this.scene.sys.scale.height; }

        this.x = x + (Math.random() * width);
        this.y = y + (Math.random() * height);

        return this;
    },

    /**
     * Sets the rotation of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setRotation
     * @since 3.0.0
     *
     * @param {number} [radians=0] - The rotation of this Game Object, in radians.
     *
     * @return {this} This Game Object instance.
     */
    setRotation(this: any, radians?: number): any
    {
        if (radians === undefined) { radians = 0; }

        this.rotation = radians;

        return this;
    },

    /**
     * Sets the angle of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setAngle
     * @since 3.0.0
     *
     * @param {number} [degrees=0] - The rotation of this Game Object, in degrees.
     *
     * @return {this} This Game Object instance.
     */
    setAngle(this: any, degrees?: number): any
    {
        if (degrees === undefined) { degrees = 0; }

        this.angle = degrees;

        return this;
    },

    /**
     * Sets the scale of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setScale
     * @since 3.0.0
     *
     * @param {number} [x=1] - The horizontal scale of this Game Object.
     * @param {number} [y=x] - The vertical scale of this Game Object. If not set it will use the `x` value.
     *
     * @return {this} This Game Object instance.
     */
    setScale(this: any, x?: number, y?: number): any
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this.scaleX = x;
        this.scaleY = y;

        return this;
    },

    /**
     * Sets the x position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setX
     * @since 3.0.0
     *
     * @param {number} [value=0] - The x position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setX(this: any, value?: number): any
    {
        if (value === undefined) { value = 0; }

        this.x = value;

        return this;
    },

    /**
     * Sets the y position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setY
     * @since 3.0.0
     *
     * @param {number} [value=0] - The y position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setY(this: any, value?: number): any
    {
        if (value === undefined) { value = 0; }

        this.y = value;

        return this;
    },

    /**
     * Sets the z position of this Game Object.
     *
     * Note: The z position does not control the rendering order of 2D Game Objects. Use
     * {@link Phaser.GameObjects.Components.Depth#setDepth} instead.
     *
     * @method Phaser.GameObjects.Components.Transform#setZ
     * @since 3.0.0
     *
     * @param {number} [value=0] - The z position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setZ(this: any, value?: number): any
    {
        if (value === undefined) { value = 0; }

        this.z = value;

        return this;
    },

    /**
     * Sets the w position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setW
     * @since 3.0.0
     *
     * @param {number} [value=0] - The w position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setW(this: any, value?: number): any
    {
        if (value === undefined) { value = 0; }

        this.w = value;

        return this;
    },

    /**
     * Gets the local transform matrix for this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#getLocalTransformMatrix
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} [tempMatrix] - The matrix to populate with the values from this Game Object.
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} The populated Transform Matrix.
     */
    getLocalTransformMatrix(this: any, tempMatrix?: any): any
    {
        if (tempMatrix === undefined) { tempMatrix = new TransformMatrix(); }

        return tempMatrix.applyITRS(this.x, this.y, this._rotation, this._scaleX, this._scaleY);
    },

    /**
     * Gets the world transform matrix for this Game Object, factoring in any parent Containers.
     *
     * @method Phaser.GameObjects.Components.Transform#getWorldTransformMatrix
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} [tempMatrix] - The matrix to populate with the values from this Game Object.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - A temporary matrix to hold parent values during the calculations.
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} The populated Transform Matrix.
     */
    getWorldTransformMatrix(this: any, tempMatrix?: any, parentMatrix?: any): any
    {
        if (tempMatrix === undefined) { tempMatrix = new TransformMatrix(); }

        let parent = this.parentContainer;

        if (!parent)
        {
            return this.getLocalTransformMatrix(tempMatrix);
        }

        let destroyParentMatrix = false;

        if (!parentMatrix)
        {
            parentMatrix = new TransformMatrix();

            destroyParentMatrix = true;
        }

        tempMatrix.applyITRS(this.x, this.y, this._rotation, this._scaleX, this._scaleY);

        while (parent)
        {
            parentMatrix.applyITRS(parent.x, parent.y, parent._rotation, parent._scaleX, parent._scaleY);

            parentMatrix.multiply(tempMatrix, tempMatrix);

            parent = parent.parentContainer;
        }

        if (destroyParentMatrix)
        {
            parentMatrix.destroy();
        }

        return tempMatrix;
    },

    /**
     * Takes the given `x` and `y` coordinates and converts them into local space for this
     * Game Object, taking into account parent and local transforms, and the Display Origin.
     *
     * The returned Vector2 contains the translated point in its properties.
     *
     * A Camera needs to be provided in order to handle modified scroll factors. If no
     * camera is specified, it will use the `main` camera from the Scene to which this
     * Game Object belongs.
     *
     * @method Phaser.GameObjects.Components.Transform#getLocalPoint
     * @since 3.50.0
     *
     * @param {number} x - The x position to translate.
     * @param {number} y - The y position to translate.
     * @param {Phaser.Math.Vector2} [point] - A Vector2, or point-like object, to store the results in.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera which is being tested against. If not given will use the Scene default camera.
     *
     * @return {Phaser.Math.Vector2} The translated point.
     */
    getLocalPoint(this: any, x: number, y: number, point?: any, camera?: any): any
    {
        if (!point) { point = new Vector2(); }
        if (!camera) { camera = this.scene.sys.cameras.main; }

        const csx = camera.scrollX;
        const csy = camera.scrollY;

        const px = x + (csx * this.scrollFactorX) - csx;
        const py = y + (csy * this.scrollFactorY) - csy;

        if (this.parentContainer)
        {
            this.getWorldTransformMatrix().applyInverse(px, py, point);
        }
        else
        {
            TransformXY(px, py, this.x, this.y, this.rotation, this.scaleX, this.scaleY, point);
        }

        //  Normalize origin
        if (this._originComponent)
        {
            point.x += this._displayOriginX;
            point.y += this._displayOriginY;
        }

        return point;
    },

    /**
     * Gets the world position of this Game Object, factoring in any parent Containers.
     *
     * @method Phaser.GameObjects.Components.Transform#getWorldPoint
     * @since 3.88.0
     *
     * @param {Phaser.Math.Vector2} [point] - A Vector2, or point-like object, to store the result in.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [tempMatrix] - A temporary matrix to hold the Game Object's values.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - A temporary matrix to hold parent values.
     *
     * @return {Phaser.Math.Vector2} The world position of this Game Object.
     */
    getWorldPoint(this: any, point?: any, tempMatrix?: any, parentMatrix?: any): any
    {
        if (point === undefined) { point = new Vector2(); }

        const parent = this.parentContainer;

        if (!parent)
        {
            point.x = this.x;
            point.y = this.y;

            return point;
        }

        const worldTransform = this.getWorldTransformMatrix(tempMatrix, parentMatrix);

        point.x = worldTransform.tx;
        point.y = worldTransform.ty;

        return point;
    },

    /**
     * Gets the sum total rotation of all of this Game Objects parent Containers.
     *
     * The returned value is in radians and will be zero if this Game Object has no parent container.
     *
     * @method Phaser.GameObjects.Components.Transform#getParentRotation
     * @since 3.18.0
     *
     * @return {number} The sum total rotation, in radians, of all parent containers of this Game Object.
     */
    getParentRotation(this: any): number
    {
        let rotation = 0;

        let parent = this.parentContainer;

        while (parent)
        {
            rotation += parent.rotation;

            parent = parent.parentContainer;
        }

        return rotation;
    }

};
