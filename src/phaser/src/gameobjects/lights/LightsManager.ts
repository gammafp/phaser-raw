/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { SpliceOne } from '../../utils/array/SpliceOne';
import { StableSort } from '../../utils/array/StableSort';

import { CircleToRectangle } from '../../geom/intersects/CircleToRectangle';

import { DistanceBetween } from '../../math/distance/DistanceBetween';
import { RGB } from '../../display/RGB';
import { Utils } from '../../renderer/webgl/Utils';

import { Light } from './Light';
import { PointLight } from '../pointlight/PointLight';

interface LightDistanceEntry
{
    light: Light;
    distance: number;
}

/**
 * @callback LightForEach
 *
 * @param {Phaser.GameObjects.Light} light - The Light.
 */

/**
 * @classdesc
 * Manages Lights for a Scene.
 *
 * Affects the rendering of Game Objects with `lighting` enabled.
 *
 * @class LightsManager
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 */
export class LightsManager
{
    lights: Light[];
    ambientColor: RGB;
    active: boolean;
    maxLights: number;
    visibleLights: number;
    systems: any;
    scene: any;

    constructor ()
    {
        this.lights = [];
        this.ambientColor = new RGB(0.1, 0.1, 0.1);
        this.active = false;
        this.maxLights = -1;
        this.visibleLights = 0;
    }

    /**
     * Creates a new Point Light Game Object and adds it to the Scene.
     *
     * Note: This method will only be available if the Point Light Game Object has been built into Phaser.
     *
     * The Point Light Game Object provides a way to add a point light effect into your game,
     * without the expensive shader processing requirements of the traditional Light Game Object.
     *
     * The difference is that the Point Light renders using a custom shader, designed to give the
     * impression of a point light source, of variable radius, intensity and color, in your game.
     * However, unlike the Light Game Object, it does not impact any other Game Objects, or use their
     * normal maps for calcuations. This makes them extremely fast to render compared to Lights
     * and perfect for special effects, such as flickering torches or muzzle flashes.
     *
     * For maximum performance you should batch Point Light Game Objects together. This means
     * ensuring they follow each other consecutively on the display list. Ideally, use a Layer
     * Game Object and then add just Point Lights to it, so that it can batch together the rendering
     * of the lights. You don't _have_ to do this, and if you've only a handful of Point Lights in
     * your game then it's perfectly safe to mix them into the display list as normal. However, if
     * you're using a large number of them, please consider how they are mixed into the display list.
     *
     * The renderer will automatically cull Point Lights. Those with a radius that does not intersect
     * with the Camera will be skipped in the rendering list. This happens automatically and the
     * culled state is refreshed every frame, for every camera.
     *
     * The origin of a Point Light is always 0.5 and it cannot be changed.
     *
     * Point Lights are a WebGL only feature and do not have a Canvas counterpart.
     *
     * @method Phaser.GameObjects.LightsManager#addPointLight
     * @since 3.50.0
     *
     * @param {number} x - The horizontal position of this Point Light in the world.
     * @param {number} y - The vertical position of this Point Light in the world.
     * @param {number} [color=0xffffff] - The color of the Point Light, given as a hex value.
     * @param {number} [radius=128] - The radius of the Point Light.
     * @param {number} [intensity=1] - The intensity, or color blend, of the Point Light.
     * @param {number} [attenuation=0.1] - The attenuation  of the Point Light. This is the reduction of light from the center point.
     *
     * @return {Phaser.GameObjects.PointLight} The Game Object that was created.
     */
    addPointLight (x: number, y: number, color?: number, radius?: number, intensity?: number, attenuation?: number): any
    {
        return this.systems.displayList.add(new PointLight(this.scene, x, y, color, radius, intensity, attenuation));
    }

    /**
     * Enable the Lights Manager.
     *
     * @method Phaser.GameObjects.LightsManager#enable
     * @since 3.0.0
     *
     * @return {this} This Lights Manager instance.
     */
    enable (): this
    {
        if (this.maxLights === -1)
        {
            this.maxLights = this.systems.renderer.config.maxLights;
        }

        this.active = true;

        return this;
    }

    /**
     * Disable the Lights Manager.
     *
     * @method Phaser.GameObjects.LightsManager#disable
     * @since 3.0.0
     *
     * @return {this} This Lights Manager instance.
     */
    disable (): this
    {
        this.active = false;

        return this;
    }

