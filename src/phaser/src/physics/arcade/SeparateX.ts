/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetOverlapX } from './GetOverlapX';
const ProcessX = require('./ProcessX');

export const SeparateX = (body1: any, body2: any, overlapOnly: boolean, bias: number, overlap?: number): boolean =>
{
    if (overlap === undefined) { overlap = GetOverlapX(body1, body2, overlapOnly, bias); }

    var body1Immovable = body1.immovable;
    var body2Immovable = body2.immovable;

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1Immovable && body2Immovable) || body1.customSeparateX || body2.customSeparateX)
    {
        //  return true if there was some overlap, otherwise false
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    var blockedState = ProcessX.Set(body1, body2, overlap);

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
        ProcessX.RunImmovableBody1(overlap);
    }
    else if (body2Immovable)
    {
        ProcessX.RunImmovableBody2(overlap);
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};
