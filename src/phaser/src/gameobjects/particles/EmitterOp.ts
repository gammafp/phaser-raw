/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../utils/object/GetFastValue';

import { Between } from '../../math/Between';
import { Clamp } from '../../math/Clamp';
import { FloatBetween } from '../../math/FloatBetween';
import { SnapTo } from '../../math/snap/SnapTo';
import { Wrap } from '../../math/Wrap';

import { GetEaseFunction } from '../../tweens/builders/GetEaseFunction';
import { GetInterpolationFunction } from '../../tweens/builders/GetInterpolationFunction';

/**
 * @classdesc
 * This class is responsible for taking control over a single property
 * in the Particle class and managing its emission and updating functions.
 *
 * Particles properties such as `x`, `y`, `scaleX`, `lifespan` and others all use
 * EmitterOp instances to manage them, as they can be given in a variety of
 * formats: from simple values, to functions, to dynamic callbacks.
 *
 * See the `ParticleEmitter` class for more details on emitter op configuration.
 *
 * @class EmitterOp
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 */
export class EmitterOp
{
    /**
     * The name of this property.
     */
    propertyKey: string;

    /**
     * The current value of this property.
     */
    propertyValue: any;

    /**
     * The default value of this property.
     */
    defaultValue: any;

    /**
     * The number of steps for stepped easing between start and end values, per emit.
     */
    steps: number;

    /**
     * The step counter for stepped easing, per emit.
     */
    counter: number;

    /**
     * When the step counter reaches its maximum, should it then yoyo back to the start again, or flip over to it?
     */
    yoyo: boolean;

    /**
     * The counter direction. 0 for up and 1 for down.
     */
    direction: number;

    /**
     * The start value for this property to ease between.
     * If an interpolation this holds a reference to the number data array.
     */
    start: number | number[];

    /**
     * The most recently calculated value.
     */
    current: number;

    /**
     * The end value for this property to ease between.
     */
    end: number;

    /**
     * The easing function to use for updating this property, if any.
     */
    ease: Function | null;

    /**
     * The interpolation function to use for updating this property, if any.
     */
    interpolation: Function | null;

    /**
     * Whether this property can only be modified when a Particle is emitted.
     */
    emitOnly: boolean;

    /**
     * The callback to run for Particles when they are emitted from the Particle Emitter.
     */
    onEmit: Function;

    /**
     * The callback to run for Particles when they are updated.
     */
    onUpdate: Function;

    /**
     * Set to `false` to disable this EmitterOp.
     */
    active: boolean;

    /**
     * The onEmit method type of this EmitterOp.
     */
    method: number;

    /**
     * The callback to run for Particles when they are emitted from the Particle Emitter.
     * This is set during `setMethods` and used by `proxyEmit`.
     */
    _onEmit: Function | any;

    /**
     * The callback to run for Particles when they are updated.
     * This is set during `setMethods` and used by `proxyUpdate`.
     */
    _onUpdate: Function | any;

    constructor (key: string, defaultValue: any, emitOnly: boolean = false)
    {
        this.propertyKey = key;
        this.propertyValue = defaultValue;
        this.defaultValue = defaultValue;
        this.steps = 0;
        this.counter = 0;
        this.yoyo = false;
        this.direction = 0;
        this.start = 0;
        this.current = 0;
        this.end = 0;
        this.ease = null;
        this.interpolation = null;
        this.emitOnly = emitOnly;
        this.onEmit = this.defaultEmit;
        this.onUpdate = this.defaultUpdate;
        this.active = true;
        this.method = 0;
        this._onEmit = undefined;
        this._onUpdate = undefined;
    }

    /**
     * Load the property from a Particle Emitter configuration object.
     *
     * Optionally accepts a new property key to use, replacing the current one.
     */
    loadConfig (config?: any, newKey?: string): void
    {
        if (config === undefined)
        {
            config = {};
        }

        if (newKey)
        {
            this.propertyKey = newKey;
        }

        this.propertyValue = GetFastValue(
            config,
            this.propertyKey,
            this.defaultValue
        );

        this.method = this.getMethod();

        this.setMethods();

        if (this.emitOnly)
        {
            //  Reset it back again
            this.onUpdate = this.defaultUpdate;
        }
    }

    /**
     * Build a JSON representation of this Particle Emitter property.
     */
    toJSON (): string
    {
        return JSON.stringify(this.propertyValue);
    }

