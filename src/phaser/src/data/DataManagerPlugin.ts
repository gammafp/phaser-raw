/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DataManager } from './DataManager';

var PluginCache = require('../plugins/PluginCache');
const SceneEvents = require('../scene/events');

/**
 * @classdesc
 * The Data Component features a means to store pieces of data specific to a Game Object, System or Plugin.
 * You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
 * or have a property called `events` that is an instance of it.
 *
 * @class DataManagerPlugin
 * @extends Phaser.Data.DataManager
 * @memberof Phaser.Data
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that this DataManager belongs to.
 */
export class DataManagerPlugin extends DataManager {

    scene: any;
    systems: any;

    constructor(scene: any)
    {
        super(scene, scene.sys.events);

        /**
         * A reference to the Scene that this DataManager belongs to.
         *
         * @name Phaser.Data.DataManagerPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene's Systems.
         *
         * @name Phaser.Data.DataManagerPlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    }

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Data.DataManagerPlugin#boot
     * @private
     * @since 3.5.1
     */
    boot(): void
    {
        this.events = this.systems.events;

        this.events.once(SceneEvents.DESTROY, this.destroy, this);
    }

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Data.DataManagerPlugin#start
     * @private
     * @since 3.5.0
     */
    start(): void
    {
        this.events.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    }

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Data.DataManagerPlugin#shutdown
     * @private
     * @since 3.5.0
     */
    shutdown(): void
    {
        this.systems.events.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    }

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Data.DataManagerPlugin#destroy
     * @since 3.5.0
     */
    destroy(): void
    {
        super.destroy();

        this.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

}

PluginCache.register('DataManagerPlugin', DataManagerPlugin, 'data');
