/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';

/**
 * @classdesc
 * A MoveTo Curve is a very simple curve consisting of only a single point.
 * Its intended use is to move the ending point in a Path.
 *
 * @class MoveTo
 * @memberof Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - `x` pixel coordinate.
 * @param {number} [y=0] - `y` pixel coordinate.
 */
export class MoveTo {

    active: boolean;
    p0: any;

    constructor(x?: number, y?: number)
    {
        /**
         * Denotes that this Curve does not influence the bounds, points, and drawing of its parent Path. Must be `false` or some methods in the parent Path will throw errors.
         *
         * @name Phaser.Curves.MoveTo#active
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.active = false;

        /**
         * The lone point which this curve consists of.
         *
         * @name Phaser.Curves.MoveTo#p0
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p0 = new Vector2(x, y);
    }

    /**
     * Get point at relative position in curve according to length.
     *
     * @method Phaser.Curves.MoveTo#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} t - The position along the curve to return. Where 0 is the start and 1 is the end.
     * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the result in. If not given will be created.
     *
     * @return {Phaser.Math.Vector2} The coordinates of the point on the curve. If an `out` object was given this will be returned.
     */
    getPoint(t: number, out?: any): any
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    }

    /**
     * Retrieves the point at given position in the curve. This will always return this curve's only point.
     *
     * @method Phaser.Curves.MoveTo#getPointAt
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} u - The position in the path to retrieve, between 0 and 1. Not used.
     * @param {Phaser.Math.Vector2} [out] - An optional vector in which to store the point.
     *
     * @return {Phaser.Math.Vector2} The modified `out` vector, or a new `Vector2` if none was provided.
     */
    getPointAt(u: number, out?: any): any
    {
        return this.getPoint(u, out);
    }

    /**
     * Gets the resolution of this curve.
     *
     * @method Phaser.Curves.MoveTo#getResolution
     * @since 3.0.0
     *
     * @return {number} The resolution of this curve. For a MoveTo the value is always 1.
     */
    getResolution(): number
    {
        return 1;
    }

    /**
     * Gets the length of this curve.
     *
     * @method Phaser.Curves.MoveTo#getLength
     * @since 3.0.0
     *
     * @return {number} The length of this curve. For a MoveTo the value is always 0.
     */
    getLength(): number
    {
        return 0;
    }

    /**
     * Converts this curve into a JSON-serializable object.
     *
     * @method Phaser.Curves.MoveTo#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Curves.JSONCurve} A primitive object with the curve's type and only point.
     */
    toJSON(): any
    {
        return {
            type: 'MoveTo',
            points: [
                this.p0.x, this.p0.y
            ]
        };
    }

}
