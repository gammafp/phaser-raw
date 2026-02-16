/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { UUID } from '../../utils/string/UUID';
import { Clamp } from '../../math/Clamp';
import { MATH_CONST } from '../../math/const';
import { Mixin } from '../../utils/MixinTS';
import { Alpha } from '../components/Alpha';
import { BlendMode } from '../components/BlendMode';
import { ComputedSize } from '../components/ComputedSize';
import { Depth } from '../components/Depth';
import { Flip } from '../components/Flip';
import { GetBounds } from '../components/GetBounds';
import { Lighting } from '../components/Lighting';
import { Mask } from '../components/Mask';
import { Origin } from '../components/Origin';
import { RenderNodes } from '../components/RenderNodes';
import { ScrollFactor } from '../components/ScrollFactor';
import { TextureCrop } from '../components/TextureCrop';
import { Tint } from '../components/Tint';
import { Transform } from '../components/Transform';
import { Visible } from '../components/Visible';
import { renderWebGL, renderCanvas } from './VideoRender';

import { DefaultImageNodes } from '../../renderer/webgl/renderNodes/defaults/DefaultImageNodes';
import { GameObject } from '../GameObject';
const Events = require('../events');
const GameEvents = require('../../core/events/');
const SoundEvents = require('../../sound/events/');

/**
 * @classdesc
 * A Video Game Object.
 *
 * This Game Object is capable of handling playback of a video file, video stream or media stream.
 *
 * You can optionally 'preload' the video into the Phaser Video Cache:
 *
 * ```javascript
 * preload () {
 *   this.load.video('ripley', 'assets/aliens.mp4');
 * }
 *
 * create () {
 *   this.add.video(400, 300, 'ripley');
 * }
 * ```
 *
 * You don't have to 'preload' the video. You can also play it directly from a URL:
 *
 * ```javascript
 * create () {
 *   this.add.video(400, 300).loadURL('assets/aliens.mp4');
 * }
 * ```
 *
 * To all intents and purposes, a video is a standard Game Object, just like a Sprite. And as such, you can do
 * all the usual things to it, such as scaling, rotating, cropping, tinting, making interactive, giving a
 * physics body, etc.
 *
 * Transparent videos are also possible via the WebM file format. Providing the video file has was encoded with
 * an alpha channel, and providing the browser supports WebM playback (not all of them do), then it will render
 * in-game with full transparency.
 *
 * Transparent videos are supported by the HEVC (H.265) codec,
 * but only on some devices and browsers, and sometimes the alpha channel is ignored,
 * which can be a problem if you're aiming for a consistent experience.
 * We advise against relying on HEVC.
 *
 * Playback is handled entirely via the Request Video Frame API, which is supported by most modern browsers.
 * A polyfill is provided for older browsers.
 *
 * ### Autoplaying Videos
 *
 * Videos can only autoplay if the browser has been unlocked with an interaction, or satisfies the MEI settings.
 * The policies that control autoplaying are vast and vary between browser. You can, and should, read more about
 * it here: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
 *
 * If your video doesn't contain any audio, then set the `noAudio` parameter to `true` when the video is _loaded_,
 * and it will often allow the video to play immediately:
 *
 * ```javascript
 * preload () {
 *   this.load.video('pixar', 'nemo.mp4', true);
 * }
 * ```
 *
 * The 3rd parameter in the load call tells Phaser that the video doesn't contain any audio tracks. Video without
 * audio can autoplay without requiring a user interaction. Video with audio cannot do this unless it satisfies
 * the browsers MEI settings. See the MDN Autoplay Guide for further details.
 *
 * Or:
 *
 * ```javascript
 * create () {
 *   this.add.video(400, 300).loadURL('assets/aliens.mp4', true);
 * }
 * ```
 *
 * You can set the `noAudio` parameter to `true` even if the video does contain audio. It will still allow the video
 * to play immediately, but the audio will not start.
 *
 * Note that due to a bug in IE11 you cannot play a video texture to a Sprite in WebGL. For IE11 force Canvas mode.
 *
 * More details about video playback and the supported media formats can be found on MDN:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
 * https://developer.mozilla.org/en-US/docs/Web/Media/Formats
 *
 * @class Video
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.20.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} [key] - Optional key of the Video this Game Object will play, as stored in the Video Cache.
 */

// Interface merging - Video now has all component methods/properties with full TypeScript support
export interface Video extends
    Alpha,
    BlendMode,
    ComputedSize,
    Depth,
    Flip,
    GetBounds,
    Lighting,
    Mask,
    Origin,
    RenderNodes,
    ScrollFactor,
    TextureCrop,
    Tint,
    Transform,
    Visible {}

export class Video extends GameObject {

    /**
     * A reference to the HTML Video Element this Video Game Object is playing.
     * Will be `undefined` until a video is loaded for playback.
     */
    video: HTMLVideoElement | undefined;

    /**
     * The Phaser Texture this Game Object is using to render the video to.
     * Will be `undefined` until a video is loaded for playback.
     */
    videoTexture: any;

    /**
     * A reference to the TextureSource backing the `videoTexture` Texture object.
     * Will be `undefined` until a video is loaded for playback.
     */
    videoTextureSource: any;

    /**
     * A Phaser `CanvasTexture` instance that holds the most recent snapshot taken from the video.
     * This will only be set if the `snapshot` or `snapshotArea` methods have been called.
     * Until those methods are called, this property will be `undefined`.
     */
    snapshotTexture: any;

