/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A RenderNode is a node in the rendering graph.
 * It is invoked by calling `run`, which takes inputs and returns outputs
 * depending on the subclass implementation.
 *
 * @class RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {string} name - The name of the RenderNode.
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class RenderNode {

    name: string;
    manager: any;
    _run: (() => any) | null = null;

    constructor(name: string, manager: any)
    {
        this.name = name;
        this.manager = manager;
    }

    run(): void
    {
        // Insert code here.
    }

    onRunBegin(drawingContext: any): void {}

    onRunEnd(drawingContext: any): void {}

    setDebug(debug: boolean): void
    {
        if (debug)
        {
            this._run = this.run.bind(this);

            (this as any).run = function (): any
            {
                const manager = this.manager;
                manager.pushDebug(this.name);

                const output = this._run!.apply(this, arguments);

                manager.popDebug();

                return output;
            };
        }
        else
        {
            (this as any).run = this._run;
            this._run = null;
        }
    }
}
