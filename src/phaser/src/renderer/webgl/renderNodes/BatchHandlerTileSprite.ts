/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BatchHandlerQuad } from './BatchHandlerQuad';
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
    MakeOutFrame,
    MakeOutInverseRotation,
    MakeRotationDatum,
    MakeSmoothPixelArt,
    MakeTexCoordFrameClamp,
    MakeTexCoordFrameWrap
} from '../shaders/additionMakers';

/**
 * @classdesc
 * This RenderNode handles batch rendering of TileSprites and Tiles.
 *
 * @class BatchHandlerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
export class BatchHandlerTileSprite extends BatchHandlerQuad {

    static readonly defaultConfig = {
        name: 'BatchHandlerTileSprite',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
        shaderName: 'TILESPRITE',
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        shaderAdditions: [
            MakeOutFrame(),
            MakeGetTexCoordOut(),
            MakeGetTexRes(true),
            MakeTexCoordFrameWrap(true),
            MakeTexCoordFrameClamp(true),
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
                { name: 'inFrame', size: 4 },
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
        super(manager, BatchHandlerTileSprite.defaultConfig as any, config);
    }

    updateRenderOptions(renderOptions: any): void
    {
        BatchHandlerQuad.prototype.updateRenderOptions.call(this, renderOptions);

        const oldRenderOptions = this.renderOptions;
        const newRenderOptions = this.nextRenderOptions;
        let changed = this._renderOptionsChanged;

        newRenderOptions.clampFrame = !!renderOptions.clampFrame;
        if (newRenderOptions.clampFrame !== oldRenderOptions.clampFrame)
        {
            changed = true;
        }

        newRenderOptions.wrapFrame = !!renderOptions.wrapFrame;
        if (newRenderOptions.wrapFrame !== oldRenderOptions.wrapFrame)
        {
            changed = true;
        }

        newRenderOptions.texRes = newRenderOptions.clampFrame || newRenderOptions.texRes;
        if (newRenderOptions.texRes !== oldRenderOptions.texRes)
        {
            changed = true;
        }

        if (changed)
        {
            this._renderOptionsChanged = true;
        }
    }

    updateShaderConfig(): void
    {
        BatchHandlerQuad.prototype.updateShaderConfig.call(this);

        const programManager = this.programManager;
        const oldRenderOptions = this.renderOptions;
        const newRenderOptions = this.nextRenderOptions;

        if (newRenderOptions.clampFrame !== oldRenderOptions.clampFrame)
        {
            const clampFrame = newRenderOptions.clampFrame;
            oldRenderOptions.clampFrame = clampFrame;

            const clampAddition = programManager.getAddition('TexCoordFrameClamp');
            clampAddition.disable = !newRenderOptions.clampFrame;
        }

        if (newRenderOptions.wrapFrame !== oldRenderOptions.wrapFrame)
        {
            const wrapFrame = newRenderOptions.wrapFrame;
            oldRenderOptions.wrapFrame = wrapFrame;

            const wrapAddition = programManager.getAddition('TexCoordFrameWrap');
            wrapAddition.disable = !wrapFrame;
        }
    }

    batch(
        drawingContext: any,
        glTexture: any,
        x0: number, y0: number,
        x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number,
        texX: number, texY: number,
        texWidth: number, texHeight: number,
        tintFill: number,
        tintTL: number, tintBL: number, tintTR: number, tintBR: number,
        renderOptions: any,
        u0: number, v0: number, u1: number, v1: number, u2: number, v2: number, u3: number, v3: number
    ): void
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, drawingContext);
        }

        this.updateRenderOptions(renderOptions);
        if (this._renderOptionsChanged)
        {
            this.run(drawingContext);
            this.updateShaderConfig();
        }

        const textureDatum = this.batchTextures(glTexture, renderOptions);

        let vertexOffset32 = this.instanceCount * this.floatsPerInstance;
        const vertexBuffer = this.vertexBufferLayout.buffer;
        const vertexViewF32 = vertexBuffer.viewF32;
        const vertexViewU32 = vertexBuffer.viewU32;

        vertexViewF32[vertexOffset32++] = x1;
        vertexViewF32[vertexOffset32++] = y1;
        vertexViewF32[vertexOffset32++] = u1;
        vertexViewF32[vertexOffset32++] = v1;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBL;

        vertexViewF32[vertexOffset32++] = x0;
        vertexViewF32[vertexOffset32++] = y0;
        vertexViewF32[vertexOffset32++] = u0;
        vertexViewF32[vertexOffset32++] = v0;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTL;

        vertexViewF32[vertexOffset32++] = x3;
        vertexViewF32[vertexOffset32++] = y3;
        vertexViewF32[vertexOffset32++] = u3;
        vertexViewF32[vertexOffset32++] = v3;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBR;

        vertexViewF32[vertexOffset32++] = x2;
        vertexViewF32[vertexOffset32++] = y2;
        vertexViewF32[vertexOffset32++] = u2;
        vertexViewF32[vertexOffset32++] = v2;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureDatum;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTR;

        this.instanceCount++;
        this.currentBatchEntry.count++;

        if (this.instanceCount === this.instancesPerBatch)
        {
            this.run(drawingContext);
        }
    }
}
