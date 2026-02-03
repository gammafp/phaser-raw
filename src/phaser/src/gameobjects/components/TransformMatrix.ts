/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { MATH_CONST } from '../../math/const';
import { Vector2 } from '../../math/Vector2';

interface DecomposedMatrix {
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
}

/**
 * @classdesc
 * A Matrix used for display transformations for rendering.
 *
 * It is represented like so:
 *
 * ```
 * | a | c | tx |
 * | b | d | ty |
 * | 0 | 0 | 1  |
 * ```
 *
 * @class TransformMatrix
 * @memberof Phaser.GameObjects.Components
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [a=1] - The Scale X value.
 * @param {number} [b=0] - The Skew Y value.
 * @param {number} [c=0] - The Skew X value.
 * @param {number} [d=1] - The Scale Y value.
 * @param {number} [tx=0] - The Translate X value.
 * @param {number} [ty=0] - The Translate Y value.
 */
export class TransformMatrix {

    matrix: Float32Array;
    decomposedMatrix: DecomposedMatrix;
    quad: Float32Array;

    constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0)
    {
        this.matrix = new Float32Array([a, b, c, d, tx, ty, 0, 0, 1]);

        this.decomposedMatrix = {
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        };

        this.quad = new Float32Array(8);
    }

    /**
     * The Scale X value.
     */
    get a(): number
    {
        return this.matrix[0];
    }

    set a(value: number)
    {
        this.matrix[0] = value;
    }

    /**
     * The Skew Y value.
     */
    get b(): number
    {
        return this.matrix[1];
    }

    set b(value: number)
    {
        this.matrix[1] = value;
    }

    /**
     * The Skew X value.
     */
    get c(): number
    {
        return this.matrix[2];
    }

    set c(value: number)
    {
        this.matrix[2] = value;
    }

    /**
     * The Scale Y value.
     */
    get d(): number
    {
        return this.matrix[3];
    }

    set d(value: number)
    {
        this.matrix[3] = value;
    }

    /**
     * The Translate X value.
     */
    get e(): number
    {
        return this.matrix[4];
    }

    set e(value: number)
    {
        this.matrix[4] = value;
    }

    /**
     * The Translate Y value.
     */
    get f(): number
    {
        return this.matrix[5];
    }

    set f(value: number)
    {
        this.matrix[5] = value;
    }

    /**
     * The Translate X value (alias for e).
     */
    get tx(): number
    {
        return this.matrix[4];
    }

    set tx(value: number)
    {
        this.matrix[4] = value;
    }

    /**
     * The Translate Y value (alias for f).
     */
    get ty(): number
    {
        return this.matrix[5];
    }

    set ty(value: number)
    {
        this.matrix[5] = value;
    }

    /**
     * The rotation of the Matrix. Value is in radians.
     */
    get rotation(): number
    {
        return Math.acos(this.a / this.scaleX) * ((Math.atan(-this.c / this.a) < 0) ? -1 : 1);
    }

    /**
     * The rotation of the Matrix, normalized to be within the Phaser right-handed
     * clockwise rotation space. Value is in radians.
     */
    get rotationNormalized(): number
    {
        const matrix = this.matrix;
        const a = matrix[0];
        const b = matrix[1];
        const c = matrix[2];
        const d = matrix[3];

        if (a || b)
        {
            return (b > 0) ? Math.acos(a / this.scaleX) : -Math.acos(a / this.scaleX);
        }
        else if (c || d)
        {
            return MATH_CONST.TAU - ((d > 0) ? Math.acos(-c / this.scaleY) : -Math.acos(c / this.scaleY));
        }
        else
        {
            return 0;
        }
    }

    /**
     * The decomposed horizontal scale of the Matrix. This value is always positive.
     */
    get scaleX(): number
    {
        return Math.sqrt((this.a * this.a) + (this.b * this.b));
    }

    /**
     * The decomposed vertical scale of the Matrix. This value is always positive.
     */
    get scaleY(): number
    {
        return Math.sqrt((this.c * this.c) + (this.d * this.d));
    }

    /**
     * Reset the Matrix to an identity matrix.
     */
    loadIdentity(): this
    {
        const matrix = this.matrix;
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 1;
        matrix[4] = 0;
        matrix[5] = 0;
        return this;
    }

    /**
     * Translate the Matrix.
     */
    translate(x: number, y: number): this
    {
        const matrix = this.matrix;
        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
        return this;
    }

    /**
     * Scale the Matrix.
     */
    scale(x: number, y: number): this
    {
        const matrix = this.matrix;
        matrix[0] *= x;
        matrix[1] *= x;
        matrix[2] *= y;
        matrix[3] *= y;
        return this;
    }

    /**
     * Rotate the Matrix.
     */
    rotate(angle: number): this
    {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const matrix = this.matrix;

        const a = matrix[0];
        const b = matrix[1];
        const c = matrix[2];
        const d = matrix[3];

        matrix[0] = a * cos + c * sin;
        matrix[1] = b * cos + d * sin;
        matrix[2] = a * -sin + c * cos;
        matrix[3] = b * -sin + d * cos;

        return this;
    }

    /**
     * Multiply this Matrix by the given Matrix.
     *
     * If an `out` Matrix is given then the results will be stored in it.
     * If it is not given, this matrix will be updated in place instead.
     * Use an `out` Matrix if you do not wish to mutate this matrix.
     */
    multiply(rhs: TransformMatrix, out?: TransformMatrix): this | TransformMatrix
    {
        const matrix = this.matrix;
        const source = rhs.matrix;

        const localA = matrix[0];
        const localB = matrix[1];
        const localC = matrix[2];
        const localD = matrix[3];
        const localE = matrix[4];
        const localF = matrix[5];

        const sourceA = source[0];
        const sourceB = source[1];
        const sourceC = source[2];
        const sourceD = source[3];
        const sourceE = source[4];
        const sourceF = source[5];

        const destinationMatrix = (out === undefined) ? matrix : out.matrix;

        destinationMatrix[0] = (sourceA * localA) + (sourceB * localC);
        destinationMatrix[1] = (sourceA * localB) + (sourceB * localD);
        destinationMatrix[2] = (sourceC * localA) + (sourceD * localC);
        destinationMatrix[3] = (sourceC * localB) + (sourceD * localD);
        destinationMatrix[4] = (sourceE * localA) + (sourceF * localC) + localE;
        destinationMatrix[5] = (sourceE * localB) + (sourceF * localD) + localF;

        return (out === undefined) ? this : out;
    }

    /**
     * Multiply this Matrix by the matrix given, including the offset.
     *
     * The offsetX is added to the tx value: `offsetX * a + offsetY * c + tx`.
     * The offsetY is added to the ty value: `offsetY * b + offsetY * d + ty`.
     */
    multiplyWithOffset(src: TransformMatrix, offsetX: number, offsetY: number): this
    {
        const matrix = this.matrix;
        const otherMatrix = src.matrix;

        const a0 = matrix[0];
        const b0 = matrix[1];
        const c0 = matrix[2];
        const d0 = matrix[3];
        const tx0 = matrix[4];
        const ty0 = matrix[5];

        const pse = offsetX * a0 + offsetY * c0 + tx0;
        const psf = offsetX * b0 + offsetY * d0 + ty0;

        const a1 = otherMatrix[0];
        const b1 = otherMatrix[1];
        const c1 = otherMatrix[2];
        const d1 = otherMatrix[3];
        const tx1 = otherMatrix[4];
        const ty1 = otherMatrix[5];

        matrix[0] = a1 * a0 + b1 * c0;
        matrix[1] = a1 * b0 + b1 * d0;
        matrix[2] = c1 * a0 + d1 * c0;
        matrix[3] = c1 * b0 + d1 * d0;
        matrix[4] = tx1 * a0 + ty1 * c0 + pse;
        matrix[5] = tx1 * b0 + ty1 * d0 + psf;

        return this;
    }

    /**
     * Transform the Matrix.
     */
    transform(a: number, b: number, c: number, d: number, tx: number, ty: number): this
    {
        const matrix = this.matrix;

        const a0 = matrix[0];
        const b0 = matrix[1];
        const c0 = matrix[2];
        const d0 = matrix[3];
        const tx0 = matrix[4];
        const ty0 = matrix[5];

        matrix[0] = a * a0 + b * c0;
        matrix[1] = a * b0 + b * d0;
        matrix[2] = c * a0 + d * c0;
        matrix[3] = c * b0 + d * d0;
        matrix[4] = tx * a0 + ty * c0 + tx0;
        matrix[5] = tx * b0 + ty * d0 + ty0;

        return this;
    }

    /**
     * Transform a point in to the local space of this Matrix.
     */
    transformPoint(x: number, y: number, point?: { x: number; y: number }): { x: number; y: number }
    {
        if (point === undefined) { point = { x: 0, y: 0 }; }

        const matrix = this.matrix;
        const a = matrix[0];
        const b = matrix[1];
        const c = matrix[2];
        const d = matrix[3];
        const tx = matrix[4];
        const ty = matrix[5];

        point.x = x * a + y * c + tx;
        point.y = x * b + y * d + ty;

        return point;
    }

    /**
     * Invert the Matrix.
     */
    invert(): this
    {
        const matrix = this.matrix;

        const a = matrix[0];
        const b = matrix[1];
        const c = matrix[2];
        const d = matrix[3];
        const tx = matrix[4];
        const ty = matrix[5];

        const n = a * d - b * c;

        matrix[0] = d / n;
        matrix[1] = -b / n;
        matrix[2] = -c / n;
        matrix[3] = a / n;
        matrix[4] = (c * ty - d * tx) / n;
        matrix[5] = -(a * ty - b * tx) / n;

        return this;
    }

    /**
     * Set the values of this Matrix to copy those of the matrix given.
     */
    copyFrom(src: TransformMatrix): this
    {
        const matrix = this.matrix;
        matrix[0] = src.a;
        matrix[1] = src.b;
        matrix[2] = src.c;
        matrix[3] = src.d;
        matrix[4] = src.e;
        matrix[5] = src.f;
        return this;
    }

    /**
     * Set the values of this Matrix to copy those of the array given.
     * Where array indexes 0, 1, 2, 3, 4 and 5 are mapped to a, b, c, d, e and f.
     */
    copyFromArray(src: number[] | Float32Array): this
    {
        const matrix = this.matrix;
        matrix[0] = src[0];
        matrix[1] = src[1];
        matrix[2] = src[2];
        matrix[3] = src[3];
        matrix[4] = src[4];
        matrix[5] = src[5];
        return this;
    }

    /**
     * Copy the values from this Matrix to the given Canvas Rendering Context.
     * This will use the Context.transform method.
     */
    copyToContext(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D
    {
        const matrix = this.matrix;
        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        return ctx;
    }

    /**
     * Copy the values from this Matrix to the given Canvas Rendering Context.
     * This will use the Context.setTransform method.
     */
    setToContext(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D
    {
        ctx.setTransform(this.a, this.b, this.c, this.d, this.e, this.f);
        return ctx;
    }

    /**
     * Copy the values in this Matrix to the array given.
     *
     * Where array indexes 0, 1, 2, 3, 4 and 5 are mapped to a, b, c, d, e and f.
     */
    copyToArray(out?: number[]): number[]
    {
        const matrix = this.matrix;

        if (out === undefined)
        {
            out = [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]];
        }
        else
        {
            out[0] = matrix[0];
            out[1] = matrix[1];
            out[2] = matrix[2];
            out[3] = matrix[3];
            out[4] = matrix[4];
            out[5] = matrix[5];
        }

        return out;
    }

    /**
     * Set the values of this Matrix.
     */
    setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): this
    {
        const matrix = this.matrix;
        matrix[0] = a;
        matrix[1] = b;
        matrix[2] = c;
        matrix[3] = d;
        matrix[4] = tx;
        matrix[5] = ty;
        return this;
    }

    /**
     * Decompose this Matrix into its translation, scale and rotation values using QR decomposition.
     *
     * The result must be applied in the following order to reproduce the current matrix:
     *
     * translate -> rotate -> scale
     */
    decomposeMatrix(): DecomposedMatrix
    {
        const decomposedMatrix = this.decomposedMatrix;
        const matrix = this.matrix;

        const a = matrix[0];
        const b = matrix[1];
        const c = matrix[2];
        const d = matrix[3];

        const determ = a * d - b * c;

        decomposedMatrix.translateX = matrix[4];
        decomposedMatrix.translateY = matrix[5];

        if (a || b)
        {
            const r = Math.sqrt(a * a + b * b);
            decomposedMatrix.rotation = (b > 0) ? Math.acos(a / r) : -Math.acos(a / r);
            decomposedMatrix.scaleX = r;
            decomposedMatrix.scaleY = determ / r;
        }
        else if (c || d)
        {
            const s = Math.sqrt(c * c + d * d);
            decomposedMatrix.rotation = Math.PI * 0.5 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            decomposedMatrix.scaleX = determ / s;
            decomposedMatrix.scaleY = s;
        }
        else
        {
            decomposedMatrix.rotation = 0;
            decomposedMatrix.scaleX = 0;
            decomposedMatrix.scaleY = 0;
        }

        return decomposedMatrix;
    }

    /**
     * Apply the identity, translate, rotate and scale operations on the Matrix.
     */
    applyITRS(x: number, y: number, rotation: number, scaleX: number, scaleY: number): this
    {
        const matrix = this.matrix;
        const radianSin = Math.sin(rotation);
        const radianCos = Math.cos(rotation);

        // Translate
        matrix[4] = x;
        matrix[5] = y;

        // Rotate and Scale
        matrix[0] = radianCos * scaleX;
        matrix[1] = radianSin * scaleX;
        matrix[2] = -radianSin * scaleY;
        matrix[3] = radianCos * scaleY;

        return this;
    }

    /**
     * Takes the `x` and `y` values and returns a new position in the `output` vector that is the inverse of
     * the current matrix with its transformation applied.
     *
     * Can be used to translate points from world to local space.
     */
    applyInverse(x: number, y: number, output?: Vector2): Vector2
    {
        if (output === undefined) { output = new Vector2(); }

        const matrix = this.matrix;
        const a = matrix[0];
        const b = matrix[1];
        const c = matrix[2];
        const d = matrix[3];
        const tx = matrix[4];
        const ty = matrix[5];

        const id = 1 / ((a * d) + (c * -b));

        output.x = (d * id * x) + (-c * id * y) + (((ty * c) - (tx * d)) * id);
        output.y = (a * id * y) + (-b * id * x) + (((-ty * a) + (tx * b)) * id);

        return output;
    }

    /**
     * Performs the 8 calculations required to create the vertices of
     * a quad based on this matrix and the given x/y/xw/yh values.
     *
     * The result is stored in `TransformMatrix.quad`, which is returned
     * from this method.
     */
    setQuad(x: number, y: number, xw: number, yh: number, roundPixels: boolean = false, quad?: Float32Array): Float32Array
    {
        if (quad === undefined) { quad = this.quad; }

        const matrix = this.matrix;
        const a = matrix[0];
        const b = matrix[1];
        const c = matrix[2];
        const d = matrix[3];
        const e = matrix[4];
        const f = matrix[5];

        // Compute the unrounded positions for the quad
        const x0 = x * a + y * c + e;
        const y0 = x * b + y * d + f;

        const x1 = x * a + yh * c + e;
        const y1 = x * b + yh * d + f;

        const x2 = xw * a + yh * c + e;
        const y2 = xw * b + yh * d + f;

        const x3 = xw * a + y * c + e;
        const y3 = xw * b + y * d + f;

        if (roundPixels)
        {
            // Round the top-left corner
            const rx0 = Math.floor(x0 + 0.5);
            const ry0 = Math.floor(y0 + 0.5);

            // Calculate the offset caused by rounding
            const dx = rx0 - x0;
            const dy = ry0 - y0;

            // Adjust the other corners by the same offset
            quad[0] = rx0;
            quad[1] = ry0;
            quad[2] = x1 + dx;
            quad[3] = y1 + dy;
            quad[4] = x2 + dx;
            quad[5] = y2 + dy;
            quad[6] = x3 + dx;
            quad[7] = y3 + dy;
        }
        else
        {
            quad[0] = x0;
            quad[1] = y0;
            quad[2] = x1;
            quad[3] = y1;
            quad[4] = x2;
            quad[5] = y2;
            quad[6] = x3;
            quad[7] = y3;
        }

        return quad;
    }

    /**
     * Returns the X component of this matrix multiplied by the given values.
     * This is the same as `x * a + y * c + e`.
     */
    getX(x: number, y: number): number
    {
        return x * this.a + y * this.c + this.e;
    }

    /**
     * Returns the Y component of this matrix multiplied by the given values.
     * This is the same as `x * b + y * d + f`.
     */
    getY(x: number, y: number): number
    {
        return x * this.b + y * this.d + this.f;
    }

    /**
     * Returns the X component of this matrix multiplied by the given values.
     *
     * This is the same as `x * a + y * c + e`, optionally passing via `Math.round`.
     */
    getXRound(x: number, y: number, round: boolean = false): number
    {
        let v = this.getX(x, y);

        if (round)
        {
            v = Math.floor(v + 0.5);
        }

        return v;
    }

    /**
     * Returns the Y component of this matrix multiplied by the given values.
     *
     * This is the same as `x * b + y * d + f`, optionally passing via `Math.round`.
     */
    getYRound(x: number, y: number, round: boolean = false): number
    {
        let v = this.getY(x, y);

        if (round)
        {
            v = Math.floor(v + 0.5);
        }

        return v;
    }

    /**
     * Returns a string that can be used in a CSS Transform call as a `matrix` property.
     */
    getCSSMatrix(): string
    {
        const m = this.matrix;
        return 'matrix(' + m[0] + ',' + m[1] + ',' + m[2] + ',' + m[3] + ',' + m[4] + ',' + m[5] + ')';
    }

    /**
     * Destroys this Transform Matrix.
     */
    destroy(): void
    {
        this.matrix = null as any;
        this.quad = null as any;
        this.decomposedMatrix = null as any;
    }

}
