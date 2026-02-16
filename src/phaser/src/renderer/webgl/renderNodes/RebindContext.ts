/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Merge } from '../../../utils/object/Merge';

import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * RebindContext is a RenderNode which sets the WebGL context to
 * a default state, resetting important properties
 * that might have been changed by an external renderer.
 *
 * This is used by the Extern GameObject after rendering.
 * It is the counterpart of YieldContext.
 *
 * @class RebindContext
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class RebindContext extends RenderNode {

    _state: any;

    constructor(manager: any)
    {
        super('RebindContext', manager);

        this._state = {
            bindings: {
                activeTexture: 0,
                arrayBuffer: null,
                elementArrayBuffer: null,
                framebuffer: null,
                program: null,
                renderbuffer: null
            },
            vao: null
        };
    }

    run(displayContext: any): void
    {
        this.onRunBegin(displayContext);

        const renderer = this.manager.renderer;
        const glWrapper = renderer.glWrapper;

        renderer.clearFramebuffer(
            undefined,
            undefined,
            0
        );

        glWrapper.update(Merge(this._state, glWrapper.state), true);

        renderer.glTextureUnits.unbindAllUnits();

        this.onRunEnd(displayContext);
    }
}
