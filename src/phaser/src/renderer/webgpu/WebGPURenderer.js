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
     * Pool of vertex buffers for quads (one per draw so data is not overwritten before submit).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_quadVertexBuffers
     * @type {GPUBuffer[]}
     * @private
     */
    this._quadVertexBuffers = [];

    /**
     * Index buffer for quad (6 indices).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_quadIndexBuffer
     * @type {GPUBuffer|null}
     * @private
     */
    this._quadIndexBuffer = null;

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
     * Pool of uniform buffers (one per draw).
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_uniformBuffers
     * @type {GPUBuffer[]}
     * @private
     */
    this._uniformBuffers = [];

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
     * Vertex data for one quad: 4 vertices * (x, y, u, v) = 16 floats.
     * @name Phaser.Renderer.WebGPU.WebGPURenderer#_vertexData
     * @type {Float32Array}
     * @private
     */
    this._vertexData = new Float32Array(16);

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
        '}',
        'struct VertexOutput {',
        '  @builtin(position) position: vec4f,',
        '  @location(0) uv: vec2f,',
        '}',
        'struct Uniforms {',
        '  resolution: vec2f,',
        '  tint: vec4f,',
        '}',
        '@group(0) @binding(0) var<uniform> u: Uniforms;',
        '@vertex fn vs(in: VertexInput) -> VertexOutput {',
        '  var out: VertexOutput;',
        '  out.uv = in.uv;',
        '  out.position = vec4f((in.position / u.resolution) * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0), 0.0, 1.0);',
        '  return out;',
        '}',
        '@group(0) @binding(1) var tex: texture_2d<f32>;',
        '@group(0) @binding(2) var s: sampler;',
        '@fragment fn fs(in: VertexOutput) -> @location(0) vec4f {',
        '  return textureSample(tex, s, in.uv) * u.tint;',
        '}'
    ].join('\n');

    var shaderModule = device.createShaderModule({ code: wgsl });

    this._quadPipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: shaderModule,
            entryPoint: 'vs',
            buffers: [{
                arrayStride: 16,
                attributes: [
                    { shaderLocation: 0, offset: 0, format: 'float32x2' },
                    { shaderLocation: 1, offset: 8, format: 'float32x2' }
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

    var poolSize = 64;
    this._quadVertexBuffers = [];
    this._uniformBuffers = [];
    for (var p = 0; p < poolSize; p++)
    {
        this._quadVertexBuffers.push(device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        }));
        this._uniformBuffers.push(device.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        }));
    }

    var indices = new Uint16Array([ 0, 1, 2, 0, 2, 3 ]);
    this._quadIndexBuffer = device.createBuffer({
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(this._quadIndexBuffer, 0, indices);

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
 * Build calc matrix and quad for a single Image/Sprite, then record draw calls.
 * @private
 * @param {GPURenderPassEncoder} pass - Current render pass.
 * @param {Phaser.GameObjects.GameObject} child - Image or Sprite.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - Camera.
 * @param {number} slot - Index into the vertex/uniform buffer pool (so each draw keeps its own data).
 */
WebGPURenderer.prototype._drawImageQuad = function (pass, child, camera, slot)
{
    if (this.width <= 0 || this.height <= 0) { return; }
    if (slot >= this._quadVertexBuffers.length) { return; }

    var vertexBuffer = this._quadVertexBuffers[slot];
    var uniformBuffer = this._uniformBuffers[slot];
    var frame = child.frame;
    var frameSource = frame.source;
    var gpuTex = this._getOrCreateGPUTexture(frameSource);
    if (!gpuTex) { return; }

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

    var v = this._vertexData;
    var q = this._quad;
    v[0] = q[0]; v[1] = q[1]; v[2] = u0; v[3] = v0;
    v[4] = q[2]; v[5] = q[3]; v[6] = u0; v[7] = v1;
    v[8] = q[4]; v[9] = q[5]; v[10] = u1; v[11] = v1;
    v[12] = q[6]; v[13] = q[7]; v[14] = u1; v[15] = v0;

    this.device.queue.writeBuffer(vertexBuffer, 0, this._vertexData);

    var tint = child.tintTopLeft;
    var r = ((tint >> 16) & 0xff) / 255;
    var g = ((tint >> 8) & 0xff) / 255;
    var b = (tint & 0xff) / 255;
    var a = camera.alpha * child.alpha;

    var uniformF32 = new Float32Array(8);
    uniformF32[0] = this.width;
    uniformF32[1] = this.height;
    uniformF32[2] = 0;
    uniformF32[3] = 0;
    uniformF32[4] = r;
    uniformF32[5] = g;
    uniformF32[6] = b;
    uniformF32[7] = a;
    this.device.queue.writeBuffer(uniformBuffer, 0, uniformF32);

    var bindGroup = this.device.createBindGroup({
        layout: this._quadPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: gpuTex.texture.createView() },
            { binding: 2, resource: this._sampler }
        ]
    });

    pass.setPipeline(this._quadPipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setIndexBuffer(this._quadIndexBuffer, 'uint16');
    pass.drawIndexed(6, 1, 0, 0, 0);
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
    this.emit(Events.RENDER, scene, camera);

    var view = this.context.getCurrentTexture().createView();
    var pass = this._frameEncoder.beginRenderPass({
        colorAttachments: [{
            view: view,
            loadOp: 'load',
            storeOp: 'store'
        }]
    });

    var slot = 0;
    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];
        if (isImageLike(child))
        {
            this._drawImageQuad(pass, child, camera, slot);
            slot++;
        }
    }

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
    if (this._quadVertexBuffers && this._quadVertexBuffers.length)
    {
        this._quadVertexBuffers.forEach(function (b) { b.destroy(); });
        this._quadVertexBuffers = [];
    }
    if (this._quadIndexBuffer) { this._quadIndexBuffer.destroy(); this._quadIndexBuffer = null; }
    if (this._uniformBuffers && this._uniformBuffers.length)
    {
        this._uniformBuffers.forEach(function (b) { b.destroy(); });
        this._uniformBuffers = [];
    }
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
