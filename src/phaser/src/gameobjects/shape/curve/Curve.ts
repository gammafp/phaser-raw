/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Earcut } from '../../../geom/polygon/Earcut';
import { Rectangle } from '../../../geom/rectangle/Rectangle';
import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { CurveRender } from './CurveRender';

export class Curve extends Shape
{
    static {
        Mixin(this, [CurveRender]);
    }

    _smoothness: number;
    _curveBounds: any;

    constructor (scene: any, x?: number, y?: number, curve?: any, fillColor?: number, fillAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        super(scene, 'Curve', curve);

        this._smoothness = 32;
        this._curveBounds = new Rectangle();
        this.closePath = false;

        this.setPosition(x, y);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

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

    setSmoothness (value: number): this
    {
        this._smoothness = value;
        return this.updateData();
    }

    updateData (): this
    {
        var bounds = this._curveBounds;
        var smoothness = this._smoothness;

        this.geom.getBounds(bounds, smoothness);
        this.setSize(bounds.width, bounds.height);
        this.updateDisplayOrigin();

        var path: number[] = [];
        var points = this.geom.getPoints(smoothness);

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
