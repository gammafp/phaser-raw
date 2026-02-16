// @ts-nocheck

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import { AlphaSingle } from '../components/AlphaSingle';
import { BlendMode } from '../components/BlendMode';
import { Depth } from '../components/Depth';
import { GetBounds } from '../components/GetBounds';
import { Mask } from '../components/Mask';
import { Origin } from '../components/Origin';
import { RenderNodes } from '../components/RenderNodes';
import { ScrollFactor } from '../components/ScrollFactor';
import { Texture } from '../components/Texture';
import { Transform } from '../components/Transform';
import { Visible } from '../components/Visible';
import { NineSliceRender } from './NineSliceRender';
import { NineSliceVertex } from './NineSliceVertex';

const DefaultNineSliceNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultQuadNodes');
const GameObject = require('../GameObject');
const TintModes = require('../../renderer/TintModes');

export interface NineSlice extends AlphaSingle, BlendMode, Depth, GetBounds, Mask, Origin, RenderNodes, ScrollFactor, Texture, Transform, Visible, NineSliceRender {}

export class NineSlice extends GameObject {
    static
    {
        Mixin(this, [
            AlphaSingle,
            BlendMode,
            Depth,
            GetBounds,
            Mask,
            Origin,
            RenderNodes,
            ScrollFactor,
            Texture,
            Transform,
            Visible,
            NineSliceRender
        ]);
    }

    constructor(scene, x, y, texture, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight)
    {
        super(scene, 'NineSlice');

        this._width = undefined;
        this._height = undefined;
        this._originX = 0.5;
        this._originY = 0.5;
        this._sizeComponent = true;

        this.vertices = [];
        this.leftWidth = undefined;
        this.rightWidth = undefined;
        this.topHeight = undefined;
        this.bottomHeight = undefined;
        this.tint = 0xffffff;
        this.tintFill = TintModes.MULTIPLY;

        const textureFrame = scene.textures.getFrame(texture, frame);

        this.is3Slice = (!topHeight && !bottomHeight);

        if (textureFrame && textureFrame.scale9)
        {
            this.is3Slice = textureFrame.is3Slice;
        }

        const size = this.is3Slice ? 18 : 54;

        for (let i = 0; i < size; i++)
        {
            this.vertices.push(new NineSliceVertex());
        }

        this.setPosition(x, y);
        this.setTexture(texture, frame);
        this.setSlices(width, height, leftWidth, rightWidth, topHeight, bottomHeight, false);
        this.updateDisplayOrigin();
        this.initRenderNodes(this._defaultRenderNodesMap);
    }

    get _defaultRenderNodesMap()
    {
        return DefaultNineSliceNodes;
    }

    setSlices(width, height, leftWidth, rightWidth, topHeight, bottomHeight, skipScale9)
    {
        if (leftWidth === undefined) { leftWidth = 10; }
        if (rightWidth === undefined) { rightWidth = 10; }
        if (topHeight === undefined) { topHeight = 0; }
        if (bottomHeight === undefined) { bottomHeight = 0; }
        if (skipScale9 === undefined) { skipScale9 = false; }

        const frame = this.frame;
        let sliceChange = false;

        if (this.is3Slice && skipScale9 && topHeight !== 0 && bottomHeight !== 0)
        {
            sliceChange = true;
        }

        if (sliceChange)
        {
            console.warn('Cannot change 9 slice to 3 slice');
            return this;
        }

        if (frame && frame.scale9 && !skipScale9)
        {
            const data = frame.data.scale9Borders;
            const x = data.x;
            const y = data.y;

            leftWidth = x;
            rightWidth = frame.width - data.w - x;
            topHeight = y;
            bottomHeight = frame.height - data.h - y;

            if (width === undefined) { width = frame.width; }
            if (height === undefined) { height = frame.height; }
        }
        else
        {
            if (width === undefined) { width = 256; }
            if (height === undefined) { height = 256; }
        }

        this._width = width;
        this._height = height;
        this.leftWidth = leftWidth;
        this.rightWidth = rightWidth;
        this.topHeight = topHeight;
        this.bottomHeight = bottomHeight;

        if (this.is3Slice)
        {
            height = frame.height;
            this._height = height;
            this.topHeight = height;
            this.bottomHeight = 0;
        }

        this.updateVertices();
        this.updateUVs();

        return this;
    }

    updateUVs()
    {
        const left = this.leftWidth;
        const right = this.rightWidth;
        const top = this.topHeight;
        const bot = this.bottomHeight;

        const width = this.frame.width;
        const height = this.frame.height;

        this.updateQuadUVs(0, 0, 0, left / width, top / height);
        this.updateQuadUVs(6, left / width, 0, 1 - (right / width), top / height);
        this.updateQuadUVs(12, 1 - (right / width), 0, 1, top / height);

        if (!this.is3Slice)
        {
            this.updateQuadUVs(18, 0, top / height, left / width, 1 - (bot / height));
            this.updateQuadUVs(24, left / width, top / height, 1 - right / width, 1 - (bot / height));
            this.updateQuadUVs(30, 1 - right / width, top / height, 1, 1 - (bot / height));
            this.updateQuadUVs(36, 0, 1 - bot / height, left / width, 1);
            this.updateQuadUVs(42, left / width, 1 - bot / height, 1 - right / width, 1);
            this.updateQuadUVs(48, 1 - right / width, 1 - bot / height, 1, 1);
        }
    }

