/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetCalcMatrix } from '../GetCalcMatrix';

export const ParticleEmitterCanvasRenderer = (renderer: any, emitter: any, camera: any, parentMatrix: any): void =>
{
    const particles = emitter.alive;
    const length = particles.length;

    if (length === 0)
    {
        return;
    }

    const ctx = renderer.currentContext;
    const calcMatrix = GetCalcMatrix(emitter, camera, parentMatrix).calc;

    ctx.save();

    calcMatrix.setToContext(ctx);

    const roundPixels = camera.roundPixels;

    for (let i = 0; i < length; i++)
    {
        const particle = particles[i];

        const alpha = particle.alpha * camera.alpha;

        if (alpha <= 0)
        {
            continue;
        }

        const frame = particle.frame;
        const cd = frame.canvasData;
        const x = -(frame.halfWidth);
        const y = -(frame.halfHeight);

        ctx.globalAlpha = alpha;

        ctx.save();

        ctx.translate(particle.x, particle.y);

        ctx.rotate(particle.rotation);

        ctx.scale(particle.scaleX, particle.scaleY);

        ctx.drawImage(frame.source.image, cd.x, cd.y, cd.width, cd.height, x, y, cd.width, cd.height);

        ctx.restore();
    }

    ctx.restore();
};