    /**
     * If you have saved this video to a texture via the `saveTexture` method, this controls if the video
     * is rendered with `flipY` in WebGL or not.
     */
    glFlipY: boolean;

    /**
     * The key used by the texture as stored in the Texture Manager.
     */
    _key: string;

    /**
     * An internal flag holding the current state of the video lock, should document interaction be required
     * before playback can begin.
     */
    touchLocked: boolean;

    /**
     * Should the video auto play when document interaction is required and happens?
     */
    playWhenUnlocked: boolean;

    /**
     * Has the video created its texture and populated it with the first frame of video?
     */
    frameReady: boolean;

    /**
     * This read-only property returns `true` if the video is currently stalled.
     */
    isStalled: boolean;

    /**
     * Records the number of times the video has failed to play.
     */
    failedPlayAttempts: number;

    /**
     * If the browser supports the Request Video Frame API then this
     * property will hold the metadata that is returned from the callback each time it is invoked.
     */
    metadata: any;

    /**
     * The current retry elapsed time.
     */
    retry: number;

    /**
     * If a video fails to play due to a lack of user interaction, this is the
     * amount of time, in ms, that the video will wait before trying again to play.
     */
    retryInterval: number;

    /**
     * The video was muted due to a system event, such as the game losing focus.
     */
    private _systemMuted: boolean;

    /**
     * The video was muted due to game code, not a system event.
     */
    private _codeMuted: boolean;

    /**
     * The video was paused due to a system event, such as the game losing focus.
     */
    private _systemPaused: boolean;

    /**
     * The video was paused due to game code, not a system event.
     */
    private _codePaused: boolean;

    /**
     * The locally bound event callback handlers.
     */
    private _callbacks: any;

    /**
     * The locally bound callback handler specifically for load and load error events.
     */
    private _loadCallbackHandler: Function;

    /**
     * The locally bound callback handler specifically for the loadedmetadata event.
     */
    private _metadataCallbackHandler: Function;

    /**
     * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
     */
    _crop: any;

    /**
     * An object containing in and out markers for sequence playback.
     */
    markers: any;

    /**
     * The in marker.
     */
    private _markerIn: number;

    /**
     * The out marker.
     */
    private _markerOut: number;

    /**
     * Are we playing a marked segment of the video?
     */
    private _playingMarker: boolean;

    /**
     * The previous frames mediaTime.
     */
    private _lastUpdate: number;

    /**
     * The key of the current video as stored in the Video cache.
     */
    cacheKey: string;

    /**
     * Is the video currently seeking?
     */
    isSeeking: boolean;

    /**
     * Has Video.play been called? This is reset if a new Video is loaded.
     */
    private _playCalled: boolean;

    /**
     * Has Video.getFirstFrame been called? This is reset if a new Video is loaded or played.
     */
    private _getFrame: boolean;

    /**
     * The Callback ID returned by Request Video Frame.
     */
    private _rfvCallbackId: number;

    /**
     * A reference to Device.Video.
     */
    private _device: any;

    static
    {
        Mixin(this, [
            Alpha,
            BlendMode,
            ComputedSize,
            Depth,
            Flip,
            GetBounds,
            Lighting,
            Mask,
            Origin,
            RenderNodes,
            ScrollFactor,
            TextureCrop,
            Tint,
            Transform,
            Visible,
            { renderWebGL, renderCanvas }
        ]);
    }

    constructor (scene: any, x: number, y: number, key?: string)
    {
        super(scene, 'Video');

        this.video = undefined;
        this.videoTexture = undefined;
        this.videoTextureSource = undefined;
        this.snapshotTexture = undefined;
        this.glFlipY = true;
        this._key = UUID();
        this.touchLocked = false;
        this.playWhenUnlocked = false;
        this.frameReady = false;
        this.isStalled = false;
        this.failedPlayAttempts = 0;
        this.metadata = undefined;
        this.retry = 0;
        this.retryInterval = 500;
        this._systemMuted = false;
        this._codeMuted = false;
        this._systemPaused = false;
        this._codePaused = false;

        this._callbacks = {
            ended: this.completeHandler.bind(this),
            legacy: this.legacyPlayHandler.bind(this),
            playing: this.playingHandler.bind(this),
            seeked: this.seekedHandler.bind(this),
            seeking: this.seekingHandler.bind(this),
            stalled: this.stalledHandler.bind(this),
            suspend: this.stalledHandler.bind(this),
            waiting: this.stalledHandler.bind(this)
        };

        this._loadCallbackHandler = this.loadErrorHandler.bind(this);
        this._metadataCallbackHandler = this.metadataHandler.bind(this);

        this._crop = this.resetCropObject();

        this.markers = {};
        this._markerIn = 0;
        this._markerOut = 0;
        this._playingMarker = false;
        this._lastUpdate = 0;
        this.cacheKey = '';
        this.isSeeking = false;
        this._playCalled = false;
        this._getFrame = false;
        this._rfvCallbackId = 0;

        var game = scene.sys.game;

        this._device = game.device.video;

        this.setPosition(x, y);
        this.setSize(256, 256);
        this.initRenderNodes(this._defaultRenderNodesMap);

        game.events.on(GameEvents.PAUSE, this.globalPause, this);
        game.events.on(GameEvents.RESUME, this.globalResume, this);

        var sound = scene.sys.sound;

        if (sound)
        {
            sound.on(SoundEvents.GLOBAL_MUTE, this.globalMute, this);
        }

        if (key)
        {
            this.load(key);
        }
    }

