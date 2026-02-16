/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';
import { AnimationState } from '../../animations/AnimationState';
import { DefaultRopeNodes } from '../../renderer/webgl/renderNodes/defaults/DefaultRopeNodes';
import { Mixin } from '../../utils/MixinTS';
import { AlphaSingle } from '../components/AlphaSingle';
import { BlendMode } from '../components/BlendMode';
import { Depth } from '../components/Depth';
import { Flip } from '../components/Flip';
import { Mask } from '../components/Mask';
import { RenderNodes } from '../components/RenderNodes';
import { Size } from '../components/Size';
import { Texture } from '../components/Texture';
import { Transform } from '../components/Transform';
import { Visible } from '../components/Visible';
import { ScrollFactor } from '../components/ScrollFactor';
import * as RopeRender from './RopeRender';
import { TintModes } from '../../renderer/TintModes';

const GameObject = require('../GameObject');

export interface Rope extends
    AlphaSingle,
    BlendMode,
    Depth,
    Flip,
    Mask,
    RenderNodes,
    Size,
    Texture,
    Transform,
    Visible,
    ScrollFactor {}

export class Rope extends GameObject
{
    anims: any;
    points: any;
    vertices: Float32Array | null;
    uv: Float32Array | null;
    colors: Uint32Array | null;
    alphas: Float32Array | null;
    tintFill: number;
    dirty: boolean;
    horizontal: boolean;
    _flipX: boolean;
    _flipY: boolean;
    _perp: Vector2;
    debugCallback: Function | null;
    debugGraphic: any;

    static
    {
        Mixin(this, [
            AlphaSingle,
            BlendMode,
            Depth,
            Flip,
            Mask,
            RenderNodes,
            Size,
            Texture,
            Transform,
            Visible,
            ScrollFactor,
            RopeRender
        ]);
    }

    constructor (scene: any, x: number, y: number, texture: string = '__DEFAULT', frame?: string | number | null, points: number | any[] = 2, horizontal: boolean = true, colors?: number[] | number, alphas?: number[] | number)
    {
        super(scene, 'Rope');

        this.anims = new AnimationState(this);
        this.points = points;
        this.vertices = null;
        this.uv = null;
        this.colors = null;
        this.alphas = null;
        this.tintFill = (texture === '__DEFAULT') ? TintModes.FILL : TintModes.MULTIPLY;
        this.dirty = false;
        this.horizontal = horizontal;
        this._flipX = false;
        this._flipY = false;
        this._perp = new Vector2();
        this.debugCallback = null;
        this.debugGraphic = null;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.initRenderNodes(this._defaultRenderNodesMap);

        if (Array.isArray(points))
        {
            this.resizeArrays(points.length);
        }

        this.setPoints(points, colors, alphas);
        this.updateVertices();
    }

    get _defaultRenderNodesMap (): any
    {
        return DefaultRopeNodes;
    }

    //  Overrides Game Object method
    addedToScene (): void
    {
        this.scene.sys.updateList.add(this);
    }

    //  Overrides Game Object method
    removedFromScene (): void
    {
        this.scene.sys.updateList.remove(this);
    }

    preUpdate (time: number, delta: number): void
    {
        const prevFrame = this.anims.currentFrame;

        this.anims.update(time, delta);

        if (this.anims.currentFrame !== prevFrame)
        {
            this.updateUVs();
            this.updateVertices();
        }
    }

    play (key: string, ignoreIfPlaying?: boolean, startFrame?: number): this
    {
        this.anims.play(key, ignoreIfPlaying, startFrame);

        return this;
    }

    setDirty (): this
    {
        this.dirty = true;

        return this;
    }

    setHorizontal (points?: number | any[], colors?: number | number[], alphas?: number | number[]): this
    {
        if (points === undefined) { points = this.points.length; }

        if (this.horizontal)
        {
            return this;
        }

        this.horizontal = true;

        return this.setPoints(points, colors, alphas);
    }

    setVertical (points?: number | any[], colors?: number | number[], alphas?: number | number[]): this
    {
        if (points === undefined) { points = this.points.length; }

        if (!this.horizontal)
        {
            return this;
        }

        this.horizontal = false;

        return this.setPoints(points, colors, alphas);
    }

    setTintFill (value: number = TintModes.MULTIPLY): this
    {
        this.tintFill = value;

        return this;
    }

