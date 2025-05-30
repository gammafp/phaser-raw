/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { PLUGIN_FBINSTANT } from "../FEATURES";
import { Systems } from './Systems';

/**
 * @classdesc
 * A base Phaser.Scene class which can be extended for your own use.
 *
 * You can also define the optional methods {@link Phaser.Types.Scenes.SceneInitCallback init()}, {@link Phaser.Types.Scenes.ScenePreloadCallback preload()}, and {@link Phaser.Types.Scenes.SceneCreateCallback create()}.
 *
 * @class Scene
 * @memberof Phaser
 * @constructor
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Scenes.SettingsConfig)} [config] - The scene key or scene specific configuration settings.
 */
export class Scene
{
    /**
     * The Scene Systems. You must never overwrite this property, or all hell will break loose.
     *
     * @name Phaser.Scene#sys
     * @type {Phaser.Scenes.Systems}
     * @since 3.0.0
     */
    // TODO: fix types
    sys: Phaser.Scenes.Systems;

    /**
     * A reference to the Phaser.Game instance.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#game
     * @type {Phaser.Game}
     * @since 3.0.0
     */
    // TODO: fix types
    game!: Phaser.Game;


    /**
     * A reference to the global Animation Manager.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#anims
     * @type {Phaser.Animations.AnimationManager}
     * @since 3.0.0
     */
    // TODO: fix types
    anims!: Phaser.Animations.AnimationManager;

    /**
     * A reference to the global Cache.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#cache
     * @type {Phaser.Cache.CacheManager}
     * @since 3.0.0
     */
    // TODO: fix types
    cache!: Phaser.Cache.CacheManager;

    /**
     * A reference to the global Data Manager.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#registry
     * @type {Phaser.Data.DataManager}
     * @since 3.0.0
     */
    // TODO: fix types
    registry!: Phaser.Data.DataManager;

    /**
     * A reference to the Sound Manager.
     *
     * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
     *
     * @name Phaser.Scene#sound
     * @type {(Phaser.Sound.NoAudioSoundManager|Phaser.Sound.HTML5AudioSoundManager|Phaser.Sound.WebAudioSoundManager)}
     * @since 3.0.0
     */
    // TODO: fix types
    sound!: Phaser.Sound.NoAudioSoundManager | Phaser.Sound.HTML5AudioSoundManager | Phaser.Sound.WebAudioSoundManager;

    /**
     * A reference to the Texture Manager.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#textures
     * @type {Phaser.Textures.TextureManager}
     * @since 3.0.0
    */
    // TODO: fix types
    textures!: Phaser.Textures.TextureManager;


    /**
     * A Scene specific Event Emitter.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#events
     * @type {Phaser.Events.EventEmitter}
     * @since 3.0.0
     */
    // TODO: fix types
    events!: Phaser.Events.EventEmitter;

    /**
     * The Scene Camera Manager.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#cameras
     * @type {Phaser.Cameras.Scene2D.CameraManager}
     * @since 3.0.0
    */
    // TODO: fix types
    cameras!: Phaser.Cameras.Scene2D.CameraManager;

    /**
     * The Scene Game Object Factory.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#add
     * @type {Phaser.GameObjects.GameObjectFactory}
     * @since 3.0.0
     */
    // TODO: fix types
    add!: Phaser.GameObjects.GameObjectFactory;

    /**
     * The Scene Game Object Creator.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#make
     * @type {Phaser.GameObjects.GameObjectCreator}
     * @since 3.0.0
     */
    // TODO: fix types
    make!: Phaser.GameObjects.GameObjectCreator;

    /**
     * A reference to the Scene Manager Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#scene
     * @type {Phaser.Scenes.ScenePlugin}
     * @since 3.0.0
     */
    // TODO: fix types
    scene!: Phaser.Scenes.ScenePlugin;

    /**
     * The Game Object Display List belonging to this Scene.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#children
     * @type {Phaser.GameObjects.DisplayList}
     * @since 3.0.0
     */
    // TODO: fix types
    children!: Phaser.GameObjects.DisplayList;

