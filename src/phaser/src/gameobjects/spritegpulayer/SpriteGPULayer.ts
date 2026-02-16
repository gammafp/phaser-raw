/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import { Alpha } from '../components/Alpha';
import { BlendMode } from '../components/BlendMode';
import { Depth } from '../components/Depth';
import { ElapseTimer } from '../components/ElapseTimer';
import { Lighting } from '../components/Lighting';
import { Mask } from '../components/Mask';
import { RenderNodes } from '../components/RenderNodes';
import { TextureCrop } from '../components/TextureCrop';
import { Visible } from '../components/Visible';
import { renderWebGL, renderCanvas } from './SpriteGPULayerRender';
import { EasingEncoding } from './EasingEncoding';
import { EasingNaming } from './EasingNaming';

var GameObject = require('../GameObject');
var SubmitterSpriteGPULayer = require('../../renderer/webgl/renderNodes/submitter/SubmitterSpriteGPULayer');
var Utils = require('../../renderer/webgl/Utils');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * A SpriteGPULayer GameObject. This is a WebGL only GameObject.
 * It is optimized for rendering very large numbers of quads
 * following simple tween animations.
 * It is suited to complex backgrounds with animation.
 *
 * A SpriteGPULayer is a composite object that contains a collection of
 * Member objects. It stores the rendering data for these
 * objects in a GPU buffer, and renders them in a single draw call.
 * Because it only updates the GPU buffer when necessary,
 * it is up to 100 times faster than rendering the objects individually.
 * Avoid changing the contents of the SpriteGPULayer frequently, as this
 * requires the whole buffer to be updated.
 *
 * @class SpriteGPULayer
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @webglOnly
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.ElapseTimer
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Scene} scene - The Scene to which this SpriteGPULayer belongs.
 * @param {Phaser.Textures.Texture} texture - The texture that will be used to render the SpriteGPULayer.
 * @param {number} size - The maximum number of quads that this SpriteGPULayer will hold.
 */

export interface SpriteGPULayer extends
    Alpha,
    BlendMode,
    Depth,
    ElapseTimer,
    Lighting,
    Mask,
    RenderNodes,
    TextureCrop,
    Visible {}

export class SpriteGPULayer extends GameObject
{
    static
    {
        Mixin(this, [
            Alpha,
            BlendMode,
            Depth,
            ElapseTimer,
            Lighting,
            Mask,
            RenderNodes,
            TextureCrop,
            Visible,
            { renderWebGL, renderCanvas }
        ]);
    }

    memberCount: number;
    size: number;
    _segments: number;
    MAX_BUFFER_UPDATE_SEGMENTS_FULL: number;
    bufferUpdateSegments: number;
    bufferUpdateSegmentSize: number;
    gravity: number;
    _animationsEnabled: Record<string, boolean>;
    EASE: Record<string, number>;
    EASE_CODES: Record<number, string>;
    frameDataTexture: any;
    frameDataIndices: Record<string, number>;
    frameDataIndicesInv: Record<number, string>;
    animationData: any[];
    animationDataNames: Record<string, any>;
    animationDataIndices: Record<number, any>;
    submitterNode: any;
    nextMember: ArrayBuffer;
    nextMemberF32: Float32Array;
    nextMemberU32: Uint32Array;

