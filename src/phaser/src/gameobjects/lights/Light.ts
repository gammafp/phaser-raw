/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RGB } from '../../display/RGB';
import { Circle } from '../../geom/circle/Circle';
import { Mixin } from '../../utils/MixinTS';
import * as Components from '../components';
const Utils = require('../../renderer/webgl/Utils');

export interface Light extends
    Components.Origin,
    Components.ScrollFactor,
    Components.Visible {}

export class Light extends Circle {

    static RENDER_MASK = 15;

    color: RGB;
    intensity: number;
    attenuation: number;
    renderFlags: number;
    cameraFilter: number;

    static {
        Mixin(this, [
            Components.Origin,
            Components.ScrollFactor,
            Components.Visible
        ]);
    }

    constructor(x: number, y: number, radius: number, r: number, g: number, b: number, intensity: number)
    {
        super(x, y, radius);

        this.color = new RGB(r, g, b);
        this.intensity = intensity;
        this.attenuation = 0.1;
        this.renderFlags = 15;
        this.cameraFilter = 0;

        (this as any).setScrollFactor(1, 1);
        (this as any).setOrigin();
        (this as any).setDisplayOrigin(radius);
    }

    get displayWidth(): number
    {
        return this.diameter;
    }

    set displayWidth(value: number)
    {
        this.diameter = value;
    }

    get displayHeight(): number
    {
        return this.diameter;
    }

    set displayHeight(value: number)
    {
        this.diameter = value;
    }

    get width(): number
    {
        return this.diameter;
    }

    set width(value: number)
    {
        this.diameter = value;
    }

    get height(): number
    {
        return this.diameter;
    }

    set height(value: number)
    {
        this.diameter = value;
    }

    willRender(camera: any): boolean
    {
        return !(Light.RENDER_MASK !== this.renderFlags || (this.cameraFilter !== 0 && (this.cameraFilter & camera.id)));
    }

    set(x: number, y: number, radius: number, r: number, g: number, b: number, intensity: number): this
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color.set(r, g, b);
        this.intensity = intensity;
        this.attenuation = 0.1;
        (this as any).visible = true;

        return this;
    }

    setPosition(x?: number, y?: number): this
    {
        if (x !== undefined) { this.x = x; }
        if (y !== undefined) { this.y = y; }

        return this;
    }

    setRadius(radius: number): this
    {
        this.radius = radius;

        return this;
    }

    setColor(rgb: number): this
    {
        var color = Utils.getFloatsFromUintRGB(rgb);

        this.color.set(color[0], color[1], color[2]);

        return this;
    }

    setIntensity(intensity: number): this
    {
        this.intensity = intensity;

        return this;
    }

    setAttenuation(value: number): this
    {
        this.attenuation = value;

        return this;
    }

}
