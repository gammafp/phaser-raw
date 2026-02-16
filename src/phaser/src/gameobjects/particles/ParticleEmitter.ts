/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ToJSON as ComponentsToJSON } from '../components/ToJSON';
import { TransformMatrix } from '../components/TransformMatrix';

import { GetRandom } from '../../utils/array/GetRandom';
import { Remove } from '../../utils/array/Remove';
import { StableSort } from '../../utils/array/StableSort';

import { GetFastValue } from '../../utils/object/GetFastValue';
import { HasAll } from '../../utils/object/HasAll';
import { HasAny } from '../../utils/object/HasAny';
import { HasValue } from '../../utils/object/HasValue';
import { MergeRight } from '../../utils/object/MergeRight';

import { CopyFrom } from '../../geom/rectangle/CopyFrom';
import { Inflate } from '../../geom/rectangle/Inflate';
import { MergeRect } from '../../geom/rectangle/MergeRect';
import { Rectangle } from '../../geom/rectangle/Rectangle';
import { RectangleToRectangle } from '../../geom/intersects/RectangleToRectangle';

import { Vector2 } from '../../math/Vector2';
import { Wrap } from '../../math/Wrap';

import { List } from '../../structs/List';

import { EmitterOp } from './EmitterOp';
import { EmitterColorOp } from './EmitterColorOp';
import { Particle } from './Particle';
import { ParticleBounds } from './ParticleBounds';
import { GravityWell } from './GravityWell';
import { DeathZone } from './zones/DeathZone';
import { EdgeZone } from './zones/EdgeZone';
import { RandomZone } from './zones/RandomZone';

import { Mixin } from '../../utils/MixinTS';

const DefaultParticleEmitterNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultParticleEmitterNodes');
const Components = require('../components');
const GameObject = require('../GameObject');
const Events = require('./events');
const Render = require('./ParticleEmitterRender');
const TintModes = require('../../renderer/TintModes');

/**
 * Names of simple configuration properties.
 *
 * @ignore
 */
const configFastMap = [
    'active',
    'advance',
    'blendMode',
    'colorEase',
    'deathCallback',
    'deathCallbackScope',
    'duration',
    'emitCallback',
    'emitCallbackScope',
    'follow',
    'frequency',
    'gravityX',
    'gravityY',
    'maxAliveParticles',
    'maxParticles',
    'name',
    'emitting',
    'particleBringToTop',
    'particleClass',
    'radial',
    'sortCallback',
    'sortOrderAsc',
    'sortProperty',
    'stopAfter',
    'tintFill',
    'timeScale',
    'trackVisible',
    'visible'
];

/**
 * Names of complex configuration properties.
 *
 * @ignore
 */
const configOpMap = [
    'accelerationX',
    'accelerationY',
    'alpha',
    'angle',
    'bounce',
    'color',
    'delay',
    'hold',
    'lifespan',
    'maxVelocityX',
    'maxVelocityY',
    'moveToX',
    'moveToY',
    'quantity',
    'rotate',
    'scaleX',
    'scaleY',
    'speedX',
    'speedY',
    'tint',
    'x',
    'y'
];

export interface ParticleEmitter extends Record<string, any> {}

export class ParticleEmitter extends GameObject {

    static {
        Mixin(this, [
            Components.AlphaSingle,
            Components.BlendMode,
            Components.Depth,
            Components.Lighting,
            Components.Mask,
            Components.RenderNodes,
            Components.ScrollFactor,
            Components.Texture,
            Components.Transform,
            Components.Visible,
            Render
        ]);
    }

