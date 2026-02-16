import { Triangle as GeomTriangle } from '../../../geom/triangle/Triangle';
import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { TriangleRender } from './TriangleRender';

export class Triangle extends Shape
{
    static {
        Mixin(this, [TriangleRender]);
    }

    constructor (scene: any, x?: number, y?: number, x1?: number, y1?: number, x2?: number, y2?: number, x3?: number, y3?: number, fillColor?: number, fillAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 128; }
        if (x2 === undefined) { x2 = 64; }
        if (y2 === undefined) { y2 = 0; }
        if (x3 === undefined) { x3 = 128; }
        if (y3 === undefined) { y3 = 128; }

        super(scene, 'Triangle', new GeomTriangle(x1, y1, x2, y2, x3, y3));

        var width = this.geom.right - this.geom.left;
        var height = this.geom.bottom - this.geom.top;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    }

    setTo (x1?: number, y1?: number, x2?: number, y2?: number, x3?: number, y3?: number): this
    {
        this.geom.setTo(x1, y1, x2, y2, x3, y3);
        return this.updateData();
    }

    updateData (): this
    {
        var path: number[] = [];
        var tri = this.geom;
        var line = this._tempLine;

        tri.getLineA(line);
        path.push(line.x1, line.y1, line.x2, line.y2);

        tri.getLineB(line);
        path.push(line.x2, line.y2);

        tri.getLineC(line);
        path.push(line.x2, line.y2);

        this.pathData = path;

        return this;
    }
}
