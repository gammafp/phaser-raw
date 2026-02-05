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
let body1MovingUp: boolean;
let body1MovingDown: boolean;
let body1Stationary: boolean;
let body2MovingUp: boolean;
let body2MovingDown: boolean;
let body2Stationary: boolean;
let body1OnTop: boolean;
let body2OnTop: boolean;
let overlap: number;

const BlockCheck = (): number =>
{
    //  Body1 is moving down and Body2 is blocked from going down any further
    if (body1MovingDown && body1OnTop && body2.blocked.down)
    {
        body1.processY(-overlap, body1FullImpact, false, true);

        return 1;
    }

    //  Body1 is moving up and Body2 is blocked from going up any further
    if (body1MovingUp && body2OnTop && body2.blocked.up)
    {
        body1.processY(overlap, body1FullImpact, true);

        return 1;
    }

    //  Body2 is moving down and Body1 is blocked from going down any further
    if (body2MovingDown && body2OnTop && body1.blocked.down)
    {
        body2.processY(-overlap, body2FullImpact, false, true);

        return 2;
    }

    //  Body2 is moving up and Body1 is blocked from going up any further
    if (body2MovingUp && body1OnTop && body1.blocked.up)
    {
        body2.processY(overlap, body2FullImpact, true);

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

    if (body1MovingUp || body1MovingDown)
    {
        body1MassImpact = body1FullImpact;
        body2MassImpact = body2FullImpact;

        if (body1Pushable && body2Pushable)
        {
            //  Both pushable, share the separation based on mass
            var m1 = body2.mass / (body1.mass + body2.mass);
            var m2 = 1 - m1;

            overlap *= 0.5;

            body1.processY(-overlap * m1, body1MassImpact * m1, true);
            body2.processY(overlap * m2, body2MassImpact * m2, true);
        }
        else if (body1Pushable && !body2Pushable)
        {
            //  Body1 pushable, Body2 not
            body1.processY(-overlap, body1MassImpact, true);
        }
        else if (!body1Pushable && body2Pushable)
        {
            //  Body2 pushable, Body1 not
            body2.processY(overlap, body2MassImpact, true);
        }
        else
        {
            //  Neither body is pushable, so base it on velocity
            var halfOverlap = overlap * 0.5;

            body1.processY(-halfOverlap, 0, true);
            body2.processY(halfOverlap, 0, true);
        }
    }

    return true;
};

const RunImmovableBody1 = (blockedState: number): void =>
{
    if (blockedState === 1)
    {
        //  Body2 is blocked by Body1, but Body1 cannot move anywhere either, so we cancel out velocity
        body2.velocity.y = 0;
    }
    else
    {
        body2.processY(overlap, body2FullImpact, true);
    }
};

const RunImmovableBody2 = (blockedState: number): void =>
{
    if (blockedState === 2)
    {
        //  Body1 is blocked by Body2, but Body2 cannot move anywhere either, so we cancel out velocity
        body1.velocity.y = 0;
    }
    else
    {
        body1.processY(-overlap, body1FullImpact, true);
    }
};

const Set = (b1: any, b2: any, ov: number): number =>
{
    body1 = b1;
    body2 = b2;

    var v1 = body1.velocity.y;
    var v2 = body2.velocity.y;

    body1Pushable = body1.pushable;
    body1MovingUp = body1._dy < 0;
    body1MovingDown = body1._dy > 0;
    body1Stationary = body1._dy === 0;
    body1OnTop = Math.abs(body1.bottom - body2.y) <= Math.abs(body2.bottom - body1.y);
    body1FullImpact = v2 - v1 * body1.bounce.y;

    body2Pushable = body2.pushable;
    body2MovingUp = body2._dy < 0;
    body2MovingDown = body2._dy > 0;
    body2Stationary = body2._dy === 0;
    body2OnTop = !body1OnTop;
    body2FullImpact = v1 - v2 * body2.bounce.y;

    //  negative delta = up, positive delta = down (inc. gravity)
    overlap = Math.abs(ov);

    return BlockCheck();
};

export const ProcessY = {
    BlockCheck,
    Check,
    RunImmovableBody1,
    RunImmovableBody2,
    Set
};
