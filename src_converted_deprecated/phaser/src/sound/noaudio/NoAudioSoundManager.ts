/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { BaseSoundManager } from '../BaseSoundManager';
import { EventEmitter } from 'eventemitter3';
import { NoAudioSound } from './NoAudioSound';
import { NOOP } from '../../utils/NOOP';

/**
 * @classdesc
 * No-audio implementation of the Sound Manager. It is used if audio has been
 * disabled in the game config or the device doesn't support any audio.
 *
 * It represents a graceful degradation of Sound Manager logic that provides
 * minimal functionality and prevents Phaser projects that use audio from
 * breaking on devices that don't support any audio playback technologies.
 *
 * @class NoAudioSoundManager
 * @extends Phaser.Sound.BaseSoundManager
 * @memberof Phaser.Sound
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 */
export class NoAudioSoundManager extends EventEmitter {

    game: any;
    sounds: any[];
    mute: boolean;
    volume: number;
    rate: number;
    detune: number;
    pauseOnBlur: boolean;
    locked: boolean;

    constructor(game: any)
    {
        super();

        this.game = game;
        this.sounds = [];
        this.mute = false;
        this.volume = 1;
        this.rate = 1;
        this.detune = 0;
        this.pauseOnBlur = true;
        this.locked = false;
    }

    /**
     * Adds a new sound into the sound manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#add
     * @since 3.60.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {Phaser.Sound.NoAudioSound} The new sound instance.
     */
    add(key: string, config?: any): NoAudioSound
    {
        var sound = new NoAudioSound(this, key, config);

        this.sounds.push(sound);

        return sound;
    }

    /**
     * Adds a new audio sprite sound into the sound manager.
     * Audio Sprites are a combination of audio files and a JSON configuration.
     * The JSON follows the format of that created by https://github.com/tonistiigi/audiosprite
     *
     * @method Phaser.Sound.NoAudioSoundManager#addAudioSprite
     * @since 3.60.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {Phaser.Sound.NoAudioSound} The new audio sprite sound instance.
     */
    addAudioSprite(key: string, config?: any): NoAudioSound
    {
        var sound = this.add(key, config);

        (sound as any).spritemap = {};

        return sound;
    }

    /**
     * Gets the first sound in the manager matching the given key, if any.
     *
     * @method Phaser.Sound.NoAudioSoundManager#get
     * @since 3.23.0
     *
     * @generic {Phaser.Sound.BaseSound} T
     * @genericUse {T} - [$return]
     *
     * @param {string} key - Sound asset key.
     *
     * @return {?Phaser.Sound.BaseSound} - The sound, or null.
     */
    get(key: string): any
    {
        return (BaseSoundManager.prototype.get as any).call(this, key);
    }

    /**
     * Gets any sounds in the manager matching the given key.
     *
     * @method Phaser.Sound.NoAudioSoundManager#getAll
     * @since 3.23.0
     *
     * @generic {Phaser.Sound.BaseSound} T
     * @genericUse {T[]} - [$return]
     *
     * @param {string} key - Sound asset key.
     *
     * @return {Phaser.Sound.BaseSound[]} - The sounds, or an empty array.
     */
    getAll(key: string): any[]
    {
        return (BaseSoundManager.prototype.getAll as any).call(this, key);
    }

    /**
     * This method does nothing but return 'false' for the No Audio Sound Manager, to maintain
     * compatibility with the other Sound Managers.
     *
     * @method Phaser.Sound.NoAudioSoundManager#play
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {(Phaser.Types.Sound.SoundConfig|Phaser.Types.Sound.SoundMarker)} [extra] - An optional additional object containing settings to be applied to the sound. It could be either config or marker object.
     *
     * @return {boolean} Always 'false' for the No Audio Sound Manager.
     */
    // eslint-disable-next-line no-unused-vars
    play(key: string, extra?: any): boolean
    {
        return false;
    }

