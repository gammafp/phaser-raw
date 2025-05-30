/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.DOM
 */

import { AddToDOM } from './AddToDOM';
import { DOMContentLoaded } from './DOMContentLoaded';
import { GetInnerHeight } from './GetInnerHeight';
import { GetScreenOrientation } from './GetScreenOrientation';
import { GetTarget } from './GetTarget';
import { RemoveFromDOM } from './RemoveFromDOM';
import { RequestAnimationFrame } from './RequestAnimationFrame';
import { ParseXML } from './ParseXML';

export {
    AddToDOM,
    DOMContentLoaded,
    GetInnerHeight,
    GetScreenOrientation,
    GetTarget,
    RemoveFromDOM,
    RequestAnimationFrame,
    ParseXML
};

const Dom = {
    AddToDOM,
    DOMContentLoaded,
    GetInnerHeight,
    GetScreenOrientation,
    GetTarget,
    RemoveFromDOM,
    RequestAnimationFrame,
    ParseXML
};

export default Dom;
