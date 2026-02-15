/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetCalcMatrix } from '../GetCalcMatrix';
import { TransformMatrix } from '../components/TransformMatrix';
const Utils = require('../../renderer/webgl/Utils');

const tempMatrix1 = new TransformMatrix();
const tempMatrix2 = new TransformMatrix();
const tempMatrix3 = new TransformMatrix();

export const ParticleEmitterWebGLRenderer = (renderer: any, emitter: any, camera: any, parentMatrix: any): void =>
{
    const particles = emitter.alive;
    const particleCount = particles.length;

    if (particleCount === 0)
    {
        return;
    }

    camera.addToRenderList(emitter);

    const pipeline = renderer.pipelines.set(emitter.pipeline, emitter);
    const calcMatrix = GetCalcMatrix(emitter, camera, parentMatrix).calc;

    renderer.pipelines.preBatch(emitter);

    const getTint = Utils.getTintAppendFloatAlpha;
    const roundPixels = camera.roundPixels;
    const textureUnit = pipeline.setGameObject(emitter);

    const camMatrix = tempMatrix1;
    const particleMatrix = tempMatrix2;
    const managerMatrix = tempMatrix3;

    if (parentMatrix)
    {
        managerMatrix.loadIdentity();
        managerMatrix.multiply(parentMatrix);
        managerMatrix.translate(emitter.x, emitter.y);
        managerMatrix.rotate(emitter.rotation);
        managerMatrix.scale(emitter.scaleX, emitter.scaleY);
    }
    else
    {
        managerMatrix.applyITRS(emitter.x, emitter.y, emitter.rotation, emitter.scaleX, emitter.scaleY);
    }

    camMatrix.copyFrom(camera.matrix);

    const scrollFactorX = emitter.scrollFactorX;
    const scrollFactorY = emitter.scrollFactorY;

    for (let i = 0; i < particleCount; i++)
    {
        const particle = particles[i];
        const alpha = particle.alpha * camera.alpha;

        if (alpha <= 0)
        {
            continue;
        }

        const frame = particle.frame;
        const x = -(frame.halfWidth);
        const y = -(frame.halfHeight);

        const xw = x + frame.width;
        const yh = y + frame.height;

        particleMatrix.applyITRS(particle.x, particle.y, particle.rotation, particle.scaleX, particle.scaleY);

        particleMatrix.e -= scrollFactorX * camera.scrollX;
        particleMatrix.f -= scrollFactorY * camera.scrollY;

        camMatrix.multiply(particleMatrix, calcMatrix);
        managerMatrix.multiply(calcMatrix, calcMatrix);

        const tx0 = calcMatrix.getX(x, y);
        const ty0 = calcMatrix.getY(x, y);
        const tx1 = calcMatrix.getX(x, yh);
        const ty1 = calcMatrix.getY(x, yh);
        const tx2 = calcMatrix.getX(xw, yh);
        const ty2 = calcMatrix.getY(xw, yh);
        const tx3 = calcMatrix.getX(xw, y);
        const ty3 = calcMatrix.getY(xw, y);

        const tint = getTint(particle.tint, alpha);

        pipeline.batchQuad(emitter, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, particle.tintFill, frame.glTexture, textureUnit);
    }

    renderer.pipelines.postBatch(emitter);
};

