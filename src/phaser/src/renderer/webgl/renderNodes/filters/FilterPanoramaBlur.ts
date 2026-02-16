/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterPanoramaBlurFrag } from '../../shaders/FilterPanoramaBlur-frag';

/**
 * @classdesc
 * This RenderNode renders the PanoramaBlue filter effect.
 * See {@link Phaser.Filters.PanoramaBlue}.
 *
 * @class FilterPanoramaBlue
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FilterPanoramaBlur extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        const additions = [
            {
                name: 'samples_32_16',
                additions: {
                    fragmentHeader: '#define SAMPLES_X 32.0\n#define SAMPLES_Y 16.0'
                },
                tags: [ 'samples' ]
            }
        ];

        super('FilterPanoramaBlur', manager, null, FilterPanoramaBlurFrag, additions);
    }

    updateShaderConfig (controller: Phaser.Filters.Controller, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const samplesX = controller.samplesX.toFixed(0);
        const samplesY = controller.samplesY.toFixed(0);
        const samplesAddition = this.programManager.getAdditionsByTag('samples')[0];
        samplesAddition.name = 'samples_' + samplesX + '_' + samplesY;
        samplesAddition.additions.fragmentHeader = '#define SAMPLES_X ' + samplesX + '.0\n#define SAMPLES_Y ' + samplesY + '.0';
    }

    setupUniforms (controller: Phaser.Filters.Controller, _drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uRadius', controller.radius);
        programManager.setUniform('uPower', controller.power);
    }
}
