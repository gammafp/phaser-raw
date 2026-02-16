/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ProgramManager } from '../ProgramManager';
import { WebGLVertexBufferLayoutWrapper } from '../wrappers/WebGLVertexBufferLayoutWrapper';
import { RenderNode } from './RenderNode';
import * as RendererEvents from '../../events';

/**
 * @classdesc
 * A Batch Handler Render Node. This is a base class used for other
 * Batch Handler Render Nodes.
 *
 * A batch handler buffers data for a batch of objects to be rendered
 * together. It is responsible for the vertex buffer layout and shaders
 * used to render the batched items.
 *
 * This class is not meant to be used directly, but to be extended by
 * other classes.
 *
 * @class BatchHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} defaultConfig - The default configuration object for this RenderNode. This is used to ensure all required properties are present, so it must be complete.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this RenderNode.
 */
export class BatchHandler extends RenderNode {

    instancesPerBatch: number;
    verticesPerInstance: number;
    indicesPerInstance: number;
    bytesPerIndexPerInstance: number;
    maxTexturesPerBatch: number;
    indexBuffer: any;
    vertexBufferLayout: WebGLVertexBufferLayoutWrapper;
    programManager: ProgramManager;
    bytesPerInstance: number;
    floatsPerInstance: number;
    currentBatchEntry: { start: number; count: number; unit: number; texture: any[] };
    batchEntries: any[];
    instanceCount: number;

    constructor(manager: any, defaultConfig: any, config?: any)
    {
        const renderer = manager.renderer;
        const gl = renderer.gl;

        config = BatchHandler._copyAndCompleteConfig(manager, config || {}, defaultConfig);

        const name = config.name;
        if (!name)
        {
            throw new Error('BatchHandler must have a name');
        }

        super(name, manager);

        this.instancesPerBatch = -1;
        this.verticesPerInstance = config.verticesPerInstance;
        this.indicesPerInstance = config.indicesPerInstance;
        this.bytesPerIndexPerInstance = this.indicesPerInstance * Uint16Array.BYTES_PER_ELEMENT;
        this.maxTexturesPerBatch = 1;

        this.manager.on(
            RendererEvents.SET_PARALLEL_TEXTURE_UNITS,
            this.updateTextureCount,
            this
        );

        renderer.glWrapper.updateVAO({ vao: null });

        const indexLimit = 65536;
        const maxInstances = Math.floor(indexLimit / this.verticesPerInstance);
        const targetInstances = config.instancesPerBatch || renderer.config.batchSize || maxInstances;
        this.instancesPerBatch = Math.min(targetInstances, maxInstances);

        this.indexBuffer = renderer.createIndexBuffer(
            this._generateElementIndices(this.instancesPerBatch),
            config.indexBufferDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW
        );

        const partialLayout = config.vertexBufferLayout;
        partialLayout.count = this.instancesPerBatch * this.verticesPerInstance;

        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            partialLayout,
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
        if (config.shaderAdditions)
        {
            for (let i = 0; i < config.shaderAdditions.length; i++)
            {
                const addition = config.shaderAdditions[i];
                this.programManager.addAddition(addition);
            }
        }
        if (config.shaderFeatures)
        {
            for (let i = 0; i < config.shaderFeatures.length; i++)
            {
                this.programManager.addFeature(config.shaderFeatures[i]);
            }
        }

        this.bytesPerInstance = this.vertexBufferLayout.layout.stride * this.verticesPerInstance;
        this.floatsPerInstance = this.bytesPerInstance / Float32Array.BYTES_PER_ELEMENT;

        this.currentBatchEntry = {
            start: 0,
            count: 0,
            unit: 0,
            texture: []
        };

        this.batchEntries = [];
        this.instanceCount = 0;

        this.updateTextureCount(manager.maxParallelTextureUnits);

        this.resize(renderer.width, renderer.height);
        renderer.on(RendererEvents.RESIZE, this.resize, this);
    }

    static _copyAndCompleteConfig(manager: any, config: any, defaultConfig: any): any
    {
        const newConfig: any = {};

        newConfig.name = config.name || defaultConfig.name;
        newConfig.verticesPerInstance = config.verticesPerInstance || defaultConfig.verticesPerInstance;
        newConfig.indicesPerInstance = config.indicesPerInstance || defaultConfig.indicesPerInstance;

        newConfig.shaderName = config.shaderName || defaultConfig.shaderName;
        newConfig.vertexSource = config.vertexSource || defaultConfig.vertexSource;
        newConfig.fragmentSource = config.fragmentSource || defaultConfig.fragmentSource;

        newConfig.shaderAdditions = config.shaderAdditions || defaultConfig.shaderAdditions;
        if (Array.isArray(newConfig.shaderAdditions))
        {
            newConfig.shaderAdditions = newConfig.shaderAdditions.map(function (addition: any): any
            {
                return Object.assign({}, addition);
            });
        }

        newConfig.shaderFeatures = config.shaderFeatures || defaultConfig.shaderFeatures;

        newConfig.indexBufferDynamic = config.indexBufferDynamic || defaultConfig.indexBufferDynamic;

        newConfig.instancesPerBatch = config.instancesPerBatch;
        newConfig.maxTexturesPerBatch = config.maxTexturesPerBatch;

        const layoutSource = config.vertexBufferLayout || defaultConfig.vertexBufferLayout;
        newConfig.vertexBufferLayout = {};
        newConfig.vertexBufferLayout.usage = layoutSource.usage;
        newConfig.vertexBufferLayout.layout = [];
        const remove = config.vertexBufferLayoutRemove || [];

        for (let i = 0; i < layoutSource.layout.length; i++)
        {
            const sourceAttr = layoutSource.layout[i];
            if (remove.indexOf(sourceAttr.name) !== -1)
            {
                continue;
            }
            newConfig.vertexBufferLayout.layout[i] = {
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
                newConfig.vertexBufferLayout.layout.push({
                    name: addAttr.name,
                    size: addAttr.size || 1,
                    type: addAttr.type || 'FLOAT',
                    normalized: addAttr.normalized || false
                });
            }
        }

        return newConfig;
    }

    _generateElementIndices(instances: number): ArrayBuffer
    {
        return new ArrayBuffer(instances * this.indicesPerInstance * Uint16Array.BYTES_PER_ELEMENT);
    }

    resize(width: number, height: number): void {}

    updateTextureCount(count?: number): void {}

    run(drawingContext: any): void {}

    batch(): void {}
}
