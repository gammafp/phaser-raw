/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Arcade Physics World Bounds Event.
 *
 * This event is dispatched by an Arcade Physics World instance if a body makes contact with the world bounds _and_
 * it has its [onWorldBounds]{@link Phaser.Physics.Arcade.Body#onWorldBounds} property set to `true`.
 *
 * It provides an alternative means to handling collide events rather than using the callback approach.
 *
 * Listen to it from a Scene using: `this.physics.world.on('worldbounds', listener)`.
 */
export const WORLD_BOUNDS: string = 'worldbounds';
