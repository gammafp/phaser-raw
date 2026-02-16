/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * YieldContext is a RenderNode which sets the WebGL context to a default state,
 * ready for another renderer.
 *
 * This is used by the Extern Game Object to prepare the WebGL context for custom rendering.
 * It is the counterpart of RebindContext.
 *
 * @class YieldContext
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class YieldContext extends RenderNode {

    _state: any;

    constructor(manager: any)
    {
        super('YieldContext', manager);

        this._state = {
            blend: this.manager.renderer.blendModes[0],
            vao: null
        };
    }

    run(displayContext: any): void
    {
        this.onRunBegin(displayContext);

        const manager = this.manager;
        const renderer = manager.renderer;

        manager.startStandAloneRender();

        renderer.glWrapper.update(this._state);

        renderer.glTextureUnits.unbindAllUnits();

        this.onRunEnd(displayContext);
    }
}
