/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Core
 */

import * as Events from './events';

module.exports = {

    Config: require('./Config'),
    CreateRenderer: require('./CreateRenderer'),
    DebugHeader: require('./DebugHeader'),
    Events,
    TimeStep: require('./TimeStep'),
    VisibilityHandler: require('./VisibilityHandler')

};