    constructor (scene: any, texture: any, size: number)
    {
        super(scene, 'SpriteGPULayer');

        this.memberCount = 0;

        this.size = Math.max(size, 0);

        this._segments = 24;

        this.MAX_BUFFER_UPDATE_SEGMENTS_FULL = 0xffffff;

        this.bufferUpdateSegments = 0;

        this.bufferUpdateSegmentSize = Math.ceil(this.size / this._segments);

        this.gravity = 1024;

        this._animationsEnabled = {};

        var animations = Object.keys(EasingEncoding);
        var animLen = animations.length;
        for (var i = 0; i < animLen; i++)
        {
            this._animationsEnabled[animations[i]] = false;
        }

        this.EASE = EasingEncoding;

        this.EASE_CODES = EasingNaming;

        this.setTexture(texture);
        this.initRenderNodes(new Phaser.Structs.Map());

        this.frameDataTexture = null;

        this.frameDataIndices = {};

        this.frameDataIndicesInv = {};

        this.animationData = [];

        this.animationDataNames = {};

        this.animationDataIndices = {};

        this.generateFrameDataTexture();

        this.submitterNode = new SubmitterSpriteGPULayer(scene.renderer.renderNodes, {}, this);

        this.defaultRenderNodes['Submitter'] = this.submitterNode;
        this.renderNodeData[this.submitterNode.name] = {};

        this.resize(this.size);

        this.nextMember = new ArrayBuffer(this.getDataByteSize());

        this.nextMemberF32 = new Float32Array(this.nextMember);

        this.nextMemberU32 = new Uint32Array(this.nextMember);
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
        this.updateTimer(time, delta);
    }

    /**
     * Get the number of bytes used to define a member.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#getDataByteSize
     * @returns {number} The number of bytes used for each member.
     */
    getDataByteSize (): number
    {
        return this.submitterNode.instanceBufferLayout.layout.stride;
    }

    /**
     * Return a list of features to enable in the shader program.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#getShaderFeatures
     * @since 4.0.0
     * @return {string[]} An array of features to enable in the shader program.
     */
    getShaderFeatures (): string[]
    {
        var features: string[] = [];

        // Add enabled animations.
        var animations = Object.keys(this._animationsEnabled);
        var animLen = animations.length;
        for (var i = 0; i < animLen; i++)
        {
            if (this._animationsEnabled[animations[i]])
            {
                features.push(animations[i]);
            }
        }

        return features;
    }

    /**
     * Set the animations available to the SpriteGPULayer.
     * This will call `generateFrameDataTexture` to regenerate
     * `frameDataTexture`.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#setAnimations
     * @since 4.0.0
     * @param {Phaser.Animations.Animation[]|Phaser.Types.GameObjects.SpriteGPULayer.SetAnimation[]} animations - An array of animations to set.
     * @returns {this} This SpriteGPULayer object.
     */
    setAnimations (animations: any[]): this
    {
        var animLen = animations.length;

        // Animation frames will start after the texture frames.
        var frameNames = this.texture.getFrameNames(true);
        var index = frameNames.length;

        for (var i = 0; i < animLen; i++)
        {
            var anim = animations[i];
            var data: any = {};
            if (anim.key)
            {
                // This is a Phaser.Animations.Animation class.
                data.name = anim.key;
                data.duration = anim.duration;
                data.frames = anim.frames;
            }
            else
            {
                data.name = anim.name;
                data.duration = anim.duration;
                data.frames = anim.frames.slice();
            }

            // Add frame indexing data.
            data.index = index;
            data.frameCount = data.frames.length;
            index += data.frameCount;

            // Store animation.
            this.animationData.push(data);
            this.animationDataNames[data.name] = data;
            this.animationDataIndices[data.index] = data;
        }

        this.generateFrameDataTexture();

        return this;
    }