    constructor(scene: any, x?: number, y?: number, texture?: any, config?: any) {
        super(scene, 'ParticleEmitter');

        this.particleClass = Particle;

        this.config = null;

        this.ops = {
            accelerationX: new EmitterOp('accelerationX', 0),
            accelerationY: new EmitterOp('accelerationY', 0),
            alpha: new EmitterOp('alpha', 1),
            angle: new EmitterOp('angle', { min: 0, max: 360 }, true),
            bounce: new EmitterOp('bounce', 0),
            color: new EmitterColorOp('color'),
            delay: new EmitterOp('delay', 0, true),
            hold: new EmitterOp('hold', 0, true),
            lifespan: new EmitterOp('lifespan', 1000, true),
            maxVelocityX: new EmitterOp('maxVelocityX', 10000),
            maxVelocityY: new EmitterOp('maxVelocityY', 10000),
            moveToX: new EmitterOp('moveToX', 0),
            moveToY: new EmitterOp('moveToY', 0),
            quantity: new EmitterOp('quantity', 1, true),
            rotate: new EmitterOp('rotate', 0),
            scaleX: new EmitterOp('scaleX', 1),
            scaleY: new EmitterOp('scaleY', 1),
            speedX: new EmitterOp('speedX', 0, true),
            speedY: new EmitterOp('speedY', 0, true),
            tint: new EmitterOp('tint', 0xffffff),
            x: new EmitterOp('x', 0),
            y: new EmitterOp('y', 0)
        };

        this.radial = true;

        this.gravityX = 0;
        this.gravityY = 0;
        this.acceleration = false;
        this.moveTo = false;

        this.emitCallback = null;
        this.emitCallbackScope = null;
        this.deathCallback = null;
        this.deathCallbackScope = null;

        this.maxParticles = 0;
        this.maxAliveParticles = 0;
        this.stopAfter = 0;
        this.duration = 0;
        this.frequency = 0;
        this.emitting = true;
        this.particleBringToTop = true;
        this.timeScale = 1;

        this.emitZones = [];
        this.deathZones = [];
        this.viewBounds = null;
        this.follow = null;
        this.followOffset = new Vector2();
        this.trackVisible = false;

        this.frames = [];
        this.randomFrame = true;
        this.frameQuantity = 1;
        this.anims = [];
        this.randomAnim = true;
        this.animQuantity = 1;

        this.dead = [];
        this.alive = [];

        this.counters = new Float32Array(10);
        this.skipping = false;
        this.worldMatrix = new TransformMatrix();

        this.sortProperty = '';
        this.sortOrderAsc = true;
        this.sortCallback = this.depthSortCallback;

        this.processors = new List(this);
        this.tintFill = TintModes.MULTIPLY;

        this.initRenderNodes(this._defaultRenderNodesMap);

        this.setPosition(x, y);
        this.setTexture(texture);

        if (config) {
            this.setConfig(config);
        }
    }

    get _defaultRenderNodesMap(): any {
        return DefaultParticleEmitterNodes;
    }

    addedToScene(): void {
        this.scene.sys.updateList.add(this);
    }

    removedFromScene(): void {
        this.scene.sys.updateList.remove(this);
    }

    setConfig(config: any): this {
        if (!config) {
            return this;
        }

        this.config = config;

        let i = 0;
        let key = '';

        const ops = this.ops;

        for (i = 0; i < configOpMap.length; i++) {
            key = configOpMap[i];
            ops[key].loadConfig(config);
        }

        for (i = 0; i < configFastMap.length; i++) {
            key = configFastMap[i];

            if (HasValue(config, key)) {
                (this as any)[key] = GetFastValue(config, key);
            }
        }

        this.acceleration = (this.accelerationX !== 0 || this.accelerationY !== 0);
        this.moveTo = HasAll(config, ['moveToX', 'moveToY']);

        if (HasValue(config, 'speed')) {
            ops.speedX.loadConfig(config, 'speed');
            ops.speedY.active = false;
        }

        if (HasAny(config, ['speedX', 'speedY']) || this.moveTo) {
            this.radial = false;
        }

        if (HasValue(config, 'scale')) {
            ops.scaleX.loadConfig(config, 'scale');
            ops.scaleY.active = false;
        }

        if (HasValue(config, 'callbackScope')) {
            const callbackScope = GetFastValue(config, 'callbackScope', null);
            this.emitCallbackScope = callbackScope;
            this.deathCallbackScope = callbackScope;
        }

        if (HasValue(config, 'emitZone')) {
            this.addEmitZone(config.emitZone);
        }

        if (HasValue(config, 'deathZone')) {
            this.addDeathZone(config.deathZone);
        }

        if (HasValue(config, 'bounds')) {
            const bounds = this.addParticleBounds(config.bounds);
            bounds.collideLeft = GetFastValue(config, 'collideLeft', true);
            bounds.collideRight = GetFastValue(config, 'collideRight', true);
            bounds.collideTop = GetFastValue(config, 'collideTop', true);
            bounds.collideBottom = GetFastValue(config, 'collideBottom', true);
        }

        if (HasValue(config, 'followOffset')) {
            this.followOffset.setFromObject(GetFastValue(config, 'followOffset', 0));
        }

        if (HasValue(config, 'texture')) {
            this.setTexture(config.texture);
        }

        if (HasValue(config, 'frame')) {
            this.setEmitterFrame(config.frame);
        } else if (HasValue(config, 'anim')) {
            this.setAnim(config.anim);
        }

        if (HasValue(config, 'reserve')) {
            this.reserve(config.reserve);
        }

        if (HasValue(config, 'advance')) {
            this.fastForward(config.advance);
        }

        this.resetCounters(this.frequency, this.emitting);

        if (this.emitting) {
            this.emit(Events.START, this);
        }

        return this;
    }

