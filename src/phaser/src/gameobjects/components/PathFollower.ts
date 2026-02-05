/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DegToRad } from '../../math/DegToRad';
import { GetValue } from '../../utils/object/GetValue';
import { GetBoolean } from '../../tweens/builders/GetBoolean';
import { Vector2 } from '../../math/Vector2';

import { TWEEN_CONST } from '../../tweens/tween/const';

/**
 * Provides methods used for managing a Game Object following a Path.
 */
export interface PathFollower {
    path: any;
    rotateToPath: boolean;
    pathRotationOffset: number;
    pathOffset: Vector2 | null;
    pathVector: Vector2 | null;
    pathDelta: Vector2 | null;
    pathTween: any;
    pathConfig: any;
    _prevDirection: number;
    x: number;
    y: number;
    rotation: number;
    scene: any;
    setPath(path: any, config?: any): this;
    setRotateToPath(value: boolean, offset?: number): this;
    isFollowing(): boolean;
    startFollow(config?: number | any, startAt?: number): this;
    pauseFollow(): this;
    resumeFollow(): this;
    stopFollow(): this;
    pathUpdate(): void;
    setPosition(x: number, y: number): this;
}

export const PathFollower = {

    path: null,
    rotateToPath: false,
    pathRotationOffset: 0,
    pathOffset: null,
    pathVector: null,
    pathDelta: null,
    pathTween: null,
    pathConfig: null,
    _prevDirection: TWEEN_CONST.PLAYING_FORWARD,

    setPath(this: any, path: any, config?: any): any {
        if (config === undefined) { config = this.pathConfig; }

        const tween = this.pathTween;

        if (tween && tween.isPlaying()) {
            tween.stop();
        }

        this.path = path;

        if (config) {
            this.startFollow(config);
        }

        return this;
    },

    setRotateToPath(this: any, value: boolean, offset: number = 0): any {
        this.rotateToPath = value;
        this.pathRotationOffset = offset;
        return this;
    },

    isFollowing(this: any): boolean {
        const tween = this.pathTween;
        return (tween && tween.isPlaying());
    },

    startFollow(this: any, config: number | any = {}, startAt: number = 0): any {
        const tween = this.pathTween;

        if (tween && tween.isPlaying()) {
            tween.stop();
        }

        if (typeof config === 'number') {
            config = { duration: config };
        }

        config.from = GetValue(config, 'from', 0);
        config.to = GetValue(config, 'to', 1);

        const positionOnPath = GetBoolean(config, 'positionOnPath', false);

        this.rotateToPath = GetBoolean(config, 'rotateToPath', false);
        this.pathRotationOffset = GetValue(config, 'rotationOffset', 0);

        const seek = GetValue(config, 'startAt', startAt);

        if (seek) {
            config.onStart = function (tween: any) {
                const tweenData = tween.data[0];
                tweenData.progress = seek;
                tweenData.elapsed = tweenData.duration * seek;
                const v = tweenData.ease(tweenData.progress);
                tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);
                tweenData.setTargetValue();
            };
        }

        if (!this.pathOffset) {
            this.pathOffset = new Vector2(this.x, this.y);
        }

        if (!this.pathVector) {
            this.pathVector = new Vector2();
        }

        if (!this.pathDelta) {
            this.pathDelta = new Vector2();
        }

        this.pathDelta.reset();
        config.persist = true;
        this.pathTween = this.scene.sys.tweens.addCounter(config);
        this.path.getStartPoint(this.pathOffset);

        if (positionOnPath) {
            this.x = this.pathOffset.x;
            this.y = this.pathOffset.y;
        }

        this.pathOffset.x = this.x - this.pathOffset.x;
        this.pathOffset.y = this.y - this.pathOffset.y;
        this._prevDirection = TWEEN_CONST.PLAYING_FORWARD;

        if (this.rotateToPath) {
            const nextPoint = this.path.getPoint(0.1);
            this.rotation = Math.atan2(nextPoint.y - this.y, nextPoint.x - this.x) + DegToRad(this.pathRotationOffset);
        }

        this.pathConfig = config;

        return this;
    },

    pauseFollow(this: any): any {
        const tween = this.pathTween;
        if (tween && tween.isPlaying()) {
            tween.pause();
        }
        return this;
    },

    resumeFollow(this: any): any {
        const tween = this.pathTween;
        if (tween && tween.isPaused()) {
            tween.resume();
        }
        return this;
    },

    stopFollow(this: any): any {
        const tween = this.pathTween;
        if (tween && tween.isPlaying()) {
            tween.stop();
        }
        return this;
    },

    pathUpdate(this: any): void {
        const tween = this.pathTween;

        if (tween && tween.data) {
            const tweenData = tween.data[0];
            const pathDelta = this.pathDelta;
            const pathVector = this.pathVector;

            pathDelta.copy(pathVector).negate();

            if (tweenData.state === TWEEN_CONST.COMPLETE) {
                this.path.getPoint(tweenData.end, pathVector);
                pathDelta.add(pathVector);
                pathVector.add(this.pathOffset);
                this.setPosition(pathVector.x, pathVector.y);
                return;
            } else if (tweenData.state !== TWEEN_CONST.PLAYING_FORWARD && tweenData.state !== TWEEN_CONST.PLAYING_BACKWARD) {
                return;
            }

            this.path.getPoint(tween.getValue(), pathVector);
            pathDelta.add(pathVector);
            pathVector.add(this.pathOffset);

            const oldX = this.x;
            const oldY = this.y;

            this.setPosition(pathVector.x, pathVector.y);

            const speedX = this.x - oldX;
            const speedY = this.y - oldY;

            if (speedX === 0 && speedY === 0) {
                return;
            }

            if (tweenData.state !== this._prevDirection) {
                this._prevDirection = tweenData.state;
                return;
            }

            if (this.rotateToPath) {
                this.rotation = Math.atan2(speedY, speedX) + DegToRad(this.pathRotationOffset);
            }
        }
    }
};
