/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Descriptor of the context within which a drawing operation is performed.
 *
 * This consists of a subset of the global WebGL state. It includes the following:
 *
 * - Framebuffer
 * - Viewport
 * - Scissor box
 * - Blend mode
 * - Clear color
 *
 * This is analogous to a drafting table in a studio. The paper is the
 * framebuffer, while the rest of the data specifies masks, guides etc for
 * drawing.
 *
 * A DrawingContext can be copied and thrown away, allowing temporary use of
 * different drawing states on a framebuffer.
 *
 * @class DrawingContext
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this context.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.DrawingContextOptions} [options] - The options for this context.
 */
export class DrawingContext {
    renderer: any;
    camera: any;
    state: any;
    blendMode: number;
    autoClear: number;
    useCanvas: boolean;
    framebuffer: any;
    texture: any;
    pool: any;
    lastUsed: number;
    width: number;
    height: number;
    _locks: any[];

    constructor(renderer: any, options?: any)
    {
        if (options === undefined) { options = {}; }

        this.renderer = renderer;
        this.camera = null;
        this.setCamera(options.camera || null);

        this.state = {
            bindings:
            {
                framebuffer: null
            },
            blend: {
                // This will be automatically populated below.
            },
            colorClearValue: options.clearColor || [ 0, 0, 0, 0 ],
            scissor: {
                box: [ 0, 0, 0, 0 ],
                enable: true
            },
            viewport: [ 0, 0, 0, 0 ]
        };

        this.blendMode = -1;
        this.setBlendMode(options.blendMode || 0);

        this.autoClear = 0;

        if (options.autoClear === undefined || options.autoClear === true)
        {
            this.setAutoClear(true, true, true);
        }
        else if (Array.isArray(options.autoClear))
        {
            this.setAutoClear.apply(this, options.autoClear);
        }

        this.useCanvas = !!options.useCanvas;
        this.framebuffer = null;
        this.texture = null;
        this.pool = options.pool || null;
        this.lastUsed = 0;
        this.width = 0;
        this.height = 0;
        this._locks = [];

        if (options.copyFrom)
        {
            this.copy(options.copyFrom);
        }
        else
        {
            this.resize(
                options.width || renderer.width,
                options.height || renderer.height
            );
        }
    }

    resize(width: number, height: number): void
    {
        width = Math.round(width);
        height = Math.round(height);

        if (width <= 0)
        {
            width = 1;
        }

        if (height <= 0)
        {
            height = 1;
        }

        if (!this.useCanvas)
        {
            if (!this.framebuffer)
            {
                const renderer = this.renderer;
                this.texture = renderer.createTextureFromSource(null, width, height, 0);
                this.framebuffer = renderer.createFramebuffer(this.texture, true, false);
            }
            else
            {
                this.framebuffer.resize(width, height);
            }
        }
        else if (!this.framebuffer)
        {
            this.framebuffer = this.renderer.createFramebuffer(null);
        }
        this.state.bindings.framebuffer = this.framebuffer;

        this.width = width;
        this.height = height;

        this.state.scissor.box = [ 0, 0, width, height ];
        this.state.viewport = [ 0, 0, width, height ];
    }

    copy(source: DrawingContext): void
    {
        const state = source.state;
        const blend = state.blend;
        const scissor = state.scissor;

        this.autoClear = source.autoClear;
        this.useCanvas = source.useCanvas;
        this.framebuffer = source.framebuffer;
        this.texture = source.texture;
        this.camera = source.camera;
        this.blendMode = source.blendMode;
        this.width = source.width;
        this.height = source.height;

        this.state = {
            bindings:
            {
                framebuffer: state.bindings.framebuffer
            },
            blend: {
                color: blend.color && blend.color.slice(),
                enable: blend.enable,
                equation: blend.equation,
                func: blend.func
            },
            colorClearValue: state.colorClearValue.slice(),
            scissor: {
                box: scissor.box.slice(),
                enable: scissor.enable
            },
            viewport: state.viewport.slice()
        };
    }

    getClone(preserveAutoClear?: boolean): DrawingContext
    {
        const context = new DrawingContext(this.renderer, { copyFrom: this });

        if (!preserveAutoClear)
        {
            context.setAutoClear(false, false, false);
        }

        return context;
    }

    setAutoClear(color: boolean, depth: boolean, stencil: boolean): void
    {
        let autoClear = 0;
        const gl = this.renderer.gl;
        if (color) { autoClear |= gl.COLOR_BUFFER_BIT; }
        if (depth) { autoClear |= gl.DEPTH_BUFFER_BIT; }
        if (stencil) { autoClear |= gl.STENCIL_BUFFER_BIT; }
        this.autoClear = autoClear;
    }

    setBlendMode(blendMode: number, blendColor?: number[]): void
    {
        if (blendMode === this.blendMode) { return; }

        const blend = this.state.blend;
        const blendModeData = this.renderer.blendModes[blendMode];

        blend.enable = blendModeData.enable;
        blend.equation = blendModeData.equation;
        blend.func = blendModeData.func;

        if (blendColor)
        {
            blend.color = blendColor;
        }
        else
        {
            blend.color = undefined;
        }

        this.blendMode = blendMode;
    }

    setCamera(camera: any): void
    {
        this.camera = camera;
    }

    setClearColor(r: number, g: number, b: number, a: number): void
    {
        const colorClearValue = this.state.colorClearValue;
        if (
            r === colorClearValue[0] &&
            g === colorClearValue[1] &&
            b === colorClearValue[2] &&
            a === colorClearValue[3]
        ) { return; }

        this.state.colorClearValue = [ r, g, b, a ];
    }

    setScissorBox(x: number, y: number, width: number, height: number): void
    {
        y = this.height - y - height;
        this.state.scissor.box = [ x, y, width, height ];
    }

    setScissorEnable(enable: boolean): void
    {
        this.state.scissor.enable = enable;
    }

    use(): void
    {
        this.renderer.renderNodes.finishBatch();

        if (this.autoClear)
        {
            this.clear();
        }
    }

    release(): void
    {
        if (this.pool && this._locks.length === 0)
        {
            this.lastUsed = Date.now();
            this.pool.add(this);
        }

        this.renderer.renderNodes.finishBatch();
    }

    lock(key: any): void
    {
        if (this._locks.indexOf(key) !== -1)
        {
            return;
        }
        this._locks.push(key);
    }

    unlock(key: any, release?: boolean): void
    {
        const index = this._locks.indexOf(key);
        if (index !== -1)
        {
            this._locks.splice(index, 1);
        }

        if (release)
        {
            this.release();
        }
    }

    isLocked(): boolean
    {
        return this._locks.length > 0;
    }

    beginDraw(): void
    {
        if (this.framebuffer)
        {
            this.renderer.glTextureUnits.unbindTexture(this.texture);
        }
        this.renderer.glWrapper.update(this.state);
    }

    clear(bits?: number): void
    {
        this.beginDraw();

        if (bits === undefined)
        {
            bits = this.autoClear;
        }

        this.renderer.renderNodes.finishBatch();

        this.renderer.gl.clear(bits);
    }

    destroy(): void
    {
        this.renderer.deleteTexture(this.texture);
        this.renderer.deleteFramebuffer(this.state.bindings.framebuffer);

        this.renderer = null;
        this.camera = null;
        this.state = null;
        this.framebuffer = null;
        this.texture = null;
    }
}
