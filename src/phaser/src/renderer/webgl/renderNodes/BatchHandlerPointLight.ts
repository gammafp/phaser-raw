/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BatchHandler } from './BatchHandler';
import { PointLightFrag } from '../shaders/PointLight-frag';
import { PointLightVert } from '../shaders/PointLight-vert';

/**
 * @classdesc
 * This RenderNode draws PointLight Game Objects in WebGL.
 *
 * @class BatchHandlerPointLight
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
export class BatchHandlerPointLight extends BatchHandler {

    static readonly defaultConfig = {
        name: 'BatchHandlerPointLight',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
        shaderName: 'POINTLIGHT',
        vertexSource: PointLightVert,
        fragmentSource: PointLightFrag,
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            layout: [
                { name: 'inPosition', size: 2 },
                { name: 'inLightPosition', size: 2 },
                { name: 'inLightRadius', size: 1 },
                { name: 'inLightAttenuation', size: 1 },
                { name: 'inLightColor', size: 4 }
            ]
        }
    };

    _emptyTextures: any[];

    constructor(manager: any, config?: any)
    {
        super(manager, BatchHandlerPointLight.defaultConfig, config);

        this._emptyTextures = [];
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

    setupUniforms(drawingContext: any): void
    {
        const programManager = this.programManager;
        const width = drawingContext.width;
        const height = drawingContext.height;

        programManager.setUniform(
            'uCameraZoom',
            drawingContext.camera.zoom
        );

        programManager.setUniform(
            'uResolution',
            [ width, height ]
        );

        drawingContext.renderer.setProjectionMatrixFromDrawingContext(drawingContext);
        programManager.setUniform(
            'uProjectionMatrix',
            drawingContext.renderer.projectionMatrix.val
        );
    }

    run(drawingContext: any): void
    {
        const instanceCount = this.instanceCount;

        if (instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        const programManager = this.programManager;
        const programSuite = programManager.getCurrentProgramSuite();

        if (programSuite)
        {
            const program = programSuite.program;
            const vao = programSuite.vao;

            this.setupUniforms(drawingContext);
            programManager.applyUniforms(program);

            this.vertexBufferLayout.buffer.update(this.instanceCount * this.bytesPerInstance);

            this.manager.renderer.drawElements(
                drawingContext,
                this._emptyTextures,
                program,
                vao,
                instanceCount * this.indicesPerInstance,
                0
            );
        }

        this.instanceCount = 0;

        this.onRunEnd(drawingContext);
    }

    batch(drawingContext: any, light: any, xTL: number, yTL: number, xBL: number, yBL: number, xTR: number, yTR: number, xBR: number, yBR: number, lightX: number, lightY: number): void
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, drawingContext);
        }

        const color = light.color;
        const intensity = light.intensity;
        const radius = light.radius;
        const attenuation = light.attenuation;

        const r = color.r * intensity;
        const g = color.g * intensity;
        const b = color.b * intensity;
        const a = light.alpha;

        let vertexOffset32 = this.instanceCount * this.floatsPerInstance;
        const vertexBuffer = this.vertexBufferLayout.buffer;
        const vertexViewF32 = vertexBuffer.viewF32;

        vertexViewF32[vertexOffset32++] = xBL;
        vertexViewF32[vertexOffset32++] = yBL;
        vertexViewF32[vertexOffset32++] = lightX;
        vertexViewF32[vertexOffset32++] = lightY;
        vertexViewF32[vertexOffset32++] = radius;
        vertexViewF32[vertexOffset32++] = attenuation;
        vertexViewF32[vertexOffset32++] = r;
        vertexViewF32[vertexOffset32++] = g;
        vertexViewF32[vertexOffset32++] = b;
        vertexViewF32[vertexOffset32++] = a;

        vertexViewF32[vertexOffset32++] = xTL;
        vertexViewF32[vertexOffset32++] = yTL;
        vertexViewF32[vertexOffset32++] = lightX;
        vertexViewF32[vertexOffset32++] = lightY;
        vertexViewF32[vertexOffset32++] = radius;
        vertexViewF32[vertexOffset32++] = attenuation;
        vertexViewF32[vertexOffset32++] = r;
        vertexViewF32[vertexOffset32++] = g;
        vertexViewF32[vertexOffset32++] = b;
        vertexViewF32[vertexOffset32++] = a;

        vertexViewF32[vertexOffset32++] = xBR;
        vertexViewF32[vertexOffset32++] = yBR;
        vertexViewF32[vertexOffset32++] = lightX;
        vertexViewF32[vertexOffset32++] = lightY;
        vertexViewF32[vertexOffset32++] = radius;
        vertexViewF32[vertexOffset32++] = attenuation;
        vertexViewF32[vertexOffset32++] = r;
        vertexViewF32[vertexOffset32++] = g;
        vertexViewF32[vertexOffset32++] = b;
        vertexViewF32[vertexOffset32++] = a;

        vertexViewF32[vertexOffset32++] = xTR;
        vertexViewF32[vertexOffset32++] = yTR;
        vertexViewF32[vertexOffset32++] = lightX;
        vertexViewF32[vertexOffset32++] = lightY;
        vertexViewF32[vertexOffset32++] = radius;
        vertexViewF32[vertexOffset32++] = attenuation;
        vertexViewF32[vertexOffset32++] = r;
        vertexViewF32[vertexOffset32++] = g;
        vertexViewF32[vertexOffset32++] = b;
        vertexViewF32[vertexOffset32++] = a;

        this.instanceCount++;

        if (this.instanceCount === this.instancesPerBatch)
        {
            this.run(drawingContext);
        }
    }
}
