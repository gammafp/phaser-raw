/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { TransformMatrix } from './components/TransformMatrix';

const tempMatrix1 = new TransformMatrix();
const tempMatrix2 = new TransformMatrix();
const tempMatrix3 = new TransformMatrix();

const result = { camera: tempMatrix1, sprite: tempMatrix2, calc: tempMatrix3 };

export const GetCalcMatrix = (src: any, camera: any, parentMatrix?: any): any =>
{
    const camMatrix = tempMatrix1;
    const spriteMatrix = tempMatrix2;
    const calcMatrix = tempMatrix3;

    spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);
        spriteMatrix.e = src.x;
        spriteMatrix.f = src.y;
    }
    else
    {
        spriteMatrix.e -= camera.scrollX * src.scrollFactorX;
        spriteMatrix.f -= camera.scrollY * src.scrollFactorY;
    }

    camMatrix.multiply(spriteMatrix, calcMatrix);

    return result;
};
