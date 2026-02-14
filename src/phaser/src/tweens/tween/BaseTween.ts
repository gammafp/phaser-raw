/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import EventEmitter from 'eventemitter3';
import * as Events from '../events';
import { TWEEN_CONST } from './const';

/**
 * @classdesc
 * As the name implies, this is the base Tween class that both the Tween and TweenChain
 * inherit from. It contains shared properties and methods common to both types of Tween.
 *
 * Typically you would never instantiate this class directly, although you could certainly
 * use it to create your own variation of Tweens from.
 *
 * @class BaseTween
 * @memberof Phaser.Tweens
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.60.0
 *
 * @param {(Phaser.Tweens.TweenManager|Phaser.Tweens.TweenChain)} parent - A reference to the Tween Manager, or Tween Chain, that owns this Tween.
 */
class BaseTween extends EventEmitter {

    parent: any;
    data: any[];
    totalData: number;
    startDelay: number;
    hasStarted: boolean;
    timeScale: number;
    loop: number;
    loopDelay: number;
    loopCounter: number;
    completeDelay: number;
    countdown: number;
    state: number;
    paused: boolean;
    callbacks: any;
    callbackScope: any;
    persist: boolean;

    constructor(parent: any)
    {
        super();

        this.parent = parent;
        this.data = [];
        this.totalData = 0;
        this.startDelay = 0;
        this.hasStarted = false;
        this.timeScale = 1;
        this.loop = 0;
        this.loopDelay = 0;
        this.loopCounter = 0;
        this.completeDelay = 0;
        this.countdown = 0;
        this.state = TWEEN_CONST.PENDING;
        this.paused = false;

        this.callbacks = {
            onActive: null,
            onComplete: null,
            onLoop: null,
            onPause: null,
            onRepeat: null,
            onResume: null,
            onStart: null,
            onStop: null,
            onUpdate: null,
            onYoyo: null
        };

        this.callbackScope = undefined;
        this.persist = false;
    }

    setTimeScale(value: number): this
    {
        this.timeScale = value;
        return this;
    }

    getTimeScale(): number
    {
        return this.timeScale;
    }

    isPlaying(): boolean
    {
        return (!this.paused && this.isActive());
    }

    isPaused(): boolean
    {
        return this.paused;
    }

    pause(): this
    {
        if (!this.paused)
        {
            this.paused = true;
            this.dispatchEvent(Events.TWEEN_PAUSE_EVENT, 'onPause');
        }
        return this;
    }

    resume(): this
    {
        if (this.paused)
        {
            this.paused = false;
            this.dispatchEvent(Events.TWEEN_RESUME_EVENT, 'onResume');
        }
        return this;
    }

    makeActive(): void
    {
        this.parent.makeActive(this);
        this.dispatchEvent(Events.TWEEN_ACTIVE_EVENT, 'onActive');
    }

    onCompleteHandler(): void
    {
        this.setPendingRemoveState();
        this.dispatchEvent(Events.TWEEN_COMPLETE_EVENT, 'onComplete');
    }

    complete(delay?: number): this
    {
        if (delay === undefined) { delay = 0; }

        if (delay)
        {
            this.setCompleteDelayState();
            this.countdown = delay;
        }
        else
        {
            this.onCompleteHandler();
        }

        return this;
    }

    completeAfterLoop(loops?: number): this
    {
        if (loops === undefined) { loops = 0; }

        if (this.loopCounter > loops)
        {
            this.loopCounter = loops;
        }

        return this;
    }

    remove(): this
    {
        if (this.parent)
        {
            this.parent.remove(this);
        }
        return this;
    }

    stop(): this
    {
        if (this.parent && !this.isRemoved() && !this.isPendingRemove() && !this.isDestroyed())
        {
            this.dispatchEvent(Events.TWEEN_STOP_EVENT, 'onStop');
            this.setPendingRemoveState();
        }
        return this;
    }

    updateLoopCountdown(delta: number): void
    {
        this.countdown -= delta;

        if (this.countdown <= 0)
        {
            this.setActiveState();
            this.dispatchEvent(Events.TWEEN_LOOP_EVENT, 'onLoop');
        }
    }

    updateStartCountdown(delta: number): number
    {
        this.countdown -= delta;

        if (this.countdown <= 0)
        {
            this.hasStarted = true;
            this.setActiveState();
            this.dispatchEvent(Events.TWEEN_START_EVENT, 'onStart');
            delta = 0;
        }

        return delta;
    }

    updateCompleteDelay(delta: number): void
    {
        this.countdown -= delta;

        if (this.countdown <= 0)
        {
            this.onCompleteHandler();
        }
    }

    setCallback(type: string, callback: Function, params?: any[]): this
    {
        if (params === undefined) { params = []; }

        if (this.callbacks.hasOwnProperty(type))
        {
            this.callbacks[type] = { func: callback, params: params };
        }

        return this;
    }

    setPendingState(): void
    {
        this.state = TWEEN_CONST.PENDING;
    }

    setActiveState(): void
    {
        this.state = TWEEN_CONST.ACTIVE;
        this.hasStarted = false;
    }

    setLoopDelayState(): void
    {
        this.state = TWEEN_CONST.LOOP_DELAY;
    }

    setCompleteDelayState(): void
    {
        this.state = TWEEN_CONST.COMPLETE_DELAY;
    }

    setStartDelayState(): void
    {
        this.state = TWEEN_CONST.START_DELAY;
        this.countdown = this.startDelay;
        this.hasStarted = false;
    }

    setPendingRemoveState(): void
    {
        this.state = TWEEN_CONST.PENDING_REMOVE;
    }

    setRemovedState(): void
    {
        this.state = TWEEN_CONST.REMOVED;
    }

    setFinishedState(): void
    {
        this.state = TWEEN_CONST.FINISHED;
    }

    setDestroyedState(): void
    {
        this.state = TWEEN_CONST.DESTROYED;
    }

    isPending(): boolean
    {
        return (this.state === TWEEN_CONST.PENDING);
    }

    isActive(): boolean
    {
        return (this.state === TWEEN_CONST.ACTIVE);
    }

    isLoopDelayed(): boolean
    {
        return (this.state === TWEEN_CONST.LOOP_DELAY);
    }

    isCompleteDelayed(): boolean
    {
        return (this.state === TWEEN_CONST.COMPLETE_DELAY);
    }

    isStartDelayed(): boolean
    {
        return (this.state === TWEEN_CONST.START_DELAY);
    }

    isPendingRemove(): boolean
    {
        return (this.state === TWEEN_CONST.PENDING_REMOVE);
    }

    isRemoved(): boolean
    {
        return (this.state === TWEEN_CONST.REMOVED);
    }

    isFinished(): boolean
    {
        return (this.state === TWEEN_CONST.FINISHED);
    }

    isDestroyed(): boolean
    {
        return (this.state === TWEEN_CONST.DESTROYED);
    }

    dispatchEvent(event: string, callback: string): void
    {
        // Override in subclasses
    }

    destroy(): void
    {
        if (this.data)
        {
            this.data.forEach(function (tweenData: any) {
                tweenData.destroy();
            });
        }

        this.removeAllListeners();

        this.callbacks = null;
        this.data = null as any;
        this.parent = null;

        this.setDestroyedState();
    }

    static TYPES = [
        'onActive',
        'onComplete',
        'onLoop',
        'onPause',
        'onRepeat',
        'onResume',
        'onStart',
        'onStop',
        'onUpdate',
        'onYoyo'
    ];

}

export { BaseTween };
