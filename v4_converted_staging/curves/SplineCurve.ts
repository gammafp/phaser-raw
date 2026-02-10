/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

import { CatmullRom } from '../math/CatmullRom';
import { Curve } from './Curve';

import { Vector2 } from '../math/Vector2';

/**
 * @classdesc
 * Create a smooth 2d spline curve from a series of points.
 *
 * @class Spline
 * @extends Phaser.Curves.Curve
 * @memberof Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {(Phaser.Math.Vector2[]|number[]|number[][])} [points] - The points that configure the curve.
 */
export class SplineCurve extends Curve {

    points: any[];

    constructor(points?: any[])
    {
        if (points === undefined) { points = []; }

        super('SplineCurve');

        /**
         * The Vector2 points that configure the curve.
         *
         * @name Phaser.Curves.Spline#points
         * @type {Phaser.Math.Vector2[]}
         * @default []
         * @since 3.0.0
         */
        this.points = [];

        this.addPoints(points);
    }

    /**
     * Add a list of points to the current list of Vector2 points of the curve.
     *
     * @method Phaser.Curves.Spline#addPoints
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2[]|number[]|number[][])} points - The points that configure the curve.
     *
     * @return {this} This curve object.
     */
    addPoints(points: any[]): this
    {
        for (let i = 0; i < points.length; i++)
        {
            const p = new Vector2();

            if (typeof points[i] === 'number')
            {
                p.x = points[i];
                p.y = points[i + 1];
                i++;
            }
            else if (Array.isArray(points[i]))
            {
                //  An array of arrays?
                p.x = points[i][0];
                p.y = points[i][1];
            }
            else
            {
                p.x = points[i].x;
                p.y = points[i].y;
            }

            this.points.push(p);
        }

        return this;
    }

    /**
     * Add a point to the current list of Vector2 points of the curve.
     *
     * @method Phaser.Curves.Spline#addPoint
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of this curve
     * @param {number} y - The y coordinate of this curve
     *
     * @return {Phaser.Math.Vector2} The new Vector2 added to the curve
     */
    addPoint(x: number, y: number): any
    {
        const vec = new Vector2(x, y);

        this.points.push(vec);

        return vec;
    }

    /**
     * Gets the starting point on the curve.
     *
     * @method Phaser.Curves.Spline#getStartPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the result in. If not given will be created.
     *
     * @return {Phaser.Math.Vector2} The coordinates of the point on the curve. If an `out` object was given this will be returned.
     */
    getStartPoint(out?: any): any
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.points[0]);
    }

    /**
     * Get the resolution of the curve.
     *
     * @method Phaser.Curves.Spline#getResolution
     * @since 3.0.0
     *
     * @param {number} divisions - Optional divisions value.
     *
     * @return {number} The curve resolution.
     */
    getResolution(divisions: number): number
    {
        return divisions * this.points.length;
    }

    /**
     * Get point at relative position in curve according to length.
     *
     * @method Phaser.Curves.Spline#getPoint
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

        const points = this.points;

        const point = (points.length - 1) * t;

        const intPoint = Math.floor(point);

        const weight = point - intPoint;

        const p0 = points[(intPoint === 0) ? intPoint : intPoint - 1];
        const p1 = points[intPoint];
        const p2 = points[(intPoint > points.length - 2) ? points.length - 1 : intPoint + 1];
        const p3 = points[(intPoint > points.length - 3) ? points.length - 1 : intPoint + 2];

        return out.set(CatmullRom(weight, p0.x, p1.x, p2.x, p3.x), CatmullRom(weight, p0.y, p1.y, p2.y, p3.y));
    }

    /**
     * Exports a JSON object containing this curve data.
     *
     * @method Phaser.Curves.Spline#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Curves.JSONCurve} The JSON object containing this curve data.
     */
    toJSON(): any
    {
        const points: number[] = [];

        for (let i = 0; i < this.points.length; i++)
        {
            points.push(this.points[i].x);
            points.push(this.points[i].y);
        }

        return {
            type: this.type,
            points: points
        };
    }

    /**
     * Imports a JSON object containing this curve data.
     *
     * @function Phaser.Curves.Spline.fromJSON
     * @since 3.0.0
     *
     * @param {Phaser.Types.Curves.JSONCurve} data - The JSON object containing this curve data.
     *
     * @return {Phaser.Curves.Spline} The spline curve created.
     */
    static fromJSON(data: any): SplineCurve
    {
        return new SplineCurve(data.points);
    }

}
