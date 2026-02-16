/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Arcade Physics World Collide Event.
 *
 * This event is dispatched by an Arcade Physics World instance if two bodies collide _and_ at least
 * one of them has their [onCollide]{@link Phaser.Physics.Arcade.Body#onCollide} property set to `true`.
 *
 * It provides an alternative means to handling collide events rather than using the callback approach.
 *
 * Listen to it from a Scene using: `this.physics.world.on('collide', listener)`.
 *
 * Please note that 'collide' and 'overlap' are two different things in Arcade Physics.
 */
export const COLLIDE: string = 'collide';