    /**
     * Get all lights that can be seen by the given Camera.
     *
     * It will automatically cull lights that are outside the world view of the Camera.
     *
     * If more lights are returned than supported by the renderer, the lights are then culled
     * based on the distance from the center of the camera. Only those closest are rendered.
     *
     * @method Phaser.GameObjects.LightsManager#getLights
     * @since 3.50.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to cull Lights for.
     *
     * @return {Phaser.GameObjects.Light[]} The culled Lights.
     */
    getLights (camera: any): LightDistanceEntry[]
    {
        const lights = this.lights;
        const worldView = camera.worldView;

        let visibleLights: LightDistanceEntry[] = [];

        for (let i = 0; i < lights.length; i++)
        {
            const light = lights[i];

            if (light.willRender(camera) && CircleToRectangle(light, worldView))
            {
                visibleLights.push({
                    light,
                    distance: DistanceBetween(light.x, light.y, worldView.centerX, worldView.centerY)
                });
            }
        }

        if (visibleLights.length > this.maxLights)
        {
            //  We've got too many lights, so sort by distance from camera and cull those far away
            //  This isn't ideal because it doesn't factor in the radius of the lights, but it'll do for now
            //  and is significantly better than we had before!
            StableSort(visibleLights, this.sortByDistance);

            visibleLights = visibleLights.slice(0, this.maxLights);
        }

        this.visibleLights = visibleLights.length;

        return visibleLights;
    }

    sortByDistance (a: LightDistanceEntry, b: LightDistanceEntry): boolean
    {
        return (a.distance >= b.distance);
    }

    /**
     * Set the ambient light color.
     *
     * @method Phaser.GameObjects.LightsManager#setAmbientColor
     * @since 3.0.0
     *
     * @param {number} rgb - The integer RGB color of the ambient light.
     *
     * @return {this} This Lights Manager instance.
     */
    setAmbientColor (rgb: number): this
    {
        const color = Utils.getFloatsFromUintRGB(rgb);

        this.ambientColor.set(color[0], color[1], color[2]);

        return this;
    }

    /**
     * Returns the maximum number of Lights allowed to appear at once.
     *
     * @method Phaser.GameObjects.LightsManager#getMaxVisibleLights
     * @since 3.0.0
     *
     * @return {number} The maximum number of Lights allowed to appear at once.
     */
    getMaxVisibleLights (): number
    {
        return this.maxLights;
    }

    /**
     * Get the number of Lights managed by this Lights Manager.
     *
     * @method Phaser.GameObjects.LightsManager#getLightCount
     * @since 3.0.0
     *
     * @return {number} The number of Lights managed by this Lights Manager.
     */
    getLightCount (): number
    {
        return this.lights.length;
    }

    /**
     * Add a Light.
     *
     * @method Phaser.GameObjects.LightsManager#addLight
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal position of the Light.
     * @param {number} [y=0] - The vertical position of the Light.
     * @param {number} [radius=128] - The radius of the Light.
     * @param {number} [rgb=0xffffff] - The integer RGB color of the light.
     * @param {number} [intensity=1] - The intensity of the Light.
     * @param {number} [z] - The z position of the light. If omitted, it will be set to `radius * 0.1`.
     *
     * @return {Phaser.GameObjects.Light} The Light that was added.
     */
    addLight (x: number = 0, y: number = 0, radius: number = 128, rgb: number = 0xffffff, intensity: number = 1, z?: number): Light
    {
        const lightZ = z === undefined ? radius * 0.1 : z;
        const color = Utils.getFloatsFromUintRGB(rgb);

        const light = new Light(x, y, radius, color[0], color[1], color[2], intensity, lightZ);

        this.lights.push(light);

        return light;
    }

    /**
     * Remove a Light.
     *
     * @method Phaser.GameObjects.LightsManager#removeLight
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Light} light - The Light to remove.
     *
     * @return {this} This Lights Manager instance.
     */
    removeLight (light: Light): this
    {
        const index = this.lights.indexOf(light);

        if (index >= 0)
        {
            SpliceOne(this.lights, index);
        }

        return this;
    }

    /**
     * Shut down the Lights Manager.
     *
     * Recycles all active Lights into the Light pool, resets ambient light color and clears the lists of Lights and
     * culled Lights.
     *
     * @method Phaser.GameObjects.LightsManager#shutdown
     * @since 3.0.0
     */
    shutdown (): void
    {
        this.lights.length = 0;
    }

    /**
     * Destroy the Lights Manager.
     *
     * Cleans up all references by calling {@link Phaser.GameObjects.LightsManager#shutdown}.
     *
     * @method Phaser.GameObjects.LightsManager#destroy
     * @since 3.0.0
     */
    destroy (): void
    {
        this.shutdown();
    }
}