    updateConfig(config: any): this {
        if (config) {
            if (!this.config) {
                this.setConfig(config);
            } else {
                this.setConfig(MergeRight(this.config, config));
            }
        }
        return this;
    }

    toJSON(): any {
        const output = ComponentsToJSON(this);

        let i = 0;
        let key = '';

        for (i = 0; i < configFastMap.length; i++) {
            key = configFastMap[i];
            (output as any)[key] = (this as any)[key];
        }

        const ops = this.ops;

        for (i = 0; i < configOpMap.length; i++) {
            key = configOpMap[i];
            if (ops[key]) {
                (output as any)[key] = ops[key].toJSON();
            }
        }

        if (!ops.speedY.active) {
            delete (output as any).speedX;
            (output as any).speed = ops.speedX.toJSON();
        }

        if (this.particleScaleX === this.particleScaleY) {
            delete (output as any).scaleX;
            delete (output as any).scaleY;
            (output as any).scale = ops.scaleX.toJSON();
        }

        return output;
    }

    resetCounters(frequency: number, on: boolean): void {
        const counters = this.counters;
        counters.fill(0);
        counters[0] = frequency;
        if (on) {
            counters[5] = 1;
        }
    }

    startFollow(target: any, offsetX?: number, offsetY?: number, trackVisible?: boolean): this {
        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = 0; }
        if (trackVisible === undefined) { trackVisible = false; }

