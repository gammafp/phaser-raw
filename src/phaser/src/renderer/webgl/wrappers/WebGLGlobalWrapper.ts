/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { WebGLGlobalParametersFactory } from '../parameters/WebGLGlobalParametersFactory';

/**
 * @classdesc
 * Wrapper for the WebGL global state.
 *
 * @class WebGLGlobalWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLGlobalWrapper for.
 */
export class WebGLGlobalWrapper {

    renderer: any;
    state: any;

    constructor(renderer: any)
    {
        /**
         * The WebGLRenderer this WebGLGlobalWrapper is associated with.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The current state of the WebGL global state.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#state
         * @type {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters}
         * @since 4.0.0
         */
        this.state = WebGLGlobalParametersFactory.getDefault(renderer);
    }

    /**
     * Sets the global WebGL state. Parameters are updated on the
     * WebGLRenderingContext only if they are defined in the input `state`,
     * and different from the current state.
     *
     * When `force` is true, and `state` is defined, parameters on `state`
     * are always set, regardless of the current state.
     *
     * When `force` is true, and `state` is undefined, the current state is
     * used to reset all the parameters.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper#update
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} [state] - The state to set. If undefined, the current state is used when `force` is `true`.
     * @param {boolean} [force=false] - If `true`, the state will be set regardless of the current state.
     * @param {boolean} [vaoLast=false] - If `true`, the VAO will be set last.
     * Otherwise, it will be set first. This is useful when performing state
     * changes that will affect a VAO, such as `bindings.elementArrayBuffer`.
     */
    update(state?: any, force?: boolean, vaoLast?: boolean): void
    {
        if (state === undefined)
        {
            if (!force)
            {
                return;
            }
            state = this.state;
        }
        if (force === undefined) { force = false; }
        if (vaoLast === undefined) { vaoLast = false; }

        if (state.vao !== undefined && !vaoLast)
        {
            this.updateVAO(state, force);
        }
        if (state.bindings !== undefined)
        {
            this.updateBindings(state, force);
        }
        if (state.blend !== undefined)
        {
            this.updateBlend(state, force);
        }
        if (state.colorClearValue !== undefined)
        {
            this.updateColorClearValue(state, force);
        }
        if (state.colorWritemask !== undefined)
        {
            this.updateColorWritemask(state, force);
        }
        if (state.cullFace !== undefined)
        {
            this.updateCullFace(state, force);
        }
        if (state.depthTest !== undefined)
        {
            this.updateDepthTest(state, force);
        }
        if (state.scissor !== undefined)
        {
            // Must happen after setting the framebuffer.
            this.updateScissor(state, force);
        }
        if (state.stencil !== undefined)
        {
            this.updateStencil(state, force);
        }
        if (state.texturing !== undefined)
        {
            this.updateTexturing(state, force);
        }
        if (state.viewport !== undefined)
        {
            this.updateViewport(state, force);
        }
        if (state.vao !== undefined && vaoLast)
        {
            this.updateVAO(state, force);
        }
    }

    updateBindings(state: any, force?: boolean): void
    {
        const bindings = state.bindings;

        if (bindings.activeTexture !== undefined)
        {
            this.updateBindingsActiveTexture(state, force);
        }
        if (bindings.arrayBuffer !== undefined)
        {
            this.updateBindingsArrayBuffer(state, force);
        }
        if (bindings.elementArrayBuffer !== undefined)
        {
            this.updateBindingsElementArrayBuffer(state, force);
        }
        if (bindings.framebuffer !== undefined)
        {
            this.updateBindingsFramebuffer(state, force);
        }
        if (bindings.program !== undefined)
        {
            this.updateBindingsProgram(state, force);
        }
        if (bindings.renderbuffer !== undefined)
        {
            this.updateBindingsRenderbuffer(state, force);
        }
    }

    updateBindingsActiveTexture(state: any, force?: boolean): void
    {
        const activeTexture = state.bindings.activeTexture;

        const different = activeTexture !== this.state.bindings.activeTexture;

        if (different)
        {
            this.state.bindings.activeTexture = activeTexture;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            gl.activeTexture(gl.TEXTURE0 + activeTexture);
        }
    }

