/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
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

/**
 * Sets all of the local processing values and calculates the velocity exchanges.
 *
 * Then runs `BlockCheck` and returns the value from it.
 *
 * This method is called by `Phaser.Physics.Arcade.SeparateX` and should not be
 * called directly.
 */
const Set = function (b1: any, b2: any, ov: number): number
{
    body1 = b1;
    body2 = b2;

    const v1 = body1.velocity.x;
    const v2 = body2.velocity.x;

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

/**
 * Blocked Direction checks, because it doesn't matter if an object can be pushed
 * or not, blocked is blocked.
 */
const BlockCheck = function (): number
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

/**
 * The main check function. Runs through one of the four possible tests and returns the results.
 */
const Check = function (): boolean
{
    const v1 = body1.velocity.x;
    const v2 = body2.velocity.x;

    const nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
    const nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
    const avg = (nv1 + nv2) * 0.5;

    const bnv1 = nv1 - avg;
    const bnv2 = nv2 - avg;

    body1MassImpact = avg + bnv1 * body1.bounce.x;
    body2MassImpact = avg + bnv2 * body2.bounce.x;

    //  Body1 hits Body2 on the right hand side
    if (body1MovingLeft && body2OnLeft)
    {
        return Run(0);
    }

    //  Body2 hits Body1 on the right hand side
    if (body2MovingLeft && body1OnLeft)
    {
        return Run(1);
    }

    //  Body1 hits Body2 on the left hand side
    if (body1MovingRight && body1OnLeft)
    {
        return Run(2);
    }

    //  Body2 hits Body1 on the left hand side
    if (body2MovingRight && body2OnLeft)
    {
        return Run(3);
    }

    return false;
};

/**
 * The main check function. Runs through one of the four possible tests and returns the results.
 */
const Run = function (side: number): boolean
{
    if (body1Pushable && body2Pushable)
    {
        //  Both pushable, or both moving at the same time, so equal rebound
        overlap *= 0.5;

        if (side === 0 || side === 3)
        {
            body1.processX(overlap, body1MassImpact);
            body2.processX(-overlap, body2MassImpact);
        }
        else
        {
            body1.processX(-overlap, body1MassImpact);
            body2.processX(overlap, body2MassImpact);
        }
    }
    else if (body1Pushable && !body2Pushable)
    {
        //  Body1 pushable, Body2 not

        if (side === 0 || side === 3)
        {
            body1.processX(overlap, body1FullImpact, true);
        }
        else
        {
            body1.processX(-overlap, body1FullImpact, false, true);
        }
    }
    else if (!body1Pushable && body2Pushable)
    {
        //  Body2 pushable, Body1 not

        if (side === 0 || side === 3)
        {
            body2.processX(-overlap, body2FullImpact, false, true);
        }
        else
        {
            body2.processX(overlap, body2FullImpact, true);
        }
    }
    else
    {
        //  Neither body is pushable, so base it on movement

        const halfOverlap = overlap * 0.5;

        if (side === 0)
        {
            if (body2Stationary)
            {
                body1.processX(overlap, 0, true);
                body2.processX(0, null, false, true);
            }
            else if (body2MovingRight)
            {
                body1.processX(halfOverlap, 0, true);
                body2.processX(-halfOverlap, 0, false, true);
            }
            else
            {
                body1.processX(halfOverlap, body2.velocity.x, true);
                body2.processX(-halfOverlap, null, false, true);
            }
        }
        else if (side === 1)
        {
            if (body1Stationary)
            {
                body1.processX(0, null, false, true);
                body2.processX(overlap, 0, true);
            }
            else if (body1MovingRight)
            {
                body1.processX(-halfOverlap, 0, false, true);
                body2.processX(halfOverlap, 0, true);
            }
            else
            {
                body1.processX(-halfOverlap, null, false, true);
                body2.processX(halfOverlap, body1.velocity.x, true);
            }
        }
        else if (side === 2)
        {
            if (body2Stationary)
            {
                body1.processX(-overlap, 0, false, true);
                body2.processX(0, null, true);
            }
            else if (body2MovingLeft)
            {
                body1.processX(-halfOverlap, 0, false, true);
                body2.processX(halfOverlap, 0, true);
            }
            else
            {
                body1.processX(-halfOverlap, body2.velocity.x, false, true);
                body2.processX(halfOverlap, null, true);
            }
        }
        else if (side === 3)
        {
            if (body1Stationary)
            {
                body1.processX(0, null, true);
                body2.processX(-overlap, 0, false, true);
            }
            else if (body1MovingLeft)
            {
                body1.processX(halfOverlap, 0, true);
                body2.processX(-halfOverlap, 0, false, true);
            }
            else
            {
                body1.processX(halfOverlap, body2.velocity.y, true);
                body2.processX(-halfOverlap, null, false, true);
            }
        }
    }

    return true;
};

/**
 * This function is run when Body1 is Immovable and Body2 is not.
 */
const RunImmovableBody1 = function (blockedState: number): void
{
    if (blockedState === 1)
    {
        body2.velocity.x = 0;
    }
    else if (body1OnLeft)
    {
        body2.processX(overlap, body2FullImpact, true);
    }
    else
    {
        body2.processX(-overlap, body2FullImpact, false, true);
    }

    //  This is special case code that handles things like vertically moving platforms you can ride
    if (body1.moves)
    {
        const body1Distance = body1.directControl ? (body1.y - body1.autoFrame.y) : (body1.y - body1.prev.y);

        body2.y += body1Distance * body1.friction.y;
        body2._dy = body2.y - body2.prev.y;
    }
};

/**
 * This function is run when Body2 is Immovable and Body1 is not.
 */
const RunImmovableBody2 = function (blockedState: number): void
{
    if (blockedState === 2)
    {
        body1.velocity.x = 0;
    }
    else if (body2OnLeft)
    {
        body1.processX(overlap, body1FullImpact, true);
    }
    else
    {
        body1.processX(-overlap, body1FullImpact, false, true);
    }

    //  This is special case code that handles things like vertically moving platforms you can ride
    if (body2.moves)
    {
        const body2Distance = body2.directControl ? (body2.y - body2.autoFrame.y) : (body2.y - body2.prev.y);

        body1.y += body2Distance * body2.friction.y;
        body1._dy = body1.y - body1.prev.y;
    }
};

export const ProcessX = {
    BlockCheck,
    Check,
    Set,
    Run,
    RunImmovableBody1,
    RunImmovableBody2
};