    /**
     * The default render node map for this Game Object.
     */
    get _defaultRenderNodesMap (): any
    {
        return DefaultImageNodes;
    }

    //  Overrides Game Object method
    addedToScene (): void
    {
        this.scene.sys.updateList.add(this);
    }

    //  Overrides Game Object method
    removedFromScene (): void
    {
        this.scene.sys.updateList.remove(this);
    }

    /**
     * Loads a Video from the Video Cache, ready for playback with the `Video.play` method.
     *
     * If a video is already playing, this method allows you to change the source of the current video element.
     * It works by first stopping the current video and then starts playback of the new source through the existing video element.
     *
     * The reason you may wish to do this is because videos that require interaction to unlock, remain in an unlocked
     * state, even if you change the source of the video. By changing the source to a new video you avoid having to
     * go through the unlock process again.
     *
     * @param key - The key of the Video this Game Object will play, as stored in the Video Cache.
     * @return This Video Game Object for method chaining.
     */
    load (key: string): this
    {
        var video = this.scene.sys.cache.video.get(key);

        if (video)
        {
            this.cacheKey = key;

            this.loadHandler(video.url, video.noAudio, video.crossOrigin);
        }
        else
        {
            console.warn('No video in cache for key: ' + key);
        }

        return this;
    }

    /**
     * This method allows you to change the source of the current video element. It works by first stopping the
     * current video, if playing. Then deleting the video texture, if one has been created. Finally, it makes a
     * new video texture and starts playback of the new source through the existing video element.
     *
     * @param key - The key of the Video this Game Object will swap to playing, as stored in the Video Cache.
     * @param autoplay - Should the video start playing immediately, once the swap is complete?
     * @param loop - Should the video loop automatically when it reaches the end?
     * @param markerIn - Optional in marker time, in seconds, for playback of a sequence of the video.
     * @param markerOut - Optional out marker time, in seconds, for playback of a sequence of the video.
     * @return This Video Game Object for method chaining.
     */
    changeSource (key: string, autoplay: boolean = true, loop: boolean = false, markerIn?: number, markerOut?: number): this
    {
        if (this.cacheKey !== key)
        {
            this.load(key);

            if (autoplay)
            {
                this.play(loop, markerIn, markerOut);
            }
        }

        return this;
    }

    /**
     * Returns the key of the currently played video, as stored in the Video Cache.
     *
     * If the video did not come from the cache this will return an empty string.
     *
     * @return The key of the video being played from the Video Cache, if any.
     */
    getVideoKey (): string
    {
        return this.cacheKey;
    }

    /**
     * Loads a Video from the given URL, ready for playback with the `Video.play` method.
     *
     * If a video is already playing, this method allows you to change the source of the current video element.
     * It works by first stopping the current video and then starts playback of the new source through the existing video element.
     *
     * @param urls - The absolute or relative URL to load the video files from.
     * @param noAudio - Does the video have an audio track? If not you can enable auto-playing on it.
     * @param crossOrigin - The value to use for the `crossOrigin` property in the video load request.
     * @return This Video Game Object for method chaining.
     */
    loadURL (urls?: string | string[] | any | any[], noAudio: boolean = false, crossOrigin?: string): this
    {
        var urlConfig = this._device.getVideoURL(urls);

        if (!urlConfig)
        {
            console.warn('No supported video format found for ' + urls);
        }
        else
        {
            this.cacheKey = '';

            this.loadHandler(urlConfig.url, noAudio, crossOrigin);
        }

        return this;
    }

    /**
     * Loads a Video from the given MediaStream object, ready for playback with the `Video.play` method.
     *
     * @param stream - The MediaStream object.
     * @param noAudio - Does the video have an audio track? If not you can enable auto-playing on it.
     * @param crossOrigin - The value to use for the `crossOrigin` property in the video load request.
     * @return This Video Game Object for method chaining.
     */
    loadMediaStream (stream: MediaStream, noAudio: boolean = false, crossOrigin?: string): this
    {
        return this.loadHandler(null, noAudio, crossOrigin, stream);
    }

    /**
     * Internal method that loads a Video from the given URL, ready for playback with the
     * `Video.play` method.
     *
     * Normally you don't call this method directly, but instead use the `Video.loadURL` method,
     * or the `Video.load` method if you have preloaded the video.
     *
     * @param url - The absolute or relative URL to load the video file from. Set to `null` if passing in a MediaStream object.
     * @param noAudio - Does the video have an audio track? If not you can enable auto-playing on it.
     * @param crossOrigin - The value to use for the `crossOrigin` property in the video load request.
     * @param stream - A MediaStream object if this is playing a stream instead of a file.
     * @return This Video Game Object for method chaining.
     */
    loadHandler (url: string | null | undefined, noAudio?: boolean, crossOrigin?: string, stream?: MediaStream): this
    {
        if (!noAudio) { noAudio = false; }

        var video = this.video;

        if (video)
        {
            //  Re-use the existing video element
            this.removeLoadEventHandlers();

            this.stop();
        }
        else
        {
            video = document.createElement('video');

            video.controls = false;

            video.setAttribute('playsinline', 'playsinline');
            video.setAttribute('preload', 'auto');
            video.setAttribute('disablePictureInPicture', 'true');
        }

        if (noAudio)
        {
            video.muted = true;
            video.defaultMuted = true;

            video.setAttribute('autoplay', 'autoplay');
        }
        else
        {
            video.muted = false;
            video.defaultMuted = false;

            video.removeAttribute('autoplay');
        }

        if (!crossOrigin)
        {
            video.removeAttribute('crossorigin');
        }
        else
        {
            video.setAttribute('crossorigin', crossOrigin);
        }

        if (stream)
        {
            if ('srcObject' in video)
            {
                try
                {
                    video.srcObject = stream;
                }
                catch (err: any)
                {
                    if (err.name !== 'TypeError')
                    {
                        throw err;
                    }

                    video.src = URL.createObjectURL(stream as any);
                }
            }
            else
            {
                (video as any).src = URL.createObjectURL(stream as any);
            }
        }
        else
        {
            video.src = url as string;
        }

        this.retry = 0;
        this.video = video;

        this._playCalled = false;

        video.load();

        this.addLoadEventHandlers();

        var texture = this.scene.sys.textures.get(this._key);

        this.setTexture(texture);

        return this;
    }

