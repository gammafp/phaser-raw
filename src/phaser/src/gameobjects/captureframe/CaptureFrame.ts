/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DrawingContext } from '../../renderer/webgl/DrawingContext';
import { DefaultQuadNodes } from '../../renderer/webgl/renderNodes/defaults/DefaultQuadNodes';
import { Mixin } from '../../utils/MixinTS';
import { BlendMode } from '../components/BlendMode';
import { Depth } from '../components/Depth';
import { RenderNodes } from '../components/RenderNodes';
import { Visible } from '../components/Visible';
import { renderWebGL, renderCanvas } from './CaptureFrameRender';

import { GameObject } from '../GameObject';

/**
 * @classdesc
 * A CaptureFrame is a special type of GameObject that allows you to
 * capture the current state of the render.
 * For example, if you place a CaptureFrame between two other objects,
 * it will capture the first object to a texture, but not the second.
 * This is useful for full-scene post-processing prior to render completion,
 * such as a layer of water.
 *
 * This is a WebGL only feature and is not available in Canvas mode.
 *
 * You must activate the `forceComposite` property of the Camera,
 * or otherwise use this object within a framebuffer, to use this feature.
 * Examples of framebuffer situations include Filters, DynamicTexture,
 * and a camera with alpha between 0 and 1.
 *
 * This object does not render anything. It simply captures a texture
 * from the current framebuffer at the moment it 'renders'.
 * If you add filters to this object, it will capture the clear, temporary
 * framebuffer used for the filter, not the main framebuffer.
 * If you add filters to a Container that contains this object,
 * it will capture only objects within that Container.
 * If you set `visible` to `false`, it will just stop capturing.
 *
 * @example
 * // Within a Scene's `create` method:
 *
 * // This image will be captured:
 * var image1 = this.add.image(0, 0, 'image1');
 *
 * // Enable framebuffer usage:
 * this.cameras.main.setForceComposite(true);
 *
 * // Set up a CaptureFrame:
 * var captureFrame = this.add.captureFrame('myCaptureFrame');
 *
 * // This image will not be captured, and can display the captured image:
 * var image2 = this.add.image(0, 0, 'myCaptureFrame');
 * // Add filters to image2 to distort the captured image.
 *
 * @class CaptureFrame
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 4.0.0
 * @webglOnly
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this CaptureFrame belongs.
 * @param {string} key - The key of the texture to create from this CaptureFrame.
 */
export interface CaptureFrame extends BlendMode, Depth, RenderNodes, Visible {}

export class CaptureFrame extends GameObject
{
    drawingContext: DrawingContext;
    captureTexture: any;

    static
    {
        Mixin(this, [
            BlendMode,
            Depth,
            RenderNodes,
            Visible,
            { renderWebGL, renderCanvas }
        ]);
    }

    constructor (scene: any, key: string)
    {
        super(scene, 'CaptureFrame');

        const renderer = scene.renderer;

        this.drawingContext = new DrawingContext(renderer, {
            width: renderer.width,
            height: renderer.height
        });

        this.captureTexture = scene.sys.textures.addGLTexture(key, this.drawingContext.texture);

        this.initRenderNodes(this._defaultRenderNodesMap);
    }

    get _defaultRenderNodesMap (): any
    {
        return DefaultQuadNodes;
    }

    setAlpha (_alpha: number): this
    {
        return this;
    }

    setScrollFactor (_x: number, _y: number): this
    {
        return this;
    }
}
