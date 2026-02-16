/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extern } from './Extern';

import { GameObjectFactory } from '../GameObjectFactory';

/**
 * Creates a new Extern Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Extern Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#extern
 * @since 3.16.0
 *
 * @return {Phaser.GameObjects.Extern} The Game Object that was created.
 */
export const ExternFactory = function (this: any): Extern {
    const extern = new Extern(this.scene);

    this.displayList.add(extern);

    return extern;
};

GameObjectFactory.register('extern', ExternFactory);

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
