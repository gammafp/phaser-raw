/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from '../../../../gameobjects/components/TransformMatrix';
import { Merge } from '../../../../utils/object/Merge';
import { Vector2 } from '../../../../math/Vector2';
import { ProgramManager } from '../../ProgramManager';
import { MakeApplyLighting } from '../../shaders/additionMakers/MakeApplyLighting';
import { MakeApplyTint } from '../../shaders/additionMakers/MakeApplyTint';
import { MakeDefineLights } from '../../shaders/additionMakers/MakeDefineLights';
import { MakeDefineTexCount } from '../../shaders/additionMakers/MakeDefineTexCount';
import { MakeGetNormalFromMap } from '../../shaders/additionMakers/MakeGetNormalFromMap';
import { MakeGetTexCoordOut } from '../../shaders/additionMakers/MakeGetTexCoordOut';
import { MakeGetTexRes } from '../../shaders/additionMakers/MakeGetTexRes';
import { MakeGetTexture } from '../../shaders/additionMakers/MakeGetTexture';
import { MakeOutInverseRotation } from '../../shaders/additionMakers/MakeOutInverseRotation';
import { MakeSmoothPixelArt } from '../../shaders/additionMakers/MakeSmoothPixelArt';
import { Utils } from '../../Utils';
import { WebGLVertexBufferLayoutWrapper } from '../../wrappers/WebGLVertexBufferLayoutWrapper';
import { RenderNode } from '../RenderNode';
import { SpriteGPULayerFrag } from '../../shaders/SpriteGPULayer-frag';
import { SpriteGPULayerVert } from '../../shaders/SpriteGPULayer-vert';

/**
 * @classdesc
 * This RenderNode handles rendering of a single SpriteGPULayer object.
 * A new instance of the RenderNode should be created for each SpriteGPULayer object,
 * as it stores the shader program and vertex buffer data for the object.
 *
 * It is a Stand Alone Render, meaning that it does not batch.
 * It is best suited to rendering highly complex objects.
 *
 * @class SubmitterSpriteGPULayer
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayerConfig} config - The configuration object for this handler.
 * @param {Phaser.GameObjects.SpriteGPULayer} gameObject - The SpriteGPULayer object to render.
 */
export class SubmitterSpriteGPULayer extends RenderNode {

    config: any;
    gameObject: any;
    instanceBufferLayout: WebGLVertexBufferLayoutWrapper;
    vertexBufferLayout: WebGLVertexBufferLayoutWrapper;
    programManager: ProgramManager;
    _calcMatrix: TransformMatrix;
    _lightVector: Vector2;
    indexBuffer: any;

    static defaultConfig = {
        name: 'SubmitterSpriteGPULayer',
        count: 0,
        shaderName: 'SpriteGPULayer',
        vertexSource: SpriteGPULayerVert,
        fragmentSource: SpriteGPULayerFrag,
        shaderAdditions: [
            MakeGetTexCoordOut(),
            MakeGetTexRes(),
            MakeSmoothPixelArt(true),
            MakeDefineTexCount(1),
            MakeGetTexture(),
            MakeApplyTint(),
            MakeDefineLights(true),
            MakeOutInverseRotation(true),
            MakeGetNormalFromMap(true),
            MakeApplyLighting(true)
        ],
        instanceBufferLayout: {
            usage: 'STATIC_DRAW',
            instanceDivisor: 1,
            layout: [
                { name: 'inPositionX', size: 4 },
                { name: 'inPositionY', size: 4 },
                { name: 'inRotation', size: 4 },
                { name: 'inScaleX', size: 4 },
                { name: 'inScaleY', size: 4 },
                { name: 'inAlpha', size: 4 },
                { name: 'inFrame', size: 4 },
                { name: 'inTintBlend', size: 4 },
                { name: 'inTintBL', size: 4, type: 'UNSIGNED_BYTE', normalized: true },
                { name: 'inTintTL', size: 4, type: 'UNSIGNED_BYTE', normalized: true },
                { name: 'inTintBR', size: 4, type: 'UNSIGNED_BYTE', normalized: true },
                { name: 'inTintTR', size: 4, type: 'UNSIGNED_BYTE', normalized: true },
                { name: 'inOriginAndTintFillAndCreationTime', size: 4 },
                { name: 'inScrollFactor', size: 2 }
            ]
        },
        vertexBufferLayout: {
            usage: 'STATIC_DRAW',
            count: 4,
            layout: [
                { name: 'inVertex', type: 'UNSIGNED_BYTE' }
            ]
        }
    };

