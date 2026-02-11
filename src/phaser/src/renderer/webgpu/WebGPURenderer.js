/**
 * @author       Phaser Studio Inc.
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const');
var EventEmitter = require('eventemitter3');
var Events = require('../events');
var ScaleEvents = require('../../scale/events');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');

/**
 * @classdesc
 * WebGPU Renderer for Phaser. Uses the WebGPU API to render the game.
 * This is a minimal implementation that clears the screen to the background color.
 * Full scene/camera rendering (sprites, textures, etc.) can be added in future iterations.
 *
 * @class WebGPURenderer
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Renderer.WebGPU
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Game} game - The Game instance which owns this WebGPU Renderer.
 */
var WebGPURenderer = function (game)
{
    EventEmitter.call(this);

    var gameConfig = game.config;
    var bgColor = gameConfig.backgroundColor || { redGL: 0, greenGL: 0, blueGL: 0, alphaGL: 1 };

    /**
     * The Game instance which owns this WebGPU Renderer.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#game
     * @type {Phaser.Game}
     */
    this.game = game;

    /**
     * Renderer type. Always CONST.WEBGPU for this renderer.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#type
     * @type {number}
     */
    this.type = CONST.WEBGPU;

    /**
     * The canvas this renderer draws to.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#canvas
     * @type {HTMLCanvasElement}
     */
    this.canvas = game.canvas;

    /**
     * Width of the canvas (updated on resize).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#width
     * @type {number}
     */
    this.width = 0;

    /**
     * Height of the canvas (updated on resize).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#height
     * @type {number}
     */
    this.height = 0;

    /**
     * Local config (clearBeforeRender, backgroundColor).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#config
     * @type {object}
     */
    this.config = {
        clearBeforeRender: gameConfig.clearBeforeRender !== false,
        backgroundColor: bgColor
    };

    /**
     * Whether the WebGPU context is ready (device and context configured).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#isReady
     * @type {boolean}
     * @private
     */
    this.isReady = false;

    /**
     * GPU adapter (from navigator.gpu.requestAdapter).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#adapter
     * @type {GPUAdapter|null}
     * @private
     */
    this.adapter = null;

    /**
     * GPU device (from adapter.requestDevice).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#device
     * @type {GPUDevice|null}
     * @private
     */
    this.device = null;

    /**
     * GPU canvas context (canvas.getContext('webgpu')).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#context
     * @type {GPUCanvasContext|null}
     * @private
     */
    this.context = null;

    /**
     * Preferred swap chain format.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#format
     * @type {string}
     * @private
     */
    this.format = 'bgra8unorm';

    /**
     * Promise that resolves when the WebGPU context is ready. The game should wait for this before starting the loop.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#readyPromise
     * @type {Promise<void>}
     */
    this.readyPromise = this._initWebGPU();

    /**
     * Pipeline for drawing textured quads (Image/Sprite).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_quadPipeline
     * @type {GPURenderPipeline|null}
     * @private
     */
    this._quadPipeline = null;

    /**
     * Max quads per batch (single texture).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_batchMaxQuads
     * @type {number}
     * @private
     */
    this._batchMaxQuads = 8192;

    /**
     * Large vertex buffer for batching.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_batchVertexBuffer
     * @type {GPUBuffer|null}
     * @private
     */
    this._batchVertexBuffer = null;

    /**
     * Pregenerated index buffer for batch (6 indices per quad).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_batchIndexBuffer
     * @type {GPUBuffer|null}
     * @private
     */
    this._batchIndexBuffer = null;

    /**
     * Uniform buffer for resolution only.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_resolutionUniformBuffer
     * @type {GPUBuffer|null}
     * @private
     */
    this._resolutionUniformBuffer = null;

    /**
     * Current batch vertex data (x,y,u,v,r,g,b,a × 4 vertices per quad).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_batchVertices
     * @type {Float32Array}
     * @private
     */
    this._batchVertices = null;

    /**
     * Number of quads in current batch.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_batchQuadCount
     * @type {number}
     * @private
     */
    this._batchQuadCount = 0;

    /**
     * GPU texture object for current batch (has .texture for createView).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_batchGpuTex
     * @type {object|null}
     * @private
     */
    this._batchGpuTex = null;

    /**
     * Frame source (TextureSource) for current batch. Flush when this changes.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_batchFrameSource
     * @type {object|null}
     * @private
     */
    this._batchFrameSource = null;

    /**
     * Game object type ('Image' or 'Sprite') for current batch. Flush when this changes so Image and Sprite never share a batch.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_batchType
     * @type {string|null}
     * @private
     */
    this._batchType = null;

    /**
     * Cache: TextureSource -> { texture: GPUTexture, width, height }.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_textureCache
     * @type {Map<object, object>}
     * @private
     */
    this._textureCache = new Map();

    /**
     * Default sampler for texture sampling.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_sampler
     * @type {GPUSampler|null}
     * @private
     */
    this._sampler = null;


    /**
     * Temp matrices for building quad transform.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_tempMatrix
     * @type {Phaser.GameObjects.Components.TransformMatrix}
     * @private
     */
    this._tempMatrix = new TransformMatrix();

    /**
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_calcMatrix
     * @type {Phaser.GameObjects.Components.TransformMatrix}
     * @private
     */
    this._calcMatrix = new TransformMatrix();

    /**
     * Quad position buffer (8 floats) from setQuad.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_quad
     * @type {Float32Array}
     * @private
     */
    this._quad = new Float32Array(8);

    /**
     * Single-quad vertex scratch (x,y,u,v,r,g,b,a × 4 = 32 floats).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_vertexData
     * @type {Float32Array}
     * @private
     */
    this._vertexData = new Float32Array(32);

    /**
     * Command encoder for the current frame (clear + all camera draws in one submit).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_frameEncoder
     * @type {GPUCommandEncoder|null}
     * @private
     */
    this._frameEncoder = null;
};

