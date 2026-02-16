/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Earcut } from '../../../geom/polygon/Earcut';
import { Circle as GeomCircle } from '../../../geom/circle/Circle';
import { DegToRad } from '../../../math/DegToRad';
import { MATH_CONST } from '../../../math/const';
import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { ArcRender } from './ArcRender';

export class Arc extends Shape
{
    static {
        Mixin(this, [ArcRender]);
    }

    _startAngle: number;
    _endAngle: number;
    _anticlockwise: boolean;
    _iterations: number;

    constructor (scene: any, x?: number, y?: number, radius?: number, startAngle?: number, endAngle?: number, anticlockwise?: boolean, fillColor?: number, fillAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (radius === undefined) { radius = 128; }
        if (startAngle === undefined) { startAngle = 0; }
        if (endAngle === undefined) { endAngle = 360; }
        if (anticlockwise === undefined) { anticlockwise = false; }

        super(scene, 'Arc', new GeomCircle(0, 0, radius));

        this._startAngle = startAngle;
        this._endAngle = endAngle;
        this._anticlockwise = anticlockwise;
        this._iterations = 0.01;

        this.setPosition(x, y);

        var diameter = this.geom.radius * 2;
        this.setSize(diameter, diameter);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    }

    get iterations (): number
    {
        return this._iterations;
    }

    set iterations (value: number)
    {
        this._iterations = value;
        this.updateData();
    }

    get radius (): number
    {
        return this.geom.radius;
    }

    set radius (value: number)
    {
        this.geom.radius = value;
        var diameter = value * 2;
        this.setSize(diameter, diameter);
        this.updateDisplayOrigin();
        this.updateData();
    }

    get startAngle (): number
    {
        return this._startAngle;
    }

    set startAngle (value: number)
    {
        this._startAngle = value;
        this.updateData();
    }

    get endAngle (): number
    {
        return this._endAngle;
    }

    set endAngle (value: number)
    {
        this._endAngle = value;
        this.updateData();
    }

    get anticlockwise (): boolean
    {
        return this._anticlockwise;
    }

    set anticlockwise (value: boolean)
    {
        this._anticlockwise = value;
        this.updateData();
    }

    setRadius (value: number): this
    {
        this.radius = value;
        return this;
    }

    setIterations (value?: number): this
    {
        if (value === undefined) { value = 0.01; }
        this.iterations = value;
        return this;
    }

    setStartAngle (angle: number, anticlockwise?: boolean): this
    {
        this._startAngle = angle;
        if (anticlockwise !== undefined)
        {
            this._anticlockwise = anticlockwise;
        }
        return this.updateData();
    }

    setEndAngle (angle: number, anticlockwise?: boolean): this
    {
        this._endAngle = angle;
        if (anticlockwise !== undefined)
        {
            this._anticlockwise = anticlockwise;
        }
        return this.updateData();
    }

    updateData (): this
    {
        var step = this._iterations;
        var iteration = step;
        var radius = this.geom.radius;
        var startAngle = DegToRad(this._startAngle);
        var endAngle = DegToRad(this._endAngle);
        var anticlockwise = this._anticlockwise;
        var x = radius;
        var y = radius;

        endAngle -= startAngle;

        if (anticlockwise)
        {
            if (endAngle < -MATH_CONST.TAU)
            {
                endAngle = -MATH_CONST.TAU;
            }
            else if (endAngle > 0)
            {
                endAngle = -MATH_CONST.TAU + endAngle % MATH_CONST.TAU;
            }
        }
        else if (endAngle > MATH_CONST.TAU)
        {
            endAngle = MATH_CONST.TAU;
        }
        else if (endAngle < 0)
        {
            endAngle = MATH_CONST.TAU + endAngle % MATH_CONST.TAU;
        }

        var path = [ x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius ];
        var ta;

        while (iteration < 1)
        {
            ta = endAngle * iteration + startAngle;
            path.push(x + Math.cos(ta) * radius, y + Math.sin(ta) * radius);
            iteration += step;
        }

        ta = endAngle + startAngle;
        path.push(x + Math.cos(ta) * radius, y + Math.sin(ta) * radius);
        path.push(x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius);

        this.pathIndexes = Earcut(path, undefined, 2);
        this.pathData = path;

        return this;
    }
}
