/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetOverlapX } from './GetOverlapX';
import { ProcessX } from './ProcessX';

/**
 * Separates two overlapping bodies on the X-axis (horizontally).
 *
 * Separation involves moving two overlapping bodies so they don't overlap anymore and adjusting their velocities based on their mass. This is a core part of collision detection.
 *
 * The bodies won't be separated if there is no horizontal overlap between them, if they are static, or if either one uses custom logic for its separation.
 */
export const SeparateX = function (body1: any, body2: any, overlapOnly: boolean, bias: number, overlap?: number): boolean
{
    if (overlap === undefined) { overlap = GetOverlapX(body1, body2, overlapOnly, bias); }

    const body1Immovable = body1.immovable;
    const body2Immovable = body2.immovable;

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1Immovable && body2Immovable) || body1.customSeparateX || body2.customSeparateX)
    {
        //  return true if there was some overlap, otherwise false
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    const blockedState = ProcessX.Set(body1, body2, overlap);

    if (!body1Immovable && !body2Immovable)
    {
        if (blockedState > 0)
        {
            return true;
        }

        return ProcessX.Check();
    }
    else if (body1Immovable)
    {
        ProcessX.RunImmovableBody1(blockedState);
    }
    else if (body2Immovable)
    {
        ProcessX.RunImmovableBody2(blockedState);
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};
