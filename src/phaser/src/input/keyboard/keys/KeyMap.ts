/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { KeyCodes } from './KeyCodes';

const KeyMapTemp: Record<number, string> = {};

for (var key in KeyCodes)
{
    KeyMapTemp[(KeyCodes as any)[key]] = key;
}

export const KeyMap = KeyMapTemp;
