import { Earcut } from '../../../geom/polygon/Earcut';
import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { StarRender } from './StarRender';

export class Star extends Shape
{
    static {
        Mixin(this, [StarRender]);
    }

    _points: number;
    _innerRadius: number;
    _outerRadius: number;

    constructor (scene: any, x?: number, y?: number, points?: number, innerRadius?: number, outerRadius?: number, fillColor?: number, fillAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (points === undefined) { points = 5; }
        if (innerRadius === undefined) { innerRadius = 32; }
        if (outerRadius === undefined) { outerRadius = 64; }

        super(scene, 'Star', null);

        this._points = points;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;

        this.setPosition(x, y);
        this.setSize(outerRadius * 2, outerRadius * 2);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    }

    setPoints (value: number): this
    {
        this._points = value;
        return this.updateData();
    }

    setInnerRadius (value: number): this
    {
        this._innerRadius = value;
        return this.updateData();
    }

    setOuterRadius (value: number): this
    {
        this._outerRadius = value;
        return this.updateData();
    }

    get points (): number
    {
        return this._points;
    }

    set points (value: number)
    {
        this._points = value;
        this.updateData();
    }

    get innerRadius (): number
    {
        return this._innerRadius;
    }

    set innerRadius (value: number)
    {
        this._innerRadius = value;
        this.updateData();
    }

    get outerRadius (): number
    {
        return this._outerRadius;
    }

    set outerRadius (value: number)
    {
        this._outerRadius = value;
        this.updateData();
    }

    updateData (): this
    {
        var path: number[] = [];

        var points = this._points;
        var innerRadius = this._innerRadius;
        var outerRadius = this._outerRadius;

        var rot = Math.PI / 2 * 3;
        var step = Math.PI / points;

        var x = outerRadius;
        var y = outerRadius;

        path.push(x, y + -outerRadius);

        for (var i = 0; i < points; i++)
        {
            path.push(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
            rot += step;

            path.push(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
            rot += step;
        }

        path.push(x, y + -outerRadius);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }
}
