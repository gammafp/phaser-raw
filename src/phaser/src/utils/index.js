/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Utils
 */

import { NOOP } from './NOOP';
import { NULL } from './NULL';


// Modules
export { NOOP, NULL };

// By default
// export default {
//     NOOP,
//     NULL,
// }

// Old mode
module.exports = {

    Array: require('./array/'),
    Base64: require('./base64/'),
    Objects: require('./object/'),
    String: require('./string/'),

};