    /**
     * This method does nothing but return 'false' for the No Audio Sound Manager, to maintain
     * compatibility with the other Sound Managers.
     *
     * @method Phaser.Sound.NoAudioSoundManager#playAudioSprite
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {string} spriteName - The name of the sound sprite to play.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {boolean} Always 'false' for the No Audio Sound Manager.
     */
    // eslint-disable-next-line no-unused-vars
    playAudioSprite(key: string, spriteName: string, config?: any): boolean
    {
        return false;
    }

    /**
     * Removes a sound from the sound manager.
     * The removed sound is destroyed before removal.
     *
     * @method Phaser.Sound.NoAudioSoundManager#remove
     * @since 3.0.0
     *
     * @param {Phaser.Sound.BaseSound} sound - The sound object to remove.
     *
     * @return {boolean} True if the sound was removed successfully, otherwise false.
     */
    remove(sound: any): boolean
    {
        return (BaseSoundManager.prototype.remove as any).call(this, sound);
    }

    /**
     * Removes all sounds from the manager, destroying the sounds.
     *
     * @method Phaser.Sound.NoAudioSoundManager#removeAll
     * @since 3.23.0
     */
    removeAll(): void
    {
        return (BaseSoundManager.prototype.removeAll as any).call(this);
    }

    /**
     * Removes all sounds from the sound manager that have an asset key matching the given value.
     * The removed sounds are destroyed before removal.
     *
     * @method Phaser.Sound.NoAudioSoundManager#removeByKey
     * @since 3.0.0
     *
     * @param {string} key - The key to match when removing sound objects.
     *
     * @return {number} The number of matching sound objects that were removed.
     */
    removeByKey(key: string): number
    {
        return (BaseSoundManager.prototype.removeByKey as any).call(this, key);
    }

    /**
     * Stops any sounds matching the given key.
     *
     * @method Phaser.Sound.NoAudioSoundManager#stopByKey
     * @since 3.23.0
     *
     * @param {string} key - Sound asset key.
     *
     * @return {number} - How many sounds were stopped.
     */
    stopByKey(key: string): number
    {
        return (BaseSoundManager.prototype.stopByKey as any).call(this, key);
    }

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#onBlur
     * @since 3.0.0
     */
    onBlur(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#onFocus
     * @since 3.0.0
     */
    onFocus(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#onGameBlur
     * @since 3.0.0
     */
    onGameBlur(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#onGameFocus
     * @since 3.0.0
     */
    onGameFocus(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#pauseAll
     * @since 3.0.0
     */
    pauseAll(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#resumeAll
     * @since 3.0.0
     */
    resumeAll(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#stopAll
     * @since 3.0.0
     */
    stopAll(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#update
     * @since 3.0.0
     */
    update(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#setRate
     * @since 3.0.0
     *
     * @return {this} This Sound Manager.
     */
    setRate(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#setDetune
     * @since 3.0.0
     *
     * @return {this} This Sound Manager.
     */
    setDetune(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#setMute
     * @since 3.0.0
     */
    setMute(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#setVolume
     * @since 3.0.0
     */
    setVolume(): void {}

    /**
     * Empty function for the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#unlock
     * @since 3.0.0
     */
    unlock(): void {}

    /**
     * Method used internally for iterating only over active sounds and skipping sounds that are marked for removal.
     *
     * @method Phaser.Sound.NoAudioSoundManager#forEachActiveSound
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Types.Sound.EachActiveSoundCallback} callback - Callback function. (manager: Phaser.Sound.BaseSoundManager, sound: Phaser.Sound.BaseSound, index: number, sounds: Phaser.Manager.BaseSound[]) => void
     * @param {*} [scope] - Callback context.
     */
    forEachActiveSound(callbackfn: Function, scope?: any): void
    {
        (BaseSoundManager.prototype.forEachActiveSound as any).call(this, callbackfn, scope);
    }

    /**
     * Destroys all the sounds in the game and all associated events.
     *
     * @method Phaser.Sound.NoAudioSoundManager#destroy
     * @since 3.0.0
     */
    destroy(): void
    {
        (BaseSoundManager.prototype.destroy as any).call(this);
    }

}
