/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import * as CameraEvents from '../../../cameras/2d/events';
import { DynamicTextureCommands } from '../../../textures/DynamicTextureCommands';
import { BlendModes } from '../../BlendModes';
import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * This RenderNode handles rendering for DynamicTextures.
 *
 * @class DynamicTextureHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class DynamicTextureHandler extends RenderNode {

    fillRectNode: any;

    constructor(manager: any)
    {
        super('DynamicTextureHandler', manager);

        this.fillRectNode = this.manager.getNode('FillRect');
    }

    run(dynamicTexture: any): void
    {
        const drawingContext = dynamicTexture.drawingContext;
        const camera = drawingContext.camera;
        const renderer = drawingContext.renderer;
        const textureManager = dynamicTexture.manager;

        this.onRunBegin(drawingContext);

        const glTexture = drawingContext.framebuffer.renderTexture;
        if (glTexture)
        {
            const glTextureUnits = renderer.glTextureUnits;
            const units = glTextureUnits.units;
            for (let i = 0; i < units.length; i++)
            {
                if (units[i] === glTexture)
                {
                    glTextureUnits.bind(null, i);
                }
            }
        }

        drawingContext.setScissorBox(
            0,
            0,
            camera.width,
            camera.height
        );

        drawingContext.use();

        let alpha: number, blendMode: number, frame: any, height: number, key: string, originX: number, originY: number, rotation: number, scaleX: number, scaleY: number, tint: number, width: number, x: number, y: number;

        const commandBuffer = dynamicTexture.commandBuffer;
        const commandBufferLength = commandBuffer.length;

        let eraseMode = false;
        let eraseContext: any = null;
        let preserveBuffer = false;
        let currentContext = drawingContext;
        const gl = renderer.gl;

        for (let index = 0; index < commandBufferLength; index++)
        {
            const command = commandBuffer[index];

            switch (command)
            {
                case DynamicTextureCommands.CLEAR:
                {
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    width = commandBuffer[++index];
                    height = commandBuffer[++index];

                    const clearContext = currentContext.getClone();
                    clearContext.setScissorEnable(true);
                    clearContext.setScissorBox(x, y, width, height);
                    clearContext.use();

                    clearContext.clear(
                        gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT
                    );

                    clearContext.release();

                    break;
                }

                case DynamicTextureCommands.FILL:
                {
                    const color = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    width = commandBuffer[++index];
                    height = commandBuffer[++index];

                    this.fillRectNode.run(
                        currentContext,
                        null,
                        null,
                        x, y, width, height,
                        color, color, color, color,
                        false
                    );

                    break;
                }

                case DynamicTextureCommands.STAMP:
                {
                    key = commandBuffer[++index];
                    frame = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    alpha = commandBuffer[++index];
                    tint = commandBuffer[++index];
                    rotation = commandBuffer[++index];
                    scaleX = commandBuffer[++index];
                    scaleY = commandBuffer[++index];
                    originX = commandBuffer[++index];
                    originY = commandBuffer[++index];
                    blendMode = commandBuffer[++index];

                    const stamp = textureManager.resetStamp(alpha, tint);

                    stamp.setPosition(x, y)
                        .setRotation(rotation)
                        .setTexture(key, frame)
                        .setOrigin(originX, originY)
                        .setScale(scaleX, scaleY)
                        .setBlendMode(blendMode);

                    currentContext = this._draw(renderer, stamp, currentContext, drawingContext, eraseContext);

                    break;
                }

                case DynamicTextureCommands.REPEAT:
                {
                    key = commandBuffer[++index];
                    frame = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    alpha = commandBuffer[++index];
                    tint = commandBuffer[++index];
                    rotation = commandBuffer[++index];
                    scaleX = commandBuffer[++index];
                    scaleY = commandBuffer[++index];
                    originX = commandBuffer[++index];
                    originY = commandBuffer[++index];
                    blendMode = commandBuffer[++index];

                    width = commandBuffer[++index];
                    height = commandBuffer[++index];
                    const tilePositionX = commandBuffer[++index];
                    const tilePositionY = commandBuffer[++index];
                    const tileRotation = commandBuffer[++index];
                    const tileScaleX = commandBuffer[++index];
                    const tileScaleY = commandBuffer[++index];

                    const repeat = textureManager.resetTileSprite(alpha, tint);

                    repeat.setPosition(x, y)
                        .setRotation(rotation)
                        .setTexture(key, frame)
                        .setSize(width, height)
                        .setOrigin(originX, originY)
                        .setScale(scaleX, scaleY)
                        .setBlendMode(blendMode)
                        .setTilePosition(tilePositionX, tilePositionY)
                        .setTileRotation(tileRotation)
                        .setTileScale(tileScaleX, tileScaleY);

                    currentContext = this._draw(renderer, repeat, currentContext, drawingContext, eraseContext);

                    break;
                }

                case DynamicTextureCommands.DRAW:
                {
                    let object = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];

                    let prevX: number | undefined;
                    let prevY: number | undefined;
                    if (x !== undefined)
                    {
                        prevX = object.x;
                        object.x += x;
                    }

                    if (y !== undefined)
                    {
                        prevY = object.y;
                        object.y += y;
                    }

                    currentContext = this._draw(renderer, object, currentContext, drawingContext, eraseContext);

                    if (x !== undefined && prevX !== undefined)
                    {
                        object.x = prevX;
                    }

                    if (y !== undefined && prevY !== undefined)
                    {
                        object.y = prevY;
                    }

                    break;
                }

                case DynamicTextureCommands.SET_ERASE:
                {
                    eraseMode = commandBuffer[++index];
                    if (eraseMode)
                    {
                        if (!eraseContext)
                        {
                            eraseContext = drawingContext.getClone();
                            eraseContext.setBlendMode(BlendModes.ERASE);
                        }
                        if (currentContext !== eraseContext)
                        {
                            currentContext.release();
                            currentContext = eraseContext;
                            eraseContext.use();
                        }
                    }
                    else if (currentContext === eraseContext)
                    {
                        eraseContext.release();
                        currentContext = drawingContext;
                        drawingContext.use();
                    }
                    break;
                }

                case DynamicTextureCommands.PRESERVE:
                {
                    preserveBuffer = commandBuffer[++index];
                    break;
                }

                case DynamicTextureCommands.CALLBACK:
                {
                    const callback = commandBuffer[++index];
                    callback();
                    break;
                }

                case DynamicTextureCommands.CAPTURE:
                {
                    const obj = commandBuffer[++index];
                    const config = commandBuffer[++index];

                    const cacheConfig = dynamicTexture.startCapture(obj, config);

                    let viewContext = currentContext;
                    if (config.camera)
                    {
                        viewContext = viewContext.getClone();
                        viewContext.setCamera(config.camera);
                        viewContext.use();
                    }

                    this._draw(renderer, obj, viewContext, drawingContext, eraseContext, cacheConfig.transform);
                    dynamicTexture.finishCapture(obj, cacheConfig);

                    if (config.camera)
                    {
                        viewContext.release();
                    }

                    break;
                }
            }
        }

        if (!preserveBuffer)
        {
            commandBuffer.length = 0;
        }

        currentContext.release();

        camera.emit(CameraEvents.POST_RENDER, camera);

        this.onRunEnd(drawingContext);
    }

    _draw(
        renderer: any,
        object: any,
        currentContext: any,
        drawingContext: any,
        eraseContext: any,
        parentMatrix?: any
    ): any
    {
        if (
            currentContext !== eraseContext &&
            object.blendMode !== currentContext.blendMode &&
            object.blendMode !== BlendModes.SKIP_CHECK
        )
        {
            currentContext.release();

            const blendMode = object.blendMode;
            if (blendMode === drawingContext.blendMode)
            {
                currentContext = drawingContext;
            }
            else
            {
                currentContext = drawingContext.getClone();
                currentContext.setBlendMode(blendMode);
            }
            currentContext.use();
        }

        object.renderWebGLStep(renderer, object, currentContext, parentMatrix);

        return currentContext;
    }
}