WebGPURenderer.prototype = Object.create(EventEmitter.prototype);
WebGPURenderer.prototype.constructor = WebGPURenderer;

/**
 * Async init: request adapter, device, configure canvas context.
 * @private
 * @returns {Promise<void>}
 */
WebGPURenderer.prototype._initWebGPU = function ()
{
    var self = this;
    var canvas = this.canvas;
    var config = this.config;

    if (!navigator.gpu)
    {
        return Promise.reject(new Error('WebGPU is not supported.'));
    }

    return navigator.gpu.requestAdapter()
        .then(function (adapter)
        {
            if (!adapter) { return Promise.reject(new Error('WebGPU adapter not found.')); }
            self.adapter = adapter;
            return adapter.requestDevice();
        })
        .then(function (device)
        {
            self.device = device;
            device.lost.then(function (info)
            {
                console.warn('WebGPU device was lost:', info.reason, info.message);
            });

            var ctx = canvas.getContext('webgpu');
            if (!ctx)
            {
                return Promise.reject(new Error('Could not get WebGPU canvas context.'));
            }
            self.context = ctx;

            var format = navigator.gpu.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : 'bgra8unorm';
            self.format = format;

            ctx.configure({
                device: device,
                format: format,
                alphaMode: 'premultiplied',
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
            });

            self.width = canvas.width;
            self.height = canvas.height;
            self._createQuadPipeline(device);
            self.isReady = true;
            self.game.scale.on(ScaleEvents.RESIZE, self.onResize, self);
        })
        .catch(function (err)
        {
            console.error('WebGPU init failed:', err);
            self.isReady = false;
            throw err;
        });
};

/**
 * Create the pipeline and buffers for drawing textured quads.
 * @private
 * @param {GPUDevice} device - The GPU device.
 */
