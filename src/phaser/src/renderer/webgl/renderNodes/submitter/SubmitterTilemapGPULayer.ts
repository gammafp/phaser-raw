/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      None
 */

import { TransformMatrix } from '../../../../gameobjects/components/TransformMatrix';
import { Merge } from '../../../../utils/object/Merge';
import { Vector2 } from '../../../../math/Vector2';
import { ProgramManager } from '../../ProgramManager';
import { MakeAnimLength } from '../../shaders/additionMakers/MakeAnimLength';
import { MakeApplyLighting } from '../../shaders/additionMakers/MakeApplyLighting';
import { MakeDefineLights } from '../../shaders/additionMakers/MakeDefineLights';
import { MakeSampleNormal } from '../../shaders/additionMakers/MakeSampleNormal';
import { MakeSmoothPixelArt } from '../../shaders/additionMakers/MakeSmoothPixelArt';
import { TilemapGPULayerFrag } from '../../shaders/TilemapGPULayer-frag';
import { TilemapGPULayerVert } from '../../shaders/TilemapGPULayer-vert';
import { WebGLVertexBufferLayoutWrapper } from '../../wrappers/WebGLVertexBufferLayoutWrapper';
import { RenderNode } from '../RenderNode';
import { Utils } from '../../Utils';

/**
 * @classdesc
 * The SubmitterTilemapGPULayer RenderNode handles rendering of
 * TilemapGPULayer objects.
 *
 * It is a Stand Alone Render, meaning that it does not batch.
 *
 * @class SubmitterTilemapGPULayer
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
export class SubmitterTilemapGPULayer extends RenderNode {

    config: any;
    indexBuffer: any;
    vertexBufferLayout: WebGLVertexBufferLayoutWrapper;
    programManager: ProgramManager;
    _spriteMatrix: TransformMatrix;
    _calcMatrix: TransformMatrix;
    _lightVector: Vector2;
    _quad: Float32Array;

    static defaultConfig = {
        name: 'SubmitterTilemapGPULayer',
        shaderName: 'TilemapGPULayer',
        vertexSource: TilemapGPULayerVert,
        fragmentSource: TilemapGPULayerFrag,
        shaderAdditions: [
            MakeSmoothPixelArt(true),
            MakeSampleNormal(true),
            MakeDefineLights(true),
            MakeApplyLighting(true)
        ],
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            count: 4,
            layout: [
                { name: 'inPosition', size: 2 },
                { name: 'inTexCoord', size: 2 }
            ]
        }
    };

    constructor(manager: any, config?: any)
    {
        const renderer = manager.renderer;

        const finalConfig = Merge(config || {}, SubmitterTilemapGPULayer.defaultConfig);
        const name = finalConfig.name;
        SubmitterTilemapGPULayer._completeLayout(finalConfig);

        super(name, manager);

        this.config = finalConfig;
        this.indexBuffer = renderer.genericQuadIndexBuffer;

        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            finalConfig.vertexBufferLayout,
            null
        );

        this.programManager = new ProgramManager(
            renderer,
            [ this.vertexBufferLayout ],
            this.indexBuffer
        );

        this.programManager.setBaseShader(
            finalConfig.shaderName,
            finalConfig.vertexSource,
            finalConfig.fragmentSource
        );
        if (finalConfig.shaderAdditions)
        {
            for (let i = 0; i < finalConfig.shaderAdditions.length; i++)
            {
                const addition = finalConfig.shaderAdditions[i];
                this.programManager.addAddition(addition);
            }
        }
        if (finalConfig.shaderFeatures)
        {
            for (let i = 0; i < finalConfig.shaderFeatures.length; i++)
            {
                this.programManager.addFeature(finalConfig.shaderFeatures[i]);
            }
        }

        this._spriteMatrix = new TransformMatrix();
        this._calcMatrix = new TransformMatrix();
        this._lightVector = new Vector2();
        this._quad = new Float32Array(8);
    }

    static _completeLayout(config: any): void
    {
        let layoutSource = config.vertexBufferLayout;
        config.vertexBufferLayout = {};
        config.vertexBufferLayout.usage = layoutSource.usage;
        config.vertexBufferLayout.count = layoutSource.count || 4;
        config.vertexBufferLayout.layout = [];
        let remove = config.vertexBufferLayoutRemove || [];

        for (let i = 0; i < layoutSource.layout.length; i++)
        {
            const sourceAttr = layoutSource.layout[i];
            if (remove.indexOf(sourceAttr.name) !== -1)
            {
                continue;
            }
            config.vertexBufferLayout.layout[i] = {
                name: sourceAttr.name,
                size: sourceAttr.size || 1,
                type: sourceAttr.type || 'FLOAT',
                normalized: sourceAttr.normalized || false
            };
        }

        if (config.vertexBufferLayoutAdd)
        {
            const add = config.vertexBufferLayoutAdd || [];
            for (let i = 0; i < add.length; i++)
            {
                const addAttr = add[i];
                config.vertexBufferLayout.layout.push({
                    name: addAttr.name,
                    size: addAttr.size || 1,
                    type: addAttr.type || 'FLOAT',
                    normalized: addAttr.normalized || false
                });
            }
        }
    }

    setupUniforms(drawingContext: any, tilemapLayer: any): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uResolution', [ drawingContext.width, drawingContext.height ]);

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform('uProjectionMatrix', drawingContext.renderer.projectionMatrix.val);

        const tileset = tilemapLayer.tileset;
        const mainTexture = tileset.glTexture;
        const layerTexture = tilemapLayer.layerDataTexture;
        const animTexture = tileset.getAnimationDataTexture(drawingContext.renderer);

        programManager.setUniform('uMainSampler', 0);
        programManager.setUniform('uLayerSampler', 1);
        programManager.setUniform('uAnimSampler', 2);

        programManager.setUniform('uMainResolution', [ mainTexture.width, mainTexture.height ]);
        programManager.setUniform('uLayerResolution', [ layerTexture.width, layerTexture.height ]);
        programManager.setUniform('uAnimResolution', [ animTexture.width, animTexture.height ]);
        programManager.setUniform('uTileColumns', tileset.columns);
        programManager.setUniform('uTileWidthHeightMarginSpacing', [
            tileset.tileWidth,
            tileset.tileHeight,
            tileset.tileMargin,
            tileset.tileSpacing
        ]);
        programManager.setUniform('uAlpha', tilemapLayer.alpha);
        programManager.setUniform('uTime', tilemapLayer.timeElapsed);

        Utils.updateLightingUniforms(
            tilemapLayer.lighting,
            drawingContext,
            programManager,
            3,
            this._lightVector,
            tilemapLayer.selfShadow.enabled,
            tilemapLayer.selfShadow.diffuseFlatThreshold,
            tilemapLayer.selfShadow.penumbra
        );
    }

    updateRenderOptions(gameObject: any): void
    {
        const programManager = this.programManager;
        const texture = gameObject.tileset.image;

        const animAddition = programManager.getAdditionsByTag('MAXANIMS')[0];
        if (animAddition)
        {
            programManager.removeAddition(animAddition.name);
        }
        if (gameObject.tileset.maxAnimationLength > 0)
        {
            programManager.addAddition(MakeAnimLength(gameObject.tileset.maxAnimationLength));
        }

        const lighting = gameObject.lighting;
        const lightingAdditions = programManager.getAdditionsByTag('LIGHTING');
        for (let i = 0; i < lightingAdditions.length; i++)
        {
            const addition = lightingAdditions[i];
            addition.disable = !lighting;
        }

        if (lighting)
        {
            const defineLightsAddition = programManager.getAddition('DefineLights');
            if (defineLightsAddition)
            {
                defineLightsAddition.additions.fragmentDefine =
                    '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
            }
        }

        let selfShadow = gameObject.selfShadow.enabled;
        if (selfShadow === null)
        {
            selfShadow = gameObject.scene.sys.game.config.selfShadow;
        }
        if (selfShadow)
        {
            programManager.addFeature('SELFSHADOW');
        }
        else
        {
            programManager.removeFeature('SELFSHADOW');
        }

        let smoothPixelArt = texture.smoothPixelArt;
        if (smoothPixelArt === null)
        {
            smoothPixelArt = gameObject.scene.sys.game.config.smoothPixelArt;
        }
        const smoothPixelArtAddition = programManager.getAddition('SmoothPixelArt');
        if (smoothPixelArtAddition)
        {
            smoothPixelArtAddition.disable = !smoothPixelArt;
        }

        const borderFilter = texture.source[0].glTexture.magFilter === this.manager.renderer.gl.LINEAR;
        if (borderFilter)
        {
            programManager.addFeature('BORDERFILTER');
        }
        else
        {
            programManager.removeFeature('BORDERFILTER');
        }
    }

    run(drawingContext: any, tilemapLayer: any, parentMatrix?: any): void
    {
        const manager = this.manager;
        const renderer = manager.renderer;

        manager.startStandAloneRender();

        this.onRunBegin(drawingContext);

        const camera = drawingContext.camera;
        const spriteMatrix = this._spriteMatrix;
        const calcMatrix = this._calcMatrix;
        const quad = this._quad;

        const x = tilemapLayer.x;
        const y = tilemapLayer.y;
        const width = tilemapLayer.width;
        const height = tilemapLayer.height;

        calcMatrix.copyWithScrollFactorFrom(
            camera.getViewMatrix(!drawingContext.useCanvas),
            camera.scrollX, camera.scrollY,
            tilemapLayer.scrollFactorX, tilemapLayer.scrollFactorY
        );

        if (parentMatrix)
        {
            calcMatrix.multiply(parentMatrix);
        }

        spriteMatrix.applyITRS(x, y, 0, tilemapLayer.scaleX, tilemapLayer.scaleY);
        calcMatrix.multiply(spriteMatrix);

        calcMatrix.setQuad(
            x,
            y,
            x + width,
            y + height,
            quad
        );

        const stride = this.vertexBufferLayout.layout.stride;
        const vertexBuffer = this.vertexBufferLayout.buffer;
        const vertexF32 = vertexBuffer.viewF32;
        let offset32 = 0;

        vertexF32[offset32++] = quad[2];
        vertexF32[offset32++] = quad[3];
        vertexF32[offset32++] = 0;
        vertexF32[offset32++] = 0;

        vertexF32[offset32++] = quad[0];
        vertexF32[offset32++] = quad[1];
        vertexF32[offset32++] = 0;
        vertexF32[offset32++] = 1;

        vertexF32[offset32++] = quad[4];
        vertexF32[offset32++] = quad[5];
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = 0;

        vertexF32[offset32++] = quad[6];
        vertexF32[offset32++] = quad[7];
        vertexF32[offset32++] = 1;
        vertexF32[offset32++] = 1;

        vertexBuffer.update(stride * 4);

        const tileset = tilemapLayer.tileset;
        const mainGlTexture = tileset.glTexture;
        const animated = tileset.getAnimationDataIndexMap(renderer).size > 0;

        const textures: any[] = [
            mainGlTexture,
            tilemapLayer.layerDataTexture
        ];

        if (animated)
        {
            textures[2] = tileset.getAnimationDataTexture(renderer);
        }

        if (tilemapLayer.lighting)
        {
            const texture = tileset.image;
            let normalMap = texture.dataSource[0];
            if (!normalMap)
            {
                normalMap = this.manager.renderer.normalTexture;
            }
            else
            {
                normalMap = normalMap.glTexture;
            }
            textures[3] = normalMap;
        }

        this.updateRenderOptions(tilemapLayer);

        const programManager = this.programManager;
        const programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            const program = programSuite.program;
            const vao = programSuite.vao;

            this.setupUniforms(drawingContext, tilemapLayer);
            programManager.applyUniforms(program);

            renderer.drawElements(
                drawingContext,
                textures,
                program,
                vao,
                4,
                0
            );
        }

        this.onRunEnd(drawingContext);
    }
}
