/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const GetCalcMatrix = require('../GetCalcMatrix');

export const PointLightWebGLRenderer = (renderer: any, src: any, camera: any, parentMatrix: any): void =>
{
    camera.addToRenderList(src);

    const pipeline = renderer.pipelines.set(src.pipeline);

    const calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    const width = src.width;
    const height = src.height;

    const x = -src._radius;
    const y = -src._radius;

    const xw = x + width;
    const yh = y + height;

    const lightX = calcMatrix.getX(0, 0);
    const lightY = calcMatrix.getY(0, 0);

    const tx0 = calcMatrix.getX(x, y);
    const ty0 = calcMatrix.getY(x, y);

    const tx1 = calcMatrix.getX(x, yh);
    const ty1 = calcMatrix.getY(x, yh);

    const tx2 = calcMatrix.getX(xw, yh);
    const ty2 = calcMatrix.getY(xw, yh);

    const tx3 = calcMatrix.getX(xw, y);
    const ty3 = calcMatrix.getY(xw, y);

    renderer.pipelines.preBatch(src);

    pipeline.batchPointLight(src, camera, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, lightX, lightY);

    renderer.pipelines.postBatch(src);
};
