import { StrokePathWebGL } from '../StrokePathWebGL';

var GetCalcMatrix = require('../../GetCalcMatrix');
import { Utils } from '../../../renderer/webgl/Utils';

export const TriangleWebGLRenderer = function (renderer: any, src: any, drawingContext: any, parentMatrix: any): void
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
        var fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha);

        var x1 = src.geom.x1 - dx;
        var y1 = src.geom.y1 - dy;
        var x2 = src.geom.x2 - dx;
        var y2 = src.geom.y2 - dy;
        var x3 = src.geom.x3 - dx;
        var y3 = src.geom.y3 - dy;

        (customRenderNodes.FillTri || defaultRenderNodes.FillTri).run(
            drawingContext,
            calcMatrix,
            submitter,
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
            fillTintColor,
            fillTintColor,
            fillTintColor
        );
    }

    if (src.isStroked)
    {
        StrokePathWebGL(drawingContext, submitter, calcMatrix, src, alpha, dx, dy);
    }
};