    setAlphas (alphas?: number | number[], bottomAlpha?: number): this
    {
        const total = this.points.length;

        if (total < 1)
        {
            return this;
        }

        const currentAlphas = this.alphas as Float32Array;

        if (alphas === undefined)
        {
            alphas = [ 1 ];
        }
        else if (!Array.isArray(alphas) && bottomAlpha === undefined)
        {
            alphas = [ alphas ];
        }

        let index = 0;

        if (bottomAlpha !== undefined && !Array.isArray(alphas))
        {
            for (let i = 0; i < total; i++)
            {
                index = i * 2;

                currentAlphas[index] = alphas;
                currentAlphas[index + 1] = bottomAlpha;
            }
        }
        else if (Array.isArray(alphas) && alphas.length === total)
        {
            for (let i = 0; i < total; i++)
            {
                index = i * 2;

                currentAlphas[index] = alphas[i];
                currentAlphas[index + 1] = alphas[i];
            }
        }
        else if (Array.isArray(alphas))
        {
            let prevAlpha = alphas[0];

            for (let i = 0; i < total; i++)
            {
                index = i * 2;

                if (alphas.length > index)
                {
                    prevAlpha = alphas[index];
                }

                currentAlphas[index] = prevAlpha;

                if (alphas.length > index + 1)
                {
                    prevAlpha = alphas[index + 1];
                }

                currentAlphas[index + 1] = prevAlpha;
            }
        }

        return this;
    }

    setColors (colors?: number | number[]): this
    {
        const total = this.points.length;

        if (total < 1)
        {
            return this;
        }

        const currentColors = this.colors as Uint32Array;

        if (colors === undefined)
        {
            colors = [ 0xffffff ];
        }
        else if (!Array.isArray(colors))
        {
            colors = [ colors ];
        }

        let index = 0;

        if (colors.length === total)
        {
            for (let i = 0; i < total; i++)
            {
                index = i * 2;

                currentColors[index] = colors[i];
                currentColors[index + 1] = colors[i];
            }
        }
        else
        {
            let prevColor = colors[0];

            for (let i = 0; i < total; i++)
            {
                index = i * 2;

                if (colors.length > index)
                {
                    prevColor = colors[index];
                }

                currentColors[index] = prevColor;

                if (colors.length > index + 1)
                {
                    prevColor = colors[index + 1];
                }

                currentColors[index + 1] = prevColor;
            }
        }

        return this;
    }

    setPoints (points: number | any[] = 2, colors?: number | number[] | null, alphas?: number | number[] | null): this
    {
        if (typeof points === 'number')
        {
            let segments = points;

            if (segments < 2)
            {
                segments = 2;
            }

            const generated: any[] = [];

            let frameSegment;
            let offset;

            if (this.horizontal)
            {
                offset = -(this.frame.halfWidth);
                frameSegment = this.frame.width / (segments - 1);

                for (let s = 0; s < segments; s++)
                {
                    generated.push({ x: offset + s * frameSegment, y: 0 });
                }
            }
            else
            {
                offset = -(this.frame.halfHeight);
                frameSegment = this.frame.height / (segments - 1);

                for (let s = 0; s < segments; s++)
                {
                    generated.push({ x: 0, y: offset + s * frameSegment });
                }
            }

            points = generated;
        }

        let total = points.length;
        const currentTotal = this.points.length;

        if (total < 1)
        {
            console.warn('Rope: Not enough points given');

            return this;
        }
        else if (total === 1)
        {
            points.unshift({ x: 0, y: 0 });
            total++;
        }

        if (currentTotal !== total)
        {
            this.resizeArrays(total);
        }

        this.dirty = true;
        this.points = points;

        this.updateUVs();

        if (colors !== undefined && colors !== null)
        {
            this.setColors(colors);
        }

        if (alphas !== undefined && alphas !== null)
        {
            this.setAlphas(alphas);
        }

        return this;
    }

