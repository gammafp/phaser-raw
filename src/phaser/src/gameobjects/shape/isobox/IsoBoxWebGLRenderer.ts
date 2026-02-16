var GetCalcMatrix = require('../../GetCalcMatrix');
var Utils = require('../../../renderer/webgl/Utils');

export const IsoBoxWebGLRenderer = function (renderer: any, src: any, drawingContext: any, parentMatrix: any): void
{
    if (!src.isFilled)
    {
        return;
    }

    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var fillTriNode = src.customRenderNodes.FillTri || src.defaultRenderNodes.FillTri;
    var submitterNode = src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter;

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var size = src.width;
    var height = src.height;

    var sizeA = size / 2;
    var sizeB = size / src.projection;

    var alpha = src.alpha;

    var tint;

    var x0;
    var y0;
    var x1;
    var y1;
    var x2;
    var y2;
    var x3;
    var y3;

    if (src.showTop)
    {
        tint = Utils.getTintAppendFloatAlpha(src.fillTop, alpha);

        x0 = -sizeA;
        y0 = -height;
        x1 = 0;
        y1 = -sizeB - height;
        x2 = sizeA;
        y2 = -height;
        x3 = 0;
        y3 = sizeB - height;

        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x0, y0, x1, y1, x2, y2, tint, tint, tint);
        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x2, y2, x3, y3, x0, y0, tint, tint, tint);
    }

    if (src.showLeft)
    {
        tint = Utils.getTintAppendFloatAlpha(src.fillLeft, alpha);

        x0 = -sizeA;
        y0 = 0;
        x1 = 0;
        y1 = sizeB;
        x2 = 0;
        y2 = sizeB - height;
        x3 = -sizeA;
        y3 = -height;

        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x0, y0, x1, y1, x2, y2, tint, tint, tint);
        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x2, y2, x3, y3, x0, y0, tint, tint, tint);
    }

    if (src.showRight)
    {
        tint = Utils.getTintAppendFloatAlpha(src.fillRight, alpha);

        x0 = sizeA;
        y0 = 0;
        x1 = 0;
        y1 = sizeB;
        x2 = 0;
        y2 = sizeB - height;
        x3 = sizeA;
        y3 = -height;

        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x0, y0, x1, y1, x2, y2, tint, tint, tint);
        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x2, y2, x3, y3, x0, y0, tint, tint, tint);
    }
};
