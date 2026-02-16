/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DefineTexCoordFrameClamp } from '../DefineTexCoordFrameClamp-glsl';

 /**
 * Returns a ShaderAdditionConfig for clamping coordinates inside a frame.
 * This prevents bleeding across the edges of the frame.
 * However, it creates a hard edge at the frame boundary.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeTexCoordFrameClamp
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
export const MakeTexCoordFrameClamp = function (disable?: boolean): any {
    return {
        name: 'TexCoordFrameClamp',
        additions: {
            fragmentHeader: DefineTexCoordFrameClamp,
            texCoord: 'texCoord = clampTexCoordWithinFrame(texCoord);'
        },
        disable: !!disable
    };
};
