/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DeepCopy } from '../../../utils/object/DeepCopy';
import { Vector2 } from '../../../math/Vector2';
import { BatchHandler } from './BatchHandler';
import { MultiVert as ShaderSourceVS } from '../shaders/Multi-vert';
import { MultiFrag as ShaderSourceFS } from '../shaders/Multi-frag';
import {
    MakeApplyLighting,
    MakeApplyTint,
    MakeDefineLights,
    MakeDefineTexCount,
    MakeGetNormalFromMap,
    MakeGetTexCoordOut,
    MakeGetTexRes,
    MakeGetTexture,
    MakeOutInverseRotation,
    MakeRotationDatum,
    MakeSmoothPixelArt
} from '../shaders/additionMakers';

import { Utils } from '../Utils';

/**
 * @classdesc
 * This RenderNode draws Standard Batch Render (SBR) quads in batches.
 *
 * @class BatchHandlerQuad
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
export class BatchHandlerQuad extends BatchHandler {

    static readonly defaultConfig = {
        name: 'BatchHandlerQuad',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
        shaderName: 'STANDARD',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeGetTexCoordOut(),
            MakeGetTexRes(true),
            MakeSmoothPixelArt(true),
            MakeDefineTexCount(1),
            MakeGetTexture(),
            MakeApplyTint(),
            MakeDefineLights(true),
            MakeRotationDatum(true),
            MakeOutInverseRotation(true),
            MakeGetNormalFromMap(true),
            MakeApplyLighting(true)
        ],
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            layout: [
                { name: 'inPosition', size: 2 },
                { name: 'inTexCoord', size: 2 },
                { name: 'inTexDatum' },
                { name: 'inTintEffect' },
                {
                    name: 'inTint',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                }
            ]
        }
    };

    renderOptions: any;
    nextRenderOptions: any;
    _renderOptionsChanged: boolean;
    _lightVector: Vector2;

    constructor(manager: any, config?: any)
    {
        super(manager, BatchHandlerQuad.defaultConfig, config);

        this.renderOptions = {
            multiTexturing: false,
            texRes: false,
            lighting: false,
            selfShadow: false,
            selfShadowPenumbra: 0,
            selfShadowThreshold: 0,
            smoothPixelArt: false
        };

        this.programManager.setUniform(
            'uMainSampler[0]',
            this.manager.renderer.textureUnitIndices
        );

        this.nextRenderOptions = DeepCopy(this.renderOptions);
        this._renderOptionsChanged = false;
        this._lightVector = new Vector2();
    }

    _generateElementIndices(instances: number): ArrayBuffer
    {
        const buffer = new ArrayBuffer(instances * 6 * 2);
        const indices = new Uint16Array(buffer);
        let offset = 0;
        for (let i = 0; i < instances; i++)
        {
            const index = i * 4;
            indices[offset++] = index;
            indices[offset++] = index;
            indices[offset++] = index + 1;
            indices[offset++] = index + 2;
            indices[offset++] = index + 3;
            indices[offset++] = index + 3;
        }
        return buffer;
    }

    updateTextureCount(count?: number): void
    {
        const renderer = this.manager.renderer;

        if (count === undefined)
        {
            count = renderer.maxTextures;
        }

        const newCount = Math.max(1, Math.min(count, renderer.maxTextures));
        if (newCount === this.maxTexturesPerBatch)
        {
            return;
        }

        if (
            newCount < this.currentBatchEntry.unit &&
            this.manager.currentBatchNode === this
        )
        {
            this.manager.finishBatch();
        }

        this.maxTexturesPerBatch = newCount;

        if (this.renderOptions && this.renderOptions.multiTexturing)
        {
            const programManager = this.programManager;
            const textureAddition = programManager.getAdditionsByTag('TEXTURE')[0];
            if (textureAddition)
            {
                programManager.replaceAddition(
                    textureAddition.name,
                    MakeGetTexture(this.maxTexturesPerBatch)
                );
            }
        }

        this.resize(renderer.width, renderer.height);
    }

    setupUniforms(drawingContext: any): void
    {
        const programManager = this.programManager;
        const renderOptions = this.renderOptions;

        programManager.setUniform(
            'uResolution',
            [ drawingContext.width, drawingContext.height ]
        );

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );

        if (this.renderOptions.lighting)
        {
            Utils.updateLightingUniforms(
                renderOptions.lighting,
                drawingContext,
                programManager,
                1,
                this._lightVector,
                renderOptions.selfShadow,
                renderOptions.selfShadowThreshold,
                renderOptions.selfShadowPenumbra
            );
        }
    }

    setupTextureUniforms(textures: any[]): void
    {
        const programManager = this.programManager;

        if (this.renderOptions.multiTexturing)
        {
            const dims: number[] = [];
            for (let i = 0; i < textures.length; i++)
            {
                dims.push(textures[i].width, textures[i].height);
            }
            programManager.setUniform(
                'uMainResolution[0]',
                dims
            );
        }
        else
        {
            programManager.setUniform(
                'uMainResolution[0]',
                [ textures[0].width, textures[0].height ]
            );
        }
    }

    finalizeTextureCount(count: number): void
    {
        const programManager = this.programManager;

        if (this.renderOptions.lighting)
        {
            count = 1;
        }

        const textureAddition = programManager.getAdditionsByTag('TEXTURE')[0];
        if (textureAddition)
        {
            programManager.replaceAddition(
                textureAddition.name,
                MakeGetTexture(count)
            );
        }

        const texCountAddition = programManager.getAdditionsByTag('TexCount')[0];
        if (texCountAddition)
        {
            programManager.replaceAddition(
                texCountAddition.name,
                MakeDefineTexCount(count)
            );
        }
    }

    updateRenderOptions(renderOptions: any): void
    {
        const newRenderOptions = this.nextRenderOptions;
        const oldRenderOptions = this.renderOptions;
        let changed = false;

        const multiTexturing = !!renderOptions.multiTexturing && !renderOptions.lighting;
        if (multiTexturing !== oldRenderOptions.multiTexturing)
        {
            newRenderOptions.multiTexturing = multiTexturing;
            changed = true;
        }

        const lighting = !!renderOptions.lighting;
        if (lighting !== oldRenderOptions.lighting)
        {
            newRenderOptions.lighting = lighting;
            changed = true;
        }

        const selfShadow = lighting && renderOptions.lighting.selfShadow && renderOptions.lighting.selfShadow.enabled;
        if (selfShadow !== oldRenderOptions.selfShadow)
        {
            newRenderOptions.selfShadow = selfShadow;
            changed = true;
        }

        const selfShadowPenumbra = selfShadow ? renderOptions.lighting.selfShadow.penumbra : 0;
        if (selfShadowPenumbra !== oldRenderOptions.selfShadowPenumbra)
        {
            newRenderOptions.selfShadowPenumbra = selfShadowPenumbra;
            changed = true;
        }

        const selfShadowThreshold = selfShadow ? renderOptions.lighting.selfShadow.diffuseFlatThreshold : 0;
        if (selfShadowThreshold !== oldRenderOptions.selfShadowThreshold)
        {
            newRenderOptions.selfShadowThreshold = selfShadowThreshold;
            changed = true;
        }

        const smoothPixelArt = !!renderOptions.smoothPixelArt;
        if (smoothPixelArt !== oldRenderOptions.smoothPixelArt)
        {
            newRenderOptions.smoothPixelArt = smoothPixelArt;
            newRenderOptions.texRes = smoothPixelArt;
            changed = true;
        }

        this._renderOptionsChanged = changed;
    }

    updateShaderConfig(): void
    {
        const programManager = this.programManager;
        const oldRenderOptions = this.renderOptions;
        const newRenderOptions = this.nextRenderOptions;

        if (oldRenderOptions.multiTexturing !== newRenderOptions.multiTexturing)
        {
            const multiTexturing = newRenderOptions.multiTexturing;
            oldRenderOptions.multiTexturing = multiTexturing;

            const texCountAddition = programManager.getAdditionsByTag('TexCount')[0];
            if (texCountAddition)
            {
                programManager.replaceAddition(
                    texCountAddition.name,
                    MakeDefineTexCount(multiTexturing ? this.maxTexturesPerBatch : 1)
                );
            }

            const textureAddition = programManager.getAdditionsByTag('TEXTURE')[0];
            if (textureAddition)
            {
                programManager.replaceAddition(
                    textureAddition.name,
                    MakeGetTexture(multiTexturing ? this.maxTexturesPerBatch : 1)
                );
            }
        }

        if (oldRenderOptions.lighting !== newRenderOptions.lighting)
        {
            const lighting = newRenderOptions.lighting;
            oldRenderOptions.lighting = lighting;

            const lightingAdditions = programManager.getAdditionsByTag('LIGHTING');
            for (let i = 0; i < lightingAdditions.length; i++)
            {
                const lightingAddition = lightingAdditions[i];
                lightingAddition.disable = !lighting;
            }

            if (lighting)
            {
                const defineLightsAddition = programManager.getAddition('DefineLights');
                if (defineLightsAddition)
                {
                    defineLightsAddition.additions.fragmentDefine = '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
                }
            }
        }

        if (oldRenderOptions.selfShadow !== newRenderOptions.selfShadow)
        {
            const selfShadow = newRenderOptions.selfShadow;
            oldRenderOptions.selfShadow = selfShadow;

            if (selfShadow)
            {
                programManager.addFeature('SELFSHADOW');
            }
            else
            {
                programManager.removeFeature('SELFSHADOW');
            }
        }

        oldRenderOptions.selfShadowPenumbra = newRenderOptions.selfShadowPenumbra;
        oldRenderOptions.selfShadowThreshold = newRenderOptions.selfShadowThreshold;

        if (oldRenderOptions.smoothPixelArt !== newRenderOptions.smoothPixelArt)
        {
            const smoothPixelArt = newRenderOptions.smoothPixelArt;
            oldRenderOptions.smoothPixelArt = smoothPixelArt;

            const smoothPixelArtAddition = programManager.getAddition('SmoothPixelArt');
            if (smoothPixelArtAddition)
            {
                smoothPixelArtAddition.disable = !smoothPixelArt;
            }
        }

        if (oldRenderOptions.texRes !== newRenderOptions.texRes)
        {
            const texRes = newRenderOptions.texRes;
            oldRenderOptions.texRes = texRes;

            const texResAddition = programManager.getAddition('GetTexRes');
            if (texResAddition)
            {
                texResAddition.disable = !texRes;
            }
        }
    }

    run(drawingContext: any): void
    {
        if (this.instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        this.pushCurrentBatchEntry();

        const programManager = this.programManager;
        const bytesPerIndexPerInstance = this.bytesPerIndexPerInstance;
        const indicesPerInstance = this.indicesPerInstance;
        const renderer = this.manager.renderer;
        const vertexBuffer = this.vertexBufferLayout.buffer;

        vertexBuffer.update(this.instanceCount * this.bytesPerInstance);

        const subBatches = this.batchEntries.length;
        for (let i = 0; i < subBatches; i++)
        {
            const entry = this.batchEntries[i];

            this.finalizeTextureCount(entry.unit);

            const programSuite = programManager.getCurrentProgramSuite();

            if (programSuite)
            {
                const program = programSuite.program;
                const vao = programSuite.vao;

                this.setupUniforms(drawingContext);
                programManager.applyUniforms(program);

                if (this.renderOptions.texRes)
                {
                    this.setupTextureUniforms(entry.texture);
                    programManager.applyUniforms(program);
                }

                renderer.drawElements(
                    drawingContext,
                    entry.texture,
                    program,
                    vao,
                    entry.count * indicesPerInstance,
                    entry.start * bytesPerIndexPerInstance
                );
            }
        }

        this.instanceCount = 0;
        this.currentBatchEntry.start = 0;
        this.batchEntries.length = 0;

        this.onRunEnd(drawingContext);
    }

    batch(
        currentContext: any,
        glTexture: any,
        x0: number, y0: number,
        x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number,
        texX: number, texY: number,
        texWidth: number, texHeight: number,
        tintFill: number,
        tintTL: number, tintBL: number, tintTR: number, tintBR: number,
        renderOptions: any
    ): void
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        this.updateRenderOptions(renderOptions);
        if (this._renderOptionsChanged)
        {
            this.run(currentContext);
            this.updateShaderConfig();
        }

        const textureDatum = this.batchTextures(glTexture, renderOptions);

        let vertexOffset32 = this.instanceCount * this.floatsPerInstance;
        const vertexBuffer = this.vertexBufferLayout.buffer;
        const vertexViewF32 = vertexBuffer.viewF32;
        const vertexViewU32 = vertexBuffer.viewU32;

        vertexViewF32[vertexOffset32++] = x1;
        vertexViewF32[vertexOffset32++] = y1;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBL;

        vertexViewF32[vertexOffset32++] = x0;
        vertexViewF32[vertexOffset32++] = y0;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTL;

        vertexViewF32[vertexOffset32++] = x3;
        vertexViewF32[vertexOffset32++] = y3;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBR;

        vertexViewF32[vertexOffset32++] = x2;
        vertexViewF32[vertexOffset32++] = y2;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTR;

        this.instanceCount++;
        this.currentBatchEntry.count++;

        if (this.instanceCount === this.instancesPerBatch)
        {
            this.run(currentContext);
        }
    }

    batchTextures(glTexture: any, renderOptions: any): number
    {
        const newRenderOptions = this.renderOptions;
        let textureDatum = 0;
        let currentBatchEntry = this.currentBatchEntry;

        if (newRenderOptions.multiTexturing)
        {
            textureDatum = glTexture.batchUnit;
            if (textureDatum === -1)
            {
                if (currentBatchEntry.texture.length === this.maxTexturesPerBatch)
                {
                    this.pushCurrentBatchEntry();
                    currentBatchEntry = this.currentBatchEntry;
                }
                textureDatum = currentBatchEntry.unit;
                glTexture.batchUnit = textureDatum;
                currentBatchEntry.texture[textureDatum] = glTexture;
                currentBatchEntry.unit++;
            }
        }
        else if (newRenderOptions.lighting)
        {
            textureDatum = renderOptions.lighting.normalMapRotation;

            const normalGLTexture = renderOptions.lighting.normalGLTexture;
            if (
                currentBatchEntry.texture[0] !== glTexture ||
                currentBatchEntry.texture[1] !== normalGLTexture
            )
            {
                this.pushCurrentBatchEntry();
                currentBatchEntry = this.currentBatchEntry;
                glTexture.batchUnit = 0;
                normalGLTexture.batchUnit = 1;
                currentBatchEntry.texture[0] = glTexture;
                currentBatchEntry.texture[1] = normalGLTexture;
                currentBatchEntry.unit = 2;
            }
        }
        else if (currentBatchEntry.texture[0] !== glTexture)
        {
            this.pushCurrentBatchEntry();
            currentBatchEntry = this.currentBatchEntry;
            glTexture.batchUnit = 0;
            currentBatchEntry.texture[0] = glTexture;
            currentBatchEntry.unit = 1;
        }

        return textureDatum;
    }

    pushCurrentBatchEntry(): void
    {
        if (this.currentBatchEntry.count < 1)
        {
            return;
        }

        this.batchEntries.push(this.currentBatchEntry);

        const texture = this.currentBatchEntry.texture;
        for (let i = 0; i < texture.length; i++)
        {
            texture[i].batchUnit = -1;
        }

        this.currentBatchEntry = {
            start: this.instanceCount,
            count: 0,
            unit: 0,
            texture: []
        };
    }
}
