/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Group } from './Group';

import { GameObjectCreator } from '../GameObjectCreator';

/**
 * Creates a new Group Game Object and returns it.
 *
 * Note: This method will only be available if the Group Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#group
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Group.GroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig} config - The configuration object this Game Object will use to create itself.
 *
 * @return {Phaser.GameObjects.Group} The Game Object that was created.
 */
export const GroupCreator = function (this: any, config: any): Group {
    return new Group(this.scene, null, config);
};

GameObjectCreator.register('group', GroupCreator);

//  When registering a factory function 'this' refers to the GameObjectCreator context.