    /**
     * This method handles the Request Video Frame callback.
     *
     * It is called by the browser when a new video frame is ready to be displayed.
     *
     * It's also responsible for the creation of the video texture, if it doesn't
     * already exist. If it does, it updates the texture as required.
     *
     * @param now - The current time in milliseconds.
     * @param metadata - Useful metadata about the video frame that was most recently presented for composition.
     */
    requestVideoFrame (now: number, metadata: any): void
    {
        var video = this.video;

        if (!video)
        {
            return;
        }

        var width = metadata.width;
        var height = metadata.height;

        var texture = this.videoTexture;
        var textureSource = this.videoTextureSource;
        var newVideo = (!texture || textureSource.source !== video);

        if (newVideo)
        {
            //  First frame of a new video
            this._codePaused = video.paused;
            this._codeMuted = video.muted;

            if (!texture)
            {
                texture = this.scene.sys.textures.create(this._key, video, width, height);

                texture.add('__BASE', 0, 0, 0, width, height);

                this.setTexture(texture);

                this.videoTexture = texture;
                this.videoTextureSource = texture.source[0];

                this.videoTextureSource.setFlipY(this.glFlipY);

                this.emit(Events.VIDEO_TEXTURE, this, texture);
            }
            else
            {
                //  Re-use the existing texture
                textureSource.source = video;
                textureSource.width = width;
                textureSource.height = height;

                //  Resize base frame
                texture.get().setSize(width, height);
            }

            this.setSizeToFrame();
            this.updateDisplayOrigin();
        }
        else
        {
            textureSource.update();
        }

        this.isStalled = false;

        this.metadata = metadata;

        var currentTime = metadata.mediaTime;

        if (newVideo)
        {
            this._lastUpdate = currentTime;

            this.emit(Events.VIDEO_CREATED, this, width, height);

            if (!this.frameReady)
            {
                this.frameReady = true;

                this.emit(Events.VIDEO_PLAY, this);
            }
        }

        if (this._playingMarker)
        {
            if (currentTime >= this._markerOut)
            {
                if (video.loop)
                {
                    video.currentTime = this._markerIn;

                    this.emit(Events.VIDEO_LOOP, this);
                }
                else
                {
                    this.stop(false);

                    this.emit(Events.VIDEO_COMPLETE, this);
                }
            }
        }
        else if (currentTime < this._lastUpdate)
        {
            this.emit(Events.VIDEO_LOOP, this);
        }

        this._lastUpdate = currentTime;

        if (this._getFrame)
        {
            this.removeEventHandlers();

            video.pause();

            this._getFrame = false;
        }
        else
        {
            this._rfvCallbackId = this.video!.requestVideoFrameCallback(this.requestVideoFrame.bind(this));
        }
    }

    /**
     * Starts this video playing.
     *
     * If the video is already playing, or has been queued to play with `changeSource` then this method just returns.
     *
     * @param loop - Should the video loop automatically when it reaches the end?
     * @param markerIn - Optional in marker time, in seconds, for playback of a sequence of the video.
     * @param markerOut - Optional out marker time, in seconds, for playback of a sequence of the video.
     * @return This Video Game Object for method chaining.
     */
    play (loop?: boolean, markerIn?: number, markerOut?: number): this
    {
        if (markerIn === undefined) { markerIn = -1; }
        if (markerOut === undefined) { markerOut = MATH_CONST.MAX_SAFE_INTEGER; }

        var video = this.video;

        if (!video || this.isPlaying())
        {
            if (!video)
            {
                console.warn('Video not loaded');
            }

            return this;
        }

        //  We can reset these each time play is called, even if the video hasn't started yet

        if (loop === undefined) { loop = video.loop; }

        video.loop = loop;

        this._markerIn = markerIn;
        this._markerOut = markerOut;
        this._playingMarker = (markerIn > -1 && markerOut > markerIn && markerOut < MATH_CONST.MAX_SAFE_INTEGER);

        //  But we go no further if play has already been called

        if (!this._playCalled)
        {
            this._getFrame = false;

            this._rfvCallbackId = video.requestVideoFrameCallback(this.requestVideoFrame.bind(this));

            this._playCalled = true;

            this.createPlayPromise();
        }

        return this;
    }

