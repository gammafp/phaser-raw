/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DefaultPointLightNodes } from '../../renderer/webgl/renderNodes/defaults/DefaultPointLightNodes';
import { Mixin } from '../../utils/MixinTS';
import { AlphaSingle } from '../components/AlphaSingle';
import { BlendMode } from '../components/BlendMode';
import { Depth } from '../components/Depth';
import { Mask } from '../components/Mask';
import { RenderNodes } from '../components/RenderNodes';
import { ScrollFactor } from '../components/ScrollFactor';
import { Transform } from '../components/Transform';
import { Visible } from '../components/Visible';
import { IntegerToColor } from '../../display/color/IntegerToColor';
import { renderWebGL, renderCanvas } from './PointLightRender';

import { GameObject } from '../GameObject';

/**
 * @classdesc
 * The Point Light Game Object provides a way to add a point light effect into your game,
 * without the expensive shader processing requirements of the traditional Light Game Object.
 *
 * The difference is that the Point Light renders using a custom shader, designed to give the
 * impression of a point light source, of variable radius, intensity and color, in your game.
 * However, unlike the Light Game Object, it does not impact any other Game Objects, or use their
 * normal maps for calculations. This makes them extremely fast to render compared to Lights
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
 * @class PointLight
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Point Light belongs. A Point Light can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Point Light in the world.
 * @param {number} y - The vertical position of this Point Light in the world.
 * @param {number} [color=0xffffff] - The color of the Point Light, given as a hex value.
 * @param {number} [radius=128] - The radius of the Point Light.
 * @param {number} [intensity=1] - The intensity, or color blend, of the Point Light.
 * @param {number} [attenuation=0.1] - The attenuation  of the Point Light. This is the reduction of light from the center point.
 */
export interface PointLight extends
    AlphaSingle,
    BlendMode,
    Depth,
    Mask,
    RenderNodes,
    ScrollFactor,
    Transform,
    Visible {}

export class PointLight extends GameObject
{
    color: any;
    intensity: number;
    attenuation: number;
    _radius: number;

    static
    {
        Mixin(this, [
            AlphaSingle,
            BlendMode,
            Depth,
            Mask,
            RenderNodes,
            ScrollFactor,
            Transform,
            Visible,
            { renderWebGL, renderCanvas }
        ]);
    }

    constructor (scene: any, x: number, y: number, color: number = 0xffffff, radius: number = 128, intensity: number = 1, attenuation: number = 0.1)
    {
        super(scene, 'PointLight');

        this.initRenderNodes(this._defaultRenderNodesMap);

        this.setPosition(x, y);

        this.color = IntegerToColor(color);
        this.intensity = intensity;
        this.attenuation = attenuation;

        //  read only:
        this.width = radius * 2;
        this.height = radius * 2;

        this._radius = radius;
    }

    get _defaultRenderNodesMap (): any
    {
        return DefaultPointLightNodes;
    }

    get radius (): number
    {
        return this._radius;
    }

    set radius (value: number)
    {
        this._radius = value;
        this.width = value * 2;
        this.height = value * 2;
    }

    get originX (): number
    {
        return 0.5;
    }

    get originY (): number
    {
        return 0.5;
    }

    get displayOriginX (): number
    {
        return this._radius;
    }

    get displayOriginY (): number
    {
        return this._radius;
    }
}
