/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { SpriteGPULayer } from './SpriteGPULayer';

import { BlendModes } from '../../renderer/BlendModes';
import { GameObjectCreator } from '../GameObjectCreator';

/**
 * Creates a new SpriteGPULayer Game Object and returns it.
 *
 * Note: This method will only be available if the SpriteGPULayer Game Object
 * has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#spriteGPULayer
 * @since 4.0.0
 *
 * @param {Phaser.Types.GameObjects.SpriteGPULayer.SpriteGPULayerConfig} config - The configuration object this Game Object will use to create itself. Must include `{ size: number }`.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.SpriteGPULayer} The Game Object that was created.
 */
export const SpriteGPULayerCreator = function (this: any, config: any, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var size = GetAdvancedValue(config, 'size', 1);

    var gpuLayer = new SpriteGPULayer(this.scene, key, size);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    //  Alpha
    gpuLayer.alpha = GetAdvancedValue(config, 'alpha', 1);

    // Blend Mode
    gpuLayer.blendMode = GetAdvancedValue(config, 'blendMode', BlendModes.NORMAL);

    // Visible
    gpuLayer.visible = GetAdvancedValue(config, 'visible', true);

    if (addToScene)
    {
        this.scene.sys.displayList.add(gpuLayer);
    }

    return gpuLayer;
};

GameObjectCreator.register('spriteGPULayer', SpriteGPULayerCreator);