        this.follow = target;
        this.followOffset.set(offsetX, offsetY);
        this.trackVisible = trackVisible;
        return this;
    }

    stopFollow(): this {
        this.follow = null;
        this.followOffset.set(0, 0);
        this.trackVisible = false;
        return this;
    }

    getFrame(): any {
        const frames = this.frames;
        const len = frames.length;
        let current: any;

        if (len === 1) {
            current = frames[0];
        } else if (this.randomFrame) {
            current = GetRandom(frames);
        } else {
            current = frames[this.currentFrame];
            this.frameCounter++;
            if (this.frameCounter === this.frameQuantity) {
                this.frameCounter = 0;
                this.currentFrame++;
                if (this.currentFrame === len) {
                    this.currentFrame = 0;
                }
            }
        }

        return this.texture.get(current);
    }

    setEmitterFrame(frames: any, pickRandom?: boolean, quantity?: number): this {
        if (pickRandom === undefined) { pickRandom = true; }
        if (quantity === undefined) { quantity = 1; }

        this.randomFrame = pickRandom;
        this.frameQuantity = quantity;
        this.currentFrame = 0;

        const t = typeof frames;
        this.frames.length = 0;

        if (Array.isArray(frames)) {
            this.frames = this.frames.concat(frames);
        } else if (t === 'string' || t === 'number') {
            this.frames.push(frames);
        } else if (t === 'object') {
            const frameConfig = frames;
            frames = GetFastValue(frameConfig, 'frames', null);
            if (frames) {
                this.frames = this.frames.concat(frames);
            }
            const isCycle = GetFastValue(frameConfig, 'cycle', false);
            this.randomFrame = (isCycle) ? false : true;
            this.frameQuantity = GetFastValue(frameConfig, 'quantity', quantity);
        }

        if (this.frames.length === 1) {
            this.frameQuantity = 1;
            this.randomFrame = false;
        }

        return this;
    }

    getAnim(): string | null {
        const anims = this.anims;
        const len = anims.length;

        if (len === 0) {
            return null;
        } else if (len === 1) {
            return anims[0];
        } else if (this.randomAnim) {
            return GetRandom(anims);
        } else {
            const anim = anims[this.currentAnim];
            this.animCounter++;
            if (this.animCounter >= this.animQuantity) {
                this.animCounter = 0;
                this.currentAnim = Wrap(this.currentAnim + 1, 0, len);
            }
            return anim;
        }
    }

    setAnim(anims: any, pickRandom?: boolean, quantity?: number): this {
        if (pickRandom === undefined) { pickRandom = true; }
        if (quantity === undefined) { quantity = 1; }

        this.randomAnim = pickRandom;
        this.animQuantity = quantity;
        this.currentAnim = 0;

        const t = typeof anims;
        this.anims.length = 0;

        if (Array.isArray(anims)) {
            this.anims = this.anims.concat(anims);
        } else if (t === 'string') {
            this.anims.push(anims);
        } else if (t === 'object') {
            const animConfig = anims;
            anims = GetFastValue(animConfig, 'anims', null);
            if (anims) {
                this.anims = this.anims.concat(anims);
            }
            const isCycle = GetFastValue(animConfig, 'cycle', false);
            this.randomAnim = (isCycle) ? false : true;
            this.animQuantity = GetFastValue(animConfig, 'quantity', quantity);
        }

        if (this.anims.length === 1) {
            this.animQuantity = 1;
            this.randomAnim = false;
        }

        return this;
    }

    setRadial(value?: boolean): this {
        if (value === undefined) { value = true; }
        this.radial = value;
        return this;
    }

    addParticleBounds(x: any, y?: number, width?: number, height?: number, collideLeft?: boolean, collideRight?: boolean, collideTop?: boolean, collideBottom?: boolean): ParticleBounds {
        if (typeof x === 'object') {
            const obj = x;
            x = obj.x;
            y = obj.y;
            width = (HasValue(obj, 'w')) ? obj.w : obj.width;
            height = (HasValue(obj, 'h')) ? obj.h : obj.height;
        }
        return this.addParticleProcessor(new ParticleBounds(x, y, width, height, collideLeft, collideRight, collideTop, collideBottom));
    }

    setParticleSpeed(x: number, y?: number): this {
        if (y === undefined) { y = x; }
        this.ops.speedX.onChange(x);
        if (x === y) {
            this.ops.speedY.active = false;
        } else {
            this.ops.speedY.onChange(y);
        }
        this.radial = true;
        return this;
    }

    setParticleScale(x?: number, y?: number): this {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }
        this.ops.scaleX.onChange(x);
        this.ops.scaleY.onChange(y);
        return this;
    }

    setParticleGravity(x: number, y: number): this {
        this.gravityX = x;
        this.gravityY = y;
        return this;
    }

    setParticleAlpha(value: any): this {
        this.ops.alpha.onChange(value);
        return this;
    }

    setParticleTint(value: any): this {
        this.ops.tint.onChange(value);
        return this;
    }

    setEmitterAngle(value: any): this {
        this.ops.angle.onChange(value);
        return this;
    }

    setParticleLifespan(value: any): this {
        this.ops.lifespan.onChange(value);
        return this;
    }

    setQuantity(quantity: any): this {
        this.quantity = quantity;
        return this;
    }

    setFrequency(frequency: number, quantity?: any): this {
        this.frequency = frequency;
        this.flowCounter = (frequency > 0) ? frequency : 0;
        if (quantity) {
            this.quantity = quantity;
        }
        return this;
    }

    addDeathZone(config: any): DeathZone[] {
        if (!Array.isArray(config)) {
            config = [config];
        }

        let zone: any;
        const output: DeathZone[] = [];

        for (let i = 0; i < config.length; i++) {
            zone = config[i];

            if (zone instanceof DeathZone) {
                output.push(zone);
            } else if (typeof zone.contains === 'function') {
                zone = new DeathZone(zone, true);
                output.push(zone);
            } else {
                const type = GetFastValue(zone, 'type', 'onEnter');
                const source = GetFastValue(zone, 'source', null);

                if (source && typeof source.contains === 'function') {
                    const killOnEnter = (type === 'onEnter') ? true : false;
                    zone = new DeathZone(source, killOnEnter);
                    output.push(zone);
                }
            }
        }

        this.deathZones = this.deathZones.concat(output);
        return output;
    }

    removeDeathZone(zone: DeathZone): this {
        Remove(this.deathZones, zone);
        return this;
    }

    clearDeathZones(): this {
        this.deathZones.length = 0;
        return this;
    }

    addEmitZone(config: any): any[] {
        if (!Array.isArray(config)) {
            config = [config];
        }

        let zone: any;
        const output: any[] = [];

        for (let i = 0; i < config.length; i++) {
            zone = config[i];

            if (zone instanceof RandomZone || zone instanceof EdgeZone) {
                output.push(zone);
            } else {
                const source = GetFastValue(zone, 'source', null);

                if (source) {
                    const type = GetFastValue(zone, 'type', 'random');

                    if (type === 'random' && typeof source.getRandomPoint === 'function') {
                        zone = new RandomZone(source);
                        output.push(zone);
                    } else if (type === 'edge' && typeof source.getPoints === 'function') {
                        const quantity = GetFastValue(zone, 'quantity', 1);
                        const stepRate = GetFastValue(zone, 'stepRate', 0);
                        const yoyo = GetFastValue(zone, 'yoyo', false);
                        const seamless = GetFastValue(zone, 'seamless', true);
                        const total = GetFastValue(zone, 'total', -1);
                        zone = new EdgeZone(source, quantity, stepRate, yoyo, seamless, total);
                        output.push(zone);
                    }
                }
            }
        }

        this.emitZones = this.emitZones.concat(output);
        return output;
    }

    removeEmitZone(zone: any): this {
        Remove(this.emitZones, zone);
        this.zoneIndex = 0;
        return this;
    }

    clearEmitZones(): this {
        this.emitZones.length = 0;
        this.zoneIndex = 0;
        return this;
    }

    getEmitZone(particle: Particle): void {
        const zones = this.emitZones;
        const len = zones.length;

        if (len === 0) {
            return;
        } else {
            const zone = zones[this.zoneIndex];
            zone.getPoint(particle);

            if (zone.total > -1) {
                this.zoneTotal++;
                if (this.zoneTotal === zone.total) {
                    this.zoneTotal = 0;
                    this.zoneIndex++;
                    if (this.zoneIndex === len) {
                        this.zoneIndex = 0;
                    }
                }
            }
        }
    }

    getDeathZone(particle: Particle): boolean {
        const zones = this.deathZones;

        for (let i = 0; i < zones.length; i++) {
            const zone = zones[i];
            if (zone.willKill(particle)) {
                this.emit(Events.DEATH_ZONE, this, particle, zone);
                return true;
            }
        }
        return false;
    }

    setEmitZone(zone: number | any): this {
        let index: number;

        if (isFinite(zone)) {
            index = zone;
        } else {
            index = this.emitZones.indexOf(zone);
        }

        if (index >= 0) {
            this.zoneIndex = index;
        }

        return this;
    }

    addParticleProcessor(processor: any): any {
        if (!this.processors.exists(processor)) {
            if (processor.emitter) {
                processor.emitter.removeParticleProcessor(processor);
            }
            this.processors.add(processor);
            processor.emitter = this;
        }
        return processor;
    }

    removeParticleProcessor(processor: any): any {
        if (this.processors.exists(processor)) {
            this.processors.remove(processor, true);
            processor.emitter = null;
        }
        return processor;
    }

    getProcessors(): any[] {
        return this.processors.getAll('active', true);
    }

    createGravityWell(config: any): GravityWell {
        return this.addParticleProcessor(new GravityWell(config));
    }

    reserve(count: number): this {
        const dead = this.dead;

        if (this.maxParticles > 0) {
            const total = this.getParticleCount();
            if (total + count > this.maxParticles) {
                count = this.maxParticles - (total + count);
            }
        }

        for (let i = 0; i < count; i++) {
            dead.push(new this.particleClass(this));
        }

        return this;
    }

    getAliveParticleCount(): number {
        return this.alive.length;
    }

    getDeadParticleCount(): number {
        return this.dead.length;
    }

    getParticleCount(): number {
        return this.getAliveParticleCount() + this.getDeadParticleCount();
    }

    atLimit(): boolean {
        if (this.maxParticles > 0 && this.getParticleCount() >= this.maxParticles) {
            return true;
        }
        return (this.maxAliveParticles > 0 && this.getAliveParticleCount() >= this.maxAliveParticles);
    }

    onParticleEmit(callback?: any, context?: any): this {
        if (callback === undefined) {
            this.emitCallback = null;
            this.emitCallbackScope = null;
        } else if (typeof callback === 'function') {
            this.emitCallback = callback;
            if (context) {
                this.emitCallbackScope = context;
            }
        }
        return this;
    }

    onParticleDeath(callback?: any, context?: any): this {
        if (callback === undefined) {
            this.deathCallback = null;
            this.deathCallbackScope = null;
        } else if (typeof callback === 'function') {
            this.deathCallback = callback;
            if (context) {
                this.deathCallbackScope = context;
            }
        }
        return this;
    }

    killAll(): this {
        const dead = this.dead;
        const alive = this.alive;

        while (alive.length > 0) {
            dead.push(alive.pop());
        }

        return this;
    }

    forEachAlive(callback: any, context: any): this {
        const alive = this.alive;
        const length = alive.length;

        for (let i = 0; i < length; i++) {
            callback.call(context, alive[i], this);
        }

        return this;
    }

    forEachDead(callback: any, context: any): this {
        const dead = this.dead;
        const length = dead.length;

        for (let i = 0; i < length; i++) {
            callback.call(context, dead[i], this);
        }

        return this;
    }

    start(advance?: number, duration?: number): this {
        if (advance === undefined) { advance = 0; }

        if (!this.emitting) {
            if (advance > 0) {
                this.fastForward(advance);
            }

            this.emitting = true;
            this.resetCounters(this.frequency, true);

            if (duration !== undefined) {
                this.duration = Math.abs(duration);
            }

            this.emit(Events.START, this);
        }

        return this;
    }

    stop(kill?: boolean): this {
        if (kill === undefined) { kill = false; }

        if (this.emitting) {
            this.emitting = false;

            if (kill) {
                this.killAll();
            }

            this.emit(Events.STOP, this);
        }

        return this;
    }

    pause(): this {
        this.active = false;
        return this;
    }

    resume(): this {
        this.active = true;
        return this;
    }

    setSortProperty(property?: string, ascending?: boolean): this {
        if (property === undefined) { property = ''; }
        if (ascending === undefined) { ascending = true; }

        this.sortProperty = property;
        this.sortOrderAsc = ascending;
        this.sortCallback = this.depthSortCallback;

        return this;
    }

    setSortCallback(callback?: any): this {
        if (this.sortProperty !== '') {
            callback = this.depthSortCallback;
        } else {
            callback = null;
        }
        this.sortCallback = callback;

        return this;
    }

    depthSort(): this {
        StableSort(this.alive, this.sortCallback.bind(this));
        return this;
    }

    depthSortCallback(a: any, b: any): number {
        const key = this.sortProperty;

        if (this.sortOrderAsc) {
            return a[key] - b[key];
        } else {
            return b[key] - a[key];
        }
    }

    flow(frequency: number, count?: any, stopAfter?: number): this {
        if (count === undefined) { count = 1; }

        this.emitting = false;

        this.frequency = frequency;
        this.quantity = count;

        if (stopAfter !== undefined) {
            this.stopAfter = stopAfter;
        }

        return this.start();
    }

    explode(count?: number, x?: number, y?: number): Particle | undefined {
        this.frequency = -1;
        this.resetCounters(-1, true);

        const particle = this.emitParticle(count, x, y);

        this.emit(Events.EXPLODE, this, particle);

        return particle;
    }

    emitParticleAt(x?: number, y?: number, count?: number): Particle | undefined {
        return this.emitParticle(count, x, y);
    }

    emitParticle(count?: number, x?: number, y?: number): Particle | undefined {
        if (this.atLimit()) {
            return;
        }

        if (count === undefined) {
            count = this.ops.quantity.onEmit();
        }

        const dead = this.dead;
        const stopAfter = this.stopAfter;

        const followX = (this.follow) ? this.follow.x + this.followOffset.x : x;
        const followY = (this.follow) ? this.follow.y + this.followOffset.y : y;

        let particle: Particle | undefined;

        for (let i = 0; i < count; i++) {
            particle = dead.pop();

            if (!particle) {
                particle = new this.particleClass(this);
            }

            if (particle.fire(followX, followY)) {
                if (this.particleBringToTop) {
                    this.alive.push(particle);
                } else {
                    this.alive.unshift(particle);
                }

                if (this.emitCallback) {
                    this.emitCallback.call(this.emitCallbackScope, particle, this);
                }
            } else {
                this.dead.push(particle);
            }

            if (stopAfter > 0) {
                this.stopCounter++;

                if (this.stopCounter >= stopAfter) {
                    break;
                }
            }

            if (this.atLimit()) {
                break;
            }
        }

        return particle;
    }

    fastForward(time: number, delta?: number): this {
        if (delta === undefined) { delta = 1000 / 60; }

        let total = 0;

        this.skipping = true;

        while (total < Math.abs(time)) {
            this.preUpdate(0, delta);
            total += delta;
        }

        this.skipping = false;

        return this;
    }

    preUpdate(time: number, delta: number): void {
        delta *= this.timeScale;

        const step = (delta / 1000);

        if (this.trackVisible) {
            this.visible = this.follow.visible;
        }

        this.getWorldTransformMatrix(this.worldMatrix);

        const processors = this.getProcessors();
        const particles = this.alive;
        const dead = this.dead;

        let i = 0;
        const rip: { index: number; particle: Particle }[] = [];
        let length = particles.length;

        for (i = 0; i < length; i++) {
            const particle = particles[i];

            if (particle.update(delta, step, processors)) {
                rip.push({ index: i, particle: particle });
            }
        }

        length = rip.length;

        if (length > 0) {
            const deathCallback = this.deathCallback;
            const deathCallbackScope = this.deathCallbackScope;

            for (i = length - 1; i >= 0; i--) {
                const entry = rip[i];

                particles.splice(entry.index, 1);
                dead.push(entry.particle);

                if (deathCallback) {
                    deathCallback.call(deathCallbackScope, entry.particle);
                }

                entry.particle.setPosition();
            }
        }

        if (!this.emitting && !this.skipping) {
            if (this.completeFlag === 1 && particles.length === 0) {
                this.completeFlag = 0;
                this.emit(Events.COMPLETE, this);
            }

            return;
        }

        if (this.frequency === 0) {
            this.emitParticle();
        } else if (this.frequency > 0) {
            this.flowCounter -= delta;

            while (this.flowCounter <= 0) {
                this.emitParticle();
                this.flowCounter += this.frequency;
            }
        }

        if (!this.skipping) {
            if (this.duration > 0) {
                this.elapsed += delta;

                if (this.elapsed >= this.duration) {
                    this.stop();
                }
            }

            if (this.stopAfter > 0 && this.stopCounter >= this.stopAfter) {
                this.stop();
            }
        }
    }

    overlap(target: any): Particle[] {
        const matrix = this.getWorldTransformMatrix();
        const alive = this.alive;
        const length = alive.length;
        const output: Particle[] = [];

        for (let i = 0; i < length; i++) {
            const particle = alive[i];

            if (RectangleToRectangle(target, particle.getBounds(matrix))) {
                output.push(particle);
            }
        }

        return output;
    }

    getBounds(padding?: number, advance?: number, delta?: number, output?: Rectangle): Rectangle {
        if (padding === undefined) { padding = 0; }
        if (advance === undefined) { advance = 0; }
        if (delta === undefined) { delta = 1000 / 60; }
        if (output === undefined) { output = new Rectangle(); }

        const matrix = this.getWorldTransformMatrix();

        let i: number;
        let bounds: any;
        const alive = this.alive;
        let setFirst = false;

        output.setTo(0, 0, 0, 0);

        if (advance > 0) {
            let total = 0;

            this.skipping = true;

            while (total < Math.abs(advance)) {
                this.preUpdate(0, delta);

                for (i = 0; i < alive.length; i++) {
                    bounds = alive[i].getBounds(matrix);

                    if (!setFirst) {
                        setFirst = true;
                        CopyFrom(bounds, output);
                    } else {
                        MergeRect(output, bounds);
                    }
                }

                total += delta;
            }

            this.skipping = false;
        } else {
            for (i = 0; i < alive.length; i++) {
                bounds = alive[i].getBounds(matrix);

                if (!setFirst) {
                    setFirst = true;
                    CopyFrom(bounds, output);
                } else {
                    MergeRect(output, bounds);
                }
            }
        }

        if (padding > 0) {
            Inflate(output, padding, padding);
        }

        return output;
    }

    createEmitter(): never {
        throw new Error('createEmitter removed. See ParticleEmitter docs for info');
    }

    get particleX(): number { return this.ops.x.current; }
    set particleX(value: any) { this.ops.x.onChange(value); }

    get particleY(): number { return this.ops.y.current; }
    set particleY(value: any) { this.ops.y.onChange(value); }

    get accelerationX(): number { return this.ops.accelerationX.current; }
    set accelerationX(value: any) { this.ops.accelerationX.onChange(value); }

    get accelerationY(): number { return this.ops.accelerationY.current; }
    set accelerationY(value: any) { this.ops.accelerationY.onChange(value); }

    get maxVelocityX(): number { return this.ops.maxVelocityX.current; }
    set maxVelocityX(value: any) { this.ops.maxVelocityX.onChange(value); }

    get maxVelocityY(): number { return this.ops.maxVelocityY.current; }
    set maxVelocityY(value: any) { this.ops.maxVelocityY.onChange(value); }

    get speed(): number { return this.ops.speedX.current; }
    set speed(value: any) {
        this.ops.speedX.onChange(value);
        this.ops.speedY.onChange(value);
    }

    get speedX(): number { return this.ops.speedX.current; }
    set speedX(value: any) { this.ops.speedX.onChange(value); }

    get speedY(): number { return this.ops.speedY.current; }
    set speedY(value: any) { this.ops.speedY.onChange(value); }

    get moveToX(): number { return this.ops.moveToX.current; }
    set moveToX(value: any) { this.ops.moveToX.onChange(value); }

    get moveToY(): number { return this.ops.moveToY.current; }
    set moveToY(value: any) { this.ops.moveToY.onChange(value); }

    get bounce(): number { return this.ops.bounce.current; }
    set bounce(value: any) { this.ops.bounce.onChange(value); }

    get particleScaleX(): number { return this.ops.scaleX.current; }
    set particleScaleX(value: any) { this.ops.scaleX.onChange(value); }

    get particleScaleY(): number { return this.ops.scaleY.current; }
    set particleScaleY(value: any) { this.ops.scaleY.onChange(value); }

    get particleColor(): any { return this.ops.color.current; }
    set particleColor(value: any) { this.ops.color.onChange(value); }

    get colorEase(): string { return this.ops.color.easeName; }
    set colorEase(value: any) { this.ops.color.setEase(value); }

    get particleTint(): number { return this.ops.tint.current; }
    set particleTint(value: any) { this.ops.tint.onChange(value); }

    get particleAlpha(): number { return this.ops.alpha.current; }
    set particleAlpha(value: any) { this.ops.alpha.onChange(value); }

    get lifespan(): number { return this.ops.lifespan.current; }
    set lifespan(value: any) { this.ops.lifespan.onChange(value); }

    get particleAngle(): number { return this.ops.angle.current; }
    set particleAngle(value: any) { this.ops.angle.onChange(value); }

    get particleRotate(): number { return this.ops.rotate.current; }
    set particleRotate(value: any) { this.ops.rotate.onChange(value); }

    get quantity(): number { return this.ops.quantity.current; }
    set quantity(value: any) { this.ops.quantity.onChange(value); }

    get delay(): number { return this.ops.delay.current; }
    set delay(value: any) { this.ops.delay.onChange(value); }

    get hold(): number { return this.ops.hold.current; }
    set hold(value: any) { this.ops.hold.onChange(value); }

    get flowCounter(): number { return this.counters[0]; }
    set flowCounter(value: number) { this.counters[0] = value; }

    get frameCounter(): number { return this.counters[1]; }
    set frameCounter(value: number) { this.counters[1] = value; }

    get animCounter(): number { return this.counters[2]; }
    set animCounter(value: number) { this.counters[2] = value; }

    get elapsed(): number { return this.counters[3]; }
    set elapsed(value: number) { this.counters[3] = value; }

    get stopCounter(): number { return this.counters[4]; }
    set stopCounter(value: number) { this.counters[4] = value; }

    get completeFlag(): number { return this.counters[5]; }
    set completeFlag(value: number) { this.counters[5] = value; }

    get zoneIndex(): number { return this.counters[6]; }
    set zoneIndex(value: number) { this.counters[6] = value; }

    get zoneTotal(): number { return this.counters[7]; }
    set zoneTotal(value: number) { this.counters[7] = value; }

    get currentFrame(): number { return this.counters[8]; }
    set currentFrame(value: number) { this.counters[8] = value; }

    get currentAnim(): number { return this.counters[9]; }
    set currentAnim(value: number) { this.counters[9] = value; }

    preDestroy(): void {
        this.texture = null;
        this.frames = null;
        this.anims = null;
        this.emitCallback = null;
        this.emitCallbackScope = null;
        this.deathCallback = null;
        this.deathCallbackScope = null;
        this.emitZones = null;
        this.deathZones = null;
        (this as any).bounds = null;
        this.follow = null;
        this.counters = null;

        let i: number;

        const ops = this.ops;

        for (i = 0; i < configOpMap.length; i++) {
            const key = configOpMap[i];
            ops[key].destroy();
        }

        for (i = 0; i < this.alive.length; i++) {
            this.alive[i].destroy();
        }

        for (i = 0; i < this.dead.length; i++) {
            this.dead[i].destroy();
        }

        this.ops = null;
        this.alive = [];
        this.dead = [];
        this.worldMatrix.destroy();
    }

    particleClass: any;
    config: any;
    ops: any;
    radial: boolean;
    gravityX: number;
    gravityY: number;
    acceleration: boolean;
    moveTo: boolean;
    emitCallback: any;
    emitCallbackScope: any;
    deathCallback: any;
    deathCallbackScope: any;
    maxParticles: number;
    maxAliveParticles: number;
    stopAfter: number;
    duration: number;
    frequency: number;
    emitting: boolean;
    particleBringToTop: boolean;
    timeScale: number;
    emitZones: any[];
    deathZones: any[];
    viewBounds: any;
    follow: any;
    followOffset: Vector2;
    trackVisible: boolean;
    frames: any[];
    randomFrame: boolean;
    frameQuantity: number;
    anims: string[];
    randomAnim: boolean;
    animQuantity: number;
    dead: Particle[];
    alive: Particle[];
    counters: Float32Array;
    skipping: boolean;
    worldMatrix: TransformMatrix;
    sortProperty: string;
    sortOrderAsc: boolean;
    sortCallback: any;
    processors: List;
    tintFill: number;
}
