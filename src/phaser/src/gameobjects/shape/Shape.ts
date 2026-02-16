/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Line } from '../../geom/line/Line';
import { Mixin } from '../../utils/MixinTS';
import { AlphaSingle } from '../components/AlphaSingle';
import { BlendMode } from '../components/BlendMode';
import { Depth } from '../components/Depth';
import { GetBounds } from '../components/GetBounds';
import { Lighting } from '../components/Lighting';
import { Mask } from '../components/Mask';
import { Origin } from '../components/Origin';
import { RenderNodes } from '../components/RenderNodes';
import { ScrollFactor } from '../components/ScrollFactor';
import { Transform } from '../components/Transform';
import { Visible } from '../components/Visible';

var DefaultGraphicsNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultGraphicsNodes');
var GameObject = require('../GameObject');

export interface Shape extends AlphaSingle, BlendMode, Depth, GetBounds, Lighting, Mask, Origin, RenderNodes, ScrollFactor, Transform, Visible {}

export class Shape extends GameObject
{
    static {
        Mixin(this, [
            AlphaSingle,
            BlendMode,
            Depth,
            GetBounds,
            Lighting,
            Mask,
            Origin,
            RenderNodes,
            ScrollFactor,
            Transform,
            Visible
        ]);
    }

    geom: any;
    pathData: number[];
    pathIndexes: number[];
    fillColor: number;
    fillAlpha: number;
    strokeColor: number;
    strokeAlpha: number;
    lineWidth: number;
    isFilled: boolean;
    isStroked: boolean;
    closePath: boolean;
    _tempLine: any;
    width: number;
    height: number;

    constructor (scene: any, type?: string, data?: any)
    {
        if (type === undefined) { type = 'Shape'; }

        super(scene, type);

        this.geom = data;
        this.pathData = [];
        this.pathIndexes = [];
        this.fillColor = 0xffffff;
        this.fillAlpha = 1;
        this.strokeColor = 0xffffff;
        this.strokeAlpha = 1;
        this.lineWidth = 1;
        this.isFilled = false;
        this.isStroked = false;
        this.closePath = true;
        this._tempLine = new Line();
        this.width = 0;
        this.height = 0;

        if (this.enableFilters)
        {
            this.filtersFocusContext = true;
        }

        this.initRenderNodes(this._defaultRenderNodesMap);
    }

    get _defaultRenderNodesMap (): any
    {
        return DefaultGraphicsNodes;
    }

    setFillStyle (color?: number, alpha?: number): this
    {
        if (alpha === undefined) { alpha = 1; }

        if (color === undefined)
        {
            this.isFilled = false;
        }
        else
        {
            this.fillColor = color;
            this.fillAlpha = alpha;
            this.isFilled = true;
        }

        return this;
    }

    setStrokeStyle (lineWidth?: number, color?: number, alpha?: number): this
    {
        if (alpha === undefined) { alpha = 1; }

        if (lineWidth === undefined)
        {
            this.isStroked = false;
        }
        else
        {
            this.lineWidth = lineWidth;
            this.strokeColor = color!;
            this.strokeAlpha = alpha;
            this.isStroked = true;
        }

        return this;
    }

    setClosePath (value: boolean): this
    {
        this.closePath = value;

        return this;
    }

    setSize (width: number, height: number): this
    {
        this.width = width;
        this.height = height;

        return this;
    }

    setDisplaySize (width: number, height: number): this
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

    preDestroy (): void
    {
        this.geom = null;
        this._tempLine = null;
        this.pathData = [];
        this.pathIndexes = [];
    }

    get displayWidth (): number
    {
        return this.scaleX * this.width;
    }

    set displayWidth (value: number)
    {
        this.scaleX = value / this.width;
    }

    get displayHeight (): number
    {
        return this.scaleY * this.height;
    }

    set displayHeight (value: number)
    {
        this.scaleY = value / this.height;
    }
}
