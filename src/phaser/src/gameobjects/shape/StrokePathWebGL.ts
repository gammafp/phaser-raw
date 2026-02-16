/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Utils = require('../../renderer/webgl/Utils');

export const StrokePathWebGL = function (drawingContext: any, submitter: any, matrix: any, src: any, alpha: number, dx: number, dy: number): void
{
    var strokeTintColor = Utils.getTintAppendFloatAlpha(src.strokeColor, src.strokeAlpha * alpha);

    var path = src.pathData;
    var pathLength = path.length - 1;
    var lineWidth = src.lineWidth;
    var openPath = !src.closePath;

    var strokePath = src.customRenderNodes.StrokePath || src.defaultRenderNodes.StrokePath;

    var pointPath: { x: number; y: number; width: number }[] = [];

    if (openPath)
    {
        pathLength -= 2;
    }

    for (var i = 0; i < pathLength; i += 2)
    {
        var x = path[i] - dx;
        var y = path[i + 1] - dy;
        if (i > 0)
        {
            if (x === path[i - 2] && y === path[i - 1])
            {
                continue;
            }
        }
        pointPath.push({
            x: x,
            y: y,
            width: lineWidth
        });
    }

    strokePath.run(
        drawingContext,
        submitter,
        pointPath,
        lineWidth,
        openPath,
        matrix,
        strokeTintColor, strokeTintColor, strokeTintColor, strokeTintColor
    );
};
