/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Remove as ArrayRemove } from '../utils/array/Remove';
import { Flatten } from '../utils/array/Flatten';

import { PluginCache } from '../plugins/PluginCache';

import { NumberTweenBuilder } from './builders/NumberTweenBuilder';
import * as SceneEvents from '../scene/events';
import { StaggerBuilder } from './builders/StaggerBuilder';
import { Tween } from './tween/Tween';
import { TweenBuilder } from './builders/TweenBuilder';
import { TweenChain } from './tween/TweenChain';
import { TweenChainBuilder } from './builders/TweenChainBuilder';

/**
 * @classdesc
 * The Tween Manager is a default Scene Plugin which controls and updates Tweens.
 *
 * A tween is a way to alter one or more properties of a target object over a defined period of time.
 *
 * Tweens are created by calling the `add` method and passing in the configuration object.
 *
 * ```js
 * const logo = this.add.image(100, 100, 'logo');
 *
 * this.tweens.add({
 *   targets: logo,
 *   x: 600,
 *   ease: 'Power1',
 *   duration: 2000
 * });
 * ```
 *
 * See the `TweenBuilderConfig` for all of the options you have available.
 *
 * Playback will start immediately unless the tween has been configured to be paused.
 *
 * Please note that a Tween will not manipulate any target property that begins with an underscore.
 *
 * Tweens are designed to be 'fire-and-forget'. They automatically destroy themselves once playback
 * is complete, to free-up memory and resources. If you wish to keep a tween after playback, i.e. to
 * play it again at a later time, then you should set the `persist` property to `true` in the config.
 * However, doing so means it's entirely up to _you_ to destroy the tween when you're finished with it,
 * otherwise it will linger in memory forever.
 *
 * A tween will complete early if its target has `isDestroyed` set to `true`.
 * This avoids bugs caused by calling methods on a destroyed Game Object,
 * or any other object with an `isDestroyed` property.
 * You can still cause bugs when targeting other objects which may change
 * in the future, so be careful.
 *
 * If you wish to chain Tweens together for sequential playback, see the `TweenManager.chain` method.
 *
 * @class TweenManager
 * @memberof Phaser.Tweens
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene which owns this Tween Manager.
 */
class TweenManager {

    scene: any;
    events: any;
    timeScale: number;
    paused: boolean;
    processing: boolean;
    tweens: any[];
    time: number;
    startTime: number;
    nextTime: number;
    prevTime: number;
    maxLag: number;
    lagSkip: number;
    gap: number;

    constructor(scene: any)
    {
        this.scene = scene;
        this.events = scene.sys.events;
        this.timeScale = 1;
        this.paused = false;
        this.processing = false;
        this.tweens = [];
        this.time = 0;
        this.startTime = 0;
        this.nextTime = 0;
        this.prevTime = 0;
        this.maxLag = 500;
        this.lagSkip = 33;
        this.gap = 1000 / 240;

        this.events.once(SceneEvents.BOOT_EVENT, this.boot, this);
        this.events.on(SceneEvents.START_EVENT, this.start, this);
    }

    boot(): void
    {
        this.events.once(SceneEvents.DESTROY_EVENT, this.destroy, this);
    }

    start(): void
    {
        this.timeScale = 1;
        this.paused = false;

        this.startTime = Date.now();
        this.prevTime = this.startTime;
        this.nextTime = this.gap;

        this.events.on(SceneEvents.UPDATE_EVENT, this.update, this);
        this.events.once(SceneEvents.SHUTDOWN_EVENT, this.shutdown, this);
    }

    create(config: any): any
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        const result: any[] = [];

        for (let i = 0; i < config.length; i++)
        {
            let tween = config[i];

            if (tween instanceof Tween || tween instanceof TweenChain)
            {
                //  Allow them to send an array of mixed instances and configs
                result.push(tween);
            }
            else if (Array.isArray(tween.tweens))
            {
                result.push(TweenChainBuilder(this, tween));
            }
            else
            {
                result.push(TweenBuilder(this, tween));
            }
        }

