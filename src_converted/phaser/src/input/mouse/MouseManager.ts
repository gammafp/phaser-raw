/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils/NOOP';
import { FEATURES_DEVICE as Features } from '../../device/Features';
import * as InputEvents from '../events';

//  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
//  https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

/**
 * @classdesc
 * The Mouse Manager is a helper class that belongs to the Input Manager.
 *
 * Its role is to listen for native DOM Mouse Events and then pass them onto the Input Manager for further processing.
 *
 * You do not need to create this class directly, the Input Manager will create an instance of it automatically.
 *
 * @class MouseManager
 * @memberof Phaser.Input.Mouse
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - A reference to the Input Manager.
 */
export class MouseManager {

    manager: any;
    preventDefaultDown: boolean;
    preventDefaultUp: boolean;
    preventDefaultMove: boolean;
    preventDefaultWheel: boolean;
    enabled: boolean;
    target: any;
    locked: boolean;
    onMouseMove: Function;
    onMouseDown: Function;
    onMouseUp: Function;
    onMouseDownWindow: Function;
    onMouseUpWindow: Function;
    onMouseOver: Function;
    onMouseOut: Function;
    onMouseWheel: Function;
    pointerLockChange: Function;
    isTop: boolean;
    passive: boolean;

    constructor(inputManager: any)
    {
        this.manager = inputManager;
        this.preventDefaultDown = true;
        this.preventDefaultUp = true;
        this.preventDefaultMove = true;
        this.preventDefaultWheel = false;
        this.enabled = false;
        this.target = null;
        this.locked = false;
        this.onMouseMove = NOOP;
        this.onMouseDown = NOOP;
        this.onMouseUp = NOOP;
        this.onMouseDownWindow = NOOP;
        this.onMouseUpWindow = NOOP;
        this.onMouseOver = NOOP;
        this.onMouseOut = NOOP;
        this.onMouseWheel = NOOP;
        this.pointerLockChange = NOOP;
        this.isTop = true;
        this.passive = false;

        inputManager.events.once(InputEvents.MANAGER_BOOT, this.boot, this);
    }

    /**
     * The Touch Manager boot process.
     *
     * @method Phaser.Input.Mouse.MouseManager#boot
     * @private
     * @since 3.0.0
     */
    boot(): void
    {
        var config = this.manager.config;

        this.enabled = config.inputMouse;
        this.target = config.inputMouseEventTarget;
        this.passive = config.inputMousePassive;

        this.preventDefaultDown = config.inputMousePreventDefaultDown;
        this.preventDefaultUp = config.inputMousePreventDefaultUp;
        this.preventDefaultMove = config.inputMousePreventDefaultMove;
        this.preventDefaultWheel = config.inputMousePreventDefaultWheel;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }
        else if (typeof this.target === 'string')
        {
            this.target = document.getElementById(this.target);
        }

        if (config.disableContextMenu)
        {
            this.disableContextMenu();
        }

