/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Circle } from '../../geom/circle/Circle';
import { RGB } from '../../display/RGB';
import { Utils } from '../../renderer/webgl/Utils';
import { Mixin } from '../../utils/MixinTS';
import { Origin } from '../components/Origin';
import { ScrollFactor } from '../components/ScrollFactor';
import { Visible } from '../components/Visible';

/**
 * @classdesc
 * A 2D Light.
 *
 * These are created by the {@link Phaser.GameObjects.LightsManager}, available from within a scene via `this.lights`.
 *
 * Any Game Objects with the Lighting Component, and `setLighting(true)`,
 * will then be affected by these Lights.
 * If they have a normal map, it will be used.
 * If they don't, the Lights will use the default normal map, a flat surface.
 *
 * They can also simply be used to represent a point light for your own purposes.
 *
 * Lights cannot be added to Containers. They are designed to exist in the root of a Scene.
 *
 * @class Light
 * @extends Phaser.Geom.Circle
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {number} x - The horizontal position of the light.
 * @param {number} y - The vertical position of the light.
 * @param {number} radius - The radius of the light.
 * @param {number} r - The red color of the light. A value between 0 and 1.
 * @param {number} g - The green color of the light. A value between 0 and 1.
 * @param {number} b - The blue color of the light. A value between 0 and 1.
 * @param {number} intensity - The intensity of the light.
 * @param {number} [z] - The z position of the light. If not given, it will be set to `radius * 0.1`.
 */

export interface Light extends Origin, ScrollFactor, Visible {}

export class Light extends Circle
{
    static RENDER_MASK = 15;

    color: RGB;
    intensity: number;
    z: number;
    renderFlags: number;
    cameraFilter: number;

    static
    {
        Mixin(this, [
            Origin,
            ScrollFactor,
            Visible
        ]);
    }

    constructor (x: number, y: number, radius: number, r: number, g: number, b: number, intensity: number, z?: number)
    {
        super(x, y, radius);

        this.color = new RGB(r, g, b);
        this.intensity = intensity;
        this.z = z === undefined ? radius * 0.1 : z;
        this.renderFlags = 15;
        this.cameraFilter = 0;

        this.setScrollFactor(1, 1);
        this.setOrigin();
        this.setDisplayOrigin(radius);
    }

    get displayWidth (): number
    {
        return this.diameter;
    }

    set displayWidth (value: number)
    {
        this.diameter = value;
    }

    get displayHeight (): number
    {
        return this.diameter;
    }

    set displayHeight (value: number)
    {
        this.diameter = value;
    }

    get width (): number
    {
        return this.diameter;
    }

    set width (value: number)
    {
        this.diameter = value;
    }

    get height (): number
    {
        return this.diameter;
    }

    set height (value: number)
    {
        this.diameter = value;
    }

    get zNormal (): number
    {
        return this.z / this.radius;
    }

    set zNormal (value: number)
    {
        this.z = value * this.radius;
    }

    willRender (camera: any): boolean
    {
        return !(Light.RENDER_MASK !== this.renderFlags || (this.cameraFilter !== 0 && (this.cameraFilter & camera.id)));
    }

    setColor (rgb: number): this
    {
        const color = Utils.getFloatsFromUintRGB(rgb);

        this.color.set(color[0], color[1], color[2]);

        return this;
    }

    setIntensity (intensity: number): this
    {
        this.intensity = intensity;

        return this;
    }

    setRadius (radius: number): this
    {
        this.radius = radius;

        return this;
    }

    setZ (z: number): this
    {
        this.z = z;

        return this;
    }

    setZNormal (z: number): this
    {
        this.z = z * this.radius;

        return this;
    }
}
