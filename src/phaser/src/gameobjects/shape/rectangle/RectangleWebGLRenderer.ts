import { FillPathWebGL } from '../FillPathWebGL';
import { StrokePathWebGL } from '../StrokePathWebGL';

var GetCalcMatrix = require('../../GetCalcMatrix');
import { Utils } from '../../../renderer/webgl/Utils';

export const RectangleWebGLRenderer = function (renderer: any, src: any, drawingContext: any, parentMatrix: any): void
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;
    var alpha = src.alpha;

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;
    var submitter = customRenderNodes.Submitter || defaultRenderNodes.Submitter;

    if (src.isFilled)
    {
        if (src.isRounded)
        {
            FillPathWebGL(drawingContext, submitter, calcMatrix, src, alpha, dx, dy);
        }
        else
        {
            var fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha);

            (customRenderNodes.FillRect || defaultRenderNodes.FillRect).run(
                drawingContext,
                calcMatrix,
                submitter,
                -dx, -dy,
                src.width, src.height,
                fillTintColor,
                fillTintColor,
                fillTintColor,
                fillTintColor
            );
        }
    }

    if (src.isStroked)
    {
        StrokePathWebGL(drawingContext, submitter, calcMatrix, src, alpha, dx, dy);
    }
};
