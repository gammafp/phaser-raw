/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Utils } from '../../renderer/webgl/Utils';

export const FillPathWebGL = function (drawingContext: any, submitter: any, calcMatrix: any, src: any, alpha: number, dx: number, dy: number): void
{
    var fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha);

    var path = src.pathData;
    var pathIndexes = src.pathIndexes;

    var length = path.length;
    var pathIndex: number, pointX: number, pointY: number, x: number, y: number;

    var vertices = Array(length * 2);
    var colors = Array(length);

    var verticesIndex = 0;
    var colorsIndex = 0;

    for (pathIndex = 0; pathIndex < length; pathIndex += 2)
    {
        pointX = path[pathIndex] - dx;
        pointY = path[pathIndex + 1] - dy;

        x = calcMatrix.getX(pointX, pointY);
        y = calcMatrix.getY(pointX, pointY);

        vertices[verticesIndex++] = x;
        vertices[verticesIndex++] = y;
        colors[colorsIndex++] = fillTintColor;
    }

    submitter.batch(
        drawingContext,
        pathIndexes,
        vertices,
        colors
    );
};
