/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { OutInverseRotation } from '../OutInverseRotation-glsl';

/**
 * Return a ShaderAdditionConfig for creating an outInverseRotationMatrix
 * in the vertex shader, which is used to apply lighting to a texture.
 *
 * The `rotation` variable must be available in the vertex renderer.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeOutInverseRotation
 * @since 4.0.0
 *
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
export const MakeOutInverseRotation = function (disable?: boolean): any {
    return {
        name: 'OutInverseRotation',
        additions: {
            vertexHeader: 'uniform vec4 uCamera;',
            vertexProcess: OutInverseRotation,
            outVariables: 'varying mat3 outInverseRotationMatrix;'
        },
        tags: [ 'LIGHTING' ],
        disable: !!disable
    };
};
