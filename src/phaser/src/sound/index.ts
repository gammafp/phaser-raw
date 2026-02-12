/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Sound
 */

import { SoundManagerCreator } from './SoundManagerCreator';

import * as Events from './events';
import { BaseSound } from './BaseSound';
import { BaseSoundManager } from './BaseSoundManager';
import { WebAudioSound } from './webaudio/WebAudioSound';
import { WebAudioSoundManager } from './webaudio/WebAudioSoundManager';
import { HTML5AudioSound } from './html5/HTML5AudioSound';
import { HTML5AudioSoundManager } from './html5/HTML5AudioSoundManager';
import { NoAudioSound } from './noaudio/NoAudioSound';
import { NoAudioSoundManager } from './noaudio/NoAudioSoundManager';

export default {
    SoundManagerCreator,
    Events,
    BaseSound,
    BaseSoundManager,
    WebAudioSound,
    WebAudioSoundManager,
    HTML5AudioSound,
    HTML5AudioSoundManager,
    NoAudioSound,
    NoAudioSoundManager
};