    /**
     * Generate `frameDataTexture` for the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#generateFrameDataTexture
     * @since 4.0.0
     */
    generateFrameDataTexture (): void
    {
        // Get the frame data.
        var texture = this.texture;
        var frames = texture.getFrameNames(true);
        var frameLen = frames.length;

        // Update the frame data indices.
        this.frameDataIndices = {};
        this.frameDataIndicesInv = {};
        var frame;
        for (var i = 0; i < frameLen; i++)
        {
            var frameName = frames[i];
            frame = texture.get(frameName);
            this.frameDataIndices[frameName] = i;
            this.frameDataIndicesInv[i] = frameName;
        }

        // Append frames from animations.
        var anims = this.animationData;
        var animsLen = anims.length;
        for (i = 0; i < animsLen; i++)
        {
            var anim = this.animationData[i];
            var frameCount = anim.frameCount;
            for (var j = 0; j < frameCount; j++)
            {
                frames.push(anim.frames[j]);
            }
        }

        frameLen = frames.length;
        var valuesPerFrame = 3;
        var pixelCount = frameLen * valuesPerFrame;
        var width = Math.min(pixelCount, 4096);
        var height = Math.ceil(pixelCount / 4096);
        var dataSize = width * height * 4;

        var textureManager = texture.manager;

        // Generate a Uint8Array with the frame data.
        var data = new ArrayBuffer(dataSize);
        var u16 = new Uint16Array(data);
        var u8 = new Uint8Array(data);
        for (i = 0; i < frameLen; i++)
        {
            var animFrame = frames[i];
            if (typeof animFrame === 'string')
            {
                frame = texture.get(frames[i]);
            }
            else if (animFrame && animFrame.key !== undefined)
            {
                // animFrame comes from a SetAnimation object.
                var animTexture = textureManager.get(animFrame.key);
                frame = animTexture.get(animFrame.frame);
            }
            else
            {
                // animFrame is an AnimationFrame object.
                frame = animFrame.frame;
            }

            var offset = i * valuesPerFrame * u16.BYTES_PER_ELEMENT;

            // Position
            u16[offset] = frame.cutX;
            u16[offset + 1] = frame.cutY;

            // Size
            u16[offset + 2] = frame.cutWidth;
            u16[offset + 3] = frame.cutHeight;

            // Pivot offset
            var pivotX = 0.5;
            var pivotY = 0.5;
            if (frame.customPivot)
            {
                pivotX = frame.pivotX;
                pivotY = frame.pivotY;
            }
            u16[offset + 4] = Math.round((pivotX - 0.5) * frame.cutWidth) + 32768;
            u16[offset + 5] = Math.round((pivotY - 0.5) * frame.cutHeight) + 32768;
        }

        // Create or update a texture with the frame data.
        if (this.frameDataTexture)
        {
            this.frameDataTexture.destroy();
        }
        this.frameDataTexture = this.scene.renderer.createUint8ArrayTexture(u8, width, height, false, false);
    }

    /**
     * Resizes the SpriteGPULayer buffer to a new size.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#resize
     * @since 4.0.0
     * @param {number} count - The new number of members in the SpriteGPULayer.
     * @param {boolean} [clear=false] - Whether to clear the buffer.
     * @returns {this} This SpriteGPULayer object.
     */
    resize (count: number, clear?: boolean): this
    {
        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var u8 = buffer.viewU8;
        var targetByteSize = count * layout.layout.stride;

        this.size = count;

        buffer.resize(targetByteSize);

        if (clear)
        {
            this.memberCount = 0;
        }
        else
        {
            // Copy data from the old buffer to the new buffer.
            var newBuffer = buffer.viewU8;
            newBuffer.set(u8.subarray(0, Math.min(newBuffer.byteLength, targetByteSize)));
            this.memberCount = Math.min(this.memberCount, count);
        }

        this.bufferUpdateSegmentSize = Math.ceil(this.size / this._segments);
        this.setAllSegmentsNeedUpdate();

        return this;
    }

    /**
     * Sets a segment of the buffer to require an update.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#setSegmentNeedsUpdate
     * @since 4.0.0
     * @param {number} index - The index at which an update occurred.
     */
    setSegmentNeedsUpdate (index: number): void
    {
        if (
            index < 0 ||
            index >= this.size ||
            this.bufferUpdateSegments === this.MAX_BUFFER_UPDATE_SEGMENTS_FULL
        )
        {
            return;
        }
        var segment = Math.floor(index / this.bufferUpdateSegmentSize);
        this.bufferUpdateSegments |= (1 << segment);
    }

