import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { GridRender } from './GridRender';

export class Grid extends Shape
{
    static {
        Mixin(this, [GridRender]);
    }

    cellWidth: number;
    cellHeight: number;
    showAltCells: boolean;
    altFillColor: number | undefined;
    altFillAlpha: number | undefined;
    cellPadding: number;
    strokeOutside: boolean;
    strokeOutsideIncomplete: boolean;

    constructor (scene: any, x?: number, y?: number, width?: number, height?: number, cellWidth?: number, cellHeight?: number, fillColor?: number, fillAlpha?: number, strokeFillColor?: number, strokeFillAlpha?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }
        if (cellWidth === undefined) { cellWidth = 32; }
        if (cellHeight === undefined) { cellHeight = 32; }

        super(scene, 'Grid', null);

        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.showAltCells = false;
        this.altFillColor = undefined;
        this.altFillAlpha = undefined;
        this.cellPadding = 0.5;
        this.strokeOutside = false;
        this.strokeOutsideIncomplete = true;

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setFillStyle(fillColor, fillAlpha);

        if (strokeFillColor !== undefined)
        {
            this.setStrokeStyle(1, strokeFillColor, strokeFillAlpha);
        }

        this.updateDisplayOrigin();
    }

    setAltFillStyle (fillColor?: number, fillAlpha?: number): this
    {
        if (fillAlpha === undefined) { fillAlpha = 1; }

        if (fillColor === undefined)
        {
            this.showAltCells = false;
        }
        else
        {
            this.altFillColor = fillColor;
            this.altFillAlpha = fillAlpha;
            this.showAltCells = true;
        }

        return this;
    }

    setCellPadding (value?: number): this
    {
        this.cellPadding = value || 0;
        return this;
    }

    setStrokeOutside (strokeOutside: boolean, strokeOutsideIncomplete?: boolean): this
    {
        this.strokeOutside = strokeOutside;

        if (strokeOutsideIncomplete !== undefined)
        {
            this.strokeOutsideIncomplete = strokeOutsideIncomplete;
        }

        return this;
    }
}
