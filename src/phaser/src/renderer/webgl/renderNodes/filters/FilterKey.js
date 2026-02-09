/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterKey-frag.js');

var FilterKey = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterKey (manager)
    {
        BaseFilterShader.call(this, 'FilterKey', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uColor', controller.color);
        programManager.setUniform('uIsolateThresholdFeather', [
            controller.isolate,
            controller.threshold,
            controller.feather
        ]);
    }
});

module.exports = FilterKey;