    /**
     * Sets all segments of the buffer to require an update.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#setAllSegmentsNeedUpdate
     * @since 4.0.0
     */
    setAllSegmentsNeedUpdate (): void
    {
        this.bufferUpdateSegments = this.MAX_BUFFER_UPDATE_SEGMENTS_FULL;
    }

    /**
     * Clears all segments of the buffer that require an update.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#clearAllSegmentsNeedUpdate
     * @since 4.0.0
     */
    clearAllSegmentsNeedUpdate (): void
    {
        this.bufferUpdateSegments = 0;
    }

    /**
     * Adds data to the SpriteGPULayer buffer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#addData
     * @since 4.0.0
     * @param {Float32Array} member - The raw data to add to the buffer.
     * @returns {this} This SpriteGPULayer object.
     */
    addData (member: Float32Array): this
    {
        if (this.memberCount >= this.size)
        {
            return this;
        }

        var layout = this.submitterNode.instanceBufferLayout;
        var f32 = layout.buffer.viewF32;
        var offset = this.memberCount * layout.layout.stride;

        f32.set(member, offset / f32.BYTES_PER_ELEMENT);

        this.setSegmentNeedsUpdate(this.memberCount);
        this.memberCount++;

        return this;
    }

    /**
     * Adds a member to the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#addMember
     * @since 4.0.0
     * @param {Partial<Phaser.Types.GameObjects.SpriteGPULayer.Member>} [member] - The member to add.
     * @returns {this} This SpriteGPULayer object.
     */
    addMember (member?: any): this
    {
        if (this.memberCount >= this.size)
        {
            return this;
        }

        var f32 = this.nextMemberF32;
        var u32 = this.nextMemberU32;

        if (!member)
        {
            member = {};
        }

        var frame: any = this.frame;
        if (member.frame !== undefined)
        {
            frame = member.frame.base ? member.frame.base : member.frame;
        }
        if (typeof frame === 'string')
        {
            frame = this.texture.get(frame);

            if (!frame)
            {
                return this;
            }
        }

        var offset = 0;

        this._setAnimatedValue(member.x, offset);
        offset += 4;

        this._setAnimatedValue(member.y, offset);
        offset += 4;

        this._setAnimatedValue(member.rotation, offset);
        offset += 4;

        this._setAnimatedValue(member.scaleX, offset, 1);
        offset += 4;

        this._setAnimatedValue(member.scaleY, offset, 1);
        offset += 4;

        this._setAnimatedValue(member.alpha, offset, 1);
        offset += 4;

        var animation = member.animation;
        if (animation)
        {
            // Use frame animation.
            var animData;
            if (
                (typeof animation === 'string') ||
                (typeof animation === 'number')
            )
            {
                if (typeof animation === 'string')
                {
                    animData = this.animationDataNames[animation];
                }
                else
                {
                    animData = this.animationDataIndices[animation];
                }
                this._setAnimatedValue({
                    base: animData.index,
                    amplitude: animData.frameCount,
                    duration: animData.duration,
                    ease: EasingEncoding.Linear,
                    yoyo: false
                }, offset);
            }
            else
            {
                var base = animation.base;
                if (typeof base === 'string')
                {
                    animData = this.animationDataNames[base];
                }
                else if (typeof base === 'number')
                {
                    animData = this.animationDataIndices[base];
                }
                else
                {
                    // Bad data; fall back to first animation.
                    animData = this.animationData[0];
                }
                this._setAnimatedValue({
                    base: animData.index,
                    amplitude: (typeof animation.amplitude === 'number') ? animation.amplitude : animData.frameCount,
                    duration: animation.duration || animData.duration,
                    delay: animation.delay || 0,
                    ease: animation.ease || EasingEncoding.Linear,
                    yoyo: !!animation.yoyo
                }, offset);
            }
        }
        else
        {
            // Use single frame.
            var frameIndex = this.frameDataIndices[frame.name];
            var memberFrame = member.frame;
            if (memberFrame && memberFrame.base !== undefined)
            {
                this._setAnimatedValue({
                    base: frameIndex,
                    amplitude: memberFrame.amplitude,
                    duration: memberFrame.duration,
                    delay: memberFrame.delay,
                    ease: memberFrame.ease,
                    yoyo: memberFrame.yoyo
                }, offset);
            }
            else
            {
                this._setAnimatedValue(frameIndex, offset);
            }
        }
        offset += 4;

        this._setAnimatedValue(member.tintBlend, offset, 1);
        offset += 4;

        var tintBottomLeft = member.tintBottomLeft === undefined ? 0xffffff : member.tintBottomLeft;
        var tintTopLeft = member.tintTopLeft === undefined ? 0xffffff : member.tintTopLeft;
        var tintBottomRight = member.tintBottomRight === undefined ? 0xffffff : member.tintBottomRight;
        var tintTopRight = member.tintTopRight === undefined ? 0xffffff : member.tintTopRight;

        var alphaBottomLeft = member.alphaBottomLeft === undefined ? 1 : member.alphaBottomLeft;
        var alphaTopLeft = member.alphaTopLeft === undefined ? 1 : member.alphaTopLeft;
        var alphaBottomRight = member.alphaBottomRight === undefined ? 1 : member.alphaBottomRight;
        var alphaTopRight = member.alphaTopRight === undefined ? 1 : member.alphaTopRight;

        u32[offset++] = getTint(
            tintBottomLeft,
            alphaBottomLeft
        );
        u32[offset++] = getTint(
            tintTopLeft,
            alphaTopLeft
        );
        u32[offset++] = getTint(
            tintBottomRight,
            alphaBottomRight
        );
        u32[offset++] = getTint(
            tintTopRight,
            alphaTopRight
        );

        f32[offset++] = member.originX === undefined ? 0.5 : member.originX;
        f32[offset++] = member.originY === undefined ? 0.5 : member.originY;

        f32[offset++] = member.tintFill || 0;

        f32[offset++] = member.creationTime === undefined ? this.timeElapsed : member.creationTime;

        f32[offset++] = member.scrollFactorX === undefined ? 1 : member.scrollFactorX;
        f32[offset++] = member.scrollFactorY === undefined ? 1 : member.scrollFactorY;

        this.addData(this.nextMemberF32);

        return this;
    }

