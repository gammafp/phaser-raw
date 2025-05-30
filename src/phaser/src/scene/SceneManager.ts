/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../utils/NOOP';
import { Scene } from './Scene';
import { Systems } from './Systems';

var CONST = require('./const');
var Events = require('./events');
var GameEvents = require('../core/events');
var GetValue = require('../utils/object/GetValue');
var LoaderEvents = require('../loader/events');

type TSceneOp = 'add' | 'remove' | 'start' | 'stop' | 'pause' | 'resume' | 'sleep' | 'wake' | 'run' | 'switch' | 'bringToTop' | 'sendToBack' | 'moveDown' | 'moveUp' | 'moveAbove' | 'moveBelow' | 'swapPosition';
interface IQueueEntry {
    op: TSceneOp;
    keyA: any;
    keyB?: any;
    data?: any;
}

/**
 * @classdesc
 * The Scene Manager.
 *
 * The Scene Manager is a Game level system, responsible for creating, processing and updating all of the
 * Scenes in a Game instance.
 *
 * You should not usually interact directly with the Scene Manager at all. Instead, you should use
 * the Scene Plugin, which is available from every Scene in your game via the `this.scene` property.
 *
 * Using methods in this Scene Manager directly will break queued operations and can cause runtime
 * errors. Instead, go via the Scene Plugin. Every feature this Scene Manager provides is also
 * available via the Scene Plugin.
 *
 * @class SceneManager
 * @memberof Phaser.Scenes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance this Scene Manager belongs to.
 * @param {object} sceneConfig - Scene specific configuration settings.
 */
export class SceneManager
{
    /**
     * The Game that this SceneManager belongs to.
     *
     * @name Phaser.Scenes.SceneManager#game
     * @type {Phaser.Game}
     * @since 3.0.0
     */
    // TODO: Fix types
    game: Phaser.Game | null;
    
    /**
     * An object that maps the keys to the scene so we can quickly get a scene from a key without iteration.
     *
     * @name Phaser.Scenes.SceneManager#keys
     * @type {Record<string, Phaser.Scene>}
     * @since 3.0.0
     */
    keys: Record<string, Phaser.Scene>;

    /**
     * The array in which all of the scenes are kept.
     *
     * @name Phaser.Scenes.SceneManager#scenes
     * @type {Phaser.Scene[]}
     * @since 3.0.0
     */
    scenes: Phaser.Scene[];


    /**
     * Is the Scene Manager actively processing the Scenes list?
     *
     * @name Phaser.Scenes.SceneManager#isProcessing
     * @type {boolean}
     * @default false
     * @readonly
     * @since 3.0.0
     */
    isProcessing: boolean;

    /**
     * Has the Scene Manager properly started?
     *
     * @name Phaser.Scenes.SceneManager#isBooted
     * @type {boolean}
     * @default false
     * @readonly
     * @since 3.4.0
     */
    isBooted: boolean;


    /**
     * Do any of the Cameras in any of the Scenes require a custom viewport?
     * If not we can skip scissor tests.
     *
     * @name Phaser.Scenes.SceneManager#customViewports
     * @type {number}
     * @default 0
     * @since 3.12.0
     */
    customViewports: number;


    /**
     * This system Scene is created during `bootQueue` and is a default
     * empty Scene that lives outside of the Scene list, but can be used
     * by plugins and managers that need access to a live Scene, without
     * being tied to one.
     *
     * @name Phaser.Scenes.SceneManager#systemScene
     * @type {Phaser.Scene}
     * @since 3.60.0
     */
    systemScene: Phaser.Scene | null;

    /**
     * Scenes pending to be added are stored in here until the manager has time to add it.
     *
     * @name Phaser.Scenes.SceneManager#_pending
     * @type {array}
     * @private
     * @since 3.0.0
     */
    private _pending: any[];

    /**
     * An array of scenes waiting to be started once the game has booted.
     *
     * @name Phaser.Scenes.SceneManager#_start
     * @type {array}
     * @private
     * @since 3.0.0
     */
    private _start: any[];


    /**
     * An operations queue, because we don't manipulate the scenes array during processing.
     *
     * @name Phaser.Scenes.SceneManager#_queue
     * @type {array}
     * @private
     * @since 3.0.0
     */
    private _queue: IQueueEntry[];

    /**
     * Boot time data to merge.
     *
     * @name Phaser.Scenes.SceneManager#_data
     * @type {object}
     * @private
     * @since 3.4.0
     */
    // TODO: Fix types
    private _data: any;

