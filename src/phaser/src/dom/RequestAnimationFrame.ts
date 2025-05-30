/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../utils/NOOP';

/**
 * @classdesc
 * Abstracts away the use of RAF or setTimeOut for the core game update loop.
 *
 * This is invoked automatically by the Phaser.Game instance.
 *
 * @class RequestAnimationFrame
 * @memberof Phaser.DOM
 * @constructor
 * @since 3.0.0
 */
export class RequestAnimationFrame
{
    /**
     * True if RequestAnimationFrame is running, otherwise false.
     *
     * @name Phaser.DOM.RequestAnimationFrame#isRunning
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    isRunning: boolean = false;

    /**
     * The callback to be invoked each step.
     *
     * @name Phaser.DOM.RequestAnimationFrame#callback
     * @type {FrameRequestCallback}
     * @since 3.0.0
     */
    callback: FrameRequestCallback = NOOP;

    /**
     * True if the step is using setTimeout instead of RAF.
     *
     * @name Phaser.DOM.RequestAnimationFrame#isSetTimeOut
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    isSetTimeOut: boolean = false;

    /**
     * The setTimeout or RAF callback ID used when canceling them.
     *
     * @name Phaser.DOM.RequestAnimationFrame#timeOutID
     * @type {?number}
     * @default null
     * @since 3.0.0
     */
    timeOutID: number | null = null;

    /**
     * The delay rate in ms for setTimeOut.
     *
     * @name Phaser.DOM.RequestAnimationFrame#delay
     * @type {number}
     * @default 0
     * @since 3.60.0
     */
    delay: number = 0;

    private stepBound: FrameRequestCallback;
    private stepTimeoutBound: () => void;

    constructor()
    {
        this.stepBound = this.step.bind(this);
        this.stepTimeoutBound = this.stepTimeout.bind(this);
    }

    /**
     * The RAF step function.
     *
     * Invokes the callback and schedules another call to requestAnimationFrame.
     *
     * @name Phaser.DOM.RequestAnimationFrame#step
     * @type {FrameRequestCallback}
     * @since 3.0.0
     *
     * @param {number} time - The timestamp passed in from RequestAnimationFrame.
     */
    step(time: number): void
    {
        this.callback(time);

        if (this.isRunning)
        {
            this.timeOutID = window.requestAnimationFrame(this.stepBound);
        }
    }

    /**
     * The SetTimeout step function.
     *
     * Invokes the callback and schedules another call to setTimeout.
     *
     * @name Phaser.DOM.RequestAnimationFrame#stepTimeout
     * @type {function}
     * @since 3.0.0
     */
    stepTimeout(): void
    {
        if (this.isRunning)
        {
            // Make the next request before the callback, so that timing is maintained
            this.timeOutID = window.setTimeout(this.stepTimeoutBound, this.delay);
        }

        this.callback(window.performance.now());
    }

    /**
     * Starts the requestAnimationFrame or setTimeout process running.
     *
     * @method Phaser.DOM.RequestAnimationFrame#start
     * @since 3.0.0
     *
     * @param {FrameRequestCallback} callback - The callback to invoke each step.
     * @param {boolean} forceSetTimeOut - Should it use SetTimeout, even if RAF is available?
     * @param {number} delay - The setTimeout delay rate in ms.
     */
    start(callback: FrameRequestCallback, forceSetTimeOut: boolean = false, delay: number = 0): void
    {
        if (this.isRunning)
        {
            return;
        }

        this.callback = callback;
        this.isSetTimeOut = forceSetTimeOut;
        this.delay = delay;
        this.isRunning = true;

        this.timeOutID = forceSetTimeOut
            ? window.setTimeout(this.stepTimeoutBound, 0)
            : window.requestAnimationFrame(this.stepBound);
    }

    /**
     * Stops the requestAnimationFrame or setTimeout from running.
     *
     * @method Phaser.DOM.RequestAnimationFrame#stop
     * @since 3.0.0
     */
    stop(): void
    {
        this.isRunning = false;

        if (this.isSetTimeOut)
        {
            clearTimeout(this.timeOutID!);
        } else
        {
            window.cancelAnimationFrame(this.timeOutID!);
        }
    }

    /**
     * Stops the step from running and clears the callback reference.
     *
     * @method Phaser.DOM.RequestAnimationFrame#destroy
     * @since 3.0.0
     */
    destroy(): void
    {
        this.stop();
        this.callback = NOOP;
    }
}