    /**
     * Edits a member of the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#editMember
     * @since 4.0.0
     * @param {number} index - The index of the member to edit.
     * @param {Partial<Phaser.Types.GameObjects.SpriteGPULayer.Member>} member - The new member data.
     * @returns {this} This SpriteGPULayer object.
     */
    editMember (index: number, member: any): this
    {
        if (index < 0 || index >= this.memberCount)
        {
            return this;
        }

        var currentMemberCount = this.memberCount;
        this.memberCount = index;
        this.addMember(member);
        this.memberCount = currentMemberCount;

        return this;
    }

    /**
     * Update a member of the SpriteGPULayer with raw data.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#patchMember
     * @since 4.0.0
     * @param {number} index - The index of the member to patch.
     * @param {Uint32Array} member - The new member data.
     * @param {number[]} [mask] - The mask to apply to the member data.
     */
    patchMember (index: number, member: Uint32Array, mask?: number[]): void
    {
        if (index < 0 || index >= this.memberCount)
        {
            return;
        }

        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;
        var u32 = buffer.viewU32;

        var offset = byteOffset / 4;

        if (mask)
        {
            for (var i = 0; i < member.length; i++)
            {
                if (mask[i])
                {
                    u32[offset + i] = member[i];
                }
            }
        }
        else
        {
            u32.set(member, offset);
        }

        this.setSegmentNeedsUpdate(index);
    }