    constructor (game: Phaser.Game, sceneConfig?: any)
    {

        this.game = game;
        this.keys = {};
        this.scenes = [];
        this._pending = [];
        this._start = [];
        this._queue = [];
        this._data = {};
        this.isProcessing = false;
        this.isBooted = false;
        this.customViewports = 0;
        this.systemScene = null;

        if (sceneConfig)
        {
            if (!Array.isArray(sceneConfig))
            {
                sceneConfig = [ sceneConfig ];
            }

            for (let i = 0; i < sceneConfig.length; i++)
            {
                //  The i === 0 part just autostarts the first Scene given (unless it says otherwise in its config)
                this._pending.push({
                    key: 'default',
                    scene: sceneConfig[i],
                    autoStart: (i === 0),
                    data: {}
                });
            }
        }

        game.events.once(GameEvents.READY, this.bootQueue, this);
    }

    /**
     * Internal first-time Scene boot handler.
     *
     * @method Phaser.Scenes.SceneManager#bootQueue
     * @private
     * @fires Phaser.Core.Events#SYSTEM_READY
     * @since 3.2.0
     */
    bootQueue ()
    {
        if (this.isBooted)
        {
            return;
        }

        //  Create the system Scene
        this.systemScene = this.createSceneFromInstance('__SYSTEM', new Scene());

        this.game?.events.emit(GameEvents.SYSTEM_READY, this.systemScene, this);

        var i;
        var entry;
        var key;
        var sceneConfig;

        for (i = 0; i < this._pending.length; i++)
        {
            entry = this._pending[i];

            key = entry.key;
            sceneConfig = entry.scene;

            var newScene;

            if (sceneConfig instanceof Scene)
            {
                newScene = this.createSceneFromInstance(key, sceneConfig);
            }
            else if (typeof sceneConfig === 'object')
            {
                newScene = this.createSceneFromObject(key, sceneConfig);
            }
            else if (typeof sceneConfig === 'function')
            {
                newScene = this.createSceneFromFunction(key, sceneConfig);
            }

            //  Replace key in case the scene changed it
            key = newScene.sys.settings.key;

            this.keys[key] = newScene;

            this.scenes.push(newScene);

            //  Any data to inject?
            if (this._data[key])
            {
                newScene.sys.settings.data = this._data[key].data;

                if (this._data[key].autoStart)
                {
                    entry.autoStart = true;
                }
            }

            if (entry.autoStart || newScene.sys.settings.active)
            {
                this._start.push(key);
            }
        }

        //  Clear the pending lists
        this._pending.length = 0;

        this._data = {};

        this.isBooted = true;

        //  _start might have been populated by the above
        for (i = 0; i < this._start.length; i++)
        {
            entry = this._start[i];

            this.start(entry);
        }

        this._start.length = 0;
    }

    /**
     * Process the Scene operations queue.
     *
     * @method Phaser.Scenes.SceneManager#processQueue
     * @since 3.0.0
     */
    processQueue ()
    {
        var pendingLength = this._pending.length;
        var queueLength = this._queue.length;

        if (pendingLength === 0 && queueLength === 0)
        {
            return;
        }

        var i;
        var entry;

        if (pendingLength)
        {
            for (i = 0; i < pendingLength; i++)
            {
                entry = this._pending[i];

                this.add(entry.key, entry.scene, entry.autoStart, entry.data);
            }

            //  _start might have been populated by this.add
            for (i = 0; i < this._start.length; i++)
            {
                entry = this._start[i];

                this.start(entry);
            }

            //  Clear the pending lists
            this._start.length = 0;
            this._pending.length = 0;
        }

        for (i = 0; i < this._queue.length; i++)
        {
            entry = this._queue[i];

            this[entry.op](entry.keyA, entry.keyB, entry.data);
        }

        this._queue.length = 0;
    }

