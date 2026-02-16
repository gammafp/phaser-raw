/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { CaptureFrame } from './CaptureFrame';

import { GameObjectCreator } from '../GameObjectCreator';

/**
 * Creates a new CaptureFrame Game Object and returns it.
 *
 * Note: This method will only be available if the CaptureFrame Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#captureFrame
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself. CaptureFrame only uses the `key`, `visible`, `depth`, and `add` properties.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.CaptureFrame} The Game Object that was created.
 */
export const CaptureFrameCreator = function (this: any, config: any, addToScene?: boolean): CaptureFrame {
    if (config === undefined) { config = {}; }

    const depth = GetAdvancedValue(config, 'depth', 0);
    const key = GetAdvancedValue(config, 'key', null);
    const visible = GetAdvancedValue(config, 'visible', true);

    const captureFrame = new CaptureFrame(this.scene, key);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    // This method does not use BuildGameObject, because most of the properties
    // are not settable on a CaptureFrame, and it doesn't render.
    captureFrame
        .setDepth(depth)
        .setVisible(visible);

    if (config.add)
    {
        this.scene.sys.displayList.add(captureFrame);
    }

    return captureFrame;
};

GameObjectCreator.register('captureFrame', CaptureFrameCreator);

//  When registering a factory function 'this' refers to the GameObjectCreator context.