    /**
     * Attempts to get the first frame of the video by running the `requestVideoFrame` callback once,
     * then stopping.
     *
     * If the video is already playing, or has been queued to play with `changeSource` then this method just returns.
     *
     * @return This Video Game Object for method chaining.
     */
    getFirstFrame (): this
    {
        var video = this.video;

        if (!video || this.isPlaying())
        {
            if (!video)
            {
                console.warn('Video not loaded');
            }

            return this;
        }

        if (!this._playCalled)
        {
            this._getFrame = true;

            this._rfvCallbackId = video.requestVideoFrameCallback(this.requestVideoFrame.bind(this));

            this.createPlayPromise();
        }

        return this;
    }

    /**
     * Adds the loading specific event handlers to the video element.
     */
    addLoadEventHandlers (): void
    {
        var video = this.video;

        if (video)
        {
            video.addEventListener('error', this._loadCallbackHandler as EventListener);
            video.addEventListener('abort', this._loadCallbackHandler as EventListener);
            video.addEventListener('loadedmetadata', this._metadataCallbackHandler as EventListener);
        }
    }

    /**
     * Removes the loading specific event handlers from the video element.
     */
    removeLoadEventHandlers (): void
    {
        var video = this.video;

        if (video)
        {
            video.removeEventListener('error', this._loadCallbackHandler as EventListener);
            video.removeEventListener('abort', this._loadCallbackHandler as EventListener);
        }
    }

    /**
     * Adds the playback specific event handlers to the video element.
     */
    addEventHandlers (): void
    {
        var video = this.video;

        //  Set these _after_ calling `video.play` or they don't fire

        if (video)
        {
            var callbacks = this._callbacks;

            for (var callback in callbacks)
            {
                video.addEventListener(callback, callbacks[callback]);
            }
        }
    }

    /**
     * Removes the playback specific event handlers from the video element.
     */
    removeEventHandlers (): void
    {
        var video = this.video;

        if (video)
        {
            var callbacks = this._callbacks;

            for (var callback in callbacks)
            {
                video.removeEventListener(callback, callbacks[callback]);
            }
        }
    }

    /**
     * Creates the video.play promise and adds the success and error handlers to it.
     *
     * Not all browsers support the video.play promise, so this method will fall back to
     * the old-school way of handling the video.play call.
     *
     * @param catchError - Should the error be caught and the video marked as failed to play?
     */
    createPlayPromise (catchError: boolean = true): void
    {
        var video = this.video!;

        var playPromise = video.play();

        if (playPromise !== undefined)
        {
            var success = this.playSuccess.bind(this);
            var error: Function = this.playError.bind(this);

            if (!catchError)
            {
                var _this = this;

                error = function ()
                {
                    _this.failedPlayAttempts++;
                };
            }

            playPromise.then(success).catch(error as any);
        }
        else
        {
            //  Old-school fallback here for pre-2019 browsers
            video.addEventListener('playing', this._callbacks.legacy);

            if (!catchError)
            {
                this.failedPlayAttempts++;
            }
        }
    }

    /**
     * Adds a sequence marker to this video.
     *
     * Markers allow you to split a video up into sequences, delineated by a start and end time, given in seconds.
     *
     * @param key - A unique name to give this marker.
     * @param markerIn - The time, in seconds, representing the start of this marker.
     * @param markerOut - The time, in seconds, representing the end of this marker.
     * @return This Video Game Object for method chaining.
     */
    addMarker (key: string, markerIn: number, markerOut: number): this
    {
        if (!isNaN(markerIn) && markerIn >= 0 && !isNaN(markerOut) && markerOut > markerIn)
        {
            this.markers[key] = [ markerIn, markerOut ];
        }

        return this;
    }

    /**
     * Plays a pre-defined sequence in this video.
     *
     * @param key - The name of the marker sequence to play.
     * @param loop - Should the video loop automatically when it reaches the end?
     * @return This Video Game Object for method chaining.
     */
    playMarker (key: string, loop?: boolean): this
    {
        var marker = this.markers[key];

        if (marker)
        {
            this.play(loop, marker[0], marker[1]);
        }

        return this;
    }

    /**
     * Removes a previously set marker from this video.
     *
     * If the marker is currently playing it will _not_ stop playback.
     *
     * @param key - The name of the marker to remove.
     * @return This Video Game Object for method chaining.
     */
    removeMarker (key: string): this
    {
        delete this.markers[key];

        return this;
    }

    /**
     * Takes a snapshot of the current frame of the video and renders it to a CanvasTexture object,
     * which is then returned. You can optionally resize the grab by passing a width and height.
     *
     * This method returns a reference to the `Video.snapshotTexture` object. Calling this method
     * multiple times will overwrite the previous snapshot with the most recent one.
     *
     * @param width - The width of the resulting CanvasTexture.
     * @param height - The height of the resulting CanvasTexture.
     * @return The snapshot CanvasTexture.
     */
    snapshot (width?: number, height?: number): any
    {
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }

        return this.snapshotArea(0, 0, this.width, this.height, width, height);
    }

    /**
     * Takes a snapshot of the specified area of the current frame of the video and renders it to a CanvasTexture object,
     * which is then returned. You can optionally resize the grab by passing a different `destWidth` and `destHeight`.
     *
     * @param x - The horizontal location of the top-left of the area to grab from.
     * @param y - The vertical location of the top-left of the area to grab from.
     * @param srcWidth - The width of area to grab from the video.
     * @param srcHeight - The height of area to grab from the video.
     * @param destWidth - The destination width of the grab, allowing you to resize it.
     * @param destHeight - The destination height of the grab, allowing you to resize it.
     * @return The snapshot CanvasTexture.
     */
    snapshotArea (x?: number, y?: number, srcWidth?: number, srcHeight?: number, destWidth?: number, destHeight?: number): any
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (srcWidth === undefined) { srcWidth = this.width; }
        if (srcHeight === undefined) { srcHeight = this.height; }
        if (destWidth === undefined) { destWidth = srcWidth; }
        if (destHeight === undefined) { destHeight = srcHeight; }

        var video = this.video;
        var snap = this.snapshotTexture;

        if (!snap)
        {
            snap = this.scene.sys.textures.createCanvas(UUID(), destWidth, destHeight);

            this.snapshotTexture = snap;

            if (video)
            {
                snap.context.drawImage(video, x, y, srcWidth, srcHeight, 0, 0, destWidth, destHeight);
            }
        }
        else
        {
            snap.setSize(destWidth, destHeight);

            if (video)
            {
                snap.context.drawImage(video, x, y, srcWidth, srcHeight, 0, 0, destWidth, destHeight);
            }
        }

        return snap.update();
    }

    /**
     * Stores a copy of this Videos `snapshotTexture` in the Texture Manager using the given key.
     *
     * @param key - The unique key to store the texture as within the global Texture Manager.
     * @return The Texture that was saved.
     */
    saveSnapshotTexture (key: string): any
    {
        if (this.snapshotTexture)
        {
            this.scene.sys.textures.renameTexture(this.snapshotTexture.key, key);
        }
        else
        {
            this.snapshotTexture = this.scene.sys.textures.createCanvas(key, this.width, this.height);
        }

        return this.snapshotTexture;
    }

    /**
     * This internal method is called automatically if the playback Promise resolves successfully.
     */
    playSuccess (): void
    {
        if (!this._playCalled)
        {
            //  The stop method has been called but the Promise has resolved
            //  after this, so we need to just abort.
            return;
        }

        this.addEventHandlers();

        this._codePaused = false;

        if (this.touchLocked)
        {
            this.touchLocked = false;

            this.emit(Events.VIDEO_UNLOCKED, this);
        }

        var sound = this.scene.sys.sound;

        if (sound && sound.mute)
        {
            //  Mute will be set based on the global mute state of the Sound Manager (if there is one)
            this.setMute(true);
        }

        if (this._markerIn > -1)
        {
            this.video!.currentTime = this._markerIn;
        }
    }

    /**
     * This internal method is called automatically if the playback Promise fails to resolve.
     *
     * @param error - The Promise DOM Exception error.
     */
    playError (error: DOMException): void
    {
        var name = error.name;

        if (name === 'NotAllowedError')
        {
            this.touchLocked = true;
            this.playWhenUnlocked = true;
            this.failedPlayAttempts = 1;

            this.emit(Events.VIDEO_LOCKED, this);
        }
        else if (name === 'NotSupportedError')
        {
            this.stop(false);

            this.emit(Events.VIDEO_UNSUPPORTED, this, error);
        }
        else
        {
            this.stop(false);

            this.emit(Events.VIDEO_ERROR, this, error);
        }
    }

    /**
     * Called when the video emits a `playing` event.
     * This is the legacy handler for browsers that don't support Promise based playback.
     */
    legacyPlayHandler (): void
    {
        var video = this.video;

        if (video)
        {
            this.playSuccess();

            video.removeEventListener('playing', this._callbacks.legacy);
        }
    }

    /**
     * Called when the video emits a `playing` event.
     */
    playingHandler (): void
    {
        this.isStalled = false;

        this.emit(Events.VIDEO_PLAYING, this);
    }

    /**
     * This internal method is called automatically if the video fails to load.
     *
     * @param event - The error Event.
     */
    loadErrorHandler (event: Event): void
    {
        this.stop(false);

        this.emit(Events.VIDEO_ERROR, this, event);
    }

    /**
     * This internal method is called automatically when the video metadata is available.
     *
     * @param event - The loadedmetadata Event.
     */
    metadataHandler (event: Event): void
    {
        this.emit(Events.VIDEO_METADATA, this, event);
    }

    /**
     * Sets the size of this Game Object to be that of the given Frame.
     *
     * @param frame - The frame to base the size of this Game Object on.
     * @return This Game Object instance.
     */
    setSizeToFrame (frame?: any): this
    {
        if (!frame) { frame = this.frame; }

        this.width = frame.realWidth;
        this.height = frame.realHeight;

        if (this.scaleX !== 1)
        {
            this.scaleX = this.displayWidth / this.width;
        }

        if (this.scaleY !== 1)
        {
            this.scaleY = this.displayHeight / this.height;
        }

        var input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = this.width;
            input.hitArea.height = this.height;
        }

        return this;
    }

    /**
     * This internal method is called automatically if the video stalls, for whatever reason.
     *
     * @param event - The error Event.
     */
    stalledHandler (event: Event): void
    {
        this.isStalled = true;

        this.emit(Events.VIDEO_STALLED, this, event);
    }

    /**
     * Called when the video completes playback, i.e. reaches an `ended` state.
     */
    completeHandler (): void
    {
        this._playCalled = false;

        this.emit(Events.VIDEO_COMPLETE, this);
    }

    /**
     * The internal update step.
     *
     * @param time - The current timestamp.
     * @param delta - The delta time in ms since the last frame.
     */
    preUpdate (time: number, delta: number): void
    {
        var video = this.video;

        if (!video || !this._playCalled)
        {
            return;
        }

        if (this.touchLocked && this.playWhenUnlocked)
        {
            this.retry += delta;

            if (this.retry >= this.retryInterval)
            {
                this.createPlayPromise(false);

                this.retry = 0;
            }
        }
    }

    /**
     * Seeks to a given point in the video. The value is given as a float between 0 and 1,
     * where 0 represents the start of the video and 1 represents the end.
     *
     * @param value - The point in the video to seek to. A value between 0 and 1.
     * @return This Video Game Object for method chaining.
     */
    seekTo (value: number): this
    {
        var video = this.video;

        if (video)
        {
            var duration = video.duration;

            if (duration !== Infinity && !isNaN(duration))
            {
                var seekTime = duration * value;

                this.setCurrentTime(seekTime);
            }
        }

        return this;
    }

    /**
     * A double-precision floating-point value indicating the current playback time in seconds.
     *
     * @return A double-precision floating-point value indicating the current playback time in seconds.
     */
    getCurrentTime (): number
    {
        return (this.video) ? this.video.currentTime : 0;
    }

    /**
     * Seeks to a given playback time in the video. The value is given in _seconds_ or as a string.
     *
     * You can provide a string prefixed with either a `+` or a `-`, such as `+2.5` or `-2.5`.
     * In this case it will seek to +/- the value given, relative to the _current time_.
     *
     * @param value - The playback time to seek to in seconds. Can be expressed as a string, such as `+2` to seek 2 seconds ahead from the current time.
     * @return This Video Game Object for method chaining.
     */
    setCurrentTime (value: string | number): this
    {
        var video = this.video;

        if (video)
        {
            if (typeof value === 'string')
            {
                var op = value[0];
                var num = parseFloat(value.substr(1));

                if (op === '+')
                {
                    value = video.currentTime + num;
                }
                else if (op === '-')
                {
                    value = video.currentTime - num;
                }
            }

            video.currentTime = value as number;
        }

        return this;
    }

    /**
     * Internal seeking handler.
     */
    seekingHandler (): void
    {
        this.isSeeking = true;

        this.emit(Events.VIDEO_SEEKING, this);
    }

    /**
     * Internal seeked handler.
     */
    seekedHandler (): void
    {
        this.isSeeking = false;

        this.emit(Events.VIDEO_SEEKED, this);
    }

    /**
     * Returns the current progress of the video as a float.
     *
     * Progress is defined as a value between 0 (the start) and 1 (the end).
     *
     * @return The current progress of playback. If the video has no duration, will always return -1.
     */
    getProgress (): number
    {
        var video = this.video;

        if (video)
        {
            var duration = video.duration;

            if (duration !== Infinity && !isNaN(duration))
            {
                return video.currentTime / duration;
            }
        }

        return -1;
    }

    /**
     * A double-precision floating-point value which indicates the duration (total length) of the media in seconds.
     *
     * @return A double-precision floating-point value indicating the duration of the media in seconds.
     */
    getDuration (): number
    {
        return (this.video) ? this.video.duration : 0;
    }

    /**
     * Sets the muted state of the currently playing video, if one is loaded.
     *
     * @param value - The mute value. `true` if the video should be muted, otherwise `false`.
     * @return This Video Game Object for method chaining.
     */
    setMute (value: boolean = true): this
    {
        this._codeMuted = value;

        var video = this.video;

        if (video)
        {
            video.muted = (this._systemMuted) ? true : value;
        }

        return this;
    }

    /**
     * Returns a boolean indicating if this Video is currently muted.
     *
     * @return A boolean indicating if this Video is currently muted, or not.
     */
    isMuted (): boolean
    {
        return this._codeMuted;
    }

    /**
     * Internal global mute handler. Will mute the video, if playing, if the global sound system mutes.
     *
     * @param soundManager - A reference to the Sound Manager that emitted the event.
     * @param value - The mute value.
     */
    globalMute (soundManager: any, value: boolean): void
    {
        this._systemMuted = value;

        var video = this.video;

        if (video)
        {
            video.muted = (this._codeMuted) ? true : value;
        }
    }

    /**
     * Internal global pause handler. Will pause the video if the Game itself pauses.
     */
    globalPause (): void
    {
        this._systemPaused = true;

        if (this.video && !this.video.ended)
        {
            this.removeEventHandlers();

            this.video.pause();
        }
    }

    /**
     * Internal global resume handler. Will resume a paused video if the Game itself resumes.
     */
    globalResume (): void
    {
        this._systemPaused = false;

        if (this.video && !this._codePaused && !this.video.ended)
        {
            this.createPlayPromise();
        }
    }

    /**
     * Sets the paused state of the currently loaded video.
     *
     * @param value - The paused value. `true` if the video should be paused, `false` to resume it.
     * @return This Video Game Object for method chaining.
     */
    setPaused (value: boolean = true): this
    {
        var video = this.video;

        this._codePaused = value;

        if (video && !video.ended)
        {
            if (value)
            {
                if (!video.paused)
                {
                    this.removeEventHandlers();

                    video.pause();
                }
            }
            else if (!value)
            {
                if (!this._playCalled)
                {
                    this.play();
                }
                else if (video.paused && !this._systemPaused)
                {
                    this.createPlayPromise();
                }
            }
        }

        return this;
    }

    /**
     * Pauses the current Video, if one is playing.
     *
     * Call `Video.resume` to resume playback.
     *
     * @return This Video Game Object for method chaining.
     */
    pause (): this
    {
        return this.setPaused(true);
    }

    /**
     * Resumes the current Video, if one was previously playing and has been paused.
     *
     * Call `Video.pause` to pause playback.
     *
     * @return This Video Game Object for method chaining.
     */
    resume (): this
    {
        return this.setPaused(false);
    }

    /**
     * Returns a double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
     *
     * @return A double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
     */
    getVolume (): number
    {
        return (this.video) ? this.video.volume : 1;
    }

    /**
     * Sets the volume of the currently playing video.
     *
     * @param value - A double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
     * @return This Video Game Object for method chaining.
     */
    setVolume (value: number = 1): this
    {
        if (this.video)
        {
            this.video.volume = Clamp(value, 0, 1);
        }

        return this;
    }

    /**
     * Returns a double that indicates the rate at which the media is being played back.
     *
     * @return A double that indicates the rate at which the media is being played back.
     */
    getPlaybackRate (): number
    {
        return (this.video) ? this.video.playbackRate : 1;
    }

    /**
     * Sets the playback rate of the current video.
     *
     * @param rate - A double that indicates the rate at which the media is being played back.
     * @return This Video Game Object for method chaining.
     */
    setPlaybackRate (rate: number): this
    {
        if (this.video)
        {
            this.video.playbackRate = rate;
        }

        return this;
    }

    /**
     * Returns a boolean which indicates whether the media element should start over when it reaches the end.
     *
     * @return A boolean which indicates whether the media element will start over when it reaches the end.
     */
    getLoop (): boolean
    {
        return (this.video) ? this.video.loop : false;
    }

    /**
     * Sets the loop state of the current video.
     *
     * @param value - A boolean which indicates whether the media element will start over when it reaches the end.
     * @return This Video Game Object for method chaining.
     */
    setLoop (value: boolean = true): this
    {
        if (this.video)
        {
            this.video.loop = value;
        }

        return this;
    }

    /**
     * Returns a boolean which indicates whether the video is currently playing.
     *
     * @return A boolean which indicates whether the video is playing, or not.
     */
    isPlaying (): boolean
    {
        return (this.video) ? !(this.video.paused || this.video.ended) : false;
    }

    /**
     * Returns a boolean which indicates whether the video is currently paused.
     *
     * @return A boolean which indicates whether the video is paused, or not.
     */
    isPaused (): boolean
    {
        return ((this.video && this._playCalled && this.video.paused) || this._codePaused || this._systemPaused);
    }

    /**
     * Stores this Video in the Texture Manager using the given key as a dynamic texture.
     *
     * @param key - The unique key to store the texture as within the global Texture Manager.
     * @param flipY - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y` during upload?
     * @return Returns `true` if the texture is available immediately, otherwise returns `false`.
     */
    saveTexture (key: string, flipY: boolean = true): boolean
    {
        if (this.videoTexture)
        {
            this.scene.sys.textures.renameTexture(this._key, key);
            this.videoTextureSource.setFlipY(flipY);
        }

        this._key = key;
        this.glFlipY = flipY;

        return (this.videoTexture) ? true : false;
    }

    /**
     * Stops the video playing and clears all internal event listeners.
     *
     * If you only wish to pause playback of the video, and resume it a later time, use the `Video.pause` method instead.
     *
     * @param emitStopEvent - Should the `VIDEO_STOP` event be emitted?
     * @return This Video Game Object for method chaining.
     */
    stop (emitStopEvent: boolean = true): this
    {
        var video = this.video;

        if (video)
        {
            this.removeEventHandlers();

            video.cancelVideoFrameCallback(this._rfvCallbackId);

            video.pause();
        }

        this.retry = 0;
        this._playCalled = false;

        if (emitStopEvent)
        {
            this.emit(Events.VIDEO_STOP, this);
        }

        return this;
    }

    /**
     * Removes the Video element from the DOM by calling parentNode.removeChild on itself.
     *
     * Also removes the autoplay and src attributes and nulls the `Video.video` reference.
     *
     * This method is called automatically by `Video.destroy`.
     */
    removeVideoElement (): void
    {
        var video = this.video;

        if (!video)
        {
            return;
        }

        if (video.parentNode)
        {
            video.parentNode.removeChild(video);
        }

        while (video.hasChildNodes())
        {
            video.removeChild(video.firstChild!);
        }

        video.removeAttribute('autoplay');
        video.removeAttribute('src');

        this.video = undefined;
    }

    /**
     * Handles the pre-destroy step for the Video object.
     *
     * This calls `Video.stop` and optionally `Video.removeVideoElement`.
     */
    preDestroy (): void
    {
        this.stop(false);

        this.removeLoadEventHandlers();

        this.removeVideoElement();

        var game = this.scene.sys.game.events;

        game.off(GameEvents.PAUSE, this.globalPause, this);
        game.off(GameEvents.RESUME, this.globalResume, this);

        var sound = this.scene.sys.sound;

        if (sound)
        {
            sound.off(SoundEvents.GLOBAL_MUTE, this.globalMute, this);
        }
    }
}
