/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @classdesc
 * The ShaderProgramFactory is a utility class used to generate
 * {@link Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} objects.
 * It facilitates generating variants of a shader program based on
 * configuration settings.
 *
 * @class ShaderProgramFactory
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer that owns this ShaderProgramFactory.
 */
export class ShaderProgramFactory {

    renderer: any;
    programs: Record<string, any>;

    constructor(renderer: any)
    {
        /**
         * The WebGLRenderer that owns this ShaderProgramFactory.
         *
         * @name Phaser.Renderer.WebGL.ShaderProgramFactory#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * A map of shader programs, identified by a unique key.
         *
         * @name Phaser.Renderer.WebGL.ShaderProgramFactory#programs
         * @type {object}
         * @since 4.0.0
         */
        this.programs = {};
    }

    /**
     * Checks if a shader program exists based on the given configuration settings.
     *
     * @method Phaser.Renderer.WebGL.ShaderProgramFactory#has
     * @since 4.0.0
     * @param {string} key - The unique key of the shader program.
     */
    has(key: string): boolean
    {
        return this.programs[key] !== undefined;
    }

    /**
     * Returns a shader program based on the given configuration settings.
     *
     * @method Phaser.Renderer.WebGL.ShaderProgramFactory#getShaderProgram
     * @since 4.0.0
     * @param {BaseShaderConfig} base - The base shader configuration.
     * @param {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [additions] - An array of shader addition configurations.
     * @param {string[]} [features] - An array of enabled shader feature keys.
     */
    getShaderProgram(base: any, additions?: any[], features?: string[]): any
    {
        const key = this.getKey(base, additions, features);

        let program = this.programs[key];

        if (!program)
        {
            program = this.createShaderProgram(key, base, additions, features);
        }

        return program;
    }

    /**
     * Returns a unique key for a shader program based on the given configuration settings.
     *
     * @method Phaser.Renderer.WebGL.ShaderProgramFactory#getKey
     * @since 4.0.0
     * @param {BaseShaderConfig} base - The base shader configuration.
     * @param {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [additions] - An array of shader addition configurations.
     * @param {string[]} [features] - An array of enabled shader feature keys.
     */
    getKey(base: any, additions?: any[], features?: string[]): string
    {
        let key = base.name;

        if (additions && additions.length > 0)
        {
            key += '_';
            for (let i = 0; i < additions.length; i++)
            {
                const addition = additions[i];
                if (!addition.disable)
                {
                    key += '_' + addition.name;
                }
            }
        }

        if (features && features.length > 0)
        {
            key += '__';
            key += features.sort().join('_');
        }

        return key;
    }

    /**
     * Creates a shader program based on the given configuration settings.
     *
     * @method Phaser.Renderer.WebGL.ShaderProgramFactory#createShaderProgram
     * @since 4.0.0
     * @param {string} name - The unique key of the shader program.
     * @param {BaseShaderConfig} base - The base shader configuration.
     * @param {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [additions] - An array of shader addition configurations.
     * @param {string[]} [features] - An array of enabled shader feature keys.
     */
    createShaderProgram(name: string, base: any, additions?: any[], features?: string[]): any
    {
        let vertexSource = base.vertexShader;
        let fragmentSource = base.fragmentShader;

        // Remove carriage return characters from the shader source.
        vertexSource = vertexSource.replace(/\r/g, '');
        fragmentSource = fragmentSource.replace(/\r/g, '');

        if (additions)
        {
            let key: string;
            let value: string;
            const templates: Record<string, string> = {};

            for (let i = 0; i < additions.length; i++)
            {
                const addition = additions[i];

                if (addition.disable)
                {
                    continue;
                }

                for (key in addition.additions)
                {
                    value = addition.additions[key];

                    // Remove carriage return characters from the shader source.
                    value = value.replace(/\r/g, '');

                    if (!templates[key])
                    {
                        templates[key] = '';
                    }

                    templates[key] += value + '\n';
                }
            }

            for (key! in templates)
            {
                const template = '#pragma phaserTemplate(' + key + ')\n';
                value! = templates[key];

                vertexSource = vertexSource.replace(template, value!);
                fragmentSource = fragmentSource.replace(template, value!);
            }
        }

        if (features)
        {
            let featureDefines = '';
            const reInvalid = /[^a-zA-Z0-9]/g;

            for (let i = 0; i < features.length; i++)
            {
                const feature = features[i].toUpperCase().replace(reInvalid, '_');
                featureDefines += '#define FEATURE_' + feature + '\n';
            }

            vertexSource = vertexSource.replace('#pragma phaserTemplate(features)', featureDefines);
            fragmentSource = fragmentSource.replace('#pragma phaserTemplate(features)', featureDefines);
        }

        // Name the program after the key.
        vertexSource = vertexSource.replace('#pragma phaserTemplate(shaderName)', '#define SHADER_NAME ' + name + '__VERTEX');
        fragmentSource = fragmentSource.replace('#pragma phaserTemplate(shaderName)', '#define SHADER_NAME ' + name + '__FRAGMENT');

        // Remove any remaining template directives.
        const rePragma = /\s*#pragma phaserTemplate\(.*/g;
        vertexSource = vertexSource.replace(rePragma, '');
        fragmentSource = fragmentSource.replace(rePragma, '');

        const program = this.renderer.createProgram(vertexSource, fragmentSource);

        this.programs[name] = program;

        return program;
    }
}