    updateVertices()
    {
        const left = this.leftWidth;
        const right = this.rightWidth;
        const top = this.topHeight;
        const bot = this.bottomHeight;

        const width = this.width;
        const height = this.height;

        this.updateQuad(0, -0.5, 0.5, -0.5 + (left / width), 0.5 - (top / height));
        this.updateQuad(6, -0.5 + (left / width), 0.5, 0.5 - (right / width), 0.5 - (top / height));
        this.updateQuad(12, 0.5 - (right / width), 0.5, 0.5, 0.5 - (top / height));

        if (!this.is3Slice)
        {
            this.updateQuad(18, -0.5, 0.5 - (top / height), -0.5 + (left / width), -0.5 + (bot / height));
            this.updateQuad(24, -0.5 + (left / width), 0.5 - (top / height), 0.5 - (right / width), -0.5 + (bot / height));
            this.updateQuad(30, 0.5 - (right / width), 0.5 - (top / height), 0.5, -0.5 + (bot / height));
            this.updateQuad(36, -0.5, -0.5 + (bot / height), -0.5 + (left / width), -0.5);
            this.updateQuad(42, -0.5 + (left / width), -0.5 + (bot / height), 0.5 - (right / width), -0.5);
            this.updateQuad(48, 0.5 - (right / width), -0.5 + (bot / height), 0.5, -0.5);
        }
    }

    updateQuad(offset, x1, y1, x2, y2)
    {
        const width = this.width;
        const height = this.height;
        const originX = this.originX;
        const originY = this.originY;
        const verts = this.vertices;

        verts[offset + 0].resize(x1, y1, width, height, originX, originY);
        verts[offset + 1].resize(x1, y2, width, height, originX, originY);
        verts[offset + 2].resize(x2, y1, width, height, originX, originY);
        verts[offset + 3].resize(x1, y2, width, height, originX, originY);
        verts[offset + 4].resize(x2, y2, width, height, originX, originY);
        verts[offset + 5].resize(x2, y1, width, height, originX, originY);
    }

    updateQuadUVs(offset, u1, v1, u2, v2)
    {
        const verts = this.vertices;
        const frame = this.frame;
        const fu1 = frame.u0;
        const fv1 = frame.v0;
        const fu2 = frame.u1;
        const fv2 = frame.v1;

        if (fu1 !== 0 || fu2 !== 1)
        {
            const udiff = fu2 - fu1;
            u1 = fu1 + u1 * udiff;
            u2 = fu1 + u2 * udiff;
        }

        if (fv1 !== 0 || fv2 !== 1)
        {
            const vdiff = fv2 - fv1;
            v1 = fv1 + v1 * vdiff;
            v2 = fv1 + v2 * vdiff;
        }

        verts[offset + 0].setUVs(u1, v1);
        verts[offset + 1].setUVs(u1, v2);
        verts[offset + 2].setUVs(u2, v1);
        verts[offset + 3].setUVs(u1, v2);
        verts[offset + 4].setUVs(u2, v2);
        verts[offset + 5].setUVs(u2, v1);
    }

    clearTint()
    {
        this.setTint(0xffffff);
        this.setTintFill();

        return this;
    }

    setTint(color)
    {
        if (color === undefined) { color = 0xffffff; }

        this.tint = color;

        return this;
    }

    setTintFill(mode)
    {
        if (mode === undefined) { mode = TintModes.MULTIPLY; }

        this.tintFill = mode;

        return this;
    }

    get isTinted()
    {
        return (this.tint !== 0xffffff || this.tintFill !== TintModes.MULTIPLY);
    }

    get width()
    {
        return this._width;
    }

    set width(value)
    {
        this._width = Math.max(value, this.leftWidth + this.rightWidth);
        this.updateVertices();
    }

    get height()
    {
        return this._height;
    }

    set height(value)
    {
        if (!this.is3Slice)
        {
            this._height = Math.max(value, this.topHeight + this.bottomHeight);
            this.updateVertices();
        }
    }

    get displayWidth()
    {
        return this.scaleX * this.width;
    }

    set displayWidth(value)
    {
        this.scaleX = value / this.width;
    }

    get displayHeight()
    {
        return this.scaleY * this.height;
    }

    set displayHeight(value)
    {
        this.scaleY = value / this.height;
    }

    setSize(width, height)
    {
        this.width = width;
        this.height = height;

        this.updateDisplayOrigin();

        const input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = this.width;
            input.hitArea.height = this.height;
        }

        return this;
    }

    setDisplaySize(width, height)
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

    get originX()
    {
        return this._originX;
    }

    set originX(value)
    {
        this._originX = value;
        this.updateVertices();
    }

    get originY()
    {
        return this._originY;
    }

    set originY(value)
    {
        this._originY = value;
        this.updateVertices();
    }

    setOrigin(x, y)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = x; }

        this._originX = x;
        this._originY = y;

        this.updateVertices();

        return this.updateDisplayOrigin();
    }

    setSizeToFrame()
    {
        if (this.is3Slice)
        {
            const height = this.frame.height;

            this._height = height;
            this.topHeight = height;
            this.bottomHeight = 0;
        }

        this.updateUVs();

        return this;
    }

    preDestroy()
    {
        this.vertices = [];
    }
}
