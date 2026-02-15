/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Utils
 */

// Export all utils namespaces for tree-shaking
export * as Array from './array';
export * as Base64 from './base64';
export * as Objects from './object';
export * as String from './string';

// Export simple utilities
export { NOOP } from './NOOP';
export { NULL } from './NULL';

// Class system (still in JS)
const Class = require('./Class');

export { Class };