    /**
     * Adds a new Scene into the SceneManager.
     * You must give each Scene a unique key by which you'll identify it.
     *
     * The `sceneConfig` can be:
     *
     * * A `Phaser.Scene` object, or an object that extends it.
     * * A plain JavaScript object
     * * A JavaScript ES6 Class that extends `Phaser.Scene`
     * * A JavaScript ES5 prototype based Class
     * * A JavaScript function
     *
     * If a function is given then a new Scene will be created by calling it.
     *
     * @method Phaser.Scenes.SceneManager#add
     * @since 3.0.0
     *
     * @param {string} key - A unique key used to reference the Scene, i.e. `MainMenu` or `Level1`.
     * @param {(Phaser.Types.Scenes.SceneType)} sceneConfig - The config for the Scene
     * @param {boolean} [autoStart=false] - If `true` the Scene will be started immediately after being added.
     * @param {object} [data] - Optional data object. This will be set as `Scene.settings.data` and passed to `Scene.init`, and `Scene.create`.
     *
     * @return {?Phaser.Scene} The added Scene, if it was added immediately, otherwise `null`.
     */
    // TODO: Fix types
    add (key: string, sceneConfig: Phaser.Types.Scenes.SceneType, autoStart: boolean = false, data: object = {})
    {

        //  If processing or not booted then put scene into a holding pattern
        if (this.isProcessing || !this.isBooted)
        {
            this._pending.push({
                key: key,
                scene: sceneConfig,
                autoStart: autoStart,
                data: data
            });

            if (!this.isBooted)
            {
                this._data[key] = { data: data };
            }

            return null;
        }

        key = this.getKey(key, sceneConfig as any);

        var newScene;

        if (sceneConfig instanceof Scene)
        {
            newScene = this.createSceneFromInstance(key, sceneConfig as any);
        }
        else if (typeof sceneConfig === 'object')
        {
            sceneConfig.key = key;

            newScene = this.createSceneFromObject(key, sceneConfig as any);
        }
        else if (typeof sceneConfig === 'function')
        {
            newScene = this.createSceneFromFunction(key, sceneConfig);
        }

        //  Any data to inject?
        newScene.sys.settings.data = data;

        //  Replace key in case the scene changed it
        key = newScene.sys.settings.key;

        this.keys[key] = newScene;

        this.scenes.push(newScene);

        if (autoStart || newScene.sys.settings.active)
        {
            if (this._pending.length)
            {
                this._start.push(key);
            }
            else
            {
                this.start(key);
            }
        }

        return newScene;
    }

    /**
     * Removes a Scene from the SceneManager.
     *
     * The Scene is removed from the local scenes array, it's key is cleared from the keys
     * cache and Scene.Systems.destroy is then called on it.
     *
     * If the SceneManager is processing the Scenes when this method is called it will
     * queue the operation for the next update sequence.
     *
     * @method Phaser.Scenes.SceneManager#remove
     * @since 3.2.0
     *
     * @param {string} key - A unique key used to reference the Scene, i.e. `MainMenu` or `Level1`.
     *
     * @return {this} This Scene Manager instance.
     */
    remove (key: string)
    {
        if (this.isProcessing)
        {
            return this.queueOp('remove', key);
        }

        var sceneToRemove = this.getScene(key);

        if (!sceneToRemove || sceneToRemove.sys.isTransitioning())
        {
            return this;
        }

        var index = this.scenes.indexOf(sceneToRemove);
        var sceneKey = sceneToRemove.sys.settings.key;

        if (index > -1)
        {
            delete this.keys[sceneKey];
            this.scenes.splice(index, 1);

            if (this._start.indexOf(sceneKey) > -1)
            {
                index = this._start.indexOf(sceneKey);
                this._start.splice(index, 1);
            }

            sceneToRemove.sys.destroy();
        }

        return this;
    }

    /**
     * Boot the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#bootScene
     * @private
     * @fires Phaser.Scenes.Events#TRANSITION_INIT
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to boot.
     */
    // TODO: Fix types
    bootScene (scene: Phaser.Scene)
    {
        var sys = scene.sys;
        var settings = sys.settings;

        sys.sceneUpdate = NOOP;

        if (scene.init)
        {
            scene.init.call(scene, settings.data);

            settings.status = CONST.INIT;

            if (settings.isTransition)
            {
                sys.events.emit(Events.TRANSITION_INIT, settings.transitionFrom, settings.transitionDuration);
            }
        }

        var loader;

        if (sys.load)
        {
            loader = sys.load;

            loader.reset();
        }

        if (loader && scene.preload)
        {
            scene.preload.call(scene);

            settings.status = CONST.LOADING;

            //  Start the loader going as we have something in the queue
            loader.once(LoaderEvents.COMPLETE, this.loadComplete, this);

            loader.start();
        }
        else
        {
            //  No preload? Then there was nothing to load either
            this.create(scene);
        }
    }

    /**
     * Handles load completion for a Scene's Loader.
     *
     * Starts the Scene that the Loader belongs to.
     *
     * @method Phaser.Scenes.SceneManager#loadComplete
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - The loader that has completed loading.
     */
    loadComplete (loader: Phaser.Loader.LoaderPlugin)
    {
        this.create(loader.scene);
    }

    /**
     * Handle payload completion for a Scene.
     *
     * @method Phaser.Scenes.SceneManager#payloadComplete
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - The loader that has completed loading its Scene's payload.
     */
    // TODO: Fix types
    payloadComplete (loader: Phaser.Loader.LoaderPlugin)
    {
        this.bootScene(loader.scene);
    }

