/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { GetValue } from '../../utils/object/GetValue';
import { NineSlice } from './NineSlice';

import { BuildGameObject } from '../BuildGameObject';
import { GameObjectCreator } from '../GameObjectCreator';

/**
 * Creates a new Nine Slice Game Object and returns it.
 *
 * Note: This method will only be available if the Nine Slice Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#nineslice
 * @since 3.60.0
 *
 * @param {Phaser.Types.GameObjects.NineSlice.NineSliceConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.NineSlice} The Game Object that was created.
 */
export const NineSliceCreator = function (this: any, config?: any, addToScene?: boolean): any
{
    if (config === undefined) { config = {}; }

    const key = GetAdvancedValue(config, 'key', null);
    const frame = GetAdvancedValue(config, 'frame', null);
    const width = GetValue(config, 'width', 256);
    const height = GetValue(config, 'height', 256);
    const leftWidth = GetValue(config, 'leftWidth', 10);
    const rightWidth = GetValue(config, 'rightWidth', 10);
    const topHeight = GetValue(config, 'topHeight', 0);
    const bottomHeight = GetValue(config, 'bottomHeight', 0);

    const nineslice = new NineSlice(this.scene, 0, 0, key, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, nineslice, config);

    return nineslice;
};

if (typeof WEBGL_RENDERER !== 'undefined')
{
    GameObjectCreator.register('nineslice', NineSliceCreator);
}
