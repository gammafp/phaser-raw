/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { FillPathWebGL } from '../FillPathWebGL';
import { StrokePathWebGL } from '../StrokePathWebGL';

var GetCalcMatrix = require('../../GetCalcMatrix');

export const CurveWebGLRenderer = function (_renderer: any, src: any, drawingContext: any, parentMatrix: any): void
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var dx = src._displayOriginX + src._curveBounds.x;
    var dy = src._displayOriginY + src._curveBounds.y;
    var alpha = src.alpha;

    var submitter = src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter;

    if (src.isFilled)
    {
        FillPathWebGL(drawingContext, submitter, calcMatrix, src, alpha, dx, dy);
    }

    if (src.isStroked)
    {
        StrokePathWebGL(drawingContext, submitter, calcMatrix, src, alpha, dx, dy);
    }
};
