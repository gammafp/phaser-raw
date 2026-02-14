/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { MATH_CONST } from '../../math/const';

import { BaseTween } from './BaseTween';
import * as Events from '../events';
const GameObjectCreator = require('../../gameobjects/GameObjectCreator');
const GameObjectFactory = require('../../gameobjects/GameObjectFactory');
import { TWEEN_CONST } from './const';
import { TweenData } from './TweenData';
import { TweenFrameData } from './TweenFrameData';

/**
 * @classdesc
 * A Tween is able to manipulate the properties of one or more objects to any given value, based
 * on a duration and type of ease. They are rarely instantiated directly and instead should be
 * created via the TweenManager.
 *
 * Please note that a Tween will not manipulate any property that begins with an underscore.
 *
 * @class Tween
 * @memberof Phaser.Tweens
 * @extends Phaser.Tweens.BaseTween
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - A reference to the Tween Manager that owns this Tween.
 * @param {object[]} targets - An array of targets to be tweened. This array should not be manipulated outside of this Tween.
 */
class Tween extends BaseTween {

    targets: any[];
    totalTargets: number;
    isSeeking: boolean;
    isInfinite: boolean;
    elapsed: number;
    totalElapsed: number;
    duration: number;
    progress: number;
    totalDuration: number;
    totalProgress: number;
    isNumberTween: boolean;

    constructor(parent: any, targets: any[])
    {
        super(parent);

        this.targets = targets;
        this.totalTargets = targets.length;
        this.isSeeking = false;
        this.isInfinite = false;
        this.elapsed = 0;
        this.totalElapsed = 0;
        this.duration = 0;
        this.progress = 0;
        this.totalDuration = 0;
        this.totalProgress = 0;
        this.isNumberTween = false;
    }

    add(targetIndex: number, key: string, getEnd: Function, getStart: Function, getActive: Function | null, ease: Function, delay: Function, duration: number, yoyo: boolean, hold: number, repeat: number, repeatDelay: number, flipX: boolean, flipY: boolean, interpolation: Function | null, interpolationData: number[] | null): TweenData
    {
        const tweenData = new TweenData(this, targetIndex, key, getEnd, getStart, getActive, ease, delay, duration, yoyo, hold, repeat, repeatDelay, flipX, flipY, interpolation, interpolationData);

        this.totalData = this.data.push(tweenData);

        return tweenData;
    }

    addFrame(targetIndex: number, texture: string, frame: string | number, delay: Function, duration: number, hold: number, repeat: number, repeatDelay: number, flipX: boolean, flipY: boolean): TweenFrameData
    {
        const tweenData = new TweenFrameData(this, targetIndex, texture, frame, delay, duration, hold, repeat, repeatDelay, flipX, flipY);

        this.totalData = this.data.push(tweenData);

        return tweenData;
    }

    getValue(index?: number): number | null
    {
        if (index === undefined) { index = 0; }

        let value: number | null = null;

        if (this.data)
        {
            value = this.data[index].current;
        }

        return value;
    }

    hasTarget(target: any): boolean
    {
        return (this.targets && this.targets.indexOf(target) !== -1);
    }

    updateTo(key: string, value: number, startToCurrent?: boolean): this
    {
        if (startToCurrent === undefined) { startToCurrent = false; }

        if (key !== 'texture')
        {
            for (let i = 0; i < this.totalData; i++)
            {
                const tweenData = this.data[i];

                if (tweenData.key === key && (tweenData.isPlayingForward() || tweenData.isPlayingBackward()))
                {
                    tweenData.end = value;

                    if (startToCurrent)
                    {
                        tweenData.start = tweenData.current;
                    }
                }
            }
        }

        return this;
    }

    restart(): this
    {
        switch (this.state)
        {
            case TWEEN_CONST.REMOVED:
            case TWEEN_CONST.FINISHED:
                this.seek();
                this.parent.makeActive(this);
                break;

            case TWEEN_CONST.PENDING:
            case TWEEN_CONST.PENDING_REMOVE:
                this.parent.reset(this);
                break;

            case TWEEN_CONST.DESTROYED:
                console.warn('Cannot restart destroyed Tween', this);
                break;

            default:
                this.seek();
                break;
        }

        this.paused = false;
        this.hasStarted = false;

        return this;
    }

    nextState(): boolean
    {
        if (this.loopCounter > 0)
        {
            this.elapsed = 0;
            this.progress = 0;
            this.loopCounter--;

            this.initTweenData(true);

            if (this.loopDelay > 0)
            {
                this.countdown = this.loopDelay;

                this.setLoopDelayState();
            }
            else
            {
                this.setActiveState();

                this.dispatchEvent(Events.TWEEN_LOOP_EVENT, 'onLoop');
            }
        }
        else if (this.completeDelay > 0)
        {
            this.countdown = this.completeDelay;

            this.setCompleteDelayState();
        }
        else
        {
            this.onCompleteHandler();

            return true;
        }

        return false;
    }

    onCompleteHandler(): void
    {
        this.progress = 1;
        this.totalProgress = 1;

        BaseTween.prototype.onCompleteHandler.call(this);
    }

    play(): this
    {
        if (this.isDestroyed())
        {
            console.warn('Cannot play destroyed Tween', this);

            return this;
        }

        if (this.isPendingRemove() || this.isFinished())
        {
            this.seek();
        }

        this.paused = false;

        this.setActiveState();

        return this;
    }

