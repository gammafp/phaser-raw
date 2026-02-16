var GetCalcMatrix = require('../../GetCalcMatrix');
import { Utils } from '../../../renderer/webgl/Utils';

var tempPath = [
    {
        x: 0, y: 0, width: 0
    },
    {
        x: 0, y: 0, width: 0
    }
];

export const LineWebGLRenderer = function (renderer: any, src: any, drawingContext: any, parentMatrix: any): void
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;
    var alpha = src.alpha;

    if (src.isStroked)
    {
        var color = Utils.getTintAppendFloatAlpha(src.strokeColor, src.strokeAlpha * alpha);

        tempPath[0].x = src.geom.x1 - dx;
        tempPath[0].y = src.geom.y1 - dy;
        tempPath[0].width = src._startWidth;

        tempPath[1].x = src.geom.x2 - dx;
        tempPath[1].y = src.geom.y2 - dy;
        tempPath[1].width = src._endWidth;

        (src.customRenderNodes.StrokePath || src.defaultRenderNodes.StrokePath).run(
            drawingContext,
            src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter,
            tempPath,
            1,
            true,
            calcMatrix,
            color, color, color, color
        );
    }
};