    /**
     * Returns a member of the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#getMember
     * @since 4.0.0
     * @param {number} index - The index of the member to get.
     * @returns {?Phaser.Types.GameObjects.SpriteGPULayer.Member} The member data, or null if the index is out of bounds.
     */
    getMember (index: number): any
    {
        if (index < 0 || index >= this.memberCount)
        {
            return null;
        }

        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;
        var f32 = buffer.viewF32;
        var u32 = buffer.viewU32;

        var member: any = {};

        var offset = byteOffset / f32.BYTES_PER_ELEMENT;

        member.x = this._getAnimatedValue(offset);
        offset += 4;

        member.y = this._getAnimatedValue(offset);
        offset += 4;

        member.rotation = this._getAnimatedValue(offset);
        offset += 4;

        member.scaleX = this._getAnimatedValue(offset);
        offset += 4;

        member.scaleY = this._getAnimatedValue(offset);
        offset += 4;

        member.alpha = this._getAnimatedValue(offset);
        offset += 4;

        // Determine frame or animation values.
        var frame: any = this._getAnimatedValue(offset);
        offset += 4;

        if (typeof frame !== 'number')
        {
            frame = frame.base;
        }

        // Get name from frame index.
        var frameName = this.frameDataIndicesInv[frame];
        if (frameName === undefined)
        {
            // Get name from animation index.
            var animData = this.animationDataIndices[frame];
            if (animData)
            {
                member.animation = animData.name;
            }
        }
        else
        {
            member.frame = frameName;
        }

        member.tintBlend = this._getAnimatedValue(offset);
        offset += 4;

        member.tintBottomLeft = u32[offset++];
        member.tintTopLeft = u32[offset++];
        member.tintBottomRight = u32[offset++];
        member.tintTopRight = u32[offset++];
        member.alphaBottomLeft = (member.tintBottomLeft >>> 24) / 255;
        member.alphaTopLeft = (member.tintTopLeft >>> 24) / 255;
        member.alphaBottomRight = (member.tintBottomRight >>> 24) / 255;
        member.alphaTopRight = (member.tintTopRight >>> 24) / 255;
        member.tintBottomLeft &= 0xffffff;
        member.tintTopLeft &= 0xffffff;
        member.tintBottomRight &= 0xffffff;
        member.tintTopRight &= 0xffffff;

        member.originX = f32[offset++];
        member.originY = f32[offset++];
        member.tintFill = f32[offset++];
        member.creationTime = f32[offset++];

        member.scrollFactorX = f32[offset++];
        member.scrollFactorY = f32[offset++];

        return member;
    }

    /**
     * Returns the raw data of a member of the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#getMemberData
     * @since 4.0.0
     * @param {number} index - The index of the member to get.
     * @param {Uint32Array} [out] - An optional array to copy the data to.
     * @returns {?Uint32Array} The member data, or null if the index is out of bounds.
     */
    getMemberData (index: number, out?: Uint32Array): Uint32Array | null
    {
        if (index < 0 || index >= this.memberCount)
        {
            return null;
        }

        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;

        if (!out)
        {
            out = this.nextMemberU32;
        }

        var viewU32 = buffer.viewU32;
        var bytesPerElement = viewU32.BYTES_PER_ELEMENT;

        out.set(viewU32.subarray(byteOffset / bytesPerElement, byteOffset / bytesPerElement + stride / bytesPerElement));

        return out;
    }

    /**
     * Removes a member or a number of members from the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#removeMembers
     * @since 4.0.0
     * @param {number} index - The index of the member to remove.
     * @param {number} [count=1] - The number of members to remove.
     * @returns {this} This SpriteGPULayer object.
     */
    removeMembers (index: number, count?: number): this
    {
        if (index < 0 || index >= this.memberCount)
        {
            return this;
        }

        if (count === undefined)
        {
            count = 1;
        }

        count = Math.min(count, this.memberCount - index);

        var layout = this.submitterNode.instanceBufferLayout;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;
        var byteLength = count * stride;

        var u8 = layout.buffer.viewU8;
        u8.set(u8.subarray(byteOffset + byteLength), byteOffset);

        // Mark segments for update.
        for (var i = index; i < this.memberCount; i += this.bufferUpdateSegmentSize)
        {
            this.setSegmentNeedsUpdate(i);
        }

        // Update layer properties.
        this.memberCount -= count;

        return this;
    }