    seek(amount?: number, delta?: number, emit?: boolean): this
    {
        if (amount === undefined) { amount = 0; }
        if (delta === undefined) { delta = 16.6; }
        if (emit === undefined) { emit = false; }

        if (this.isDestroyed())
        {
            console.warn('Cannot seek destroyed Tween', this);

            return this;
        }

        if (!emit)
        {
            this.isSeeking = true;
        }

        this.reset(true);

        this.initTweenData(true);

        this.setActiveState();

        this.dispatchEvent(Events.TWEEN_ACTIVE_EVENT, 'onActive');

        const isPaused = this.paused;

        this.paused = false;

        if (amount > 0)
        {
            const iterations = Math.floor(amount / delta);
            const remainder = amount - (iterations * delta);

            for (let i = 0; i < iterations; i++)
            {
                this.update(delta);
            }

            if (remainder > 0)
            {
                this.update(remainder);
            }
        }

        this.paused = isPaused;

        this.isSeeking = false;

        return this;
    }

    initTweenData(isSeeking?: boolean): void
    {
        if (isSeeking === undefined) { isSeeking = false; }

        //  These two values are updated directly during TweenData.reset:
        this.duration = 0;
        this.startDelay = MATH_CONST.MAX_SAFE_INTEGER;

        const data = this.data;

        for (let i = 0; i < this.totalData; i++)
        {
            data[i].reset(isSeeking);
        }

        //  Clamp duration to ensure we never divide by zero
        this.duration = Math.max(this.duration, 0.01);

        const duration = this.duration;
        const completeDelay = this.completeDelay;
        const loopCounter = this.loopCounter;
        const loopDelay = this.loopDelay;

        if (loopCounter > 0)
        {
            this.totalDuration = duration + completeDelay + ((duration + loopDelay) * loopCounter);
        }
        else
        {
            this.totalDuration = duration + completeDelay;
        }
    }

    reset(skipInit?: boolean): this
    {
        if (skipInit === undefined) { skipInit = false; }

        this.elapsed = 0;
        this.totalElapsed = 0;
        this.progress = 0;
        this.totalProgress = 0;
        this.loopCounter = this.loop;

        if (this.loop === -1)
        {
            this.isInfinite = true;
            this.loopCounter = TWEEN_CONST.MAX;
        }

        if (!skipInit)
        {
            this.initTweenData();

            this.setActiveState();

            this.dispatchEvent(Events.TWEEN_ACTIVE_EVENT, 'onActive');
        }

        return this;
    }

    update(delta: number): boolean
    {
        if (this.isPendingRemove() || this.isDestroyed())
        {
            if (this.persist)
            {
                this.setFinishedState();

                return false;
            }

            return true;
        }
        else if (this.paused || this.isFinished())
        {
            return false;
        }

        delta *= this.timeScale * this.parent.timeScale;

        if (this.isLoopDelayed())
        {
            this.updateLoopCountdown(delta);

            return false;
        }
        else if (this.isCompleteDelayed())
        {
            this.updateCompleteDelay(delta);

            return false;
        }
        else if (!this.hasStarted)
        {
            this.startDelay -= delta;

            if (this.startDelay <= 0)
            {
                this.hasStarted = true;

                this.dispatchEvent(Events.TWEEN_START_EVENT, 'onStart');

                //  Reset the delta so we always start progress from zero
                delta = 0;
            }
        }

        let stillRunning = false;

        if (this.isActive())
        {
            const data = this.data;

            for (let i = 0; i < this.totalData; i++)
            {
                if (data[i].update(delta))
                {
                    stillRunning = true;
                }
            }
        }

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        //  Anything still running? If not, we're done
        if (!stillRunning)
        {
            //  This calls onCompleteHandler if this tween is over
            this.nextState();
        }

        //  if nextState called onCompleteHandler then we're ready to be removed, unless we persist
        let remove = this.isPendingRemove();

        if (remove && this.persist)
        {
            this.setFinishedState();

            remove = false;
        }

        return remove;
    }

    forward(ms: number): this
    {
        this.update(ms);

        return this;
    }

    rewind(ms: number): this
    {
        this.update(-ms);

        return this;
    }

    dispatchEvent(event: string, callback: string): void
    {
        if (!this.isSeeking)
        {
            this.emit(event, this, this.targets);

            if (!this.callbacks)
            {
                return;
            }

            const handler = this.callbacks[callback];

            if (handler)
            {
                handler.func.apply(this.callbackScope, [ this, this.targets ].concat(handler.params));
            }
        }
    }

    destroy(): void
    {
        BaseTween.prototype.destroy.call(this);

        this.targets = null as any;
    }

}

/**
 * Creates a new Tween object.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#tween
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} config - A Tween Configuration object, or a Tween or TweenChain instance.
 *
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectFactory.register('tween', function (config: any) {
    return this.scene.sys.tweens.add(config);
});

/**
 * Creates a new Tween object and returns it.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tween
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} config - A Tween Configuration object, or a Tween or TweenChain instance.
 *
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectCreator.register('tween', function (config: any) {
    return this.scene.sys.tweens.create(config);
});

export { Tween };
