/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

let body1: any;
let body2: any;
let body1Pushable: boolean;
let body2Pushable: boolean;
let body1MassImpact: number;
let body2MassImpact: number;
let body1FullImpact: number;
let body2FullImpact: number;
let body1MovingLeft: boolean;
let body1MovingRight: boolean;
let body1Stationary: boolean;
let body2MovingLeft: boolean;
let body2MovingRight: boolean;
let body2Stationary: boolean;
let body1OnLeft: boolean;
let body2OnLeft: boolean;
let overlap: number;

const BlockCheck = (): number =>
{
    //  Body1 is moving right and Body2 is blocked from going right any further
    if (body1MovingRight && body1OnLeft && body2.blocked.right)
    {
        body1.processX(-overlap, body1FullImpact, false, true);

        return 1;
    }

    //  Body1 is moving left and Body2 is blocked from going left any further
    if (body1MovingLeft && body2OnLeft && body2.blocked.left)
    {
        body1.processX(overlap, body1FullImpact, true);

        return 1;
    }

    //  Body2 is moving right and Body1 is blocked from going right any further
    if (body2MovingRight && body2OnLeft && body1.blocked.right)
    {
        body2.processX(-overlap, body2FullImpact, false, true);

        return 2;
    }

    //  Body2 is moving left and Body1 is blocked from going left any further
    if (body2MovingLeft && body1OnLeft && body1.blocked.left)
    {
        body2.processX(overlap, body2FullImpact, true);

        return 2;
    }

    return 0;
};

const Check = (): boolean =>
{
    var py = BlockCheck();

    if (py !== 0)
    {
        return (py === 1);
    }

    //  Share the velocity between them based on mass, pushable, etc.

    if (body1MovingLeft || body1MovingRight)
    {
        body1MassImpact = body1FullImpact;
        body2MassImpact = body2FullImpact;

        if (body1Pushable && body2Pushable)
        {
            //  Both pushable, share the separation based on mass
            var m1 = body2.mass / (body1.mass + body2.mass);
            var m2 = 1 - m1;

            overlap *= 0.5;

            body1.processX(-overlap * m1, body1MassImpact * m1, true);
            body2.processX(overlap * m2, body2MassImpact * m2, true);
        }
        else if (body1Pushable && !body2Pushable)
        {
            //  Body1 pushable, Body2 not
            body1.processX(-overlap, body1MassImpact, true);
        }
        else if (!body1Pushable && body2Pushable)
        {
            //  Body2 pushable, Body1 not
            body2.processX(overlap, body2MassImpact, true);
        }
        else
        {
            //  Neither body is pushable, so base it on velocity
            var halfOverlap = overlap * 0.5;

            body1.processX(-halfOverlap, 0, true);
            body2.processX(halfOverlap, 0, true);
        }
    }

    return true;
};

const RunImmovableBody1 = (blockedState: number): void =>
{
    if (blockedState === 1)
    {
        //  Body2 is blocked by Body1, but Body1 cannot move anywhere either, so we cancel out velocity
        body2.velocity.x = 0;
    }
    else
    {
        body2.processX(overlap, body2FullImpact, true);
    }
};

const RunImmovableBody2 = (blockedState: number): void =>
{
    if (blockedState === 2)
    {
        //  Body1 is blocked by Body2, but Body2 cannot move anywhere either, so we cancel out velocity
        body1.velocity.x = 0;
    }
    else
    {
        body1.processX(-overlap, body1FullImpact, true);
    }
};

const Set = (b1: any, b2: any, ov: number): number =>
{
    body1 = b1;
    body2 = b2;

    var v1 = body1.velocity.x;
    var v2 = body2.velocity.x;

    body1Pushable = body1.pushable;
    body1MovingLeft = body1._dx < 0;
    body1MovingRight = body1._dx > 0;
    body1Stationary = body1._dx === 0;
    body1OnLeft = Math.abs(body1.right - body2.x) <= Math.abs(body2.right - body1.x);
    body1FullImpact = v2 - v1 * body1.bounce.x;

    body2Pushable = body2.pushable;
    body2MovingLeft = body2._dx < 0;
    body2MovingRight = body2._dx > 0;
    body2Stationary = body2._dx === 0;
    body2OnLeft = !body1OnLeft;
    body2FullImpact = v1 - v2 * body2.bounce.x;

    //  negative delta = up, positive delta = down (inc. gravity)
    overlap = Math.abs(ov);

    return BlockCheck();
};

export const ProcessX = {
    BlockCheck,
    Check,
    RunImmovableBody1,
    RunImmovableBody2,
    Set
};
