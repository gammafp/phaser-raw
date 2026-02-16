/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetCalcMatrix } from '../GetCalcMatrix';

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Extern#renderWebGL
 * @since 3.16.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Extern} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 * @param {number} renderStep - The render step index.
 * @param {Phaser.GameObjects.GameObject[]} displayList - The display list which is currently being rendered.
 * @param {number} displayListIndex - The index of the Game Object within the display list.
 */
export const ExternWebGLRenderer = function (renderer: any, src: any, drawingContext: any, parentMatrix: any, renderStep: number, displayList: any[], displayListIndex: number): void
{
    renderer.renderNodes.getNode('YieldContext').run(drawingContext);

    const calcMatrix = GetCalcMatrix(src, drawingContext.camera, parentMatrix, !drawingContext.useCanvas).calc;

    src.render.call(src, renderer, drawingContext, calcMatrix, displayList, displayListIndex);

    renderer.renderNodes.getNode('RebindContext').run(drawingContext);
};
