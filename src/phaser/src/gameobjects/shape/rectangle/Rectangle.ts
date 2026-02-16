import { Earcut } from '../../../geom/polygon/Earcut';
import { Rectangle as GeomRectangle } from '../../../geom/rectangle/Rectangle';
import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { RectangleRender } from './RectangleRender';

export class Rectangle extends Shape
{
    static {
        Mixin(this, [RectangleRender]);
    }

    radius: number;
    isRounded: boolean;

    constructor (scene: any, x?: number, y?: number, width?: number, height?: number, fillColor?: number, fillAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        super(scene, 'Rectangle', new GeomRectangle(0, 0, width, height));

        this.radius = 20;
        this.isRounded = false;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    }

    setRounded (radius?: number): this
    {
        if (radius === undefined) { radius = 16; }

        this.radius = radius;
        this.isRounded = radius > 0;

        return this.updateRoundedData();
    }

    setSize (width: number, height: number): this
    {
        this.width = width;
        this.height = height;

        this.geom.setSize(width, height);

        this.updateData();
        this.updateDisplayOrigin();

        var input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = width;
            input.hitArea.height = height;
        }

        return this;
    }

    updateData (): this
    {
        if (this.isRounded)
        {
            return this.updateRoundedData();
        }

        var path: number[] = [];
        var rect = this.geom;
        var line = this._tempLine;

        rect.getLineA(line);
        path.push(line.x1, line.y1, line.x2, line.y2);

        rect.getLineB(line);
        path.push(line.x2, line.y2);

        rect.getLineC(line);
        path.push(line.x2, line.y2);

        rect.getLineD(line);
        path.push(line.x2, line.y2);

        this.pathData = path;

        return this;
    }

    updateRoundedData (): this
    {
        var path: number[] = [];
        var halfWidth = this.width / 2;
        var halfHeight = this.height / 2;

        var maxRadius = Math.min(halfWidth, halfHeight);
        var radius = Math.min(this.radius, maxRadius);

        var x = halfWidth;
        var y = halfHeight;

        var segments = Math.max(4, Math.min(16, Math.ceil(radius / 2)));

        this.arcTo(path, x - halfWidth + radius, y - halfHeight + radius, radius, Math.PI, Math.PI * 1.5, segments);

        path.push(x + halfWidth - radius, y - halfHeight);

        this.arcTo(path, x + halfWidth - radius, y - halfHeight + radius, radius, Math.PI * 1.5, Math.PI * 2, segments);

        path.push(x + halfWidth, y + halfHeight - radius);

        this.arcTo(path, x + halfWidth - radius, y + halfHeight - radius, radius, 0, Math.PI * 0.5, segments);

        path.push(x - halfWidth + radius, y + halfHeight);

        this.arcTo(path, x - halfWidth + radius, y + halfHeight - radius, radius, Math.PI * 0.5, Math.PI, segments);

        path.push(x - halfWidth, y - halfHeight + radius);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

    arcTo (path: number[], centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, segments: number): void
    {
        var angleInc = (endAngle - startAngle) / segments;

        for (var i = 0; i <= segments; i++)
        {
            var angle = startAngle + (angleInc * i);

            path.push(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
        }
    }
}
