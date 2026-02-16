/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { WebGLVertexBufferLayoutWrapper } from '../wrappers/WebGLVertexBufferLayoutWrapper';
import { ProgramManager } from '../ProgramManager';
import { RenderNode } from './RenderNode';

import { ShaderQuadVert as ShaderSourceVS } from '../shaders/ShaderQuad-vert';
import { ShaderQuadFrag as ShaderSourceFS } from '../shaders/ShaderQuad-frag';

/**
 * @classdesc
 * A RenderNode that renders a quad using a shader program.
 * This is used for custom rendering effects and post-processing.
 *
 * @class ShaderQuad
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.GameObjects.Shader.ShaderQuadConfig} config - The configuration object for this RenderNode.
 */
export class ShaderQuad extends RenderNode {

    renderer: any;
    indexBuffer: any;
    vertexBufferLayout: WebGLVertexBufferLayoutWrapper;
    programManager: ProgramManager;
    setUniform: (name: string, value: any) => void;
    transformerNode: any;
    _texturerProxy: any;

    constructor(manager: any, config: any)
    {
        super('ShaderQuad', manager);

        const renderer = manager.renderer;

        this.renderer = renderer;

        config = this._completeConfig(config);

        if (config.updateShaderConfig)
        {
            this.updateShaderConfig = config.updateShaderConfig;
        }

        this.indexBuffer = renderer.genericQuadIndexBuffer;

        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            config.vertexBufferLayout,
            null
        );

        this.programManager = new ProgramManager(
            renderer,
            [ this.vertexBufferLayout ],
            this.indexBuffer
        );

        this.programManager.setBaseShader(
            config.shaderName,
            config.vertexSource,
            config.fragmentSource
        );
        for (let i = 0; i < config.shaderAdditions.length; i++)
        {
            const addition = config.shaderAdditions[i];
            this.programManager.addAddition(addition);
        }

        this.setUniform = this.programManager.setUniform.bind(this.programManager);

        this.transformerNode = manager.getNode('TransformerImage');

        this._texturerProxy = {
            frameWidth: 1,
            frameHeight: 1,
            frame: { realWidth: 1, realHeight: 1 },
            uvSource: { x: 0, y: 0 }
        };
    }

    _completeConfig(config: any): any
    {
        const gl = this.renderer.gl;

        let vertexSource = config.vertexSource;
        if (!vertexSource)
        {
            const vertexKey = config.vertexKey;
            if (vertexKey)
            {
                const baseShader = this.manager.renderer.game.cache.shader.get(vertexKey);
                if (baseShader && baseShader.glsl)
                {
                    vertexSource = baseShader.glsl;
                }
            }
        }
        if (!vertexSource)
        {
            vertexSource = ShaderSourceVS;
        }

        let fragmentSource = config.fragmentSource;
        if (!fragmentSource)
        {
            const fragmentKey = config.fragmentKey;
            if (fragmentKey)
            {
                const baseShader = this.manager.renderer.game.cache.shader.get(fragmentKey);
                if (baseShader && baseShader.glsl)
                {
                    fragmentSource = baseShader.glsl;
                }
            }
        }
        if (!fragmentSource)
        {
            fragmentSource = ShaderSourceFS;
        }

        return {
            name: config.name || 'ShaderQuad',
            shaderName: config.shaderName || config.name || 'ShaderQuad',
            vertexSource: vertexSource,
            fragmentSource: fragmentSource,
            shaderAdditions: config.shaderAdditions || [],
            vertexBufferLayout: {
                usage: 'DYNAMIC_DRAW',
                count: 4,
                layout: [
                    {
                        name: 'inPosition',
                        size: 2,
                        type: gl.FLOAT,
                        normalized: false
                    },
                    {
                        name: 'inTexCoord',
                        size: 2,
                        type: gl.FLOAT,
                        normalized: false
                    }
                ]
            }
        };
    }

    run(drawingContext: any, gameObject: any, parentMatrix?: any): void
    {
        const manager = this.manager;
        const renderer = this.renderer;

        manager.startStandAloneRender();

        this.onRunBegin(drawingContext);

        const width = gameObject.width;
        const height = gameObject.height;
        this._texturerProxy.frame.realWidth = width;
        this._texturerProxy.frame.realHeight = height;
        this._texturerProxy.frameWidth = width;
        this._texturerProxy.frameHeight = height;

        let xTL: number, yTL: number, xBL: number, yBL: number, xBR: number, yBR: number, xTR: number, yTR: number;

        if (gameObject.renderToTexture)
        {
            xTL = 0;
            yTL = 0;
            xBL = 0;
            yBL = height;
            xBR = width;
            yBR = height;
            xTR = width;
            yTR = 0;
        }
        else
        {
            const transformerNode = this.transformerNode;
            transformerNode.run(drawingContext, gameObject, this._texturerProxy, parentMatrix);
            const quad = transformerNode.quad;

            xTL = quad[0];
            yTL = quad[1];
            xBL = quad[2];
            yBL = quad[3];
            xBR = quad[4];
            yBR = quad[5];
            xTR = quad[6];
            yTR = quad[7];
        }

        const stride = this.vertexBufferLayout.layout.stride;
        const vertexBuffer = this.vertexBufferLayout.buffer;
        const vertexF32 = vertexBuffer.viewF32;
        let offset32 = 0;

        vertexF32[offset32++] = xBL;
        vertexF32[offset32++] = yBL;
        vertexF32[offset32++] = gameObject.textureCoordinateBottomLeft.x;
        vertexF32[offset32++] = gameObject.textureCoordinateBottomLeft.y;

        vertexF32[offset32++] = xTL;
        vertexF32[offset32++] = yTL;
        vertexF32[offset32++] = gameObject.textureCoordinateTopLeft.x;
        vertexF32[offset32++] = gameObject.textureCoordinateTopLeft.y;

        vertexF32[offset32++] = xBR;
        vertexF32[offset32++] = yBR;
        vertexF32[offset32++] = gameObject.textureCoordinateBottomRight.x;
        vertexF32[offset32++] = gameObject.textureCoordinateBottomRight.y;

        vertexF32[offset32++] = xTR;
        vertexF32[offset32++] = yTR;
        vertexF32[offset32++] = gameObject.textureCoordinateTopRight.x;
        vertexF32[offset32++] = gameObject.textureCoordinateTopRight.y;

        vertexBuffer.update(stride * 4);

        const programManager = this.programManager;
        this.updateShaderConfig(drawingContext, gameObject, this);
        const programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            const program = programSuite.program;
            const vao = programSuite.vao;
            const setUniform = this.setUniform;

            renderer.setProjectionMatrixFromDrawingContext(drawingContext);
            setUniform(
                'uProjectionMatrix',
                drawingContext.renderer.projectionMatrix.val
            );

            gameObject.setupUniforms(setUniform, drawingContext);

            programManager.applyUniforms(program);

            renderer.drawElements(
                drawingContext,
                this.setupTextures(gameObject),
                program,
                vao,
                4,
                0
            );
        }

        this.onRunEnd(drawingContext);
    }

    setupTextures(gameObject: any): any[]
    {
        const textures = gameObject.textures;
        const glTextures: any[] = [];

        for (let i = 0; i < textures.length; i++)
        {
            const texture = textures[i];
            const glTexture = texture.get().source.glTexture;
            glTextures.push(glTexture);
        }

        return glTextures;
    }

    updateShaderConfig(drawingContext: any, gameObject: any, renderNode: any): void
    {
        // NOOP.
    }
}
