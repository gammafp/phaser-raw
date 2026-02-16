/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BatchHandlerQuad } from './BatchHandlerQuad';

/**
 * @classdesc
 * BatchHandlerQuadSingle is a specialized batch handler for rendering quads
 * with a single instance per batch.
 * It extends the BatchHandlerQuad class and provides a specific configuration
 * for single-instance rendering.
 * It is used to efficiently render operations that require only a single quad,
 * specifically filters.
 *
 * @class BatchHandlerQuadSingle
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @memberOf Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
export class BatchHandlerQuadSingle extends BatchHandlerQuad {

    constructor(manager: any, config?: any)
    {
        if (config === undefined) { config = {}; }
        if (!config.name) { config.name = 'BatchHandlerQuadSingle'; }
        if (!config.shaderName) { config.shaderName = 'STANDARD_SINGLE'; }
        if (!config.instancesPerBatch) { config.instancesPerBatch = 1; }

        super(manager, BatchHandlerQuad.defaultConfig, config);
    }
}
