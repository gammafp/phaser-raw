/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Contains } from './Contains';
import { GetPoint } from './GetPoint';
import { GetPoints } from './GetPoints';
import { GEOM_CONST } from '../const';
import { Random } from './Random';

/**
 * @classdesc
 * A Circle object.
 *
 * This is a geometry object, containing numerical values and related methods to inspect and modify them.
 * It is not a Game Object, in that you cannot add it to the display list, and it has no texture.
 * To render a Circle you should look at the capabilities of the Graphics class.
 *
 * @class Circle
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The x position of the center of the circle.
 * @param {number} [y=0] - The y position of the center of the circle.
 * @param {number} [radius=0] - The radius of the circle.
 */
export class Circle {

    readonly type: number;
    x: number;
    y: number;
    private _radius: number;
    private _diameter: number;

    constructor(x: number = 0, y: number = 0, radius: number = 0)
    {
        this.type = GEOM_CONST.CIRCLE;
        this.x = x;
        this.y = y;
        this._radius = radius;
        this._diameter = radius * 2;
    }

    contains(x: number, y: number): boolean
    {
        return Contains(this, x, y);
    }

    getPoint(position: number, point?: any): any
    {
        return GetPoint(this, position, point);
    }

    getPoints(quantity: number, stepRate?: number, output?: any[]): any[]
    {
        return GetPoints(this, quantity, stepRate, output);
    }

    getRandomPoint(point?: any): any
    {
        return Random(this, point);
    }

    setTo(x: number = 0, y: number = 0, radius: number = 0): this
    {
        this.x = x;
        this.y = y;
        this._radius = radius;
        this._diameter = radius * 2;
        return this;
    }

    setEmpty(): this
    {
        this._radius = 0;
        this._diameter = 0;
        return this;
    }

    setPosition(x: number = 0, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.x = x;
        this.y = y;
        return this;
    }

    isEmpty(): boolean
    {
        return (this._radius <= 0);
    }

    get radius(): number
    {
        return this._radius;
    }

    set radius(value: number)
    {
        this._radius = value;
        this._diameter = value * 2;
    }

    get diameter(): number
    {
        return this._diameter;
    }

    set diameter(value: number)
    {
        this._diameter = value;
        this._radius = value * 0.5;
    }

    get left(): number
    {
        return this.x - this._radius;
    }

    set left(value: number)
    {
        this.x = value + this._radius;
    }

    get right(): number
    {
        return this.x + this._radius;
    }

    set right(value: number)
    {
        this.x = value - this._radius;
    }

    get top(): number
    {
        return this.y - this._radius;
    }

    set top(value: number)
    {
        this.y = value + this._radius;
    }

    get bottom(): number
    {
        return this.y + this._radius;
    }

    set bottom(value: number)
    {
        this.y = value - this._radius;
    }

}
