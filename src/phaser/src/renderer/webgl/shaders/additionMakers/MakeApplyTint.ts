/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ApplyTint } from '../ApplyTint-glsl';

/**
 * Return a ShaderAdditionConfig for applying a tint to a texture.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeApplyTint
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
export const MakeApplyTint = function (disable?: boolean): any {
    return {
        name: 'Tint',
        additions: {
            fragmentHeader: ApplyTint,
            fragmentProcess: 'fragColor = applyTint(fragColor);'
        },
        tags: ['TINT'],
        disable: !!disable
    };
};