        return (result.length === 1) ? result[0] : result;
    }

    add(config: any): any
    {
        let tween = config;
        const tweens = this.tweens;

        if (tween instanceof Tween || tween instanceof TweenChain)
        {
            tweens.push(tween.reset());
        }
        else
        {
            if (Array.isArray(tween.tweens))
            {
                tween = TweenChainBuilder(this, tween);
            }
            else
            {
                tween = TweenBuilder(this, tween);
            }

            tweens.push(tween.reset());
        }

        return tween;
    }

    addMultiple(configs: any[]): any[]
    {
        let tween: any;
        const result: any[] = [];
        const tweens = this.tweens;

        for (let i = 0; i < configs.length; i++)
        {
            tween = configs[i];

            if (tween instanceof Tween || tween instanceof TweenChain)
            {
                tweens.push(tween.reset());
            }
            else
            {
                if (Array.isArray(tween.tweens))
                {
                    tween = TweenChainBuilder(this, tween);
                }
                else
                {
                    tween = TweenBuilder(this, tween);
                }

                tweens.push(tween.reset());
            }

            result.push(tween);
        }

        return result;
    }

    chain(config: any): any
    {
        const chain = TweenChainBuilder(this, config);

        this.tweens.push(chain.init());

        return chain;
    }

    getChainedTweens(tween: any): any[]
    {
        return tween.getChainedTweens();
    }

    has(tween: any): boolean
    {
        return (this.tweens.indexOf(tween) > -1);
    }

    existing(tween: any): this
    {
        if (!this.has(tween))
        {
            this.tweens.push(tween.reset());
        }

        return this;
    }

    addCounter(config: any): any
    {
        const tween = NumberTweenBuilder(this, config);

        this.tweens.push(tween.reset());

        return tween;
    }

    stagger(value: number | number[], options?: any): Function
    {
        return StaggerBuilder(value, options);
    }

    setLagSmooth(limit?: number, skip?: number): this
    {
        if (limit === undefined) { limit = 1 / 1e-8; }
        if (skip === undefined) { skip = 0; }

        this.maxLag = limit;
        this.lagSkip = Math.min(skip, this.maxLag);

        return this;
    }

    setFps(fps?: number): this
    {
        if (fps === undefined) { fps = 240; }

        this.gap = 1000 / fps;
        this.nextTime = this.time * 1000 + this.gap;

        return this;
    }

    getDelta(tick?: boolean): number
    {
        const elapsed = Date.now() - this.prevTime;

        if (elapsed > this.maxLag)
        {
            this.startTime += elapsed - this.lagSkip;
        }

        this.prevTime += elapsed;

        let time = this.prevTime - this.startTime;
        const overlap = time - this.nextTime;
        let delta = time - this.time * 1000;

        if (overlap > 0 || tick)
        {
            time /= 1000;
            this.time = time;
            this.nextTime += overlap + (overlap >= this.gap ? 4 : this.gap - overlap);
        }
        else
        {
            delta = 0;
        }

        return delta;
    }

    tick(): this
    {
        this.step(true);

        return this;
    }

    update(): void
    {
        if (!this.paused)
        {
            this.step(false);
        }
    }

    step(tick?: boolean): void
    {
        if (tick === undefined) { tick = false; }

        const delta = this.getDelta(tick);

        if (delta <= 0)
        {
            //  If we've got a negative delta, skip this step
            return;
        }

        this.processing = true;

        let i: number;
        let tween: any;
        const toDestroy: any[] = [];
        const list = this.tweens;

        //  By not caching the length we can immediately update tweens added
        //  this frame (such as chained tweens)
        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            //  If Tween.update returns 'true' then it means it has completed,
            //  so move it to the destroy list
            if (tween.update(delta))
            {
                toDestroy.push(tween);
            }
        }

        //  Clean-up the 'toDestroy' list
        const count = toDestroy.length;

        if (count && list.length > 0)
        {
            for (i = 0; i < count; i++)
            {
                tween = toDestroy[i];

                const idx = list.indexOf(tween);

                if (idx > -1 && (tween.isPendingRemove() || tween.isDestroyed()))
                {
                    list.splice(idx, 1);

                    tween.destroy();
                }
            }

            toDestroy.length = 0;
        }

        this.processing = false;
    }

    remove(tween: any): this
    {
        if (this.processing)
        {
            //  Remove it on the next frame
            tween.setPendingRemoveState();
        }
        else
        {
            //  Remove it immediately
            ArrayRemove(this.tweens, tween);

            tween.setRemovedState();
        }

        return this;
    }

    reset(tween: any): this
    {
        this.existing(tween);

        tween.seek();

        tween.setActiveState();

        return this;
    }

    makeActive(tween: any): this
    {
        this.existing(tween);

        tween.setActiveState();

        return this;
    }

    each(callback: Function, scope?: any, ...args: any[]): this
    {
        let i: number;
        const callbackArgs: any[] = [ null ];

        for (i = 1; i < arguments.length; i++)
        {
            callbackArgs.push(arguments[i]);
        }

        this.tweens.forEach(function (tween: any) {
            callbackArgs[0] = tween;

            callback.apply(scope, callbackArgs);
        });

        return this;
    }

    getTweens(): any[]
    {
        return this.tweens.slice();
    }

    getTweensOf(target: any | any[]): any[]
    {
        const output: any[] = [];
        const list = this.tweens;

        if (!Array.isArray(target))
        {
            target = [ target ];
        }
        else
        {
            target = Flatten(target);
        }

        const targetLen = target.length;

        for (let i = 0; i < list.length; i++)
        {
            const tween = list[i];

            for (let t = 0; t < targetLen; t++)
            {
                if (!tween.isDestroyed() && tween.hasTarget(target[t]))
                {
                    output.push(tween);
                }
            }
        }

        return output;
    }

    getGlobalTimeScale(): number
    {
        return this.timeScale;
    }

    setGlobalTimeScale(value: number): this
    {
        this.timeScale = value;

        return this;
    }

    isTweening(target: any): boolean
    {
        const list = this.tweens;
        let tween: any;

        for (let i = 0; i < list.length; i++)
        {
            tween = list[i];

            if (tween.isPlaying() && tween.hasTarget(target))
            {
                return true;
            }
        }

        return false;
    }

    killAll(): this
    {
        const tweens = (this.processing) ? this.getTweens() : this.tweens;

        for (let i = 0; i < tweens.length; i++)
        {
            tweens[i].destroy();
        }

        if (!this.processing)
        {
            tweens.length = 0;
        }

        return this;
    }

    killTweensOf(target: any | any[]): this
    {
        const tweens = this.getTweensOf(target);

        for (let i = 0; i < tweens.length; i++)
        {
            tweens[i].destroy();
        }

        return this;
    }

    pauseAll(): this
    {
        this.paused = true;

        return this;
    }

    resumeAll(): this
    {
        this.paused = false;

        return this;
    }

    shutdown(): void
    {
        this.killAll();

        this.tweens = [];

        this.events.off(SceneEvents.UPDATE_EVENT, this.update, this);
        this.events.off(SceneEvents.SHUTDOWN_EVENT, this.shutdown, this);
    }

    destroy(): void
    {
        this.shutdown();

        this.events.off(SceneEvents.START_EVENT, this.start, this);

        this.scene = null;
        this.events = null;
    }

}

PluginCache.register('TweenManager', TweenManager, 'tweens');

export { TweenManager };