    /**
     * Inserts members into the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#insertMembers
     * @since 4.0.0
     * @param {number} index - The index at which to insert members.
     * @param {Phaser.Types.GameObjects.SpriteGPULayer.Member|Phaser.Types.GameObjects.SpriteGPULayer.Member[]} members - The members to insert.
     * @returns {this} This SpriteGPULayer object.
     */
    insertMembers (index: number, members: any | any[]): this
    {
        if (index < 0 || index > this.memberCount)
        {
            return this;
        }

        if (!Array.isArray(members))
        {
            members = [ members ];
        }

        var oldMemberCount = this.memberCount;
        var layout = this.submitterNode.instanceBufferLayout;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;
        var byteLength = members.length * stride;

        // Move the data after the insertion point.
        layout.buffer.viewU8.copyWithin(

            // Target
            byteOffset + byteLength,

            // Source
            byteOffset,

            // End
            oldMemberCount * stride
        );

        // Insert members.
        this.memberCount = index;
        for (var i = 0; i < members.length; i++)
        {
            this.addMember(members[i]);
        }

        this.memberCount = Math.min(this.size, oldMemberCount + members.length);

        // Mark segments for update.
        for (i = index; i < this.memberCount; i += this.bufferUpdateSegmentSize)
        {
            this.setSegmentNeedsUpdate(i);
        }

        return this;
    }

    /**
     * Inserts raw data into the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#insertMembersData
     * @since 4.0.0
     * @param {number} index - The index at which to insert members.
     * @param {Uint32Array} data - The members to insert.
     * @returns {this} This SpriteGPULayer object.
     */
    insertMembersData (index: number, data: Uint32Array): this
    {
        if (index < 0 || index > this.memberCount)
        {
            return this;
        }

        var byteLength = data.length * data.BYTES_PER_ELEMENT;
        var layout = this.submitterNode.instanceBufferLayout;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;

        // Move the data after the insertion point.
        layout.buffer.viewU8.copyWithin(

            // Target
            byteOffset + byteLength,

            // Source
            byteOffset,

            // End
            this.memberCount * stride
        );

        // Insert members.
        layout.buffer.viewU32.set(data, byteOffset / data.BYTES_PER_ELEMENT);

        this.memberCount = Math.min(this.size, this.memberCount + byteLength / stride);

        // Mark segments for update.
        for (var i = index; i < this.memberCount; i += this.bufferUpdateSegmentSize)
        {
            this.setSegmentNeedsUpdate(i);
        }

        return this;
    }