    updateUVs (): this
    {
        const currentUVs = this.uv as Float32Array;
        const total = this.points.length;

        const u0 = this.frame.u0;
        const v0 = this.frame.v0;
        const u1 = this.frame.u1;
        const v1 = this.frame.v1;

        const partH = (u1 - u0) / (total - 1);
        const partV = (v1 - v0) / (total - 1);

        for (let i = 0; i < total; i++)
        {
            const index = i * 4;

            let uv0;
            let uv1;
            let uv2;
            let uv3;

            if (this.horizontal)
            {
                if (this._flipX)
                {
                    uv0 = u1 - (i * partH);
                    uv2 = u1 - (i * partH);
                }
                else
                {
                    uv0 = u0 + (i * partH);
                    uv2 = u0 + (i * partH);
                }

                if (this._flipY)
                {
                    uv1 = v1;
                    uv3 = v0;
                }
                else
                {
                    uv1 = v0;
                    uv3 = v1;
                }
            }
            else
            {
                if (this._flipX)
                {
                    uv0 = u0;
                    uv2 = u1;
                }
                else
                {
                    uv0 = u1;
                    uv2 = u0;
                }

                if (this._flipY)
                {
                    uv1 = v1 - (i * partV);
                    uv3 = v1 - (i * partV);
                }
                else
                {
                    uv1 = v0 + (i * partV);
                    uv3 = v0 + (i * partV);
                }
            }

            currentUVs[index + 0] = uv0;
            currentUVs[index + 1] = uv1;
            currentUVs[index + 2] = uv2;
            currentUVs[index + 3] = uv3;
        }

        return this;
    }

    resizeArrays (newSize: number): this
    {
        this.vertices = new Float32Array(newSize * 4);
        this.uv = new Float32Array(newSize * 4);

        const colors = new Uint32Array(newSize * 2);
        const alphas = new Float32Array(newSize * 2);

        for (let i = 0; i < newSize * 2; i++)
        {
            colors[i] = 0xffffff;
            alphas[i] = 1;
        }

        this.colors = colors;
        this.alphas = alphas;

        //  updateVertices during next render
        this.dirty = true;

        return this;
    }

    updateVertices (): this
    {
        const perp = this._perp;
        const points = this.points;
        const vertices = this.vertices as Float32Array;

        const total = points.length;

        this.dirty = false;

        if (total < 1)
        {
            return this;
        }

        let nextPoint;
        let lastPoint = points[0];

        const frameSize = this.horizontal ? this.frame.halfHeight : this.frame.halfWidth;

        for (let i = 0; i < total; i++)
        {
            const point = points[i];
            const index = i * 4;

            if (i < total - 1)
            {
                nextPoint = points[i + 1];
            }
            else
            {
                nextPoint = point;
            }

            perp.x = nextPoint.y - lastPoint.y;
            perp.y = -(nextPoint.x - lastPoint.x);

            const perpLength = perp.length();

            perp.x /= perpLength;
            perp.y /= perpLength;

            perp.x *= frameSize;
            perp.y *= frameSize;

            vertices[index] = point.x + perp.x;
            vertices[index + 1] = point.y + perp.y;
            vertices[index + 2] = point.x - perp.x;
            vertices[index + 3] = point.y - perp.y;

            lastPoint = point;
        }

        return this;
    }

    setDebug (graphic?: any, callback?: Function): this
    {
        this.debugGraphic = graphic || null;

        if (!graphic && !callback)
        {
            this.debugCallback = null;
        }
        else if (!callback)
        {
            this.debugCallback = this.renderDebugVerts;
        }
        else
        {
            this.debugCallback = callback;
        }

        return this;
    }

    renderDebugVerts (src: any, meshLength: number, verts: number[]): void
    {
        const graphic = src.debugGraphic;

        let px0 = verts[0];
        let py0 = verts[1];
        let px1 = verts[2];
        let py1 = verts[3];

        graphic.lineBetween(px0, py0, px1, py1);

        for (let i = 4; i < meshLength; i += 4)
        {
            const x0 = verts[i + 0];
            const y0 = verts[i + 1];
            const x1 = verts[i + 2];
            const y1 = verts[i + 3];

            graphic.lineBetween(px0, py0, x0, y0);
            graphic.lineBetween(px1, py1, x1, y1);
            graphic.lineBetween(px1, py1, x0, y0);
            graphic.lineBetween(x0, y0, x1, y1);

            px0 = x0;
            py0 = y0;
            px1 = x1;
            py1 = y1;
        }
    }

    preDestroy (): void
    {
        this.anims.destroy();
        this.anims = undefined;

        this.points = null;
        this.vertices = null;
        this.uv = null;
        this.colors = null;
        this.alphas = null;

        this.debugCallback = null;
        this.debugGraphic = null;
    }

    get flipX (): boolean
    {
        return this._flipX;
    }

    set flipX (value: boolean)
    {
        this._flipX = value;
        this.updateUVs();
    }

    get flipY (): boolean
    {
        return this._flipY;
    }

    set flipY (value: boolean)
    {
        this._flipY = value;
        this.updateUVs();
    }
}
