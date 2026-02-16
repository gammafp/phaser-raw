/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { EmitterOp } from './EmitterOp';
import { GetColor } from '../../display/color/GetColor';
import { GetEaseFunction } from '../../tweens/builders/GetEaseFunction';
import { GetInterpolationFunction } from '../../tweens/builders/GetInterpolationFunction';
import { IntegerToRGB } from '../../display/color/IntegerToRGB';

/**
 * @classdesc
 * This class is responsible for taking control over the color property
 * in the Particle class and managing its emission and updating functions.
 *
 * See the `ParticleEmitter` class for more details on emitter op configuration.
 *
 * @class EmitterColorOp
 * @extends Phaser.GameObjects.Particles.EmitterOp
 * @memberof Phaser.GameObjects.Particles
 * @constructor
 * @since 3.60.0
 */
export class EmitterColorOp extends EmitterOp
{
    /**
     * The name of the ease function.
     */
    easeName: string;

    /**
     * An array containing the red color values.
     */
    r: number[];

    /**
     * An array containing the green color values.
     */
    g: number[];

    /**
     * An array containing the blue color values.
     */
    b: number[];

    constructor (key: string)
    {
        super(key, null, false);

        this.active = false;

        this.easeName = 'Linear';

        this.r = [];
        this.g = [];
        this.b = [];
    }

    /**
     * Checks the type of `EmitterOp.propertyValue` to determine which
     * method is required in order to return values from this op function.
     */
    getMethod (): number
    {
        return (this.propertyValue === null) ? 0 : 9;
    }

    /**
     * Sets the EmitterColorOp method values, if in use.
     */
    setMethods (): this
    {
        var value = this.propertyValue;
        var current = value;

        var onEmit: Function = this.defaultEmit;
        var onUpdate: Function = this.defaultUpdate;

        if (this.method === 9)
        {
            this.start = value[0];
            this.ease = GetEaseFunction('Linear');
            this.interpolation = GetInterpolationFunction('linear');

            onEmit = this.easedValueEmit;
            onUpdate = this.easeValueUpdate;
            current = value[0];

            this.active = true;

            this.r.length = 0;
            this.g.length = 0;
            this.b.length = 0;

            //  Populate the r,g,b arrays
            for (var i = 0; i < value.length; i++)
            {
                //  in hex format 0xff0000
                var color = IntegerToRGB(value[i]);

                this.r.push(color.r);
                this.g.push(color.g);
                this.b.push(color.b);
            }
        }

        this.onEmit = onEmit;
        this.onUpdate = onUpdate;
        this.current = current;

        return this;
    }

    /**
     * Sets the Ease function to use for Color interpolation.
     */
    setEase (value: string): void
    {
        this.easeName = value;

        this.ease = GetEaseFunction(value);
    }

    /**
     * An `onEmit` callback for an eased property.
     * It prepares the particle for easing by easeValueUpdate.
     */
    easedValueEmit (): number
    {
        this.current = this.start as number;

        return this.start as number;
    }

    /**
     * An `onUpdate` callback that returns an eased value between the start and end range.
     */
    easeValueUpdate (particle: any, key: string, t: number): number
    {
        var v = (this.ease as Function)(t);

        var r = (this.interpolation as Function)(this.r, v);
        var g = (this.interpolation as Function)(this.g, v);
        var b = (this.interpolation as Function)(this.b, v);

        var current = GetColor(r, g, b);

        this.current = current;

        return current;
    }
}