    updateBindingsArrayBuffer(state: any, force?: boolean): void
    {
        const arrayBuffer = state.bindings.arrayBuffer;
        const gl = this.renderer.gl;
        if (
            arrayBuffer !== null &&
            arrayBuffer.bufferType !== gl.ARRAY_BUFFER
        )
        {
            throw new Error('Invalid buffer type for ARRAY_BUFFER');
        }

        const different = arrayBuffer !== this.state.bindings.arrayBuffer;

        if (different)
        {
            this.state.bindings.arrayBuffer = arrayBuffer;
        }
        if (different || force)
        {
            const webGLBuffer = arrayBuffer ? arrayBuffer.webGLBuffer : null;
            gl.bindBuffer(gl.ARRAY_BUFFER, webGLBuffer);
        }
    }

    updateBindingsElementArrayBuffer(state: any, force?: boolean): void
    {
        const elementArrayBuffer = state.bindings.elementArrayBuffer;
        const gl = this.renderer.gl;
        if (
            elementArrayBuffer !== null &&
            elementArrayBuffer.bufferType !== gl.ELEMENT_ARRAY_BUFFER
        )
        {
            throw new Error('Invalid buffer type for ELEMENT_ARRAY_BUFFER');
        }

        const different = elementArrayBuffer !== this.state.bindings.elementArrayBuffer;

        if (different)
        {
            this.state.bindings.elementArrayBuffer = elementArrayBuffer;
        }
        if (different || force)
        {
            const webGLBuffer = elementArrayBuffer ? elementArrayBuffer.webGLBuffer : null;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLBuffer);
        }
    }

    updateBindingsFramebuffer(state: any, force?: boolean): void
    {
        const framebuffer = state.bindings.framebuffer;

        const different = framebuffer !== this.state.bindings.framebuffer;

        if (different)
        {
            this.state.bindings.framebuffer = framebuffer;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            const webGLFramebuffer = framebuffer ? framebuffer.webGLFramebuffer : null;
            gl.bindFramebuffer(gl.FRAMEBUFFER, webGLFramebuffer);
        }
    }

    updateBindingsProgram(state: any, force?: boolean): void
    {
        const program = state.bindings.program;

        const different = program !== this.state.bindings.program;

        if (different)
        {
            this.state.bindings.program = program;
        }
        if (different || force)
        {
            const webGLProgram = program ? program.webGLProgram : null;
            this.renderer.gl.useProgram(webGLProgram);
        }
    }

    updateBindingsRenderbuffer(state: any, force?: boolean): void
    {
        const renderbuffer = state.bindings.renderbuffer;

        const different = renderbuffer !== this.state.bindings.renderbuffer;

        if (different)
        {
            this.state.bindings.renderbuffer = renderbuffer;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            const webGLRenderbuffer = renderbuffer || null;
            gl.bindRenderbuffer(gl.RENDERBUFFER, webGLRenderbuffer);
        }
    }

    updateBlend(state: any, force?: boolean): void
    {
        const blend = state.blend;
        if (blend.enabled !== undefined)
        {
            this.updateBlendEnabled(state, force);
        }
        if (blend.color !== undefined)
        {
            this.updateBlendColor(state, force);
        }
        if (blend.equation !== undefined)
        {
            this.updateBlendEquation(state, force);
        }
        if (blend.func !== undefined)
        {
            this.updateBlendFunc(state, force);
        }
    }

    updateBlendColor(state: any, force?: boolean): void
    {
        const color = state.blend.color;
        const r = color[0];
        const g = color[1];
        const b = color[2];
        const a = color[3];

        const different = r !== this.state.blend.color[0] ||
            g !== this.state.blend.color[1] ||
            b !== this.state.blend.color[2] ||
            a !== this.state.blend.color[3];

        if (different)
        {
            this.state.blend.color = [ r, g, b, a ];
        }
        if (different || force)
        {
            this.renderer.gl.blendColor(r, g, b, a);
        }
    }

    updateBlendEnabled(state: any, force?: boolean): void
    {
        const enabled = state.blend.enabled;

        const different = enabled !== this.state.blend.enabled;

        if (different)
        {
            this.state.blend.enabled = enabled;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            if (enabled)
            {
                gl.enable(gl.BLEND);
            }
            else
            {
                gl.disable(gl.BLEND);
            }
        }
    }

    updateBlendEquation(state: any, force?: boolean): void
    {
        const equation = state.blend.equation;

        const different = equation[0] !== this.state.blend.equation[0] ||
            equation[1] !== this.state.blend.equation[1];

        if (different)
        {
            this.state.blend.equation = [ equation[0], equation[1] ];
        }
        if (different || force)
        {
            this.renderer.gl.blendEquationSeparate(equation[0], equation[1]);
        }
    }

    updateBlendFunc(state: any, force?: boolean): void
    {
        const func = state.blend.func;

        const different =
            func[0] !== this.state.blend.func[0] ||
            func[1] !== this.state.blend.func[1] ||
            func[2] !== this.state.blend.func[2] ||
            func[3] !== this.state.blend.func[3];

        if (different)
        {
            this.state.blend.func = [ func[0], func[1], func[2], func[3] ];
        }
        if (different || force)
        {
            this.renderer.gl.blendFuncSeparate(func[0], func[1], func[2], func[3]);
        }
    }

    updateColorClearValue(state: any, force?: boolean): void
    {
        const colorClearValue = state.colorClearValue;
        const r = colorClearValue[0];
        const g = colorClearValue[1];
        const b = colorClearValue[2];
        const a = colorClearValue[3];

        const different = r !== this.state.colorClearValue[0] ||
            g !== this.state.colorClearValue[1] ||
            b !== this.state.colorClearValue[2] ||
            a !== this.state.colorClearValue[3];

        if (different)
        {
            this.state.colorClearValue = [ r, g, b, a ];
        }

        if (different || force)
        {
            this.renderer.gl.clearColor(r, g, b, a);
        }
    }

    updateColorWritemask(state: any, force?: boolean): void
    {
        const colorWritemask = state.colorWritemask;
        const r = colorWritemask[0];
        const g = colorWritemask[1];
        const b = colorWritemask[2];
        const a = colorWritemask[3];

        const different = r !== this.state.colorWritemask[0] ||
            g !== this.state.colorWritemask[1] ||
            b !== this.state.colorWritemask[2] ||
            a !== this.state.colorWritemask[3];

        if (different)
        {
            this.state.colorWritemask = [ r, g, b, a ];
        }
        if (different || force)
        {
            this.renderer.gl.colorMask(r, g, b, a);
        }
    }

    updateCullFace(state: any, force?: boolean): void
    {
        const cullFace = !!state.cullFace;

        const different = cullFace !== this.state.cullFace;

        if (different)
        {
            this.state.cullFace = cullFace;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            if (cullFace)
            {
                gl.enable(gl.CULL_FACE);
            }
            else
            {
                gl.disable(gl.CULL_FACE);
            }
        }
    }

    updateDepthTest(state: any, force?: boolean): void
    {
        const depthTest = !!state.depthTest;

        const different = depthTest !== this.state.depthTest;

        if (different)
        {
            this.state.depthTest = depthTest;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            if (depthTest)
            {
                gl.enable(gl.DEPTH_TEST);
            }
            else
            {
                gl.disable(gl.DEPTH_TEST);
            }
        }
    }

    updateScissor(state: any, force?: boolean): void
    {
        const scissor = state.scissor;
        if (scissor.enable !== undefined)
        {
            this.updateScissorEnabled(state, force);
        }
        if (scissor.box !== undefined)
        {
            this.updateScissorBox(state, force);
        }
    }

    updateScissorEnabled(state: any, force?: boolean): void
    {
        const enable = state.scissor.enable;

        const different = enable !== this.state.scissor.enable;

        if (different)
        {
            this.state.scissor.enable = enable;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            if (enable)
            {
                gl.enable(gl.SCISSOR_TEST);
            }
            else
            {
                gl.disable(gl.SCISSOR_TEST);
            }
        }
    }

    updateScissorBox(state: any, force?: boolean): void
    {
        const scissorBox = state.scissor.box;
        const x = scissorBox[0];
        const y = scissorBox[1];
        const width = scissorBox[2];
        const height = scissorBox[3];

        const different = x !== this.state.scissor.box[0] ||
            y !== this.state.scissor.box[1] ||
            width !== this.state.scissor.box[2] ||
            height !== this.state.scissor.box[3];

        if (different)
        {
            this.state.scissor.box = [ x, y, width, height ];
        }
        if (different || force)
        {
            this.renderer.gl.scissor(
                x,
                y,
                width,
                height
            );
        }
    }

    updateStencil(state: any, force?: boolean): void
    {
        const stencil = state.stencil;
        if (stencil.clear !== undefined)
        {
            this.updateStencilClear(state, force);
        }
        if (stencil.enabled !== undefined)
        {
            this.updateStencilEnabled(state, force);
        }
        if (stencil.func !== undefined)
        {
            this.updateStencilFunc(state, force);
        }
        if (stencil.op !== undefined)
        {
            this.updateStencilOp(state, force);
        }
    }

    updateStencilClear(state: any, force?: boolean): void
    {
        const clear = state.stencil.clear;

        const different = clear !== this.state.stencil.clear;

        if (different)
        {
            this.state.stencil.clear = clear;
        }
        if (different || force)
        {
            this.renderer.gl.clearStencil(clear);
        }
    }

    updateStencilEnabled(state: any, force?: boolean): void
    {
        const enabled = state.stencil.enabled;

        const different = enabled !== this.state.stencil.enabled;

        if (different)
        {
            this.state.stencil.enabled = enabled;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            if (enabled)
            {
                gl.enable(gl.STENCIL_TEST);
            }
            else
            {
                gl.disable(gl.STENCIL_TEST);
            }
        }
    }

    updateStencilFunc(state: any, force?: boolean): void
    {
        const func = state.stencil.func;

        const different = func.func !== this.state.stencil.func.func ||
            func.ref !== this.state.stencil.func.ref ||
            func.mask !== this.state.stencil.func.mask;

        if (different)
        {
            this.state.stencil.func = { func: func.func, ref: func.ref, mask: func.mask };
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            gl.stencilFunc(func.func, func.ref, func.mask);
        }
    }

    updateStencilOp(state: any, force?: boolean): void
    {
        const op = state.stencil.op;

        const different = op.fail !== this.state.stencil.op.fail ||
            op.zfail !== this.state.stencil.op.zfail ||
            op.zpass !== this.state.stencil.op.zpass;

        if (different)
        {
            this.state.stencil.op = { fail: op.fail, zfail: op.zfail, zpass: op.zpass };
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            gl.stencilOp(op.fail, op.zfail, op.zpass);
        }
    }

    updateTexturing(state: any, force?: boolean): void
    {
        const texturing = state.texturing;
        if (texturing.flipY !== undefined)
        {
            this.updateTexturingFlipY(state, force);
        }
        if (texturing.premultiplyAlpha !== undefined)
        {
            this.updateTexturingPremultiplyAlpha(state, force);
        }
    }

    updateTexturingFlipY(state: any, force?: boolean): void
    {
        const flipY = state.texturing.flipY;

        const different = flipY !== this.state.texturing.flipY;

        if (different)
        {
            this.state.texturing.flipY = flipY;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        }
    }

    updateTexturingPremultiplyAlpha(state: any, force?: boolean): void
    {
        const premultiplyAlpha = state.texturing.premultiplyAlpha;

        const different = premultiplyAlpha !== this.state.texturing.premultiplyAlpha;

        if (different)
        {
            this.state.texturing.premultiplyAlpha = premultiplyAlpha;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
    }

    updateVAO(state: any, force?: boolean): void
    {
        const vao = state.vao;

        const different = vao !== this.state.vao;

        if (different)
        {
            this.state.vao = vao;
        }
        if (different || force)
        {
            const gl = this.renderer.gl;

            if (vao)
            {
                gl.bindVertexArray(vao.vertexArrayObject);
            }
            else
            {
                gl.bindVertexArray(null);
            }
        }
    }

    updateViewport(state: any, force?: boolean): void
    {
        const viewport = state.viewport;
        const x = viewport[0];
        const y = viewport[1];
        const width = viewport[2];
        const height = viewport[3];

        const different = x !== this.state.viewport[0] ||
            y !== this.state.viewport[1] ||
            width !== this.state.viewport[2] ||
            height !== this.state.viewport[3];

        if (different)
        {
            this.state.viewport = [ x, y, width, height ];
        }
        if (different || force)
        {
            this.renderer.gl.viewport(x, y, width, height);
        }
    }
}
