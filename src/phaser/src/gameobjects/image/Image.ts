/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import { Alpha } from '../components/Alpha';
import { BlendMode } from '../components/BlendMode';
import { Depth } from '../components/Depth';
import { Flip } from '../components/Flip';
import { GetBounds } from '../components/GetBounds';
import { Lighting } from '../components/Lighting';
import { Mask } from '../components/Mask';
import { Origin } from '../components/Origin';
import { RenderNodes } from '../components/RenderNodes';
import { ScrollFactor } from '../components/ScrollFactor';
import { Size } from '../components/Size';
import { TextureCrop } from '../components/TextureCrop';
import { Tint } from '../components/Tint';
import { Transform } from '../components/Transform';
import { Visible } from '../components/Visible';
import { renderWebGL, renderCanvas } from './ImageRender';

import { DefaultImageNodes } from '../../renderer/webgl/renderNodes/defaults/DefaultImageNodes';
import { GameObject } from '../GameObject';

/**
 * @classdesc
 * An Image Game Object.
 *
 * An Image is a light-weight Game Object useful for the display of static images in your game,
 * such as logos, backgrounds, scenery or other non-animated elements. Images can have input
 * events and physics bodies, or be tweened, tinted or scrolled. The main difference between an
 * Image and a Sprite is that you cannot animate an Image as they do not have the Animation component.
 *
 * @class Image
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */

// Interface merging - Image now has all component methods/properties with full TypeScript support
export interface Image extends 
    Alpha,
    BlendMode,
    Depth,
    Flip,
    GetBounds,
    Lighting,
    Mask,
    Origin,
    RenderNodes,
    ScrollFactor,
    Size,
    TextureCrop,
    Tint,
    Transform,
    Visible {}

export class Image extends GameObject {

    /**
     * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
     *
     * @name Phaser.GameObjects.Image#_crop
     * @type {object}
     * @private
     * @since 3.11.0
     */
    _crop: any;

    static
    {
        Mixin(this, [
            Alpha,
            BlendMode,
            Depth,
            Flip,
            GetBounds,
            Lighting,
            Mask,
            Origin,
            RenderNodes,
            ScrollFactor,
            Size,
            TextureCrop,
            Tint,
            Transform,
            Visible,
            { renderWebGL, renderCanvas }
        ]);
    }

    constructor(scene: any, x: number, y: number, texture: string | any, frame?: string | number)
    {
        super(scene, 'Image');

        this._crop = this.resetCropObject();

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOriginFromFrame();
        this.initRenderNodes(this._defaultRenderNodesMap);
    }

    /**
     * The default render nodes for this Game Object.
     *
     * @name Phaser.GameObjects.Image#_defaultRenderNodesMap
     * @type {Map<string, string>}
     * @private
     * @webglOnly
     * @readonly
     * @since 4.0.0
     */
    get _defaultRenderNodesMap(): any
    {
        return DefaultImageNodes;
    }
}