    /**
     * Change the current value of the property and update its callback methods.
     */
    onChange (value: number): this
    {
        var current;

        switch (this.method)
        {
            //  Number
            //  Custom Callback (onEmit only)
            //  Custom onEmit and/or onUpdate callbacks
            case 1:
            case 3:
            case 8:
                current = value;
                break;

            //  Random Array
            case 2:
                if (this.propertyValue.indexOf(value) >= 0)
                {
                    current = value;
                }
                break;

            //  Stepped start/end
            case 4:
                var step = ((this.end as number) - (this.start as number)) / this.steps;
                current = SnapTo(value, step);
                this.counter = current;
                break;

            //  Eased start/end
            //  min/max (random float or int)
            //  Random object (random integer)
            case 5:
            case 6:
            case 7:
                current = Clamp(value, this.start as number, this.end);
                break;

            //  Interpolation
            case 9:
                current = (this.start as number[])[0];
                break;
        }

        this.current = current!;

        return this;
    }

    /**
     * Checks the type of `EmitterOp.propertyValue` to determine which
     * method is required in order to return values from this op function.
     */
    getMethod (): number
    {
        var value = this.propertyValue;

        //  `moveToX` and `moveToY` are null by default
        if (value === null)
        {
            return 0;
        }

        var t = typeof value;

        if (t === 'number')
        {
            //  Number
            return 1;
        }
        else if (Array.isArray(value))
        {
            //  Random Array
            return 2;
        }
        else if (t === 'function')
        {
            //  Custom Callback
            return 3;
        }
        else if (t === 'object')
        {
            if (this.hasBoth(value, 'start', 'end'))
            {
                if (this.has(value, 'steps'))
                {
                    //  Stepped start/end
                    return 4;
                }
                else
                {
                    //  Eased start/end
                    return 5;
                }
            }
            else if (this.hasBoth(value, 'min', 'max'))
            {
                //  min/max
                return 6;
            }
            else if (this.has(value, 'random'))
            {
                //  Random object
                return 7;
            }
            else if (this.hasEither(value, 'onEmit', 'onUpdate'))
            {
                //  Custom onEmit onUpdate
                return 8;
            }
            else if (this.hasEither(value, 'values', 'interpolation'))
            {
                //  Interpolation
                return 9;
            }
        }

        return 0;
    }

    /**
     * Update the onEmit and onUpdate callbacks based on the method returned
     * from `getMethod`.
     */
    setMethods (): this
    {
        var value = this.propertyValue;
        var current: any = value;

        var onEmit: Function = this.defaultEmit;
        var onUpdate: Function = this.defaultUpdate;

        switch (this.method)
        {
            //  Number
            case 1:
                onEmit = this.staticValueEmit;
                break;

            //  Random Array
            case 2:
                onEmit = this.randomStaticValueEmit;
                current = value[0];
                break;

            //  Custom Callback (onEmit only)
            case 3:
                this._onEmit = value;
                onEmit = this.proxyEmit;
                current = this.defaultValue;
                break;

            //  Stepped start/end
            case 4:
                this.start = value.start;
                this.end = value.end;
                this.steps = value.steps;
                this.counter = this.start as number;
                this.yoyo = this.has(value, 'yoyo') ? value.yoyo : false;
                this.direction = 0;
                onEmit = this.steppedEmit;
                current = this.start;
                break;

            //  Eased start/end
            case 5:
                this.start = value.start;
                this.end = value.end;
                var easeType = this.has(value, 'ease') ? value.ease : 'Linear';
                this.ease = GetEaseFunction(easeType, value.easeParams);
                onEmit = (this.has(value, 'random') && value.random) ? this.randomRangedValueEmit : this.easedValueEmit;
                onUpdate = this.easeValueUpdate;
                current = this.start;
                break;

            //  min/max (random float or int)
            case 6:
                this.start = value.min;
                this.end = value.max;
                onEmit = (this.has(value, 'int') && value.int) ? this.randomRangedIntEmit : this.randomRangedValueEmit;
                current = this.start;
                break;

            //  Random object (random integer)
            case 7:
                var rnd = value.random;

                if (Array.isArray(rnd))
                {
                    this.start = rnd[0];
                    this.end = rnd[1];
                }

                onEmit = this.randomRangedIntEmit;
                current = this.start;
                break;

            //  Custom onEmit and/or onUpdate callbacks
            case 8:
                this._onEmit = (this.has(value, 'onEmit')) ? value.onEmit : this.defaultEmit;
                this._onUpdate = (this.has(value, 'onUpdate')) ? value.onUpdate : this.defaultUpdate;
                onEmit = this.proxyEmit;
                onUpdate = this.proxyUpdate;
                current = this.defaultValue;
                break;

            //  Interpolation
            case 9:
                this.start = value.values;
                var easeTypeI = this.has(value, 'ease') ? value.ease : 'Linear';
                this.ease = GetEaseFunction(easeTypeI, value.easeParams);
                this.interpolation = GetInterpolationFunction(value.interpolation);
                onEmit = this.easedValueEmit;
                onUpdate = this.easeValueUpdate;
                current = this.start[0];
                break;
        }

        this.onEmit = onEmit;
        this.onUpdate = onUpdate;
        this.current = current;

        return this;
    }