        if (this.enabled && this.target)
        {
            this.startListeners();
        }
    }

    /**
     * Attempts to disable the context menu from appearing if you right-click on the game canvas, or specified input target.
     *
     * Works by listening for the `contextmenu` event and prevent defaulting it.
     *
     * Use this if you need to enable right-button mouse support in your game, and the context
     * menu keeps getting in the way.
     *
     * @method Phaser.Input.Mouse.MouseManager#disableContextMenu
     * @since 3.0.0
     *
     * @return {this} This Mouse Manager instance.
     */
    disableContextMenu(): this
    {
        this.target.addEventListener('contextmenu', function (event: Event)
        {
            event.preventDefault();
            return false;
        });

        return this;
    }

    /**
     * If the browser supports it, you can request that the pointer be locked to the browser window.
     *
     * This is classically known as 'FPS controls', where the pointer can't leave the browser until
     * the user presses an exit key.
     *
     * If the browser successfully enters a locked state, a `POINTER_LOCK_CHANGE_EVENT` will be dispatched,
     * from the games Input Manager, with an `isPointerLocked` property.
     *
     * It is important to note that pointer lock can only be enabled after an 'engagement gesture',
     * see: https://w3c.github.io/pointerlock/#dfn-engagement-gesture.
     *
     * Note for Firefox: There is a bug in certain Firefox releases that cause native DOM events like
     * `mousemove` to fire continuously when in pointer lock mode. You can get around this by setting
     * `this.preventDefaultMove` to `false` in this class. You may also need to do the same for
     * `preventDefaultDown` and/or `preventDefaultUp`. Please test combinations of these if you encounter
     * the error.
     *
     * @method Phaser.Input.Mouse.MouseManager#requestPointerLock
     * @since 3.0.0
     */
    requestPointerLock(): void
    {
        if (Features.pointerLock)
        {
            var element: any = this.target;

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            element.requestPointerLock();
        }
    }

    /**
     * If the browser supports pointer lock, this will request that the pointer lock is released. If
     * the browser successfully enters a locked state, a 'POINTER_LOCK_CHANGE_EVENT' will be
     * dispatched - from the game's input manager - with an `isPointerLocked` property.
     *
     * @method Phaser.Input.Mouse.MouseManager#releasePointerLock
     * @since 3.0.0
     */
    releasePointerLock(): void
    {
        if (Features.pointerLock)
        {
            (document as any).exitPointerLock = (document as any).exitPointerLock || (document as any).mozExitPointerLock || (document as any).webkitExitPointerLock;
            (document as any).exitPointerLock();
        }
    }

    /**
     * Starts the Mouse Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Mouse.MouseManager#startListeners
     * @since 3.0.0
     */
    startListeners(): void
    {
        var target = this.target;

        if (!target)
        {
            return;
        }

        var _this = this;
        var manager = this.manager;
        var canvas = manager.canvas;
        var autoFocus = (window && window.focus && manager.game.config.autoFocus);

        this.onMouseMove = function (event: MouseEvent)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.onMouseMove(event);

                if (_this.preventDefaultMove)
                {
                    event.preventDefault();
                }
            }
        };

        this.onMouseDown = function (event: MouseEvent)
        {
            if (autoFocus)
            {
                window.focus();
            }

            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.onMouseDown(event);

                if (_this.preventDefaultDown && event.target === canvas)
                {
                    event.preventDefault();
                }
            }
        };

        this.onMouseDownWindow = function (event: any)
        {
            if (event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents)
            {
                return;
            }

            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled && event.target !== canvas)
            {
                //  Only process the event if the target isn't the canvas
                manager.onMouseDown(event);
            }
        };

        this.onMouseUp = function (event: MouseEvent)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.onMouseUp(event);

                if (_this.preventDefaultUp && event.target === canvas)
                {
                    event.preventDefault();
                }
            }
        };

        this.onMouseUpWindow = function (event: any)
        {
            if (event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents)
            {
                return;
            }

            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled && event.target !== canvas)
            {
                //  Only process the event if the target isn't the canvas
                manager.onMouseUp(event);
            }
        };

        this.onMouseOver = function (event: MouseEvent)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.setCanvasOver(event);
            }
        };

        this.onMouseOut = function (event: MouseEvent)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.setCanvasOut(event);
            }
        };

        this.onMouseWheel = function (event: WheelEvent)
        {
            if (!event.defaultPrevented && _this.enabled && manager && manager.enabled)
            {
                manager.onMouseWheel(event);
            }

            if (_this.preventDefaultWheel && event.target === canvas)
            {
                event.preventDefault();
            }
        };

        var passive = { passive: true };

        target.addEventListener('mousemove', this.onMouseMove);
        target.addEventListener('mousedown', this.onMouseDown);
        target.addEventListener('mouseup', this.onMouseUp);
        target.addEventListener('mouseover', this.onMouseOver, passive);
        target.addEventListener('mouseout', this.onMouseOut, passive);

        if (this.preventDefaultWheel)
        {
            target.addEventListener('wheel', this.onMouseWheel, { passive: false });
        }
        else
        {
            target.addEventListener('wheel', this.onMouseWheel, passive);
        }

        if (window && manager.game.config.inputWindowEvents)
        {
            try
            {
                window.top!.addEventListener('mousedown', this.onMouseDownWindow, passive);
                window.top!.addEventListener('mouseup', this.onMouseUpWindow, passive);
            }
            catch (exception)
            {
                window.addEventListener('mousedown', this.onMouseDownWindow, passive);
                window.addEventListener('mouseup', this.onMouseUpWindow, passive);

                this.isTop = false;
            }
        }

        if (Features.pointerLock)
        {
            this.pointerLockChange = function (event: Event)
            {
                var element = _this.target;

                _this.locked = ((document as any).pointerLockElement === element || (document as any).mozPointerLockElement === element || (document as any).webkitPointerLockElement === element) ? true : false;

                manager.onPointerLockChange(event);
            };

            document.addEventListener('pointerlockchange', this.pointerLockChange, true);
            document.addEventListener('mozpointerlockchange', this.pointerLockChange, true);
            document.addEventListener('webkitpointerlockchange', this.pointerLockChange, true);
        }

        this.enabled = true;
    }

    /**
     * Stops the Mouse Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Mouse.MouseManager#stopListeners
     * @since 3.0.0
     */
    stopListeners(): void
    {
        var target: any = this.target;

        target.removeEventListener('mousemove', this.onMouseMove);
        target.removeEventListener('mousedown', this.onMouseDown);
        target.removeEventListener('mouseup', this.onMouseUp);
        target.removeEventListener('mouseover', this.onMouseOver);
        target.removeEventListener('mouseout', this.onMouseOut);

        if (window)
        {
            target = (this.isTop) ? window.top : window;

            target.removeEventListener('mousedown', this.onMouseDownWindow);
            target.removeEventListener('mouseup', this.onMouseUpWindow);
        }

        if (Features.pointerLock)
        {
            document.removeEventListener('pointerlockchange', this.pointerLockChange, true);
            document.removeEventListener('mozpointerlockchange', this.pointerLockChange, true);
            document.removeEventListener('webkitpointerlockchange', this.pointerLockChange, true);
        }
    }

    /**
     * Destroys this Mouse Manager instance.
     *
     * @method Phaser.Input.Mouse.MouseManager#destroy
     * @since 3.0.0
     */
    destroy(): void
    {
        this.stopListeners();

        this.target = null;
        this.enabled = false;
        this.manager = null;
    }

}
