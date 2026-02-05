/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Input.Keyboard
 */

import * as Events from './events';
import { KeyboardManager } from './KeyboardManager';
import { KeyboardPlugin } from './KeyboardPlugin';
import { Key } from './keys/Key';
import { KeyCodes } from './keys/KeyCodes';
import { KeyCombo } from './combo/KeyCombo';
import { AdvanceKeyCombo } from './combo/AdvanceKeyCombo';
import { ProcessKeyCombo } from './combo/ProcessKeyCombo';
import { ResetKeyCombo } from './combo/ResetKeyCombo';
import { JustDown } from './keys/JustDown';
import { JustUp } from './keys/JustUp';
import { DownDuration } from './keys/DownDuration';
import { UpDuration } from './keys/UpDuration';

export {
    Events,
    KeyboardManager,
    KeyboardPlugin,
    Key,
    KeyCodes,
    KeyCombo,
    AdvanceKeyCombo,
    ProcessKeyCombo,
    ResetKeyCombo,
    JustDown,
    JustUp,
    DownDuration,
    UpDuration
};
