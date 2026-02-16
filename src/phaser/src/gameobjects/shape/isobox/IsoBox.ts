import { Mixin } from '../../../utils/MixinTS';
import { Shape } from '../Shape';
import { IsoBoxRender } from './IsoBoxRender';

export class IsoBox extends Shape
{
    static {
        Mixin(this, [IsoBoxRender]);
    }

    projection: number;
    fillTop: number;
    fillLeft: number;
    fillRight: number;
    showTop: boolean;
    showLeft: boolean;
    showRight: boolean;

    constructor (scene: any, x?: number, y?: number, size?: number, height?: number, fillTop?: number, fillLeft?: number, fillRight?: number)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (size === undefined) { size = 48; }
        if (height === undefined) { height = 32; }
        if (fillTop === undefined) { fillTop = 0xeeeeee; }
        if (fillLeft === undefined) { fillLeft = 0x999999; }
        if (fillRight === undefined) { fillRight = 0xcccccc; }

        super(scene, 'IsoBox', null);

        this.projection = 4;
        this.fillTop = fillTop;
        this.fillLeft = fillLeft;
        this.fillRight = fillRight;
        this.showTop = true;
        this.showLeft = true;
        this.showRight = true;
        this.isFilled = true;

        this.setPosition(x, y);
        this.setSize(size, height);
        this.updateDisplayOrigin();
    }

    setProjection (value: number): this
    {
        this.projection = value;
        return this;
    }

    setFaces (showTop?: boolean, showLeft?: boolean, showRight?: boolean): this
    {
        if (showTop === undefined) { showTop = true; }
        if (showLeft === undefined) { showLeft = true; }
        if (showRight === undefined) { showRight = true; }

        this.showTop = showTop;
        this.showLeft = showLeft;
        this.showRight = showRight;

        return this;
    }

    setFillStyle (fillTop?: number, fillLeft?: number, fillRight?: number): this
    {
        this.fillTop = fillTop!;
        this.fillLeft = fillLeft!;
        this.fillRight = fillRight!;
        this.isFilled = true;

        return this;
    }
}
