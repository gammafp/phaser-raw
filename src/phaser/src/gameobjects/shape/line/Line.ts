import { Line as GeomLine } from '../../../geom/line/Line';
import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { LineRender } from './LineRender';

export class Line extends Shape
{
    static {
        Mixin(this, [LineRender]);
    }

    lineWidth: number;
    _startWidth: number;
    _endWidth: number;

    constructor (scene: any, x?: number, y?: number, x1?: number, y1?: number, x2?: number, y2?: number, strokeColor?: number, strokeAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 128; }
        if (y2 === undefined) { y2 = 0; }

        super(scene, 'Line', new GeomLine(x1, y1, x2, y2));

        var width = Math.max(1, this.geom.right - this.geom.left);
        var height = Math.max(1, this.geom.bottom - this.geom.top);

        this.lineWidth = 1;
        this._startWidth = 1;
        this._endWidth = 1;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (strokeColor !== undefined)
        {
            this.setStrokeStyle(1, strokeColor, strokeAlpha);
        }

        this.updateDisplayOrigin();
    }

    setLineWidth (startWidth: number, endWidth?: number): this
    {
        if (endWidth === undefined) { endWidth = startWidth; }

        this._startWidth = startWidth;
        this._endWidth = endWidth;
        this.lineWidth = startWidth;

        return this;
    }

    setTo (x1?: number, y1?: number, x2?: number, y2?: number): this
    {
        this.geom.setTo(x1, y1, x2, y2);
        return this;
    }
}
