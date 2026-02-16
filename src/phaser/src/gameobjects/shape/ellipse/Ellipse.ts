/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Earcut } from '../../../geom/polygon/Earcut';
import { Ellipse as GeomEllipse } from '../../../geom/ellipse/Ellipse';
import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { EllipseRender } from './EllipseRender';

export class Ellipse extends Shape
{
    static {
        Mixin(this, [EllipseRender]);
    }

    _smoothness: number;

    constructor (scene: any, x?: number, y?: number, width?: number, height?: number, fillColor?: number, fillAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        super(scene, 'Ellipse', new GeomEllipse(width / 2, height / 2, width, height));

        this._smoothness = 64;

        this.setPosition(x, y);

        this.width = width;
        this.height = height;

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    }

    get smoothness (): number
    {
        return this._smoothness;
    }

    set smoothness (value: number)
    {
        this._smoothness = value;
        this.updateData();
    }

    setSize (width: number, height: number): this
    {
        this.width = width;
        this.height = height;
        this.geom.setPosition(width / 2, height / 2);
        this.geom.setSize(width, height);

        this.updateDisplayOrigin();

        return this.updateData();
    }

    setSmoothness (value: number): this
    {
        this._smoothness = value;
        return this.updateData();
    }

    updateData (): this
    {
        var path: number[] = [];
        var points = this.geom.getPoints(this._smoothness);

        for (var i = 0; i < points.length; i++)
        {
            path.push(points[i].x, points[i].y);
        }

        path.push(points[0].x, points[0].y);

        this.pathIndexes = Earcut(path, undefined, 2);
        this.pathData = path;

        return this;
    }
}
