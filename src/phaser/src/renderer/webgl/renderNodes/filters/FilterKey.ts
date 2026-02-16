/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseFilterShader } from './BaseFilterShader';
import { FilterKeyFrag } from '../../shaders/FilterKey-frag';

export class FilterKey extends BaseFilterShader {

    constructor (manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager)
    {
        super('FilterKey', manager, null, FilterKeyFrag);
    }

    setupUniforms (controller: Phaser.Filters.Controller, _drawingContext: Phaser.Renderer.WebGL.DrawingContext): void
    {
        const programManager = this.programManager;

        programManager.setUniform('uColor', controller.color);
        programManager.setUniform('uIsolateThresholdFeather', [
            controller.isolate,
            controller.threshold,
            controller.feather
        ]);
    }
}