    /**
     * Updates the Scenes.
     *
     * @method Phaser.Scenes.SceneManager#update
     * @since 3.0.0
     *
     * @param {number} time - Time elapsed.
     * @param {number} delta - Delta time from the last update.
     */
    // TODO: Fix types
    update (time: number, delta: number)
    {
        this.processQueue();

        this.isProcessing = true;

        //  Loop through the active scenes in reverse order
        for (var i = this.scenes.length - 1; i >= 0; i--)
        {
            var sys = this.scenes[i].sys;

            if (sys.settings.status > CONST.START && sys.settings.status <= CONST.RUNNING)
            {
                sys.step(time, delta);
            }

            if (sys.scenePlugin && sys.scenePlugin._target)
            {
                sys.scenePlugin.step(time, delta);
            }
        }
    }

    /**
     * Renders the Scenes.
     *
     * @method Phaser.Scenes.SceneManager#render
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The renderer to use.
     */
    // TODO: Fix types
    render (renderer: Phaser.Renderer.Canvas.CanvasRenderer | Phaser.Renderer.WebGL.WebGLRenderer)
    {
        //  Loop through the scenes in forward order
        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            if (sys.settings.visible && sys.settings.status >= CONST.LOADING && sys.settings.status < CONST.SLEEPING)
            {
                sys.render(renderer);
            }
        }

