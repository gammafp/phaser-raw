/**
 * @author       Jason Nicholls <nicholls.jason@gmail.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

import { Clamp } from '../../../math/Clamp';
import { EaseMap } from '../../../math/easing/EaseMap';
import { Wrap as WrapAngle } from '../../../math/angle/Wrap';
import * as Events from '../events';

/**
 * @classdesc
 * A Camera Rotate effect.
 *
 * This effect will rotate the Camera so that the its viewport finishes at the given angle in radians,
 * over the duration and with the ease specified.
 *
 * Camera rotation always takes place based on the Camera viewport. By default, rotation happens
 * in the center of the viewport. You can adjust this with the `originX` and `originY` properties.
 *
 * Rotation influences the rendering of _all_ Game Objects visible by this Camera. However, it does not
 * rotate the Camera viewport itself, which always remains an axis-aligned rectangle.
 *
 * Only the camera is rotates. None of the objects it is displaying are impacted, i.e. their positions do
 * not change.
 *
 * The effect will dispatch several events on the Camera itself and you can also specify an `onUpdate` callback,
 * which is invoked each frame for the duration of the effect if required.
 *
 * @class RotateTo
 * @memberof Phaser.Cameras.Scene2D.Effects
 * @constructor
 * @since 3.23.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera this effect is acting upon.
 */
export class RotateTo {

    camera: any;
    isRunning: boolean;
    duration: number;
    source: number;
    current: number;
    destination: number;
    ease: any;
    progress: number;
    _elapsed: number;
    _onUpdate: any;
    _onUpdateScope: any;
    clockwise: boolean;
    shortestPath: boolean;

    constructor(camera: any)
    {
        /**
         * The Camera this effect belongs to.
         *
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @readonly
         * @since 3.23.0
         */
        this.camera = camera;

        this.isRunning = false;
        this.duration = 0;
        this.source = 0;
        this.current = 0;
        this.destination = 0;
        this.ease = null;
        this.progress = 0;
        this._elapsed = 0;
        this._onUpdate = null;
        this._onUpdateScope = null;
        this.clockwise = true;
        this.shortestPath = false;
    }

    /**
     * Rotate the Camera to the given angle over the duration and with the ease specified.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#start
     * @fires Phaser.Cameras.Scene2D.Events#ROTATE_START
     * @fires Phaser.Cameras.Scene2D.Events#ROTATE_COMPLETE
     * @since 3.23.0
     *
     * @param {number} angle - The destination angle in radians to rotate the Camera view to.
     * @param {boolean} [shortestPath=false] - If true, take the shortest distance to the destination. This adjusts the destination angle to be within one half turn of the start angle.
     * @param {number} [duration=1000] - The duration of the effect in milliseconds.
     * @param {(string|function)} [ease='Linear'] - The ease to use. Can be any of the Phaser Easing constants or a custom function.
     * @param {boolean} [force=false] - Force the rotation effect to start immediately, even if already running.
     * @param {Phaser.Types.Cameras.Scene2D.CameraRotateCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent three arguments: A reference to the camera, a progress amount between 0 and 1 indicating how complete the effect is,
     * and the current camera rotation.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The Camera on which the effect was started.
     */
    start(angle: number, shortestPath?: boolean, duration?: number, ease?: any, force?: boolean, callback?: any, context?: any): any
    {
        if (duration === undefined) { duration = 1000; }
        if (ease === undefined) { ease = EaseMap.Linear; }
        if (force === undefined) { force = false; }
        if (callback === undefined) { callback = null; }
        if (context === undefined) { context = this.camera.scene; }
        if (shortestPath === undefined) { shortestPath = false; }

        var cam = this.camera;

        if (!force && this.isRunning)
        {
            return cam;
        }

        this.shortestPath = shortestPath;
        this.isRunning = true;
        this.duration = duration;
        this.progress = 0;

        //  Starting from
        this.source = cam.rotation;

        //  Destination
        this.destination = angle;

        //  Using this ease
        if (typeof ease === 'string' && EaseMap.hasOwnProperty(ease))
        {
            this.ease = EaseMap[ease];
        }
        else if (typeof ease === 'function')
        {
            this.ease = ease;
        }

        this._elapsed = 0;

        this._onUpdate = callback;
        this._onUpdateScope = context;

        if (this.shortestPath)
        {
            var distance = WrapAngle(this.destination - this.source);

            this.destination = this.source + distance;

            this.clockwise = distance >= 0;
        }
        else
        {
            this.clockwise = this.destination >= this.source;
        }

        this.camera.emit(Events.ROTATE_START, this.camera, this, duration, this.destination);

        return cam;
    }

    /**
     * The main update loop for this effect. Called automatically by the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#update
     * @since 3.23.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update(time: number, delta: number): void
    {
        if (!this.isRunning)
        {
            return;
        }

        this._elapsed += delta;

        var progress = Clamp(this._elapsed / this.duration, 0, 1);

        this.progress = progress;

        var cam = this.camera;

        if (this._elapsed < this.duration)
        {
            var v = this.ease(progress);
            var r = this.source + v * (this.destination - this.source);

            cam.rotation = r;

            this.current = r;

            if (this._onUpdate)
            {
                this._onUpdate.call(this._onUpdateScope, cam, progress, r);
            }
        }
        else
        {
            cam.rotation = this.destination;

            this.current = this.destination;

            if (this._onUpdate)
            {
                this._onUpdate.call(this._onUpdateScope, cam, progress, this.destination);
            }

            this.effectComplete();
        }
    }

    /**
     * Called internally when the effect completes.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#effectComplete
     * @since 3.23.0
     */
    effectComplete(): void
    {
        this._onUpdate = null;
        this._onUpdateScope = null;

        this.isRunning = false;

        this.camera.emit(Events.ROTATE_COMPLETE, this.camera, this);
    }

    /**
     * Resets this camera effect.
     * If it was previously running, it stops instantly without calling its onComplete callback or emitting an event.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#reset
     * @since 3.23.0
     */
    reset(): void
    {
        this.isRunning = false;

        this._onUpdate = null;
        this._onUpdateScope = null;
    }

    /**
     * Destroys this effect, releasing it from the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#destroy
     * @since 3.23.0
     */
    destroy(): void
    {
        this.reset();

        this.camera = null;
        this.source = null;
        this.destination = null;
    }

}