WebGPURenderer.prototype._createQuadPipeline = function (device)
{
    var wgsl = [
        'struct VertexInput {',
        '  @location(0) position: vec2f,',
        '  @location(1) uv: vec2f,',
        '  @location(2) color: vec4f,',
        '}',
        'struct VertexOutput {',
        '  @builtin(position) position: vec4f,',
        '  @location(0) uv: vec2f,',
        '  @location(1) color: vec4f,',
        '}',
        '@group(0) @binding(0) var<uniform> resolution: vec2f;',
        '@vertex fn vs(in: VertexInput) -> VertexOutput {',
        '  var out: VertexOutput;',
        '  out.uv = in.uv;',
        '  out.color = in.color;',
        '  out.position = vec4f((in.position / resolution) * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0), 0.0, 1.0);',
        '  return out;',
        '}',
        '@group(0) @binding(1) var tex: texture_2d<f32>;',
        '@group(0) @binding(2) var s: sampler;',
        '@fragment fn fs(in: VertexOutput) -> @location(0) vec4f {',
        '  return textureSample(tex, s, in.uv) * in.color;',
        '}'
    ].join('\n');

    var shaderModule = device.createShaderModule({ code: wgsl });

    this._quadPipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: shaderModule,
            entryPoint: 'vs',
            buffers: [{
                arrayStride: 32,
                attributes: [
                    { shaderLocation: 0, offset: 0, format: 'float32x2' },
                    { shaderLocation: 1, offset: 8, format: 'float32x2' },
                    { shaderLocation: 2, offset: 16, format: 'float32x4' }
                ]
            }]
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fs',
            targets: [{ format: this.format, blend: {
                color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' },
                alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' }
            } }]
        },
        primitive: { topology: 'triangle-list' }
    });

    var maxQuads = this._batchMaxQuads;
    var vertexBufferSize = maxQuads * 4 * 32;
    this._batchVertexBuffer = device.createBuffer({
        size: vertexBufferSize,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    var indexCount = maxQuads * 6;
    var indices = new Uint16Array(indexCount);
    for (var i = 0; i < maxQuads; i++)
    {
        var base = i * 4;
        indices[i * 6 + 0] = base + 0;
        indices[i * 6 + 1] = base + 1;
        indices[i * 6 + 2] = base + 2;
        indices[i * 6 + 3] = base + 0;
        indices[i * 6 + 4] = base + 2;
        indices[i * 6 + 5] = base + 3;
    }
    this._batchIndexBuffer = device.createBuffer({
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(this._batchIndexBuffer, 0, indices);

    this._resolutionUniformBuffer = device.createBuffer({
        size: 8,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    this._batchVertices = new Float32Array(maxQuads * 4 * 8);

    this._sampler = device.createSampler({
        minFilter: 'linear',
        magFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge'
    });
};

/**
 * Get a source suitable for copyExternalImageToTexture (Canvas or ImageBitmap).
 * HTMLImageElement can fail in some browsers; drawing to canvas is reliable.
 * @private
 */
function getUploadSource (source, w, h)
{
    if (source instanceof HTMLCanvasElement || source instanceof OffscreenCanvas)
    {
        return source;
    }
    if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap)
    {
        return source;
    }
    if (source instanceof HTMLImageElement && source.complete && source.naturalWidth > 0)
    {
        try
        {
            var canvas = typeof OffscreenCanvas !== 'undefined'
                ? new OffscreenCanvas(w, h)
                : document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            if (ctx) { ctx.drawImage(source, 0, 0, w, h); return canvas; }
        }
        catch (e) { /* fall through */ }
    }
    return null;
}

/**
 * Get or create a GPUTexture from a Phaser TextureSource (frame.source).
 * @private
 * @param {Phaser.Textures.TextureSource} frameSource - frame.source
 * @returns {{ texture: GPUTexture, width: number, height: number }|null}
 */
WebGPURenderer.prototype._getOrCreateGPUTexture = function (frameSource)
{
    if (!this.device || !frameSource || !frameSource.source) { return null; }
    var source = frameSource.source;
    var w = frameSource.width;
    var h = frameSource.height;
    if (!w || !h) { return null; }

    var cached = this._textureCache.get(frameSource);
    if (cached) { return cached; }

    var uploadSource = getUploadSource(source, w, h);
    if (!uploadSource)
    {
        return null;
    }

    var texture = this.device.createTexture({
        size: [ w, h, 1 ],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });

    try
    {
        this.device.queue.copyExternalImageToTexture(
            { source: uploadSource, flipY: true },
            { texture: texture },
            [ w, h, 1 ]
        );
    }
    catch (e)
    {
        texture.destroy();
        return null;
    }

    cached = { texture: texture, width: w, height: h };
    this._textureCache.set(frameSource, cached);
    return cached;
};

/**
 * Return true if the game object can be drawn as a textured quad (Image or Sprite).
 * @private
 */
function isImageLike (obj)
{
    return obj && obj.texture && obj.frame &&
        (obj.type === 'Image' || obj.type === 'Sprite') &&
        obj.visible && obj.alpha > 0;
}

/**
 * Flush the current batch to the GPU (one draw call per texture).
 * @private
 * @param {GPURenderPassEncoder} pass - Current render pass.
 */
WebGPURenderer.prototype._flushBatch = function (pass)
{
    if (this._batchQuadCount === 0) { return; }

    var count = this._batchQuadCount;
    var numFloats = count * 4 * 8;
    var copy = new Float32Array(numFloats);
    copy.set(this._batchVertices.subarray(0, numFloats));
    this.device.queue.writeBuffer(this._batchVertexBuffer, 0, copy);

    var bindGroup = this.device.createBindGroup({
        layout: this._quadPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: this._resolutionUniformBuffer } },
            { binding: 1, resource: this._batchGpuTex.texture.createView() },
            { binding: 2, resource: this._sampler }
        ]
    });

    pass.setPipeline(this._quadPipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, this._batchVertexBuffer);
    pass.setIndexBuffer(this._batchIndexBuffer, 'uint16');
    pass.drawIndexed(count * 6, 1, 0, 0, 0);

    this._batchQuadCount = 0;
    this._batchType = null;
    this._batchFrameSource = null;
    this._batchGpuTex = null;
};

/**
 * Push one Image/Sprite quad into the batch. Flushes if texture changes or batch is full.
 * @private
 * @param {GPURenderPassEncoder} pass - Current render pass.
 * @param {Phaser.GameObjects.GameObject} child - Image or Sprite.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - Camera.
 * @param {object} gpuTex - { texture, width, height } from _getOrCreateGPUTexture.
 */
WebGPURenderer.prototype._pushQuadToBatch = function (pass, child, camera, gpuTex)
{
    var maxQuads = this._batchMaxQuads;
    var frame = child.frame;
    var frameSource = frame.source;

    var childType = child.type || '';
    if (this._batchQuadCount > 0 && (this._batchType !== childType || this._batchFrameSource !== frameSource || this._batchGpuTex !== gpuTex || this._batchQuadCount >= maxQuads))
    {
        this._flushBatch(pass);
    }

    if (this._batchQuadCount >= maxQuads) { return; }
    var uvSource = frame;
    if (child.isCropped)
    {
        var crop = child._crop;
        if (crop.flipX !== child.flipX || crop.flipY !== child.flipY)
        {
            frame.updateCropUVs(crop, child.flipX, child.flipY);
        }
        uvSource = crop;
    }

    var u0 = uvSource.u0;
    var v0 = uvSource.v0;
    var u1 = uvSource.u1;
    var v1 = uvSource.v1;
    if (child.flipX) { var tu = u0; u0 = u1; u1 = tu; }
    if (child.flipY) { var tv = v0; v0 = v1; v1 = tv; }

    var frameX = frame.x || 0;
    var frameY = frame.y || 0;
    var displayOriginX = child.displayOriginX;
    var displayOriginY = child.displayOriginY;
    var frameWidth = frame.cutWidth;
    var frameHeight = frame.cutHeight;
    var res = frameSource.resolution || 1;
    frameWidth /= res;
    frameHeight /= res;

    var x = -displayOriginX + frameX;
    var y = -displayOriginY + frameY;

    this._calcMatrix.copyWithScrollFactorFrom(
        camera.getViewMatrix(false),
        camera.scrollX, camera.scrollY,
        child.scrollFactorX, child.scrollFactorY
    );
    this._calcMatrix.multiply(child.getWorldTransformMatrix(this._tempMatrix));
    this._calcMatrix.setQuad(x, y, x + frameWidth, y + frameHeight, this._quad);

    var tint = child.tintTopLeft;
    var r = ((tint >> 16) & 0xff) / 255;
    var g = ((tint >> 8) & 0xff) / 255;
    var b = (tint & 0xff) / 255;
    var a = camera.alpha * child.alpha;

    var q = this._quad;
    var batch = this._batchVertices;
    var offset = this._batchQuadCount * 4 * 8;

    batch[offset + 0] = q[0]; batch[offset + 1] = q[1]; batch[offset + 2] = u0; batch[offset + 3] = v0; batch[offset + 4] = r; batch[offset + 5] = g; batch[offset + 6] = b; batch[offset + 7] = a;
    batch[offset + 8] = q[2]; batch[offset + 9] = q[3]; batch[offset + 10] = u0; batch[offset + 11] = v1; batch[offset + 12] = r; batch[offset + 13] = g; batch[offset + 14] = b; batch[offset + 15] = a;
    batch[offset + 16] = q[4]; batch[offset + 17] = q[5]; batch[offset + 18] = u1; batch[offset + 19] = v1; batch[offset + 20] = r; batch[offset + 21] = g; batch[offset + 22] = b; batch[offset + 23] = a;
    batch[offset + 24] = q[6]; batch[offset + 25] = q[7]; batch[offset + 26] = u1; batch[offset + 27] = v0; batch[offset + 28] = r; batch[offset + 29] = g; batch[offset + 30] = b; batch[offset + 31] = a;

    this._batchType = childType;
    this._batchFrameSource = frameSource;
    this._batchGpuTex = gpuTex;
    this._batchQuadCount++;
};

/**
 * Pre-render: start frame encoder and clear the canvas (submit happens in postRender).
 * @method Phaser.Renderer.WebGPU.WebGPURenderer#preRender
 */
WebGPURenderer.prototype.preRender = function ()
{
    if (!this.isReady || !this.device || !this.context) { return; }

    this.emit(Events.PRE_RENDER_CLEAR);
    this.emit(Events.PRE_RENDER);

    this._frameEncoder = this.device.createCommandEncoder();

    if (this.config.clearBeforeRender)
    {
        var view = this.context.getCurrentTexture().createView();
        var bg = this.config.backgroundColor;
        var r = bg.redGL !== undefined ? bg.redGL : 0;
        var g = bg.greenGL !== undefined ? bg.greenGL : 0;
        var b = bg.blueGL !== undefined ? bg.blueGL : 0;
        var a = bg.alphaGL !== undefined ? bg.alphaGL : 1;

        var pass = this._frameEncoder.beginRenderPass({
            colorAttachments: [{
                view: view,
                clearValue: { r: r, g: g, b: b, a: a },
                loadOp: 'clear',
                storeOp: 'store'
            }]
        });
        pass.end();
    }
};

/**
 * Main render entry: called per camera by CameraManager. Draws Image and Sprite game objects as textured quads.
 * @method Phaser.Renderer.WebGPU.WebGPURenderer#render
 * @param {Phaser.Scene} scene - The Scene to render.
 * @param {Phaser.GameObjects.GameObject[]} children - Game objects to render.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to render with.
 */
WebGPURenderer.prototype.render = function (scene, children, camera)
{
    if (!this.isReady || !this.device || !this.context || !this._frameEncoder) { return; }
    if (this.width <= 0 || this.height <= 0) { return; }
    this.emit(Events.RENDER, scene, camera);

    var resF32 = new Float32Array(2);
    resF32[0] = this.width;
    resF32[1] = this.height;
    this.device.queue.writeBuffer(this._resolutionUniformBuffer, 0, resF32);

    var view = this.context.getCurrentTexture().createView();
    var pass = this._frameEncoder.beginRenderPass({
        colorAttachments: [{
            view: view,
            loadOp: 'load',
            storeOp: 'store'
        }]
    });

    this._batchQuadCount = 0;
    this._batchType = null;
    this._batchFrameSource = null;
    this._batchGpuTex = null;

    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];
        if (isImageLike(child))
        {
            var gpuTex = this._getOrCreateGPUTexture(child.frame.source);
            if (gpuTex)
            {
                this._pushQuadToBatch(pass, child, camera, gpuTex);
            }
        }
    }

    this._flushBatch(pass);
    pass.end();
};

