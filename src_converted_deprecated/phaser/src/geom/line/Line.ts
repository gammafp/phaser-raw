/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetPoint } from './GetPoint';
import { GetPoints } from './GetPoints';
import { GEOM_CONST } from '../const';
import { Random } from './Random';
import { Vector2 } from '../../math/Vector2';

/**
 * @classdesc
 * Defines a Line segment, a part of a line between two endpoints.
 *
 * @class Line
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x1=0] - The x coordinate of the lines starting point.
 * @param {number} [y1=0] - The y coordinate of the lines starting point.
 * @param {number} [x2=0] - The x coordinate of the lines ending point.
 * @param {number} [y2=0] - The y coordinate of the lines ending point.
 */
export class Line {

    readonly type: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0)
    {
        this.type = GEOM_CONST.LINE;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    getPoint(position: number, output?: any): any
    {
        return GetPoint(this, position, output);
    }

    getPoints(quantity: number, stepRate?: number, output?: any[]): any[]
    {
        return GetPoints(this, quantity, stepRate, output);
    }

    getRandomPoint(point?: any): any
    {
        return Random(this, point);
    }

    setTo(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0): this
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        return this;
    }

    setFromObjects(start: { x: number; y: number }, end: { x: number; y: number }): this
    {
        this.x1 = start.x;
        this.y1 = start.y;
        this.x2 = end.x;
        this.y2 = end.y;
        return this;
    }

    getPointA(vec2?: Vector2): Vector2
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }
        vec2.set(this.x1, this.y1);
        return vec2;
    }

    getPointB(vec2?: Vector2): Vector2
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }
        vec2.set(this.x2, this.y2);
        return vec2;
    }

    get left(): number
    {
        return Math.min(this.x1, this.x2);
    }

    set left(value: number)
    {
        if (this.x1 <= this.x2)
        {
            this.x1 = value;
        }
        else
        {
            this.x2 = value;
        }
    }

    get right(): number
    {
        return Math.max(this.x1, this.x2);
    }

    set right(value: number)
    {
        if (this.x1 > this.x2)
        {
            this.x1 = value;
        }
        else
        {
            this.x2 = value;
        }
    }

    get top(): number
    {
        return Math.min(this.y1, this.y2);
    }

    set top(value: number)
    {
        if (this.y1 <= this.y2)
        {
            this.y1 = value;
        }
        else
        {
            this.y2 = value;
        }
    }

    get bottom(): number
    {
        return Math.max(this.y1, this.y2);
    }

    set bottom(value: number)
    {
        if (this.y1 > this.y2)
        {
            this.y1 = value;
        }
        else
        {
            this.y2 = value;
        }
    }

}
