/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Contains as CircleContains } from '../../geom/circle/Contains';
import { Contains as RectangleContains } from '../../geom/rectangle/Contains';
const BlendModes = require('../../renderer/BlendModes');
import { Circle } from '../../geom/circle/Circle';
import { Mixin } from '../../utils/MixinTS';
import * as Components from '../components';
const GameObject = require('../GameObject');
import { Rectangle } from '../../geom/rectangle/Rectangle';

export interface Zone extends
    Components.Depth,
    Components.GetBounds,
    Components.Origin,
    Components.Transform,
    Components.ScrollFactor,
    Components.Visible {}

export class Zone extends GameObject {

    width: number;
    height: number;
    blendMode: number;

    static {
        Mixin(this, [
            Components.Depth,
            Components.GetBounds,
            Components.Origin,
            Components.Transform,
            Components.ScrollFactor,
            Components.Visible
        ]);
    }

    constructor(scene: any, x: number, y: number, width: number = 1, height: number = width)
    {
        super(scene, 'Zone');

        this.setPosition(x, y);

        this.width = width;
        this.height = height;
        this.blendMode = BlendModes.NORMAL;

        this.updateDisplayOrigin();
    }

    get displayWidth(): number
    {
        return (this as any).scaleX * this.width;
    }

    set displayWidth(value: number)
    {
        (this as any).scaleX = value / this.width;
    }

    get displayHeight(): number
    {
        return (this as any).scaleY * this.height;
    }

    set displayHeight(value: number)
    {
        (this as any).scaleY = value / this.height;
    }

    setSize(width: number, height: number, resizeInput: boolean = true): this
    {
        this.width = width;
        this.height = height;

        this.updateDisplayOrigin();

        var input = (this as any).input;

        if (resizeInput && input && !input.customHitArea)
        {
            input.hitArea.width = width;
            input.hitArea.height = height;
        }

        return this;
    }

    setDisplaySize(width: number, height: number): this
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

    setCircleDropZone(radius: number): this
    {
        return this.setDropZone(new Circle(0, 0, radius), CircleContains);
    }

    setRectangleDropZone(width: number, height: number): this
    {
        return this.setDropZone(new Rectangle(0, 0, width, height), RectangleContains);
    }

    setDropZone(hitArea?: any, hitAreaCallback?: Function): this
    {
        if (!(this as any).input)
        {
            (this as any).setInteractive(hitArea, hitAreaCallback, true);
        }

        return this;
    }

    setAlpha(): void
    {
    }

    setBlendMode(): void
    {
    }

    renderCanvas(renderer: any, src: any, camera: any): void
    {
        camera.addToRenderList(src);
    }

    renderWebGL(renderer: any, src: any, camera: any): void
    {
        camera.addToRenderList(src);
    }

}
