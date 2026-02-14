/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { KeyCodes } from './KeyCodes';

export const KeyMap: Record<number, string> = {};

for (const key in KeyCodes)
{
    KeyMap[KeyCodes[key as keyof typeof KeyCodes]] = key;
}
