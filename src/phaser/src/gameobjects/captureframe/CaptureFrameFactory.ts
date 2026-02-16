/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { CaptureFrame } from './CaptureFrame';

import { GameObjectFactory } from '../GameObjectFactory';

/**
 * Creates a new CaptureFrame Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the CaptureFrame Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#captureFrame
 * @since 3.0.0
 *
 * @param {string} key - The key of the texture to create from this CaptureFrame.
 *
 * @return {Phaser.GameObjects.CaptureFrame} The Game Object that was created.
 */
export const CaptureFrameFactory = function (this: any, key: string): CaptureFrame {
    return this.displayList.add(new CaptureFrame(this.scene, key));
};

GameObjectFactory.register('captureFrame', CaptureFrameFactory);

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