    /**
     * Check whether an object has the given property.
     */
    has (object: any, key: string): boolean
    {
        return object.hasOwnProperty(key);
    }

    /**
     * Check whether an object has both of the given properties.
     */
    hasBoth (object: any, key1: string, key2: string): boolean
    {
        return object.hasOwnProperty(key1) && object.hasOwnProperty(key2);
    }

    /**
     * Check whether an object has at least one of the given properties.
     */
    hasEither (object: any, key1: string, key2: string): boolean
    {
        return object.hasOwnProperty(key1) || object.hasOwnProperty(key2);
    }

    /**
     * The returned value sets what the property will be at the START of the particles life, on emit.
     */
    defaultEmit (): number
    {
        return this.defaultValue;
    }

    /**
     * The returned value updates the property for the duration of the particles life.
     */
    defaultUpdate (particle: any, key: string, t: number, value: number): number
    {
        return value;
    }

    /**
     * The returned value sets what the property will be at the START of the particles life, on emit.
     * This method is only used when you have provided a custom emit callback.
     */
    proxyEmit (particle: any, key: string, value?: number): number
    {
        var result = this._onEmit(particle, key, value);

        this.current = result;

        return result;
    }

    /**
     * The returned value updates the property for the duration of the particles life.
     * This method is only used when you have provided a custom update callback.
     */
    proxyUpdate (particle: any, key: string, t: number, value: number): number
    {
        var result = this._onUpdate(particle, key, t, value);

        this.current = result;

        return result;
    }

    /**
     * An `onEmit` callback that returns the current value of the property.
     */
    staticValueEmit (): number
    {
        return this.current;
    }

    /**
     * An `onUpdate` callback that returns the current value of the property.
     */
    staticValueUpdate (): number
    {
        return this.current;
    }

    /**
     * An `onEmit` callback that returns a random value from the current value array.
     */
    randomStaticValueEmit (): number
    {
        var randomIndex = Math.floor(Math.random() * this.propertyValue.length);

        this.current = this.propertyValue[randomIndex];

        return this.current;
    }

    /**
     * An `onEmit` callback that returns a value between the start and end range.
     */
    randomRangedValueEmit (particle: any, key: string): number
    {
        var value = FloatBetween(this.start as number, this.end);

        if (particle && particle.data[key])
        {
            particle.data[key].min = value;
            particle.data[key].max = this.end;
        }

        this.current = value;

        return value;
    }

    /**
     * An `onEmit` callback that returns a value between the start and end range.
     */
    randomRangedIntEmit (particle: any, key: string): number
    {
        var value = Between(this.start as number, this.end);

        if (particle && particle.data[key])
        {
            particle.data[key].min = value;
            particle.data[key].max = this.end;
        }

        this.current = value;

        return value;
    }

    /**
     * An `onEmit` callback that returns a stepped value between the start and end range.
     */
    steppedEmit (): number
    {
        var current = this.counter;

        var next = current;

        var step = ((this.end as number) - (this.start as number)) / this.steps;

        if (this.yoyo)
        {
            var over;

            if (this.direction === 0)
            {
                //  Add step to the current value
                next += step;

                if (next >= (this.end as number))
                {
                    over = next - (this.end as number);

                    next = (this.end as number) - over;

                    this.direction = 1;
                }
            }
            else
            {
                //  Down
                next -= step;

                if (next <= (this.start as number))
                {
                    over = (this.start as number) - next;

                    next = (this.start as number) + over;

                    this.direction = 0;
                }
            }

            this.counter = next;
        }
        else
        {
            this.counter = Wrap(next + step, this.start as number, this.end);
        }

        this.current = current;

        return current;
    }

    /**
     * An `onEmit` callback for an eased property.
     * It prepares the particle for easing by easeValueUpdate.
     */
    easedValueEmit (particle: any, key: string): number
    {
        if (particle && particle.data[key])
        {
            var data = particle.data[key];

            data.min = this.start;
            data.max = this.end;
        }

        this.current = this.start as number;

        return this.start as number;
    }

    /**
     * An `onUpdate` callback that returns an eased value between the start and end range.
     */
    easeValueUpdate (particle: any, key: string, t: number): number
    {
        var data = particle.data[key];

        var current;
        var v = (this.ease as Function)(t);

        if (this.interpolation)
        {
            current = this.interpolation(this.start, v);
        }
        else
        {
            current = (data.max - data.min) * v + data.min;
        }

        this.current = current;

        return current;
    }

    /**
     * Destroys this EmitterOp instance and all of its references.
     */
    destroy (): void
    {
        this.propertyValue = null;
        this.defaultValue = null;
        this.ease = null;
        this.interpolation = null;
        this._onEmit = null;
        this._onUpdate = null;
    }
}