        this.isProcessing = false;
    }

    /**
     * Calls the given Scene's {@link Phaser.Scene#create} method and updates its status.
     *
     * @method Phaser.Scenes.SceneManager#create
     * @private
     * @fires Phaser.Scenes.Events#CREATE
     * @fires Phaser.Scenes.Events#TRANSITION_INIT
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to create.
     */
    // TODO: Fix types
    create (scene: Phaser.Scene)
    {
        var sys = scene.sys;
        var settings = sys.settings;

        if (scene.create)
        {
            settings.status = CONST.CREATING;

            scene.create.call(scene, settings.data);

            if (settings.status === CONST.DESTROYED)
            {
                return;
            }
        }

        if (settings.isTransition)
        {
            sys.events.emit(Events.TRANSITION_START, settings.transitionFrom, settings.transitionDuration);
        }

        //  If the Scene has an update function we'll set it now, otherwise it'll remain as NOOP
        if (scene.update)
        {
            sys.sceneUpdate = scene.update;
        }

        settings.status = CONST.RUNNING;

        sys.events.emit(Events.CREATE, scene);
    }

    /**
     * Creates and initializes a Scene from a function.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromFunction
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {function} scene - The function to create the Scene from.
     *
     * @return {Phaser.Scene} The created Scene.
     */
    // TODO: Fix types
    createSceneFromFunction (key: string, scene: Function)
    {
        var newScene = new scene();

        if (newScene instanceof Scene)
        {
            var configKey = newScene.sys.settings.key;

            if (configKey !== '')
            {
                key = configKey;
            }

            if (this.keys.hasOwnProperty(key))
            {
                throw new Error('Cannot add Scene with duplicate key: ' + key);
            }

            return this.createSceneFromInstance(key, newScene);
        }
        else
        {
            newScene.sys = new Systems(newScene);

            newScene.sys.settings.key = key;

            newScene.sys.init(this.game);

            return newScene;
        }
    }

    /**
     * Creates and initializes a Scene instance.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromInstance
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {Phaser.Scene} newScene - The Scene instance.
     *
     * @return {Phaser.Scene} The created Scene.
     */
    // TODO: Fix types
    createSceneFromInstance (key: string, newScene: Phaser.Scene)
    {
        var configKey = newScene.sys.settings.key;

        if (configKey === '')
        {
            newScene.sys.settings.key = key;
        }

        newScene.sys.init(this.game);

        return newScene;
    }

    /**
     * Creates and initializes a Scene from an Object definition.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromObject
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {(string|Phaser.Types.Scenes.SettingsConfig|Phaser.Types.Scenes.CreateSceneFromObjectConfig)} sceneConfig - The Scene config.
     *
     * @return {Phaser.Scene} The created Scene.
     */
    // TODO: Fix types
    createSceneFromObject (key: string, sceneConfig: Phaser.Types.Scenes.CreateSceneFromObjectConfig)
    {
        var newScene = new Scene(sceneConfig);

        var configKey = newScene.sys.settings.key;

        if (configKey !== '')
        {
            key = configKey;
        }
        else
        {
            newScene.sys.settings.key = key;
        }

        newScene.sys.init(this.game);

        //  Extract callbacks

        var defaults = [ 'init', 'preload', 'create', 'update', 'render' ];

        for (var i = 0; i < defaults.length; i++)
        {
            var sceneCallback = GetValue(sceneConfig, defaults[i], null);

            if (sceneCallback)
            {
                newScene[defaults[i]] = sceneCallback;
            }
        }

        //  Now let's move across any other functions or properties that may exist in the extend object:

        /*
        scene: {
            preload: preload,
            create: create,
            extend: {
                hello: 1,
                test: 'atari',
                addImage: addImage
            }
        }
        */

        if (sceneConfig.hasOwnProperty('extend'))
        {
            for (var propertyKey in sceneConfig.extend)
            {
                if (!sceneConfig.extend.hasOwnProperty(propertyKey))
                {
                    continue;
                }

                var value = sceneConfig.extend[propertyKey];

                if (propertyKey === 'data' && newScene.hasOwnProperty('data') && typeof value === 'object')
                {
                    //  Populate the DataManager
                    newScene.data.merge(value);
                }
                else if (propertyKey !== 'sys')
                {
                    newScene[propertyKey] = value;
                }
            }
        }

        return newScene;
    }

    /**
     * Retrieves the key of a Scene from a Scene config.
     *
     * @method Phaser.Scenes.SceneManager#getKey
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key to check in the Scene config.
     * @param {(Phaser.Scene|Phaser.Types.Scenes.SettingsConfig|function)} sceneConfig - The Scene config.
     *
     * @return {string} The Scene key.
     */
    // TODO: Fix types
    getKey (key: string, sceneConfig: Phaser.Types.Scenes.SettingsConfig | Phaser.Scene | Function)
    {
        if (!key) { key = 'default'; }

        if (typeof sceneConfig === 'function')
        {
            return key;
        }
        else if (sceneConfig instanceof Scene)
        {
            key = sceneConfig.sys.settings.key;
        }
        else if (typeof sceneConfig === 'object' && sceneConfig.hasOwnProperty('key'))
        {
            key = sceneConfig.key;
        }

        //  By this point it's either 'default' or extracted from the Scene

        if (this.keys.hasOwnProperty(key))
        {
            throw new Error('Cannot add Scene with duplicate key: ' + key);
        }
        else
        {
            return key;
        }
    }

    /**
     * Returns an array of all the current Scenes being managed by this Scene Manager.
     *
     * You can filter the output by the active state of the Scene and choose to have
     * the array returned in normal or reversed order.
     *
     * @method Phaser.Scenes.SceneManager#getScenes
     * @since 3.16.0
     *
     * @generic {Phaser.Scene[]} T - [$return]
     * @genericUse {T} - [$return]
     *
     * @param {boolean} [isActive=true] - Only include Scene's that are currently active?
     * @param {boolean} [inReverse=false] - Return the array of Scenes in reverse?
     *
     * @return {Phaser.Scene[]} An array containing all of the Scenes in the Scene Manager.
     */
    // TODO: Fix types
    getScenes (isActive: boolean = true, inReverse: boolean = false)
    {
        if (isActive === undefined) { isActive = true; }
        if (inReverse === undefined) { inReverse = false; }

        var out = [];
        var scenes = this.scenes;

        for (var i = 0; i < scenes.length; i++)
        {
            var scene = scenes[i];

            if (scene && (!isActive || (isActive && scene.sys.isActive())))
            {
                out.push(scene);
            }
        }

        return (inReverse) ? out.reverse() : out;
    }

    /**
     * Retrieves a Scene based on the given key.
     *
     * If an actual Scene is passed to this method, it can be used to check if
     * its currently within the Scene Manager, or not.
     *
     * @method Phaser.Scenes.SceneManager#getScene
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     * @genericUse {T} - [$return]
     *
     * @param {(string|Phaser.Scene)} key - The key of the Scene to retrieve.
     *
     * @return {?Phaser.Scene} The Scene, or `null` if no matching Scene was found.
     */
    // TODO: Fix types
    getScene (key: string | Phaser.Scene)
    {
        if (typeof key === 'string')
        {
            if (this.keys[key])
            {
                return this.keys[key];
            }
        }
        else
        {
            for (var i = 0; i < this.scenes.length; i++)
            {
                if (key === this.scenes[i])
                {
                    return key;
                }
            }
        }

        return null;
    }

    /**
     * Determines whether a Scene is running.
     *
     * @method Phaser.Scenes.SceneManager#isActive
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is running, or `null` if no matching Scene was found.
     */
    // TODO: Fix types
    isActive (key: string | Phaser.Scene)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            return scene.sys.isActive();
        }

        return null;
    }

    /**
     * Determines whether a Scene is paused.
     *
     * @method Phaser.Scenes.SceneManager#isPaused
     * @since 3.17.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is paused, or `null` if no matching Scene was found.
     */
    // TODO: Fix types
    isPaused (key: string | Phaser.Scene)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            return scene.sys.isPaused();
        }

        return null;
    }

    /**
     * Determines whether a Scene is visible.
     *
     * @method Phaser.Scenes.SceneManager#isVisible
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is visible, or `null` if no matching Scene was found.
     */
    // TODO: Fix types
    isVisible (key: string | Phaser.Scene)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            return scene.sys.isVisible();
        }

        return null;
    }

    /**
     * Determines whether a Scene is sleeping.
     *
     * @method Phaser.Scenes.SceneManager#isSleeping
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is sleeping, or `null` if no matching Scene was found.
     */
    // TODO: Fix types
    isSleeping (key: string | Phaser.Scene)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            return scene.sys.isSleeping();
        }

        return null;
    }

    /**
     * Pauses the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#pause
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to pause.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted by its pause event.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    pause (key: string | Phaser.Scene, data: any = {})
    {
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.pause(data);
        }

        return this;
    }

    /**
     * Resumes the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#resume
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to resume.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted by its resume event.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    resume (key: string | Phaser.Scene, data: any = {})
    {
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.resume(data);
        }

        return this;
    }

    /**
     * Puts the given Scene to sleep.
     *
     * @method Phaser.Scenes.SceneManager#sleep
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to put to sleep.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted by its sleep event.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    sleep (key: string | Phaser.Scene, data: any = {})
    {
        var scene = this.getScene(key);

        if (scene && !scene.sys.isTransitioning())
        {
            scene.sys.sleep(data);
        }

        return this;
    }

    /**
     * Awakens the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#wake
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to wake up.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted by its wake event.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    wake (key: string | Phaser.Scene, data: any = {})
    {
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.wake(data);
        }

        return this;
    }

    /**
     * Runs the given Scene.
     *
     * If the given Scene is paused, it will resume it. If sleeping, it will wake it.
     * If not running at all, it will be started.
     *
     * Use this if you wish to open a modal Scene by calling `pause` on the current
     * Scene, then `run` on the modal Scene.
     *
     * @method Phaser.Scenes.SceneManager#run
     * @since 3.10.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to run.
     * @param {object} [data] - A data object that will be passed to the Scene on start, wake, or resume.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    run (key: string | Phaser.Scene, data: any = {})
    {
        var scene = this.getScene(key);

        if (!scene)
        {
            for (var i = 0; i < this._pending.length; i++)
            {
                if (this._pending[i].key === key)
                {
                    this.queueOp('start', key, data);
                    break;
                }
            }
            return this;
        }

        if (scene.sys.isSleeping())
        {
            //  Sleeping?
            scene.sys.wake(data);
        }
        else if (scene.sys.isPaused())
        {
            //  Paused?
            scene.sys.resume(data);
        }
        else
        {
            //  Not actually running?
            this.start(key, data);
        }
    }

    /**
     * Starts the given Scene, if it is not starting, loading, or creating.
     *
     * If the Scene is running, paused, or sleeping, it will be shutdown and then started.
     *
     * @method Phaser.Scenes.SceneManager#start
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to start.
     * @param {object} [data] - Optional data object to pass to `Scene.Settings` and `Scene.init`, and `Scene.create`.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    start (key: string | Phaser.Scene, data: any = {})
    {
        //  If the Scene Manager is not running, then put the Scene into a holding pattern
        if (!this.isBooted)
        {
            this._data[key] = {
                autoStart: true,
                data: data
            };

            return this;
        }

        var scene = this.getScene(key);

        if (!scene)
        {
            console.warn('Scene key not found: ' + key);
            return this;
        }

        var sys = scene.sys;
        var status = sys.settings.status;

        //  If the scene is already started but not yet running,
        //  let it continue.
        if (status >= CONST.START && status <= CONST.CREATING)
        {
            return this;
        }

        //  If the Scene is already running, paused, or sleeping,
        //  close it down before starting it again.
        else if (status >= CONST.RUNNING && status <= CONST.SLEEPING)
        {
            sys.shutdown();

            sys.sceneUpdate = NOOP;

            sys.start(data);
        }

        //  If the Scene is INIT or SHUTDOWN,
        //  start it directly.
        else
        {
            sys.sceneUpdate = NOOP;

            sys.start(data);

            var loader;

            if (sys.load)
            {
                loader = sys.load;
            }

            //  Files payload?
            if (loader && sys.settings.hasOwnProperty('pack'))
            {
                loader.reset();

                if (loader.addPack({ payload: sys.settings.pack }))
                {
                    sys.settings.status = CONST.LOADING;

                    loader.once(LoaderEvents.COMPLETE, this.payloadComplete, this);

                    loader.start();

                    return this;
                }
            }
        }

        this.bootScene(scene);

        return this;
    }

    /**
     * Stops the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#stop
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to stop.
     * @param {object} [data] - Optional data object to pass to Scene.shutdown.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    stop (key: string | Phaser.Scene, data: any = {})
    {
        var scene = this.getScene(key);

        if (scene && !scene.sys.isTransitioning() && scene.sys.settings.status !== CONST.SHUTDOWN)
        {
            var loader = scene.sys.load;

            if (loader)
            {
                loader.off(LoaderEvents.COMPLETE, this.loadComplete, this);
                loader.off(LoaderEvents.COMPLETE, this.payloadComplete, this);
            }

            scene.sys.shutdown(data);
        }

        return this;
    }

    /**
     * Sleeps one one Scene and starts the other.
     *
     * @method Phaser.Scenes.SceneManager#switch
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [from,to]
     *
     * @param {(string|Phaser.Scene)} from - The Scene to sleep.
     * @param {(string|Phaser.Scene)} to - The Scene to start.
     * @param {object} [data] - Optional data object to pass to `Scene.Settings` and `Scene.init`, and `Scene.create`. It is only passed when the scene starts for the first time.
     *
     * @return {this} This Scene Manager instance.
     */
    switch (from: string | Phaser.Scene, to: string | Phaser.Scene, data: object = {})
    {
        var sceneA = this.getScene(from);
        var sceneB = this.getScene(to);

        if (sceneA && sceneB && sceneA !== sceneB)
        {
            this.sleep(from);

            if (this.isSleeping(to))
            {
                this.wake(to, data);
            }
            else
            {
                this.start(to, data);
            }
        }

        return this;
    }

    /**
     * Retrieves a Scene by numeric index.
     *
     * @method Phaser.Scenes.SceneManager#getAt
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {T} - [$return]
     *
     * @param {number} index - The index of the Scene to retrieve.
     *
     * @return {(Phaser.Scene|undefined)} The Scene.
     */
    // TODO: Fix types
    getAt (index: number)
    {
        return this.scenes[index];
    }

    /**
     * Retrieves the numeric index of a Scene.
     *
     * @method Phaser.Scenes.SceneManager#getIndex
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The key of the Scene.
     *
     * @return {number} The index of the Scene.
     */
    // TODO: Fix types
    getIndex (key: string | Phaser.Scene)
    {
        var scene = this.getScene(key);

        return this.scenes.indexOf(scene!);
    }

    /**
     * Brings a Scene to the top of the Scenes list.
     *
     * This means it will render above all other Scenes.
     *
     * @method Phaser.Scenes.SceneManager#bringToTop
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    bringToTop (key: string | Phaser.Scene)
    {
        if (this.isProcessing)
        {
            return this.queueOp('bringToTop', key);
        }

        var index = this.getIndex(key);
        var scenes = this.scenes;

        if (index !== -1 && index < scenes.length)
        {
            var scene = this.getScene(key);

            scenes.splice(index, 1);
            scenes.push(scene!);
        }

        return this;
    }

    /**
     * Sends a Scene to the back of the Scenes list.
     *
     * This means it will render below all other Scenes.
     *
     * @method Phaser.Scenes.SceneManager#sendToBack
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    sendToBack (key: string | Phaser.Scene)
    {
        if (this.isProcessing)
        {
            return this.queueOp('sendToBack', key);
        }

        var index = this.getIndex(key);

        if (index !== -1 && index > 0)
        {
            var scene = this.getScene(key);

            this.scenes.splice(index, 1);
            this.scenes.unshift(scene!);
        }

        return this;
    }

    /**
     * Moves a Scene down one position in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#moveDown
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    moveDown (key: string | Phaser.Scene)
    {
        if (this.isProcessing)
        {
            return this.queueOp('moveDown', key);
        }

        var indexA = this.getIndex(key);

        if (indexA > 0)
        {
            var indexB = indexA - 1;
            var sceneA = this.getScene(key);
            var sceneB = this.getAt(indexB);

            this.scenes[indexA] = sceneB;
            this.scenes[indexB] = sceneA!;
        }

        return this;
    }

    /**
     * Moves a Scene up one position in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#moveUp
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    moveUp (key: string | Phaser.Scene)
    {
        if (this.isProcessing)
        {
            return this.queueOp('moveUp', key);
        }

        var indexA = this.getIndex(key);

        if (indexA < this.scenes.length - 1)
        {
            var indexB = indexA + 1;
            var sceneA = this.getScene(key);
            var sceneB = this.getAt(indexB);

            this.scenes[indexA] = sceneB;
            this.scenes[indexB] = sceneA!;
        }

        return this;
    }

    /**
     * Moves a Scene so it is immediately above another Scene in the Scenes list.
     * If the Scene is already above the other, it isn't moved.
     *
     * This means it will render over the top of the other Scene.
     *
     * @method Phaser.Scenes.SceneManager#moveAbove
     * @since 3.2.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [keyA,keyB]
     *
     * @param {(string|Phaser.Scene)} keyA - The Scene that Scene B will be moved above.
     * @param {(string|Phaser.Scene)} keyB - The Scene to be moved.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    moveAbove (keyA: string | Phaser.Scene, keyB: string | Phaser.Scene)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this.isProcessing)
        {
            return this.queueOp('moveAbove', keyA, keyB);
        }

        var indexA = this.getIndex(keyA);
        var indexB = this.getIndex(keyB);

        if (indexA !== -1 && indexB !== -1 && indexB < indexA)
        {
            var tempScene = this.getAt(indexB);

            //  Remove
            this.scenes.splice(indexB, 1);

            //  Add in new location
            this.scenes.splice(indexA + Number(indexB > indexA), 0, tempScene);
        }

        return this;
    }

    /**
     * Moves a Scene so it is immediately below another Scene in the Scenes list.
     * If the Scene is already below the other, it isn't moved.
     *
     * This means it will render behind the other Scene.
     *
     * @method Phaser.Scenes.SceneManager#moveBelow
     * @since 3.2.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [keyA,keyB]
     *
     * @param {(string|Phaser.Scene)} keyA - The Scene that Scene B will be moved below.
     * @param {(string|Phaser.Scene)} keyB - The Scene to be moved.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    moveBelow (keyA: string | Phaser.Scene, keyB: string | Phaser.Scene)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this.isProcessing)
        {
            return this.queueOp('moveBelow', keyA, keyB);
        }

        var indexA = this.getIndex(keyA);
        var indexB = this.getIndex(keyB);

        if (indexA !== -1 && indexB !== -1 && indexB > indexA)
        {
            var tempScene = this.getAt(indexB);

            //  Remove
            this.scenes.splice(indexB, 1);

            if (indexA === 0)
            {
                this.scenes.unshift(tempScene);
            }
            else
            {
                //  Add in new location
                this.scenes.splice(indexA - Number(indexB < indexA), 0, tempScene);
            }
        }

        return this;
    }

    /**
     * Queue a Scene operation for the next update.
     *
     * @method Phaser.Scenes.SceneManager#queueOp
     * @private
     * @since 3.0.0
     *
     * @param {string} op - The operation to perform.
     * @param {(string|Phaser.Scene)} keyA - Scene A.
     * @param {(any|string|Phaser.Scene)} [keyB] - Scene B, or a data object.
     * @param {any} [data] - Optional data object to pass.
     *
     * @return {this} This Scene Manager instance.
     */
    // TODO: Fix types
    queueOp (op: string, keyA: string | Phaser.Scene, keyB?: any | string | Phaser.Scene, data: object = {})
    {
        this._queue.push({ op: op, keyA: keyA, keyB: keyB, data: data });

        return this;
    }

    /**
     * Swaps the positions of two Scenes in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#swapPosition
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [keyA,keyB]
     *
     * @param {(string|Phaser.Scene)} keyA - The first Scene to swap.
     * @param {(string|Phaser.Scene)} keyB - The second Scene to swap.
     *
     * @return {this} This Scene Manager instance.
     */
    swapPosition (keyA: string | Phaser.Scene, keyB: string | Phaser.Scene)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this.isProcessing)
        {
            return this.queueOp('swapPosition', keyA, keyB);
        }

        var indexA = this.getIndex(keyA);
        var indexB = this.getIndex(keyB);

        if (indexA !== indexB && indexA !== -1 && indexB !== -1)
        {
            var tempScene = this.getAt(indexA);

            this.scenes[indexA] = this.scenes[indexB];
            this.scenes[indexB] = tempScene;
        }

        return this;
    }

    /**
     * Dumps debug information about each Scene to the developer console.
     *
     * @method Phaser.Scenes.SceneManager#dump
     * @since 3.2.0
     */
    dump ()
    {
        var out = [];
        var map = [ 'pending', 'init', 'start', 'loading', 'creating', 'running', 'paused', 'sleeping', 'shutdown', 'destroyed' ];

        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            var key = (sys.settings.visible && (sys.settings.status === CONST.RUNNING || sys.settings.status === CONST.PAUSED)) ? '[*] ' : '[-] ';
            key += sys.settings.key + ' (' + map[sys.settings.status] + ')';

            out.push(key);
        }

        console.log(out.join('\n'));
    }

    /**
     * Destroy this Scene Manager and all of its systems.
     *
     * This process cannot be reversed.
     *
     * This method is called automatically when a Phaser Game instance is destroyed.
     *
     * @method Phaser.Scenes.SceneManager#destroy
     * @since 3.0.0
     */
    destroy ()
    {
        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            sys.destroy();
        }

        this.systemScene.sys.destroy();

        this.update = NOOP;

        this.scenes = [];

        this._pending = [];
        this._start = [];
        this._queue = [];

        this.game = null;
        this.systemScene = null;
    }

}