    /**
     * The Scene Lights Manager Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
     *
     * @name Phaser.Scene#lights
     * @type {Phaser.GameObjects.LightsManager}
     * @since 3.0.0
     */
    // TODO: fix types
    lights!: Phaser.GameObjects.LightsManager;

    /**
     * A Scene specific Data Manager Plugin.
     *
     * See the `registry` property for the global Data Manager.
     *
     * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
     *
     * @name Phaser.Scene#data
     * @type {Phaser.Data.DataManager}
     * @since 3.0.0
     */
    // TODO: fix types
    data!: Phaser.Data.DataManager;

    /**
     * The Scene Input Manager Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
     *
     * @name Phaser.Scene#input
     * @type {Phaser.Input.InputPlugin}
     * @since 3.0.0
     */
    // TODO: fix types
    input!: Phaser.Input.InputPlugin;


    /**
     * The Scene Loader Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
     *
     * @name Phaser.Scene#load
     * @type {Phaser.Loader.LoaderPlugin}
     * @since 3.0.0
     */
    // TODO: fix types
    load!: Phaser.Loader.LoaderPlugin;

    /**
     * The Scene Time and Clock Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
     *
     * @name Phaser.Scene#time
     * @type {Phaser.Time.Clock}
     * @since 3.0.0
     */
    // TODO: fix types
    time!: Phaser.Time.Clock;

    /**
     * The Scene Tween Manager Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
     *
     * @name Phaser.Scene#tweens
     * @type {Phaser.Tweens.TweenManager}
     * @since 3.0.0
     */
    // TODO: fix types
    tweens!: Phaser.Tweens.TweenManager;

    /**
     * The Scene Arcade Physics Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
     *
     * @name Phaser.Scene#physics
     * @type {Phaser.Physics.Arcade.ArcadePhysics}
     * @since 3.0.0
     */
    // TODO: fix types
    physics!: Phaser.Physics.Arcade.ArcadePhysics;

    /**
     * The Scene Matter Physics Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
     *
     * @name Phaser.Scene#matter
     * @type {Phaser.Physics.Matter.MatterPhysics}
     * @since 3.0.0
     */
    // TODO: fix types
    matter!: Phaser.Physics.Matter.MatterPhysics;

    /**
     * The Facebook Instant Games Plugin.
     *
     * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
     *
     * @name Phaser.Scene#facebook
     * @type {Phaser.FacebookInstantGamesPlugin}
     * @since 3.12.0
     */
    // TODO: fix types
    facebook!: Phaser.FacebookInstantGamesPlugin;

    /**
     * A reference to the global Scale Manager.
     *
     * This property will only be available if defined in the Scene Injection Map.
     *
     * @name Phaser.Scene#scale
     * @type {Phaser.Scale.ScaleManager}
     * @since 3.16.2
     */
    scale!: Phaser.Scale.ScaleManager;

    /**
     * A reference to the global Plugin Manager.
     *
     * The Plugin Manager is a global system that allows plugins to register themselves with it, and can then install
     * those plugins into Scenes as required.
     *
     * @name Phaser.Scene#plugins
     * @type {Phaser.Plugins.PluginManager}
     * @since 3.0.0
     */
    // TODO: fix types
    plugins!: Phaser.Plugins.PluginManager;

    /**
     * A reference to the renderer instance Phaser is using, either Canvas Renderer or WebGL Renderer.
     *
     * @name Phaser.Scene#renderer
     * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
     * @since 3.50.0
     */
    // TODO: fix types
    renderer!: Phaser.Renderer.Canvas.CanvasRenderer | Phaser.Renderer.WebGL.WebGLRenderer;

    // TODO: Fix types
    constructor (config: string | Phaser.Types.Scenes.SettingsConfig)
    {

        this.sys = new Systems(this, config);


        if (PLUGIN_FBINSTANT)
        {

            this.facebook;
        }


        this.scale;


        this.plugins;


        this.renderer;
    }

    /**
     * This method should be overridden by your own Scenes.
     *
     * This method is called once per game step while the scene is running.
     *
     * @method Phaser.Scene#update
     * @since 3.0.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update (time: number, delta: number)
    {
    }
}