/**
 * Post-render: submit the frame encoder (clear + all camera draws) and emit event.
 * @method Phaser.Renderer.WebGPU.WebGPURenderer#postRender
 */
WebGPURenderer.prototype.postRender = function ()
{
    if (this._frameEncoder)
    {
        this.device.queue.submit([ this._frameEncoder.finish() ]);
        this._frameEncoder = null;
    }
    this.emit(Events.POST_RENDER);
};

/**
 * Called by Scale Manager when the game size changes.
 * @method Phaser.Renderer.WebGPU.WebGPURenderer#onResize
 * @param {Phaser.Structs.Size} gameSize - The default Game Size object.
 * @param {Phaser.Structs.Size} baseSize - The base Size object (canvas dimensions).
 */
WebGPURenderer.prototype.onResize = function (gameSize, baseSize)
{
    if (baseSize.width !== this.width || baseSize.height !== this.height)
    {
        this.resize(baseSize.width, baseSize.height);
    }
};

/**
 * Resize: reconfigure the WebGPU context for the new canvas size.
 * @method Phaser.Renderer.WebGPU.WebGPURenderer#resize
 * @param {number} width - New width.
 * @param {number} height - New height.
 */
WebGPURenderer.prototype.resize = function (width, height)
{
    this.width = width;
    this.height = height;
    if (this.context && this.device)
    {
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'premultiplied',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST,
            width: width,
            height: height
        });
    }
    this.emit(Events.RESIZE, width, height);
};

/**
 * Destroy the renderer and release WebGPU resources.
 * @method Phaser.Renderer.WebGPU.WebGPURenderer#destroy
 */
WebGPURenderer.prototype.destroy = function ()
{
    if (this.game && this.game.scale)
    {
        this.game.scale.off(ScaleEvents.RESIZE, this.onResize, this);
    }
    if (this._textureCache)
    {
        this._textureCache.forEach(function (entry) { if (entry.texture) entry.texture.destroy(); });
        this._textureCache.clear();
        this._textureCache = null;
    }
    if (this._batchVertexBuffer) { this._batchVertexBuffer.destroy(); this._batchVertexBuffer = null; }
    if (this._batchIndexBuffer) { this._batchIndexBuffer.destroy(); this._batchIndexBuffer = null; }
    if (this._resolutionUniformBuffer) { this._resolutionUniformBuffer.destroy(); this._resolutionUniformBuffer = null; }
    if (this.context)
    {
        this.context.unconfigure();
        this.context = null;
    }
    if (this.device)
    {
        this.device.destroy();
        this.device = null;
    }
    this._quadPipeline = null;
    this._sampler = null;
    this.adapter = null;
    this.isReady = false;
    this.removeAllListeners();
};

module.exports = WebGPURenderer;
