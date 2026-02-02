/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Sound
 */

export { SoundManagerCreator } from './SoundManagerCreator';

const Events = require('./events');
const BaseSound = require('./BaseSound');
const BaseSoundManager = require('./BaseSoundManager');
const WebAudioSound = require('./webaudio/WebAudioSound');
const WebAudioSoundManager = require('./webaudio/WebAudioSoundManager');
const HTML5AudioSound = require('./html5/HTML5AudioSound');
const HTML5AudioSoundManager = require('./html5/HTML5AudioSoundManager');
const NoAudioSound = require('./noaudio/NoAudioSound');
const NoAudioSoundManager = require('./noaudio/NoAudioSoundManager');

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
