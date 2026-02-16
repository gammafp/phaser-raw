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
let body1MovingUp: boolean;
let body1MovingDown: boolean;
let body1Stationary: boolean;
let body2MovingUp: boolean;
let body2MovingDown: boolean;
let body2Stationary: boolean;
let body1OnTop: boolean;
let body2OnTop: boolean;
let overlap: number;

/**
 * Sets all of the local processing values and calculates the velocity exchanges.
 *
 * Then runs `BlockCheck` and returns the value from it.
 *
 * This method is called by `Phaser.Physics.Arcade.SeparateY` and should not be
 * called directly.
 */
const Set = function (b1: any, b2: any, ov: number): number
{
    body1 = b1;
    body2 = b2;

    const v1 = body1.velocity.y;
    const v2 = body2.velocity.y;

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

/**
 * Blocked Direction checks, because it doesn't matter if an object can be pushed
 * or not, blocked is blocked.
 */
const BlockCheck = function (): number
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

/**
 * The main check function. Runs through one of the four possible tests and returns the results.
 */
const Check = function (): boolean
{
    const v1 = body1.velocity.y;
    const v2 = body2.velocity.y;

    const nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
    const nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
    const avg = (nv1 + nv2) * 0.5;

    const bnv1 = nv1 - avg;
    const bnv2 = nv2 - avg;

    body1MassImpact = avg + bnv1 * body1.bounce.y;
    body2MassImpact = avg + bnv2 * body2.bounce.y;

    //  Body1 hits Body2 on the bottom side
    if (body1MovingUp && body2OnTop)
    {
        return Run(0);
    }

    //  Body2 hits Body1 on the bottom side
    if (body2MovingUp && body1OnTop)
    {
        return Run(1);
    }

    //  Body1 hits Body2 on the top side
    if (body1MovingDown && body1OnTop)
    {
        return Run(2);
    }

    //  Body2 hits Body1 on the top side
    if (body2MovingDown && body2OnTop)
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
            body1.processY(overlap, body1MassImpact);
            body2.processY(-overlap, body2MassImpact);
        }
        else
        {
            body1.processY(-overlap, body1MassImpact);
            body2.processY(overlap, body2MassImpact);
        }
    }
    else if (body1Pushable && !body2Pushable)
    {
        //  Body1 pushable, Body2 not

        if (side === 0 || side === 3)
        {
            body1.processY(overlap, body1FullImpact, true);
        }
        else
        {
            body1.processY(-overlap, body1FullImpact, false, true);
        }
    }
    else if (!body1Pushable && body2Pushable)
    {
        //  Body2 pushable, Body1 not

        if (side === 0 || side === 3)
        {
            body2.processY(-overlap, body2FullImpact, false, true);
        }
        else
        {
            body2.processY(overlap, body2FullImpact, true);
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
                body1.processY(overlap, 0, true);
                body2.processY(0, null, false, true);
            }
            else if (body2MovingDown)
            {
                body1.processY(halfOverlap, 0, true);
                body2.processY(-halfOverlap, 0, false, true);
            }
            else
            {
                body1.processY(halfOverlap, body2.velocity.y, true);
                body2.processY(-halfOverlap, null, false, true);
            }
        }
        else if (side === 1)
        {
            if (body1Stationary)
            {
                body1.processY(0, null, false, true);
                body2.processY(overlap, 0, true);
            }
            else if (body1MovingDown)
            {
                body1.processY(-halfOverlap, 0, false, true);
                body2.processY(halfOverlap, 0, true);
            }
            else
            {
                body1.processY(-halfOverlap, null, false, true);
                body2.processY(halfOverlap, body1.velocity.y, true);
            }
        }
        else if (side === 2)
        {
            if (body2Stationary)
            {
                body1.processY(-overlap, 0, false, true);
                body2.processY(0, null, true);
            }
            else if (body2MovingUp)
            {
                body1.processY(-halfOverlap, 0, false, true);
                body2.processY(halfOverlap, 0, true);
            }
            else
            {
                body1.processY(-halfOverlap, body2.velocity.y, false, true);
                body2.processY(halfOverlap, null, true);
            }
        }
        else if (side === 3)
        {
            if (body1Stationary)
            {
                body1.processY(0, null, true);
                body2.processY(-overlap, 0, false, true);
            }
            else if (body1MovingUp)
            {
                body1.processY(halfOverlap, 0, true);
                body2.processY(-halfOverlap, 0, false, true);
            }
            else
            {
                body1.processY(halfOverlap, body2.velocity.y, true);
                body2.processY(-halfOverlap, null, false, true);
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
        body2.velocity.y = 0;
    }
    else if (body1OnTop)
    {
        body2.processY(overlap, body2FullImpact, true);
    }
    else
    {
        body2.processY(-overlap, body2FullImpact, false, true);
    }

    //  This is special case code that handles things like horizontally moving platforms you can ride
    if (body1.moves)
    {
        const body1Distance = body1.directControl ? (body1.x - body1.autoFrame.x) : (body1.x - body1.prev.x);

        body2.x += body1Distance * body1.friction.x;
        body2._dx = body2.x - body2.prev.x;
    }
};

/**
 * This function is run when Body2 is Immovable and Body1 is not.
 */
const RunImmovableBody2 = function (blockedState: number): void
{
    if (blockedState === 2)
    {
        body1.velocity.y = 0;
    }
    else if (body2OnTop)
    {
        body1.processY(overlap, body1FullImpact, true);
    }
    else
    {
        body1.processY(-overlap, body1FullImpact, false, true);
    }

    //  This is special case code that handles things like horizontally moving platforms you can ride
    if (body2.moves)
    {
        const body2Distance = body2.directControl ? (body2.x - body2.autoFrame.x) : (body2.x - body2.prev.x);

        body1.x += body2Distance * body2.friction.x;
        body1._dx = body1.x - body1.prev.x;
    }
};

export const ProcessY = {
    BlockCheck,
    Check,
    Set,
    Run,
    RunImmovableBody1,
    RunImmovableBody2
};