    constructor(manager: any, config: any, gameObject: any)
    {
        const renderer = manager.renderer;

        const finalConfig = Merge(config || {}, SubmitterSpriteGPULayer.defaultConfig);
        const name = finalConfig.name;
        SubmitterSpriteGPULayer._completeLayout(finalConfig);

        super(name, manager);

        this.config = finalConfig;
        this.gameObject = gameObject;

        this.instanceBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            finalConfig.instanceBufferLayout,
            null
        );

        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            finalConfig.vertexBufferLayout,
            null
        );

        const vertexBuffer = this.vertexBufferLayout.buffer;
        const vertexBufferViewU8 = vertexBuffer.viewU8;
        vertexBufferViewU8[0] = 0;
        vertexBufferViewU8[1] = 1;
        vertexBufferViewU8[2] = 2;
        vertexBufferViewU8[3] = 3;
        vertexBuffer.update();

        this.programManager = new ProgramManager(
            renderer,
            [ this.vertexBufferLayout, this.instanceBufferLayout ],
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

        this._calcMatrix = new TransformMatrix();
        this._lightVector = new Vector2();
    }

    _completeLayout(config: any): void
    {
        let layoutSource = config.vertexBufferLayout;
        config.vertexBufferLayout = {};
        config.vertexBufferLayout.usage = layoutSource.usage;
        config.vertexBufferLayout.count = layoutSource.count;
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

        layoutSource = config.instanceBufferLayout;
        config.instanceBufferLayout = {};
        config.instanceBufferLayout.usage = layoutSource.usage;
        config.instanceBufferLayout.instanceDivisor = layoutSource.instanceDivisor;
        config.instanceBufferLayout.layout = [];
        remove = config.instanceBufferLayoutRemove || [];

        for (let i = 0; i < layoutSource.layout.length; i++)
        {
            const sourceAttr = layoutSource.layout[i];
            if (remove.indexOf(sourceAttr.name) !== -1)
            {
                continue;
            }
            config.instanceBufferLayout.layout[i] = {
                name: sourceAttr.name,
                size: sourceAttr.size || 1,
                type: sourceAttr.type || 'FLOAT',
                normalized: sourceAttr.normalized || false
            };
        }

        if (config.instanceBufferLayoutAdd)
        {
            const add = config.instanceBufferLayoutAdd || [];
            for (let i = 0; i < add.length; i++)
            {
                const addAttr = add[i];
                config.instanceBufferLayout.layout.push({
                    name: addAttr.name,
                    size: addAttr.size || 1,
                    type: addAttr.type || 'FLOAT',
                    normalized: addAttr.normalized || false
                });
            }
        }
    }

    setupUniforms(drawingContext: any): void
    {
        const camera = drawingContext.camera;
        const programManager = this.programManager;
        const layer = this.gameObject;

        programManager.setUniform('uRoundPixels', camera.roundPixels);
        programManager.setUniform('uResolution', [ drawingContext.width, drawingContext.height ]);

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform('uProjectionMatrix', drawingContext.renderer.projectionMatrix.val);

        const cm = camera.matrixCombined;
        programManager.setUniform('uViewMatrix', [
            cm.a, cm.b, 0,
            cm.c, cm.d, 0,
            cm.tx, cm.ty, 1
        ]);

        programManager.setUniform('uCameraScrollAndAlpha', [
            camera.scrollX,
            camera.scrollY,
            layer.alpha
        ]);

        programManager.setUniform('uTime', layer.timeElapsed);
        programManager.setUniform('uDiffuseResolution', [
            layer.frame.source.width,
            layer.frame.source.height
        ]);
        programManager.setUniform('uFrameDataResolution', [
            layer.frameDataTexture.width,
            layer.frameDataTexture.height
        ]);
        programManager.setUniform('uGravity', layer.gravity);

        programManager.setUniform('uMainSampler[0]', 0);
        programManager.setUniform('uFrameDataTexture', 1);

        const glTexture = layer.texture.source[0].glTexture;
        programManager.setUniform('uMainResolution[0]', [ glTexture.width, glTexture.height ]);

        Utils.updateLightingUniforms(
            layer.lighting,
            drawingContext,
            programManager,
            2,
            this._lightVector,
            layer.selfShadow.enabled,
            layer.selfShadow.diffuseFlatThreshold,
            layer.selfShadow.penumbra
        );
    }

    updateRenderOptions(): void
    {
        const programManager = this.programManager;

        const lighting = this.gameObject.lighting;
        const lightingAdditions = programManager.getAdditionsByTag('LIGHTING');
        for (let i = 0; i < lightingAdditions.length; i++)
        {
            lightingAdditions[i].disable = !lighting;
        }

        if (lighting)
        {
            const defineLightsAddition = programManager.getAddition('DefineLights');
            if (defineLightsAddition)
            {
                defineLightsAddition.additions.fragmentDefine = '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
            }
        }

        const smoothAddition = programManager.getAddition('SmoothPixelArt');
        if (smoothAddition)
        {
            let smoothPixelArt = this.gameObject.texture.smoothPixelArt;
            if (smoothPixelArt === null)
            {
                smoothPixelArt = this.gameObject.scene.game.config.smoothPixelArt;
            }
            smoothAddition.disable = !smoothPixelArt;
        }

        programManager.clearFeatures();
        const shaderFeatures = this.gameObject.getShaderFeatures();
        for (let i = 0; i < shaderFeatures.length; i++)
        {
            programManager.addFeature(shaderFeatures[i]);
        }

        if (this.gameObject.selfShadow.enabled)
        {
            programManager.addFeature('SELFSHADOW');
        }
    }

    run(drawingContext: any): void
    {
        const layer = this.gameObject;

        if (layer.memberCount === 0)
        {
            return;
        }

        this.manager.startStandAloneRender();

        this.onRunBegin(drawingContext);

        const segments = layer.bufferUpdateSegments;
        if (segments > 0)
        {
            const buffer = this.instanceBufferLayout.buffer;
            const memberCount = layer.memberCount;

            const lastSegment = Math.floor(memberCount / layer.bufferUpdateSegmentSize);
            let occupiedSegmentsAllUpdated = true;
            for (let i = 0; i <= lastSegment; i++)
            {
                if (1 << i & segments)
                {
                    continue;
                }
                occupiedSegmentsAllUpdated = false;
                break;
            }

            if (
                segments === layer.MAX_BUFFER_UPDATE_SEGMENTS_FULL ||
                memberCount <= layer.bufferUpdateSegmentSize ||
                occupiedSegmentsAllUpdated
            )
            {
                buffer.update();
            }
            else
            {
                const segmentSize = layer.bufferUpdateSegmentSize;
                const segmentByteSize = segmentSize * this.instanceBufferLayout.layout.stride;
                for (let i = 0; i < 32 && i * segmentSize < memberCount; i++)
                {
                    if (segments & (1 << i))
                    {
                        buffer.update(segmentByteSize, i * segmentByteSize);
                    }
                }
            }
            layer.clearAllSegmentsNeedUpdate();
        }

        const textures: any[] = [
            layer.frame.source.glTexture,
            layer.frameDataTexture
        ];

        if (layer.lighting)
        {
            let normalMap = layer.texture.dataSource[layer.frame.sourceIndex];
            if (!normalMap)
            {
                normalMap = this.manager.renderer.normalTexture;
            }
            else
            {
                normalMap = normalMap.glTexture;
            }
            textures[2] = normalMap;
        }

        this.updateRenderOptions();

        const programManager = this.programManager;
        const programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            const program = programSuite.program;
            const vao = programSuite.vao;

            this.setupUniforms(drawingContext);
            programManager.applyUniforms(program);

            this.manager.renderer.drawInstancedArrays(
                drawingContext,
                textures,
                program,
                vao,
                0,
                4,
                layer.memberCount
            );
        }

        this.onRunEnd(drawingContext);
    }
}
