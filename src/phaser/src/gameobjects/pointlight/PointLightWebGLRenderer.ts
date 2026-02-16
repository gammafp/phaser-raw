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
 * @method Phaser.GameObjects.PointLight#renderWebGL
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.PointLight} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
export const PointLightWebGLRenderer = function (_renderer: any, src: any, drawingContext: any, parentMatrix: any): void
{
    const camera = drawingContext.camera;
    camera.addToRenderList(src);

    const calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    const width = src.width;
    const height = src.height;

    const x = -src._radius;
    const y = -src._radius;

    const xw = x + width;
    const yh = y + height;

    const lightX = calcMatrix.getX(0, 0);
    const lightY = calcMatrix.getY(0, 0);

    const txTL = calcMatrix.getX(x, y);
    const tyTL = calcMatrix.getY(x, y);

    const txBL = calcMatrix.getX(x, yh);
    const tyBL = calcMatrix.getY(x, yh);

    const txBR = calcMatrix.getX(xw, yh);
    const tyBR = calcMatrix.getY(xw, yh);

    const txTR = calcMatrix.getX(xw, y);
    const tyTR = calcMatrix.getY(xw, y);

    (src.customRenderNodes.BatchHandler || src.defaultRenderNodes.BatchHandler).batch(
        drawingContext,
        src,
        txTL, tyTL,
        txBL, tyBL,
        txTR, tyTR,
        txBR, tyBR,
        lightX, lightY
    );
};
