/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Wrappers
 */

import { WebGLGlobalWrapper } from './WebGLGlobalWrapper';
import { WebGLBufferWrapper } from './WebGLBufferWrapper';
import { WebGLProgramWrapper } from './WebGLProgramWrapper';
import { WebGLShaderSetterWrapper } from './WebGLShaderSetterWrapper';
import { WebGLTextureWrapper } from './WebGLTextureWrapper';
import { WebGLTextureUnitsWrapper } from './WebGLTextureUnitsWrapper';
import { WebGLFramebufferWrapper } from './WebGLFramebufferWrapper';
import { WebGLVAOWrapper } from './WebGLVAOWrapper';
import { WebGLVertexBufferLayoutWrapper } from './WebGLVertexBufferLayoutWrapper';

export const Wrappers = {
    WebGLGlobalWrapper,
    WebGLBufferWrapper,
    WebGLProgramWrapper,
    WebGLShaderSetterWrapper,
    WebGLTextureWrapper,
    WebGLTextureUnitsWrapper,
    WebGLFramebufferWrapper,
    WebGLVAOWrapper,
    WebGLVertexBufferLayoutWrapper
};
