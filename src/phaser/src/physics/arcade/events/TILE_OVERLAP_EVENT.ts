/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Arcade Physics Tile Overlap Event.
 *
 * This event is dispatched by an Arcade Physics World instance if a body overlaps with a Tile _and_
 * has its [onOverlap]{@link Phaser.Physics.Arcade.Body#onOverlap} property set to `true`.
 *
 * It provides an alternative means to handling overlap events rather than using the callback approach.
 *
 * Listen to it from a Scene using: `this.physics.world.on('tileoverlap', listener)`.
 *
 * Please note that 'collide' and 'overlap' are two different things in Arcade Physics.
 */
export const TILE_OVERLAP: string = 'tileoverlap';
