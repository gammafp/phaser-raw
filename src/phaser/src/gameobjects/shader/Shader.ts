/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../utils/object/GetFastValue';

import { Vector2 } from '../../math/Vector2';
import { BaseCamera } from '../../cameras/2d/BaseCamera';
import { ShaderQuad } from '../../renderer/webgl/renderNodes/ShaderQuad';
import { DrawingContext } from '../../renderer/webgl/DrawingContext';
import { Mixin } from '../../utils/MixinTS';
import { BlendMode } from '../components/BlendMode';
import { ComputedSize } from '../components/ComputedSize';
import { Depth } from '../components/Depth';
import { GetBounds } from '../components/GetBounds';
import { Origin } from '../components/Origin';
import { ScrollFactor } from '../components/ScrollFactor';
import { Transform } from '../components/Transform';
import { Visible } from '../components/Visible';
import { renderWebGL, renderCanvas } from './ShaderRender';

import { GameObject } from '../GameObject';

export interface Shader extends
    BlendMode,
    ComputedSize,
    Depth,
    GetBounds,
    Origin,
    ScrollFactor,
    Transform,
    Visible {}

/**
 * @classdesc
 * A Shader Game Object.
 *
 * This Game Object allows you to easily add a quad with its own shader
 * into the display list, and manipulate it as you would any other Game Object,
 * including scaling, rotating, positioning and adding to Containers.
 * The Shader can be made interactive and used for input events.
 * It can also be used in filters to create visually stunning effects.
 *
 * It works by creating a custom RenderNode which runs a custom shader program
 * to draw a quad. The shader program can be loaded from the Shader Cache,
 * or provided in-line as strings.
 *
 * Please see the Phaser 3 Examples GitHub repo for several examples
 * of loading and creating shaders dynamically.
 *
 * Due to the way in which they work, you cannot directly change the alpha
 * of a Shader. It should be handled via uniforms in the shader code itself.
 *
 * By default, a Shader has a uniform called `uProjectionMatrix`
 * which is set automatically.
 * You can control additional uniforms using the `setupUniforms` method
 * in the Shader configuration object, which runs every time the shader renders.
 *
 * Shaders are stand-alone renders: they finish any current render batch
 * and run once by themselves. As this costs a draw call, you should use them sparingly.
 * If you need to have a fully batched custom shader, then please look at using
 * a custom RenderNode instead. However, for background or special masking effects,
 * they are extremely effective.
 */
export class Shader extends GameObject
{
    textures: any[];
    renderNode: ShaderQuad | null;
    drawingContext: DrawingContext | null;
    glTexture: any;
    renderToTexture: boolean;
    texture: any;
    textureCoordinateTopLeft: Vector2;
    textureCoordinateTopRight: Vector2;
    textureCoordinateBottomLeft: Vector2;
    textureCoordinateBottomRight: Vector2;
    setupUniforms: (setUniform: (name: string, value: any) => void, drawingContext: any) => void;

    static
    {
        Mixin(this, [
            BlendMode,
            ComputedSize,
            Depth,
            GetBounds,
            Origin,
            ScrollFactor,
            Transform,
            Visible,
            { renderWebGL, renderCanvas }
        ]);
    }

    constructor (scene: any, config: string | any = {}, x: number = 0, y: number = 0, width: number = 128, height: number = 128, textures?: string[] | any[])
    {
        if (typeof config === 'string')
        {
            config = { fragmentKey: config };
        }

        super(scene, 'Shader');

        const renderer = scene.sys.renderer;

        this.textures = [];
        this.renderNode = new ShaderQuad(renderer.renderNodes, config);
        this.setupUniforms = GetFastValue(config, 'setupUniforms', function (): void {});

        if (config.updateShaderConfig)
        {
            this.renderNode.updateShaderConfig = config.updateShaderConfig;
        }

        const initialUniforms = GetFastValue(config, 'initialUniforms', {});

        Object.entries(initialUniforms).forEach((entry: any) =>
        {
            this.setUniform(entry[0], entry[1]);
        });

        this.drawingContext = null;
        this.glTexture = null;
        this.renderToTexture = false;
        this.texture = null;

        this.textureCoordinateTopLeft = new Vector2(0, 1);
        this.textureCoordinateTopRight = new Vector2(1, 1);
        this.textureCoordinateBottomLeft = new Vector2(0, 0);
        this.textureCoordinateBottomRight = new Vector2(1, 0);

        this.setTextures(textures);
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5, 0.5);
    }

    getUniform (name: string): any
    {
        return (this.renderNode as ShaderQuad).programManager.uniforms[name];
    }

    setUniform (name: string, value: any): this
    {
        (this.renderNode as ShaderQuad).programManager.setUniform(name, value);

        return this;
    }

    setTextures (textures: string[] | any[] = []): this
    {
        this.textures.length = 0;

        for (let i = 0; i < textures.length; i++)
        {
            let texture = textures[i];

            if (typeof texture === 'string')
            {
                texture = this.scene.textures.get(texture);
            }

            this.textures.push(texture);
        }

        return this;
    }

    setRenderToTexture (key?: string): this
    {
        if (this.renderToTexture)
        {
            return this;
        }

        const width = this.width;
        const height = this.height;
        const renderer = this.scene.sys.renderer;
        const scene = this.scene;

        const camera = new BaseCamera(0, 0, width, height).setScene(scene.game.scene.systemScene, false);

        this.drawingContext = new DrawingContext(renderer, {
            width,
            height,
            camera
        });

        this.glTexture = this.drawingContext.texture;

        if (key)
        {
            this.texture = scene.sys.textures.addGLTexture(key, this.glTexture);
        }

        this.renderToTexture = true;

        // Render at least once, so our texture isn't blank on the first update
        this.renderWebGLStep(renderer, this, this.drawingContext);

        return this;
    }

    renderImmediate (): this
    {
        this.renderWebGLStep(this.scene.renderer, this, this.drawingContext);

        return this;
    }

    setAlpha (): this
    {
        return this;
    }

    setTextureCoordinates (
        topLeftX: number = 0,
        topLeftY: number = 1,
        topRightX: number = 1,
        topRightY: number = 1,
        bottomLeftX: number = 0,
        bottomLeftY: number = 0,
        bottomRightX: number = 1,
        bottomRightY: number = 0
    ): this
    {
        this.textureCoordinateTopLeft.set(topLeftX, topLeftY);
        this.textureCoordinateTopRight.set(topRightX, topRightY);
        this.textureCoordinateBottomLeft.set(bottomLeftX, bottomLeftY);
        this.textureCoordinateBottomRight.set(bottomRightX, bottomRightY);

        return this;
    }

    setTextureCoordinatesFromFrame (frame: any, texture?: any): void
    {
        if (typeof frame === 'string')
        {
            if (!texture)
            {
                texture = this.textures[0];
            }
            else if (typeof texture === 'string')
            {
                texture = this.scene.textures.get(texture);
            }

            frame = texture.get(frame);
        }

        const u0 = frame.u0;
        const v0 = frame.v0;
        const u1 = frame.u1;
        const v1 = frame.v1;

        this.setTextureCoordinates(u0, v0, u1, v0, u0, v1, u1, v1);
    }

    preDestroy (): void
    {
        this.renderNode = null;
        this.textures.length = 0;

        if (this.drawingContext)
        {
            this.drawingContext.destroy();

            if (this.texture)
            {
                this.texture.destroy();
            }

            this.drawingContext = null;
            this.glTexture = null;
            this.texture = null;
        }
    }
}
