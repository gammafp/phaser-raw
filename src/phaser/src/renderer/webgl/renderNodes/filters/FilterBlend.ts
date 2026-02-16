/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Map } from '../../../../structs/Map';
import { BlendModes } from '../../../BlendModes';
import { BaseFilterShader } from './BaseFilterShader';
import { FilterBlendFrag } from '../../shaders/FilterBlend-frag';

/**
 * @classdesc
 * This RenderNode renders the Blend filter effect.
 * See {@link Phaser.Filters.Blend}.
 *
 * @class FilterBlend
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterBlend extends BaseFilterShader {

    private _blendModeMap: Map<number, string>;

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        const blendModeMap = new Map<number, string>();
        Object.entries(BlendModes).forEach(function (entry: [string, number])
        {
            blendModeMap.set(entry[1], entry[0]);
        });

        const normal = blendModeMap.get(BlendModes.NORMAL);

        const additions = [
            {
                name: normal,
                additions: {
                    fragmentHeader: '#define BLEND ' + normal
                },
                tags: [ 'blendmode' ]
            }
        ];

        super('FilterBlend', manager, null, FilterBlendFrag, additions);

        /**
         * A map from blend mode integers to their string names.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FilterBlend#_blendModeMap
         * @type {Phaser.Structs.Map}
         * @private
         * @since 4.0.0
         */
        this._blendModeMap = blendModeMap;
    }

    updateShaderConfig (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        let blendMode = controller.blendMode;
        if (blendMode === BlendModes.SKIP_CHECK)
        {
            blendMode = BlendModes.NORMAL;
        }
        const name = this._blendModeMap.get(blendMode) || this._blendModeMap.get(BlendModes.NORMAL);

        const blendModeAddition = this.programManager.getAdditionsByTag('blendmode')[0];
        blendModeAddition.name = name;
        blendModeAddition.additions.fragmentHeader = '#define BLEND ' + name;
    }

    setupTextures (controller: Phaser.Filters.Controller, textures: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[], drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        // Blend texture.
        textures[1] = controller.glTexture;
    }

    setupUniforms (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uMainSampler2', 1);
        programManager.setUniform('amount', controller.amount);
        programManager.setUniform('color', controller.color);
    }
}
