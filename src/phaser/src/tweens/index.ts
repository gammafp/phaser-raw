/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Tweens
 */

import { TweenManager } from './TweenManager';
import { TWEEN_CONST } from './tween/const';
import { TweenData } from './tween/TweenData';
import { TweenFrameData } from './tween/TweenFrameData';
import { BaseTween } from './tween/BaseTween';
import { Tween } from './tween/Tween';
import { TweenChain } from './tween/TweenChain';
import * as Builders from './builders';
import * as Events from './events';

const Tweens: any = {

    States: TWEEN_CONST,

    Builders,
    Events,

    TweenManager,
    Tween,
    TweenData,
    TweenFrameData,

    BaseTween,
    TweenChain
};

// TODO: Remove this for tree-shaking
export default Tweens;

// Also export individual classes for tree-shaking
export {
    TweenManager,
    TWEEN_CONST,
    TweenData,
    TweenFrameData,
    BaseTween,
    Tween,
    TweenChain,
    Builders,
    Events
};
