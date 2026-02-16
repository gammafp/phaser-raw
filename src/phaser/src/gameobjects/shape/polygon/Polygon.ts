import { Earcut } from '../../../geom/polygon/Earcut';
import { GetAABB } from '../../../geom/polygon/GetAABB';
import { Polygon as GeomPolygon } from '../../../geom/polygon/Polygon';
import { Smooth } from '../../../geom/polygon/Smooth';
import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { PolygonRender } from './PolygonRender';

export class Polygon extends Shape
{
    static {
        Mixin(this, [PolygonRender]);
    }

    constructor (scene: any, x?: number, y?: number, points?: any, fillColor?: number, fillAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        super(scene, 'Polygon', new GeomPolygon(points));

        var bounds = GetAABB(this.geom);

        this.setPosition(x, y);
        this.setSize(bounds.width, bounds.height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    }

    smooth (iterations?: number): this
    {
        if (iterations === undefined) { iterations = 1; }

        for (var i = 0; i < iterations; i++)
        {
            Smooth(this.geom);
        }

        return this.updateData();
    }

    setTo (points?: any): this
    {
        this.geom.setTo(points);

        var bounds = GetAABB(this.geom);

        this.setSize(bounds.width, bounds.height);
        this.updateDisplayOrigin();

        return this.updateData();
    }

    updateData (): this
    {
        var path: number[] = [];
        var points = this.geom.points;

        for (var i = 0; i < points.length; i++)
        {
            path.push(points[i].x, points[i].y);
        }

        path.push(points[0].x, points[0].y);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }
}
