/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Arcade Physics Tile Collide Event.
 *
 * This event is dispatched by an Arcade Physics World instance if a body collides with a Tile _and_
 * has its [onCollide]{@link Phaser.Physics.Arcade.Body#onCollide} property set to `true`.
 *
 * It provides an alternative means to handling collide events rather than using the callback approach.
 *
 * Listen to it from a Scene using: `this.physics.world.on('tilecollide', listener)`.
 *
 * Please note that 'collide' and 'overlap' are two different things in Arcade Physics.
 */
export const TILE_COLLIDE: string = 'tilecollide';
