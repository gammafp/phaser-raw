/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BatchHandlerQuad } from './BatchHandlerQuad';
import { MultiVert as ShaderSourceVS } from '../shaders/Multi-vert';
import { MultiFrag as ShaderSourceFS } from '../shaders/Multi-frag';
import {
    MakeApplyTint,
    MakeDefineTexCount,
    MakeGetTexCoordOut,
    MakeGetTexRes,
    MakeGetTexture,
    MakeSmoothPixelArt
} from '../shaders/additionMakers';

import { Utils } from '../Utils';
const getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * This RenderNode renders textured triangle strips, such as for the Rope
 * Game Object. It uses batches to accelerate drawing.
 *
 * @class BatchHandlerStrip
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} config - The configuration object for this handler.
 */
export class BatchHandlerStrip extends BatchHandlerQuad {

    static readonly defaultConfig = {
        name: 'BatchHandlerStrip',
        verticesPerInstance: 2,
        indicesPerInstance: 2,
        shaderName: 'STRIP',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeGetTexCoordOut(),
            MakeGetTexRes(true),
            MakeSmoothPixelArt(true),
            MakeDefineTexCount(1),
            MakeGetTexture(),
            MakeApplyTint()
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

    constructor(manager: any, config?: any)
    {
        super(manager, BatchHandlerStrip.defaultConfig as any, config);

        this.renderOptions.multiTexturing = true;
    }

    _generateElementIndices(instances: number): ArrayBuffer
    {
        const buffer = new ArrayBuffer(instances * 2 * 2);
        const indices = new Uint16Array(buffer);
        const len = indices.length;
        for (let i = 0; i < len; i++)
        {
            indices[i] = i;
        }
        return buffer;
    }

    batchStrip(
        drawingContext: any,
        src: any,
        calcMatrix: any,
        glTexture: any,
        vertices: Float32Array,
        uv: Float32Array,
        colors: Uint32Array,
        alphas: Float32Array,
        alpha: number,
        tintFill: number,
        renderOptions: any,
        debugCallback?: (src: any, length: number, verts: number[]) => void
    ): void
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, drawingContext);
        }

        const submittedInstanceCount = vertices.length / (2 * this.verticesPerInstance);
        const maxVerticesPerBatch = this.instancesPerBatch * this.verticesPerInstance;
        if (submittedInstanceCount > this.instancesPerBatch)
        {
            throw new Error('BatchHandlerStrip: Vertex count exceeds maximum per batch (' + maxVerticesPerBatch + ')');
        }

        if (this.instanceCount + submittedInstanceCount > this.instancesPerBatch)
        {
            this.run(drawingContext);
        }

        this.updateRenderOptions(renderOptions);
        if (this._renderOptionsChanged)
        {
            this.run(drawingContext);
            this.updateShaderConfig();
        }

        const textureDatum = this.batchTextures(glTexture, renderOptions || {});

        let vertexOffset32 = this.instanceCount * this.floatsPerInstance;
        const vertexBuffer = this.vertexBufferLayout.buffer;
        const vertexViewF32 = vertexBuffer.viewF32;
        const vertexViewU32 = vertexBuffer.viewU32;

        let repeatFirstVertex = false;

        if (this.instanceCount > 0)
        {
            const prevOffset = 1 + this.floatsPerInstance / this.verticesPerInstance;

            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewU32[vertexOffset32++] = vertexViewU32[vertexOffset32 - prevOffset];

            repeatFirstVertex = true;
        }

        let debugVerts: number[] | undefined;
        if (debugCallback)
        {
            debugVerts = [];
        }

        const a = calcMatrix.a;
        const b = calcMatrix.b;
        const c = calcMatrix.c;
        const d = calcMatrix.d;
        const e = calcMatrix.e;
        const f = calcMatrix.f;

        const meshVerticesLength = vertices.length;

        for (let i = 0; i < meshVerticesLength; i += 2)
        {
            const x = vertices[i];
            const y = vertices[i + 1];

            const tx = x * a + y * c + e;
            const ty = x * b + y * d + f;

            vertexViewF32[vertexOffset32++] = tx;
            vertexViewF32[vertexOffset32++] = ty;
            vertexViewF32[vertexOffset32++] = uv[i];
            vertexViewF32[vertexOffset32++] = uv[i + 1];
            vertexViewF32[vertexOffset32++] = textureDatum;
            vertexViewF32[vertexOffset32++] = tintFill;
            vertexViewU32[vertexOffset32++] = getTint(
                colors[i / 2],
                alphas[i / 2] * alpha
            );

            if (repeatFirstVertex)
            {
                i -= 2;

                this.instanceCount++;
                this.currentBatchEntry.count++;

                repeatFirstVertex = false;
            }
            else if (debugVerts)
            {
                debugVerts.push(tx, ty);
            }

            if (i % 4 === 2)
            {
                this.instanceCount++;
                this.currentBatchEntry.count++;
            }
        }

        if (debugCallback)
        {
            debugCallback.call(src, src, meshVerticesLength, debugVerts || []);
        }
    }
}
