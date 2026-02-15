/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../utils/object/GetFastValue';

/**
 * @classdesc
 * A Timer Event represents a delayed function call. It's managed by a Scene's {@link Clock} and will call its function after a set amount of time has passed. The Timer Event can optionally repeat - i.e. call its function multiple times before finishing, or loop indefinitely.
 *
 * Because it's managed by a Clock, a Timer Event is based on game time, will be affected by its Clock's time scale, and will pause if its Clock pauses.
 *
 * @class TimerEvent
 * @memberof Phaser.Time
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Time.TimerEventConfig} config - The configuration for the Timer Event, including its delay and callback.
 */
export class TimerEvent {
    delay: number;
    repeat: number;
    repeatCount: number;
    loop: boolean;
    callback: Function | undefined;
    callbackScope: any;
    args: any[];
    timeScale: number;
    startAt: number;
    elapsed: number;
    paused: boolean;
    hasDispatched: boolean;

    constructor(config: any)
    {
        this.delay = 0;
        this.repeat = 0;
        this.repeatCount = 0;
        this.loop = false;
        this.callback = undefined;
        this.callbackScope = undefined;
        this.args = [];
        this.timeScale = 1;
        this.startAt = 0;
        this.elapsed = 0;
        this.paused = false;
        this.hasDispatched = false;

        this.reset(config);
    }

    /**
     * Completely reinitializes the Timer Event, regardless of its current state, according to a configuration object.
     *
     * @method Phaser.Time.TimerEvent#reset
     * @since 3.0.0
     *
     * @param {Phaser.Types.Time.TimerEventConfig} config - The new state for the Timer Event.
     *
     * @return {Phaser.Time.TimerEvent} This TimerEvent object.
     */
    reset(config: any): this
    {
        this.delay = GetFastValue(config, 'delay', 0);

        //  Can also be set to -1 for an infinite loop (same as setting loop: true)
        this.repeat = GetFastValue(config, 'repeat', 0);

        this.loop = GetFastValue(config, 'loop', false);

        this.callback = GetFastValue(config, 'callback', undefined);

        this.callbackScope = GetFastValue(config, 'callbackScope', this);

        this.args = GetFastValue(config, 'args', []);

        this.timeScale = GetFastValue(config, 'timeScale', 1);

        this.startAt = GetFastValue(config, 'startAt', 0);

        this.paused = GetFastValue(config, 'paused', false);

        this.elapsed = this.startAt;
        this.hasDispatched = false;
        this.repeatCount = (this.repeat === -1 || this.loop) ? 999999999999 : this.repeat;

        if (this.delay <= 0 && this.repeatCount > 0)
        {
            throw new Error('TimerEvent infinite loop created via zero delay');
        }

        return this;
    }

    /**
     * Gets the progress of the current iteration, not factoring in repeats.
     *
     * @method Phaser.Time.TimerEvent#getProgress
     * @since 3.0.0
     *
     * @return {number} A number between 0 and 1 representing the current progress.
     */
    getProgress(): number
    {
        return (this.elapsed / this.delay);
    }

    /**
     * Gets the progress of the timer overall, factoring in repeats.
     *
     * @method Phaser.Time.TimerEvent#getOverallProgress
     * @since 3.0.0
     *
     * @return {number} The overall progress of the Timer Event, between 0 and 1.
     */
    getOverallProgress(): number
    {
        if (this.repeat > 0)
        {
            const totalDuration = this.delay + (this.delay * this.repeat);
            const totalElapsed = this.elapsed + (this.delay * (this.repeat - this.repeatCount));

            return (totalElapsed / totalDuration);
        }
        else
        {
            return this.getProgress();
        }
    }

    /**
     * Returns the number of times this Timer Event will repeat before finishing.
     *
     * This should not be confused with the number of times the Timer Event will fire before finishing. A return value of 0 doesn't indicate that the Timer Event has finished running - it indicates that it will not repeat after the next time it fires.
     *
     * @method Phaser.Time.TimerEvent#getRepeatCount
     * @since 3.0.0
     *
     * @return {number} How many times the Timer Event will repeat.
     */
    getRepeatCount(): number
    {
        return this.repeatCount;
    }

    /**
     * Returns the local elapsed time for the current iteration of the Timer Event.
     *
     * @method Phaser.Time.TimerEvent#getElapsed
     * @since 3.0.0
     *
     * @return {number} The local elapsed time in milliseconds.
     */
    getElapsed(): number
    {
        return this.elapsed;
    }

    /**
     * Returns the local elapsed time for the current iteration of the Timer Event in seconds.
     *
     * @method Phaser.Time.TimerEvent#getElapsedSeconds
     * @since 3.0.0
     *
     * @return {number} The local elapsed time in seconds.
     */
    getElapsedSeconds(): number
    {
        return this.elapsed * 0.001;
    }

    /**
     * Returns the time interval until the next iteration of the Timer Event.
     *
     * @method Phaser.Time.TimerEvent#getRemaining
     * @since 3.50.0
     *
     * @return {number} The time interval in milliseconds.
     */
    getRemaining(): number
    {
        return this.delay - this.elapsed;
    }

    /**
     * Returns the time interval until the next iteration of the Timer Event in seconds.
     *
     * @method Phaser.Time.TimerEvent#getRemainingSeconds
     * @since 3.50.0
     *
     * @return {number} The time interval in seconds.
     */
    getRemainingSeconds(): number
    {
        return this.getRemaining() * 0.001;
    }

    /**
     * Returns the time interval until the last iteration of the Timer Event.
     *
     * @method Phaser.Time.TimerEvent#getOverallRemaining
     * @since 3.50.0
     *
     * @return {number} The time interval in milliseconds.
     */
    getOverallRemaining(): number
    {
        return this.delay * (1 + this.repeatCount) - this.elapsed;
    }

    /**
     * Returns the time interval until the last iteration of the Timer Event in seconds.
     *
     * @method Phaser.Time.TimerEvent#getOverallRemainingSeconds
     * @since 3.50.0
     *
     * @return {number} The time interval in seconds.
     */
    getOverallRemainingSeconds(): number
    {
        return this.getOverallRemaining() * 0.001;
    }

    /**
     * Forces the Timer Event to immediately expire, thus scheduling its removal in the next frame.
     *
     * @method Phaser.Time.TimerEvent#remove
     * @since 3.0.0
     *
     * @param {boolean} [dispatchCallback=false] - If `true`, the function of the Timer Event will be called before its removal.
     */
    remove(dispatchCallback?: boolean): void
    {
        if (dispatchCallback === undefined) { dispatchCallback = false; }

        this.elapsed = this.delay;

        this.hasDispatched = !dispatchCallback;

        this.repeatCount = 0;
    }

    /**
     * Destroys all object references in the Timer Event, i.e. its callback, scope, and arguments.
     *
     * Normally, this method is only called by the Clock when it shuts down. As such, it doesn't stop the Timer Event. If called manually, the Timer Event will still be updated by the Clock, but it won't do anything when it fires.
     *
     * @method Phaser.Time.TimerEvent#destroy
     * @since 3.0.0
     */
    destroy(): void
    {
        this.callback = undefined;
        this.callbackScope = undefined;
        this.args = [];
    }
}
