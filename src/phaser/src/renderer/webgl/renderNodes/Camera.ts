/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from '../../../gameobjects/components/TransformMatrix';

import { Rectangle } from '../../../geom/rectangle/Rectangle';
import { Equal } from '../../../math/fuzzy/Equal';

import * as CameraEvents from '../../../cameras/2d/events';
import { GetColor32 } from '../../../display/color/GetColor32';
import { Utils } from '../Utils';
import { RenderNode } from './RenderNode';

function getAlphaTint(alpha: number): number
{
    return Utils.getTintAppendFloatAlpha(0xffffff, alpha);
}

/**
 * @class Camera
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class Camera extends RenderNode {

    batchHandlerQuadSingleNode: any;
    fillCameraNode: any;
    listCompositorNode: any;
    _parentTransformMatrix: TransformMatrix;

    constructor(manager: any)
    {
        super('Camera', manager);

        this.batchHandlerQuadSingleNode = manager.getNode('BatchHandlerQuadSingle');
        this.fillCameraNode = manager.getNode('FillCamera');
        this.listCompositorNode = manager.getNode('ListCompositor');
        this._parentTransformMatrix = new TransformMatrix();
    }

    run(
        drawingContext: any,
        children: any[],
        camera: any,
        parentTransformMatrix?: any,
        forceFramebuffer?: boolean,
        renderStep?: number
    ): void
    {
        this.onRunBegin(drawingContext);

        let currentContext: any;
        const drawingContextPool = drawingContext.renderer.drawingContextPool;
        const manager = this.manager;

        const alpha = camera.alpha;

        const internalFilters = camera.filters.internal.getActive();
        const externalFilters = camera.filters.external.getActive();

        const useFramebuffers = forceFramebuffer || camera.forceComposite || internalFilters.length || externalFilters.length || alpha < 1;

        if (!parentTransformMatrix)
        {
            parentTransformMatrix = this._parentTransformMatrix.copyFrom(camera.matrixExternal);
        }
        else
        {
            camera.matrixExternal.multiply(parentTransformMatrix, parentTransformMatrix);
        }

        const decomposedParent = parentTransformMatrix.decomposeMatrix();
        const parentIsIdentity =
            Equal(decomposedParent.translateX, 0) &&
            Equal(decomposedParent.translateY, 0) &&
            Equal(decomposedParent.rotation, 0) &&
            Equal(decomposedParent.scaleX, 1) &&
            Equal(decomposedParent.scaleY, 1);

        const cx = camera.x;
        const cy = camera.y;
        const cw = camera.width;
        const ch = camera.height;

        const baseContext = drawingContext.getClone();
        baseContext.setCamera(camera);

        if (useFramebuffers)
        {
            currentContext = drawingContextPool.get(cw, ch);
            currentContext.setCamera(camera);

            currentContext.setScissorBox(0, 0, cw, ch);
        }
        else
        {
            currentContext = baseContext;
            currentContext.setScissorBox(cx, cy, cw, ch);
        }

        currentContext.use();

        const fillCamera = this.fillCameraNode;

        if (camera.backgroundColor.alphaGL > 0)
        {
            const bg = camera.backgroundColor;
            let col = GetColor32(bg.red, bg.green, bg.blue, bg.alpha);
            fillCamera.run(currentContext, col, useFramebuffers);
        }

        this.listCompositorNode.run(currentContext, children, null, renderStep);

        let flashEffect = camera.flashEffect;
        if (flashEffect.postRenderWebGL())
        {
            let col = GetColor32(flashEffect.red, flashEffect.green, flashEffect.blue, flashEffect.alpha * 255);
            fillCamera.run(currentContext, col, useFramebuffers);
        }

        const fadeEffect = camera.fadeEffect;
        if (fadeEffect.postRenderWebGL())
        {
            const col = GetColor32(fadeEffect.red, fadeEffect.green, fadeEffect.blue, fadeEffect.alpha * 255);
            fillCamera.run(currentContext, col, useFramebuffers);
        }

        manager.finishBatch();

        if (useFramebuffers)
        {
            let index: number;
            let filter: any;
            let padding: any;
            let renderNode: any;
            let tint: number;

            const renderOptions = {
                smoothPixelArt: manager.renderer.game.config.smoothPixelArt
            };

            const coverageInternal = new Rectangle(0, 0, currentContext.width, currentContext.height);
            for (index = 0; index < internalFilters.length; index++)
            {
                filter = internalFilters[index];

                renderNode = manager.getNode(filter.renderNode);
                currentContext = renderNode.run(filter, currentContext);

                padding = filter.getPadding();
                coverageInternal.setTo(
                    coverageInternal.x + padding.x,
                    coverageInternal.y + padding.y,
                    coverageInternal.width + padding.width,
                    coverageInternal.height + padding.height
                );
            }
            const outputContext = currentContext;

            const drawExternalFilters = externalFilters.length > 0;
            let copyInternal = !drawExternalFilters;
            const coverageExternal = new Rectangle(0, 0, baseContext.width, baseContext.height);
            if (drawExternalFilters)
            {
                for (index = externalFilters.length - 1; index >= 0; index--)
                {
                    filter = externalFilters[index];

                    if (!filter.active) { continue; }

                    padding = filter.getPadding();

                    coverageExternal.setTo(
                        coverageExternal.x + padding.x,
                        coverageExternal.y + padding.y,
                        coverageExternal.width + padding.width,
                        coverageExternal.height + padding.height
                    );
                }

                copyInternal =
                    coverageExternal.width !== currentContext.width ||
                    coverageExternal.height !== currentContext.height ||
                    !parentIsIdentity;

                if (copyInternal)
                {
                    currentContext = drawingContextPool.get(coverageExternal.width, coverageExternal.height);
                    currentContext.setScissorBox(0, 0, coverageExternal.width, coverageExternal.height);
                    currentContext.setCamera(baseContext.camera);
                    currentContext.use();
                }
            }
            else
            {
                currentContext = baseContext;
            }

            if (copyInternal)
            {
                const externalX = coverageExternal.x;
                const externalY = coverageExternal.y;
                let quad: number[];

                parentTransformMatrix.setQuad(
                    coverageInternal.x,
                    coverageInternal.y,
                    coverageInternal.x + coverageInternal.width,
                    coverageInternal.y + coverageInternal.height
                );
                quad = parentTransformMatrix.quad;

                tint = drawExternalFilters ? 0xffffffff : getAlphaTint(alpha);

                this.batchHandlerQuadSingleNode.batch(
                    currentContext,

                    outputContext.texture,

                    quad[0] - externalX, quad[1] - externalY,
                    quad[2] - externalX, quad[3] - externalY,
                    quad[6] - externalX, quad[7] - externalY,
                    quad[4] - externalX, quad[5] - externalY,

                    0, 1, 1, -1,

                    false,

                    tint, tint, tint, tint,

                    renderOptions
                );
            }

            if (outputContext !== currentContext)
            {
                outputContext.release();
            }

            if (drawExternalFilters)
            {
                let skipDrawOut = false;
                let outputContext2: any = null;
                padding = new Rectangle();

                for (index = 0; index < externalFilters.length; index++)
                {
                    filter = externalFilters[index];

                    if (
                        filter.allowBaseDraw &&

                        currentContext.width === baseContext.width &&
                        currentContext.height === baseContext.height &&

                        index === externalFilters.length - 1 &&

                        alpha === 1
                    )
                    {
                        skipDrawOut = true;
                        outputContext2 = baseContext;
                    }

                    renderNode = manager.getNode(filter.renderNode);
                    currentContext = renderNode.run(filter, currentContext, outputContext2, padding);

                    padding = filter.currentPadding;

                    padding.x = -padding.x;
                    padding.y = -padding.y;
                    padding.width = -padding.width;
                    padding.height = -padding.height;
                }

                if (!skipDrawOut)
                {
                    tint = getAlphaTint(alpha);

                    const x1 = -padding.x;
                    const y1 = -padding.y;
                    const x2 = currentContext.width + padding.right;
                    const y2 = currentContext.height + padding.bottom;

                    this.batchHandlerQuadSingleNode.batch(
                        baseContext,

                        currentContext.texture,

                        x1, y2,
                        x1, y1,
                        x2, y2,
                        x2, y1,

                        0, 0, 1, 1,

                        false,

                        tint, tint, tint, tint,

                        renderOptions
                    );

                    currentContext.release();
                }
            }

        }

        camera.dirty = false;

        camera.emit(CameraEvents.POST_RENDER, camera);

        this.onRunEnd(drawingContext);
    }
}
