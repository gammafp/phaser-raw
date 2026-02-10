/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Utils
 */

import { NOOP } from './NOOP';

export { NOOP };

module.exports = {

    Array: require('./array/'),
    Base64: require('./base64/'),
    Objects: require('./object/'),
    String: require('./string/'),
    NULL: require('./NULL')

};
