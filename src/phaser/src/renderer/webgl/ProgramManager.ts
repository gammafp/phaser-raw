/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DeepCopy } from '../../utils/object/DeepCopy';

/**
 * @classdesc
 * The ProgramManager is a utility class used to manage
 * instantiated shader programs and a suite of associated data,
 * such as a VAO. It maintains a shared pool of uniforms,
 * so if a different shader program is used, the uniforms
 * can be applied to the new program.
 *
 * @class ProgramManager
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The current WebGLRenderer instance.
 * @param {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout[]} attributeBufferLayouts - The attribute buffer layouts to use in the program.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [indexBuffer] - The index buffer to use in the program, if any.
 */
export class ProgramManager {
    renderer: any;
    indexBuffer: any;
    attributeBufferLayouts: any[];
    currentProgramKey: string | null;
    currentConfig: {
        base: { vertexShader: string; fragmentShader: string; name?: string };
        additions: any[];
        features: string[];
    };
    programs: Record<string, any>;
    uniforms: Record<string, any>;

    constructor(renderer: any, attributeBufferLayouts: any[], indexBuffer?: any)
    {
        this.renderer = renderer;
        this.indexBuffer = indexBuffer;
        this.attributeBufferLayouts = attributeBufferLayouts;
        this.currentProgramKey = null;
        this.currentConfig = {
            base: {
                vertexShader: '',
                fragmentShader: ''
            },
            additions: [],
            features: []
        };
        this.programs = {};
        this.uniforms = {};
    }

    getCurrentProgramSuite(): any
    {
        const config = this.currentConfig;
        const renderer = this.renderer;
        const factory = renderer.shaderProgramFactory;

        const key = factory.getKey(config.base, config.additions, config.features);

        if (!this.programs[key])
        {
            const program = factory.getShaderProgram(config.base, config.additions, config.features);

            if (program.compiling)
            {
                program.checkParallelCompile();
            }

            if (!program.compiling)
            {
                this.programs[key] = {
                    program: program,
                    vao: renderer.createVAO(
                        program,
                        this.indexBuffer,
                        this.attributeBufferLayouts
                    ),
                    config: DeepCopy(config)
                };
            }
        }

        return this.programs[key] || null;
    }

    resetCurrentConfig(): void
    {
        this.currentConfig.base.vertexShader = '';
        this.currentConfig.base.fragmentShader = '';
        this.currentConfig.additions.length = 0;
        this.currentConfig.features.length = 0;
    }

    setUniform(name: string, value: any): void
    {
        this.uniforms[name] = value;
    }

    removeUniform(name: string): void
    {
        delete this.uniforms[name];
    }

    clearUniforms(): void
    {
        this.uniforms = {};
    }

    applyUniforms(program: any): void
    {
        const uniforms = this.uniforms;

        for (const name in uniforms)
        {
            program.setUniform(name, uniforms[name]);
        }
    }

    setBaseShader(name: string, vertexShader: string, fragmentShader: string): void
    {
        const base = this.currentConfig.base;
        base.name = name;
        base.vertexShader = vertexShader;
        base.fragmentShader = fragmentShader;
    }

    addAddition(addition: any, index?: number): void
    {
        if (index === undefined)
        {
            this.currentConfig.additions.push(addition);
        }
        else
        {
            this.currentConfig.additions.splice(index, 0, addition);
        }
    }

    getAddition(name: string): any
    {
        const additions = this.currentConfig.additions;
        for (let i = 0; i < additions.length; i++)
        {
            const addition = additions[i];
            if (addition.name === name)
            {
                return addition;
            }
        }
        return null;
    }

    getAdditionsByTag(tag: string): any[]
    {
        return this.currentConfig.additions.filter(function (addition: any)
        {
            if (!addition.tags)
            {
                return false;
            }
            return addition.tags.includes(tag);
        });
    }

    getAdditionIndex(name: string): number
    {
        return this.currentConfig.additions.findIndex(function (addition: any)
        {
            return addition.name === name;
        });
    }

    removeAddition(name: string): void
    {
        this.currentConfig.additions = this.currentConfig.additions.filter(function (addition: any)
        {
            return addition.name !== name;
        });
    }

    replaceAddition(name: string, addition: any): void
    {
        const index = this.currentConfig.additions.findIndex(function (a: any)
        {
            return a.name === name;
        });

        if (index !== -1)
        {
            this.currentConfig.additions[index] = addition;
        }
    }

    addFeature(feature: string): void
    {
        if (this.currentConfig.features.indexOf(feature) === -1)
        {
            this.currentConfig.features.push(feature);
        }
    }

    removeFeature(feature: string): void
    {
        this.currentConfig.features = this.currentConfig.features.filter(function (f: string)
        {
            return f !== feature;
        });
    }

    clearFeatures(): void
    {
        this.currentConfig.features.length = 0;
    }
}
