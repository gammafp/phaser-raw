/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { PHASER_CONST as CONST } from '../../../const';
import { DeepCopy } from '../../../utils/object/DeepCopy';
import { WebGLStencilParametersFactory } from './WebGLStencilParametersFactory';

/**
 * Factory for creating a WebGLGlobalParameters.
 *
 * @namespace Phaser.Renderer.WebGL.WebGLGlobalParametersFactory
 * @webglOnly
 * @since 4.0.0
 */
export const WebGLGlobalParametersFactory = {

    /**
     * Creates a new WebGLGlobalParameters.
     *
     * @method Phaser.Renderer.WebGL.WebGLGlobalParametersFactory#getDefault
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLGlobalParameters for.
     * @returns {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} The default WebGLGlobalParameters.
     */
    getDefault: function (renderer: any): any
    {
        const parameters = {
            bindings: {
                activeTexture: 0,
                arrayBuffer: null,
                elementArrayBuffer: null,
                framebuffer: null,
                program: null,
                renderbuffer: null
            },
            blend: DeepCopy(renderer.blendModes[CONST.BlendModes.NORMAL]),
            colorClearValue: [ 0, 0, 0, 1 ],
            colorWritemask: [ true, true, true, true ],
            cullFace: false,
            depthTest: false,
            scissor: {
                enable: true,
                box: [ 0, 0, 0, 0 ]
            },
            stencil: WebGLStencilParametersFactory.create(renderer),
            texturing: {
                flipY: false,
                premultiplyAlpha: false
            },
            vao: null,
            viewport: [ 0, 0, 0, 0 ]
        };

        return parameters;
    }
};