    /**
     * Sets the values of an animation for a member of this SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#_setAnimatedValue
     * @since 4.0.0
     * @private
     * @param {undefined|number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} value - The value to set.
     * @param {number} index - The offset in `nextMember` to write to.
     * @param {number} [defaultValue=0] - A default value to use if `value` is undefined.
     */
    _setAnimatedValue (value: any, index: number, defaultValue?: number): void
    {
        var f32 = this.nextMemberF32;

        if (defaultValue === undefined)
        {
            defaultValue = 0;
        }

        if (typeof value === 'number')
        {
            f32[index++] = value;
            f32[index++] = 0;
            f32[index++] = 0;
            f32[index] = 0;
        }
        else if (value === undefined)
        {
            f32[index++] = defaultValue;
            f32[index++] = 0;
            f32[index++] = 0;
            f32[index] = 0;
        }
        else
        {
            var base = value.base || 0;
            var ease = value.ease || 0;
            var amplitude = value.amplitude || 0;
            var duration = Math.abs(value.duration || 0);
            var delay = value.delay || 0;
            var yoyo = value.yoyo !== undefined ? value.yoyo : true;
            var loop = value.loop !== undefined ? value.loop : true;

            if (typeof ease === 'string')
            {
                ease = this.EASE[ease] || 0;
            }

            // Enable the chosen animation type.
            var easeString = this.EASE_CODES[ease];
            if (!this._animationsEnabled[easeString])
            {
                this.setAnimationEnabled(easeString, true);
            }

            if (ease === EasingEncoding.Gravity)
            {
                var velocity = value.velocity || 0;
                var gravityFactor = value.gravityFactor || 1;

                if (gravityFactor >= 1)
                {
                    gravityFactor = 0;
                }
                else if (gravityFactor < -1)
                {
                    gravityFactor = -0.999;
                }

                // Map gravityFactor range [-1,1] to [0,1].
                gravityFactor = (gravityFactor + 1) / 2;

                // Encode values into amplitude.
                amplitude = Math.floor(velocity) + gravityFactor;
            }

            // Normalize delay.
            if (duration > 0)
            {
                delay = (delay / duration) % 2;
            }
            else
            {
                delay = 0;
            }
            if (delay < 0)
            {
                delay += 2;
            }
            delay /= 2;

            // Add an integer to encode the type.
            delay += ease;

            // Encode yoyo in the sign of duration, which must be positive.
            if (yoyo)
            {
                duration = -duration;
            }

            // Encode loop in the sign of delay, which must be positive.
            if (!loop)
            {
                delay = -delay;
            }

            f32[index++] = base;
            f32[index++] = amplitude;
            f32[index++] = duration;
            f32[index] = delay;
        }
    }

    /**
     * Return the values of an animation for a member of this SpriteGPULayer
     * in the buffer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#_getAnimatedValue
     * @since 4.0.0
     * @private
     * @param {number} index - The index where the animation begins in the buffer.
     * @returns {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} The animation values.
     */
    _getAnimatedValue (index: number): any
    {
        var f32 = this.submitterNode.instanceBufferLayout.buffer.viewF32;

        var base = f32[index++];
        var amplitude = f32[index++];
        var duration = f32[index++];
        var delay = f32[index];

        // Declare ease before the condition check so it's available in scope
        var ease = Math.floor(Math.abs(delay));

        if (amplitude === 0 || duration === 0 || ease === 0)
        {
            return base;
        }

        var loop = delay > 0;
        if (!loop)
        {
            delay = -delay;
        }

        var yoyo = duration < 0;
        if (yoyo)
        {
            duration = -duration;
        }

        // Negate ease after duration, so duration has the correct sign.
        delay -= ease;
        delay = (delay * duration * 2) % duration;

        // Check for Gravity mode.
        if (ease === EasingEncoding.Gravity)
        {
            var velocity = Math.floor(amplitude);
            var gravityFactor = (amplitude - velocity) * 2 - 1;
            if (gravityFactor === 0)
            {
                gravityFactor = 1;
            }
            return {
                base: base,
                ease: ease,
                duration: duration,
                delay: delay,
                yoyo: yoyo,
                velocity: velocity,
                gravityFactor: gravityFactor
            };
        }

        return {
            base: base,
            ease: ease,
            amplitude: amplitude,
            duration: duration,
            delay: delay,
            yoyo: yoyo
        };
    }

    /**
     * Set the enabled state of an animation.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#setAnimationEnabled
     * @since 4.0.0
     * @param {string} name - The name of the animation to enable or disable.
     * @param {boolean} enabled - Whether to enable or disable the animation.
     * @returns {this} This SpriteGPULayer object.
     */
    setAnimationEnabled (name: string, enabled: boolean): this
    {
        this._animationsEnabled[name] = !!enabled;

        return this;
    }

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#preDestroy
     * @protected
     * @since 4.0.0
     */
    preDestroy (): void
    {
        this.frameDataTexture.destroy();

        // TODO: Destroy the Submitter RenderNode.
    }
}
