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
import { Line } from '../line/Line';

/**
 * @classdesc
 * Encapsulates a 2D rectangle defined by its corner point in the top-left and its extends in x (width) and y (height)
 *
 * @class Rectangle
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The X coordinate of the top left corner of the Rectangle.
 * @param {number} [y=0] - The Y coordinate of the top left corner of the Rectangle.
 * @param {number} [width=0] - The width of the Rectangle.
 * @param {number} [height=0] - The height of the Rectangle.
 */
export class Rectangle {

    readonly type: number;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
    {
        this.type = GEOM_CONST.RECTANGLE;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(x: number, y: number): boolean
    {
        return Contains(this, x, y);
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

    setTo(x: number, y: number, width: number, height: number): this
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    setEmpty(): this
    {
        return this.setTo(0, 0, 0, 0);
    }

    setPosition(x: number, y?: number): this
    {
        if (y === undefined) { y = x; }
        this.x = x;
        this.y = y;
        return this;
    }

    setSize(width: number, height?: number): this
    {
        if (height === undefined) { height = width; }
        this.width = width;
        this.height = height;
        return this;
    }

    isEmpty(): boolean
    {
        return (this.width <= 0 || this.height <= 0);
    }

    getLineA(line?: Line): Line
    {
        if (line === undefined) { line = new Line(); }
        line.setTo(this.x, this.y, this.right, this.y);
        return line;
    }

    getLineB(line?: Line): Line
    {
        if (line === undefined) { line = new Line(); }
        line.setTo(this.right, this.y, this.right, this.bottom);
        return line;
    }

    getLineC(line?: Line): Line
    {
        if (line === undefined) { line = new Line(); }
        line.setTo(this.right, this.bottom, this.x, this.bottom);
        return line;
    }

    getLineD(line?: Line): Line
    {
        if (line === undefined) { line = new Line(); }
        line.setTo(this.x, this.bottom, this.x, this.y);
        return line;
    }

    get left(): number
    {
        return this.x;
    }

    set left(value: number)
    {
        if (value >= this.right)
        {
            this.width = 0;
        }
        else
        {
            this.width = this.right - value;
        }
        this.x = value;
    }

    get right(): number
    {
        return this.x + this.width;
    }

    set right(value: number)
    {
        if (value <= this.x)
        {
            this.width = 0;
        }
        else
        {
            this.width = value - this.x;
        }
    }

    get top(): number
    {
        return this.y;
    }

    set top(value: number)
    {
        if (value >= this.bottom)
        {
            this.height = 0;
        }
        else
        {
            this.height = (this.bottom - value);
        }
        this.y = value;
    }

    get bottom(): number
    {
        return this.y + this.height;
    }

    set bottom(value: number)
    {
        if (value <= this.y)
        {
            this.height = 0;
        }
        else
        {
            this.height = value - this.y;
        }
    }

    get centerX(): number
    {
        return this.x + (this.width / 2);
    }

    set centerX(value: number)
    {
        this.x = value - (this.width / 2);
    }

    get centerY(): number
    {
        return this.y + (this.height / 2);
    }

    set centerY(value: number)
    {
        this.y = value - (this.height / 2);
    }

}
