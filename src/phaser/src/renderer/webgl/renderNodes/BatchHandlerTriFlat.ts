/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../../math/Vector2';
import { BatchHandler } from './BatchHandler';
import {
    MakeApplyLighting,
    MakeDefineLights,
    MakeFlatNormal
} from '../shaders/additionMakers';
import { FlatFrag } from '../shaders/Flat-frag';
import { FlatVert } from '../shaders/Flat-vert';

import { Utils } from '../Utils';

/**
 * @classdesc
 * This render node draws triangles with vertex color in batches.
 *
 * @class BatchHandlerTriFlat
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
export class BatchHandlerTriFlat extends BatchHandler {

    static readonly defaultConfig = {
        name: 'BatchHandlerTriFlat',
        verticesPerInstance: 3,
        indicesPerInstance: 3,
        shaderName: 'FLAT',
        vertexSource: FlatVert,
        fragmentSource: FlatFrag,
        shaderAdditions: [
            MakeDefineLights(true),
            MakeFlatNormal(true),
            MakeApplyLighting(true)
        ],
        indexBufferDynamic: true,
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            layout: [
                { name: 'inPosition', size: 2 },
                {
                    name: 'inTint',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                }
            ]
        }
    };

    _emptyTextures: any[];
    vertexCount: number;
    _lightVector: Vector2;
    renderOptions: any;
    nextRenderOptions: any;
    _renderOptionsChanged: boolean;

    constructor(manager: any, config?: any)
    {
        super(manager, BatchHandlerTriFlat.defaultConfig as any, config);

        this._emptyTextures = [];
        this.vertexCount = 0;
        this._lightVector = new Vector2();
        this.renderOptions = {
            lighting: false
        };
        this.nextRenderOptions = {
            lighting: false
        };
        this._renderOptionsChanged = false;
    }

    _generateElementIndices(instances: number): ArrayBuffer
    {
        return new ArrayBuffer(instances * 3 * 2);
    }

    setupUniforms(drawingContext: any): void
    {
        const programManager = this.programManager;

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );

        if (this.renderOptions.lighting)
        {
            Utils.updateLightingUniforms(
                this.renderOptions.lighting,
                drawingContext,
                programManager,
                1,
                this._lightVector
            );

            programManager.setUniform(
                'uResolution',
                [ drawingContext.width, drawingContext.height ]
            );
        }
    }

    updateRenderOptions(lighting: boolean): void
    {
        const newRenderOptions = this.nextRenderOptions;
        const oldRenderOptions = this.renderOptions;
        let changed = false;

        if (lighting !== oldRenderOptions.lighting)
        {
            newRenderOptions.lighting = lighting;
            changed = true;
        }

        this._renderOptionsChanged = changed;
    }

    updateShaderConfig(): void
    {
        const programManager = this.programManager;
        const renderOptions = this.renderOptions;
        const nextRenderOptions = this.nextRenderOptions;

        if (renderOptions.lighting !== nextRenderOptions.lighting)
        {
            const lighting = nextRenderOptions.lighting;
            renderOptions.lighting = lighting;

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
                    defineLightsAddition.additions.fragmentDefine = '#define LIGHT_COUNT ' + this.manager.renderer.config.maxLights;
                }
            }
        }
    }

    run(drawingContext: any): void
    {
        if (this.instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        const programManager = this.programManager;
        const programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            const program = programSuite.program;
            const vao = programSuite.vao;

            this.setupUniforms(drawingContext);
            programManager.applyUniforms(program);

            const indicesPerInstance = this.indicesPerInstance;
            const instanceCount = this.instanceCount;
            const renderer = this.manager.renderer;
            const vertexBuffer = this.vertexBufferLayout.buffer;
            const stride = this.vertexBufferLayout.layout.stride;

            vertexBuffer.update(this.vertexCount * stride);

            vao.bind();
            vao.indexBuffer.update(instanceCount * indicesPerInstance * 2);

            renderer.drawElements(
                drawingContext,
                this._emptyTextures,
                program,
                vao,
                instanceCount * indicesPerInstance,
                0,
                renderer.gl.TRIANGLES
            );
        }

        this.instanceCount = 0;
        this.vertexCount = 0;

        this.onRunEnd(drawingContext);
    }

    batch(currentContext: any, indexes: number[], vertices: number[], colors: number[], lighting?: boolean): void
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        this.updateRenderOptions(!!lighting);
        if (this._renderOptionsChanged)
        {
            this.run(currentContext);
            this.updateShaderConfig();
        }

        let passID = 0;
        let instanceCompletion = 0;
        const instancesPerBatch = this.instancesPerBatch;

        const stride = this.vertexBufferLayout.layout.stride;
        const verticesPerInstance = this.verticesPerInstance;

        const indexBuffer = this.indexBuffer;
        const indexView16 = indexBuffer.viewU16;
        let indexOffset16 = this.instanceCount * this.indicesPerInstance;

        const vertexBuffer = this.vertexBufferLayout.buffer;
        const vertexViewF32 = vertexBuffer.viewF32;
        const vertexViewU32 = vertexBuffer.viewU32;
        let vertexOffset32 = this.vertexCount * stride / vertexViewF32.BYTES_PER_ELEMENT;

        const passes: number[] = [];
        const vertexIndices: number[] = [];
        let vertexIndicesOffset = 0;

        for (let i = 0; i < indexes.length; i++)
        {
            const index = indexes[i];
            const vertexIndex = index * 2;

            if (passes[index] !== passID)
            {
                vertexViewF32[vertexOffset32++] = vertices[vertexIndex];
                vertexViewF32[vertexOffset32++] = vertices[vertexIndex + 1];
                vertexViewU32[vertexOffset32++] = colors[index];

                passes[index] = passID;

                vertexIndices[vertexIndicesOffset++] = this.vertexCount;

                this.vertexCount++;
            }
            const id = vertexIndices[vertexIndicesOffset - 1];

            indexView16[indexOffset16++] = id;

            instanceCompletion++;
            if (instanceCompletion === verticesPerInstance)
            {
                this.instanceCount++;
                instanceCompletion = 0;
            }

            if (
                this.instanceCount === instancesPerBatch ||
                (instanceCompletion === 0 && indexOffset16 + verticesPerInstance >= indexView16.length)
            )
            {
                passID++;
                this.run(currentContext);

                indexOffset16 = this.instanceCount * this.indicesPerInstance;
                vertexOffset32 = this.vertexCount * stride / vertexViewF32.BYTES_PER_ELEMENT;
                vertexIndicesOffset = 0;
            }
        }
    }
}
