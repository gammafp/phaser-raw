/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
import { Rectangle } from '../../geom/rectangle/Rectangle';
import { DegToRad } from '../../math/DegToRad';
import { Vector2 } from '../../math/Vector2';
import { Mixin } from '../../utils/MixinTS';

import EventEmitter from 'eventemitter3';

var TransformMatrix = require('../../gameobjects/components/TransformMatrix');
var ValueToColor = require('../../display/color/ValueToColor');

var ComponentAlphaSingle = require('../../gameobjects/components/Alpha');
var ComponentVisible = require('../../gameobjects/components/Visible');

var Events = require('./events');

// TODO: Check the types of this script

/**
 * @classdesc
 * A Base Camera class.
 *
 * The Camera is the way in which all games are rendered in Phaser. They provide a view into your game world,
 * and can be positioned, rotated, zoomed and scrolled accordingly.
 *
 * A Camera consists of two elements: The viewport and the scroll values.
 *
 * The viewport is the physical position and size of the Camera within your game. Cameras, by default, are
 * created the same size as your game, but their position and size can be set to anything. This means if you
 * wanted to create a camera that was 320x200 in size, positioned in the bottom-right corner of your game,
 * you'd adjust the viewport to do that (using methods like `setViewport` and `setSize`).
 *
 * If you wish to change where the Camera is looking in your game, then you scroll it. You can do this
 * via the properties `scrollX` and `scrollY` or the method `setScroll`. Scrolling has no impact on the
 * viewport, and changing the viewport has no impact on the scrolling.
 *
 * By default a Camera will render all Game Objects it can see. You can change this using the `ignore` method,
 * allowing you to filter Game Objects out on a per-Camera basis.
 *
 * The Base Camera is extended by the Camera class, which adds in special effects including Fade,
 * Flash and Camera Shake, as well as the ability to follow Game Objects.
 *
 * The Base Camera was introduced in Phaser 3.12. It was split off from the Camera class, to allow
 * you to isolate special effects as needed. Therefore the 'since' values for properties of this class relate
 * to when they were added to the Camera class.
 *
 * @class BaseCamera
 * @memberof Phaser.Cameras.Scene2D
 * @extends Phaser.Events.EventEmitter
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @since 3.12.0
 */
export class BaseCamera extends EventEmitter {

    // Core references
    scene: any;
    sceneManager: any;
    scaleManager: any;
    cameraManager: any;

    // Identity and basic flags
    id: number = 0;
    name: string = '';
    roundPixels: boolean = false;
    useBounds: boolean = false;
    worldView: Rectangle;
    dirty: boolean = true;

    // Viewport
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    // Bounds and scroll
    private _bounds: Rectangle;
    private _scrollX: number = 0;
    private _scrollY: number = 0;

    // Zoom and rotation
    private _zoomX: number = 1;
    private _zoomY: number = 1;
    private _rotation: number = 0;

    // Matrices
    matrix: any;
    matrixCombined: any;
    matrixExternal: any;

    // Background
    transparent: boolean = true;
    backgroundColor: any;

    // Culling and render list
    disableCull: boolean = false;
    culledObjects: any[] = [];
    renderList: any[] = [];

    // Position helpers
    midPoint: Vector2;
    originX: number = 0.5;
    originY: number = 0.5;

    // Viewport state
    private _customViewport: boolean = false;

    // Masking
    mask: any = null;
    private _maskCamera: BaseCamera | null = null;

    // Camera type and composition
    isSceneCamera: boolean = true;
    forceComposite: boolean = false;
    renderRoundPixels: boolean = true;

    static
    {
        // Aplicar componentes de AlphaSingle y Visible al prototipo de la cámara
        Mixin(this, [
            ComponentAlphaSingle,
            ComponentVisible
        ]);
    }

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
    {
        super();

        this.worldView = new Rectangle();

        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this._bounds = new Rectangle();

        this.matrix = new TransformMatrix();
        this.matrixCombined = new TransformMatrix();
        this.matrixExternal = new TransformMatrix();

        this.backgroundColor = ValueToColor('rgba(0,0,0,0)');

        this.midPoint = new Vector2(width / 2, height / 2);

        this.mask = null;
        this._maskCamera = null;

        this.renderList = [];
        this.isSceneCamera = true;
        this.forceComposite = false;
        this.renderRoundPixels = true;
    }

    /**
     * Adds the given Game Object to this cameras render list.
     *
     * This is invoked during the rendering stage. Only objects that are actually rendered
     * will appear in the render list.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#addToRenderList
     * @since 3.52.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to add to the render list.
     */
    addToRenderList(child)
    {
        this.renderList.push(child);
    }

    /**
     * Sets the rotation origin of this Camera.
     *
     * The values are given in the range 0 to 1 and are only used when calculating Camera rotation.
     *
     * By default the camera rotates around the center of the viewport.
     *
     * Changing the origin allows you to adjust the point in the viewport from which rotation happens.
     * A value of 0 would rotate from the top-left of the viewport. A value of 1 from the bottom right.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setOrigin
     * @since 3.11.0
     *
     * @param {number} [x=0.5] - The horizontal origin value.
     * @param {number} [y=x] - The vertical origin value. If not defined it will be set to the value of `x`.
     *
     * @return {this} This Camera instance.
     */
    setOrigin(x?, y?)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = x; }

        this.originX = x;
        this.originY = y;

        return this;
    }

    /**
     * Calculates what the Camera.scrollX and scrollY values would need to be in order to move
     * the Camera so it is centered on the given x and y coordinates, without actually moving
     * the Camera there. The results are clamped based on the Camera bounds, if set.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#getScroll
     * @since 3.11.0
     *
     * @param {number} x - The horizontal coordinate to center on.
     * @param {number} y - The vertical coordinate to center on.
     * @param {Phaser.Math.Vector2} [out] - A Vector2 to store the values in. If not given a new Vector2 is created.
     *
     * @return {Phaser.Math.Vector2} The scroll coordinates stored in the `x` and `y` properties.
     */
    getScroll(x, y, out?)
    {
        if (out === undefined) { out = new Vector2(); }

        var originX = this.width * 0.5;
        var originY = this.height * 0.5;

        out.x = x - originX;
        out.y = y - originY;

        if (this.useBounds)
        {
            out.x = this.clampX(out.x);
            out.y = this.clampY(out.y);
        }

        return out;
    }

    /**
     * Moves the Camera horizontally so that it is centered on the given x coordinate, bounds allowing.
     * Calling this does not change the scrollY value.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#centerOnX
     * @since 3.16.0
     *
     * @param {number} x - The horizontal coordinate to center on.
     *
     * @return {this} This Camera instance.
     */
    centerOnX(x)
    {
        var originX = this.width * 0.5;

        this.midPoint.x = x;

        this.scrollX = x - originX;

        if (this.useBounds)
        {
            this.scrollX = this.clampX(this.scrollX);
        }

        return this;
    }

    /**
     * Moves the Camera vertically so that it is centered on the given y coordinate, bounds allowing.
     * Calling this does not change the scrollX value.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#centerOnY
     * @since 3.16.0
     *
     * @param {number} y - The vertical coordinate to center on.
     *
     * @return {this} This Camera instance.
     */
    centerOnY(y)
    {
        var originY = this.height * 0.5;

        this.midPoint.y = y;

        this.scrollY = y - originY;

        if (this.useBounds)
        {
            this.scrollY = this.clampY(this.scrollY);
        }

        return this;
    }

    /**
     * Moves the Camera so that it is centered on the given coordinates, bounds allowing.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#centerOn
     * @since 3.11.0
     *
     * @param {number} x - The horizontal coordinate to center on.
     * @param {number} y - The vertical coordinate to center on.
     *
     * @return {this} This Camera instance.
     */
    centerOn(x, y)
    {
        this.centerOnX(x);
        this.centerOnY(y);

        return this;
    }

    /**
     * Moves the Camera so that it is looking at the center of the Camera Bounds, if enabled.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#centerToBounds
     * @since 3.0.0
     *
     * @return {this} This Camera instance.
     */
    centerToBounds()
    {
        if (this.useBounds)
        {
            var bounds = this._bounds;
            var originX = this.width * 0.5;
            var originY = this.height * 0.5;

            this.midPoint.set(bounds.centerX, bounds.centerY);

            this.scrollX = bounds.centerX - originX;
            this.scrollY = bounds.centerY - originY;
        }

        return this;
    }

    /**
     * Moves the Camera so that it is re-centered based on its viewport size.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#centerToSize
     * @since 3.0.0
     *
     * @return {this} This Camera instance.
     */
    centerToSize()
    {
        this.scrollX = this.width * 0.5;
        this.scrollY = this.height * 0.5;

        return this;
    }

    /**
     * Takes an array of Game Objects and returns a new array featuring only those objects
     * visible by this camera.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#cull
     * @since 3.0.0
     *
     * @generic {Phaser.GameObjects.GameObject[]} G - [renderableObjects,$return]
     *
     * @param {Phaser.GameObjects.GameObject[]} renderableObjects - An array of Game Objects to cull.
     *
     * @return {Phaser.GameObjects.GameObject[]} An array of Game Objects visible to this Camera.
     */
    cull(renderableObjects)
    {
        if (this.disableCull)
        {
            return renderableObjects;
        }

        var cameraMatrix = this.matrix.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];

        /* First Invert Matrix */
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            return renderableObjects;
        }

        var scrollX = this.scrollX;
        var scrollY = this.scrollY;
        var cameraW = this.width;
        var cameraH = this.height;
        var cullTop = this.y;
        var cullBottom = cullTop + cameraH;
        var cullLeft = this.x;
        var cullRight = cullLeft + cameraW;
        var culledObjects = this.culledObjects;
        var length = renderableObjects.length;

        determinant = 1 / determinant;

        culledObjects.length = 0;

        for (var index = 0; index < length; ++index)
        {
            var object = renderableObjects[index];

            if (!object.hasOwnProperty('width') || object.parentContainer)
            {
                culledObjects.push(object);
                continue;
            }

            var objectW = object.width;
            var objectH = object.height;
            var objectX = (object.x - (scrollX * object.scrollFactorX)) - (objectW * object.originX);
            var objectY = (object.y - (scrollY * object.scrollFactorY)) - (objectH * object.originY);
            var tx = (objectX * mva + objectY * mvc);
            var ty = (objectX * mvb + objectY * mvd);
            var tw = ((objectX + objectW) * mva + (objectY + objectH) * mvc);
            var th = ((objectX + objectW) * mvb + (objectY + objectH) * mvd);

            if ((tw > cullLeft && tx < cullRight) && (th > cullTop && ty < cullBottom))
            {
                culledObjects.push(object);
            }
        }

        return culledObjects;
    }

    /**
     * Converts the given `x` and `y` coordinates into World space, based on this Cameras transform.
     * You can optionally provide a Vector2, or similar object, to store the results in.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#getWorldPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {number} x - The x position to convert to world space.
     * @param {number} y - The y position to convert to world space.
     * @param {(object|Phaser.Math.Vector2)} [output] - An optional object to store the results in. If not provided a new Vector2 will be created.
     *
     * @return {Phaser.Math.Vector2} An object holding the converted values in its `x` and `y` properties.
     */
    getWorldPoint(x, y, output?)
    {
        if (output === undefined) { output = new Vector2(); }

        var cameraMatrix = this.matrixCombined.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];
        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];

        //  Invert Matrix
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            output.x = x;
            output.y = y;

            return output;
        }

        determinant = 1 / determinant;

        var ima = mvd * determinant;
        var imb = -mvb * determinant;
        var imc = -mvc * determinant;
        var imd = mva * determinant;
        var ime = (mvc * mvf - mvd * mve) * determinant;
        var imf = (mvb * mve - mva * mvf) * determinant;

        // Apply transform to point
        output.x = (x * ima + y * imc) + ime;
        output.y = (x * imb + y * imd) + imf;

        return output;
    }

    /**
     * Given a Game Object, or an array of Game Objects, it will update all of their camera filter settings
     * so that they are ignored by this Camera. This means they will not be rendered by this Camera.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#ignore
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]|Phaser.GameObjects.Group|Phaser.GameObjects.Layer|Phaser.GameObjects.Layer[])} entries - The Game Object, or array of Game Objects, to be ignored by this Camera.
     *
     * @return {this} This Camera instance.
     */
    ignore(entries)
    {
        var id = this.id;

        if (!Array.isArray(entries))
        {
            entries = [ entries ];
        }

        for (var i = 0; i < entries.length; i++)
        {
            var entry = entries[i];

            if (Array.isArray(entry))
            {
                this.ignore(entry);
            }
            else if (entry.isParent)
            {
                this.ignore(entry.getChildren());
            }
            else
            {
                entry.cameraFilter |= id;
            }
        }

        return this;
    }

    /**
     * Takes an x value and checks it's within the range of the Camera bounds, adjusting if required.
     * Do not call this method if you are not using camera bounds.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#clampX
     * @since 3.11.0
     *
     * @param {number} x - The value to horizontally scroll clamp.
     *
     * @return {number} The adjusted value to use as scrollX.
     */
    clampX(x)
    {
        var bounds = this._bounds;

        var dw = this.displayWidth;

        var bx = bounds.x + ((dw - this.width) / 2);
        var bw = Math.max(bx, bx + bounds.width - dw);

        if (x < bx)
        {
            x = bx;
        }
        else if (x > bw)
        {
            x = bw;
        }

        return x;
    }

    /**
     * Takes a y value and checks it's within the range of the Camera bounds, adjusting if required.
     * Do not call this method if you are not using camera bounds.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#clampY
     * @since 3.11.0
     *
     * @param {number} y - The value to vertically scroll clamp.
     *
     * @return {number} The adjusted value to use as scrollY.
     */
    clampY(y)
    {
        var bounds = this._bounds;

        var dh = this.displayHeight;

        var by = bounds.y + ((dh - this.height) / 2);
        var bh = Math.max(by, by + bounds.height - dh);

        if (y < by)
        {
            y = by;
        }
        else if (y > bh)
        {
            y = bh;
        }

        return y;
    }

    /**
     * If this Camera has previously had movement bounds set on it, this will remove them.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#removeBounds
     * @since 3.0.0
     *
     * @return {this} This Camera instance.
     */
    removeBounds()
    {
        this.useBounds = false;

        this.dirty = true;

        this._bounds.setEmpty();

        return this;
    }

    /**
     * Set the rotation of this Camera. This causes everything it renders to appear rotated.
     *
     * Rotating a camera does not rotate the viewport itself, it is applied during rendering.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setAngle
     * @since 3.0.0
     *
     * @param {number} [value=0] - The cameras angle of rotation, given in degrees.
     *
     * @return {this} This Camera instance.
     */
    setAngle(value?)
    {
        if (value === undefined) { value = 0; }

        this.rotation = DegToRad(value);

        return this;
    }

    /**
     * Sets the background color for this Camera.
     *
     * By default a Camera has a transparent background but it can be given a solid color, with any level
     * of transparency, via this method.
     *
     * The color value can be specified using CSS color notation, hex or numbers.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setBackgroundColor
     * @since 3.0.0
     *
     * @param {(string|number|Phaser.Types.Display.InputColorObject)} [color='rgba(0,0,0,0)'] - The color value. In CSS, hex or numeric color notation.
     *
     * @return {this} This Camera instance.
     */
    setBackgroundColor(color?)
    {
        if (color === undefined) { color = 'rgba(0,0,0,0)'; }

        this.backgroundColor = ValueToColor(color);

        this.transparent = (this.backgroundColor.alpha === 0);

        return this;
    }

    /**
     * Set the bounds of the Camera. The bounds are an axis-aligned rectangle.
     *
     * The Camera bounds controls where the Camera can scroll to, stopping it from scrolling off the
     * edges and into blank space. It does not limit the placement of Game Objects, or where
     * the Camera viewport can be positioned.
     *
     * Temporarily disable the bounds by changing the boolean `Camera.useBounds`.
     *
     * Clear the bounds entirely by calling `Camera.removeBounds`.
     *
     * If you set bounds that are smaller than the viewport it will stop the Camera from being
     * able to scroll. The bounds can be positioned where-ever you wish. By default they are from
     * 0x0 to the canvas width x height. This means that the coordinate 0x0 is the top left of
     * the Camera bounds. However, you can position them anywhere. So if you wanted a game world
     * that was 2048x2048 in size, with 0x0 being the center of it, you can set the bounds x/y
     * to be -1024, -1024, with a width and height of 2048. Depending on your game you may find
     * it easier for 0x0 to be the top-left of the bounds, or you may wish 0x0 to be the middle.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setBounds
     * @since 3.0.0
     *
     * @param {number} x - The top-left x coordinate of the bounds.
     * @param {number} y - The top-left y coordinate of the bounds.
     * @param {number} width - The width of the bounds, in pixels.
     * @param {number} height - The height of the bounds, in pixels.
     * @param {boolean} [centerOn=false] - If `true` the Camera will automatically be centered on the new bounds.
     *
     * @return {this} This Camera instance.
     */
    setBounds(x, y, width, height, centerOn?)
    {
        if (centerOn === undefined) { centerOn = false; }

        this._bounds.setTo(x, y, width, height);

        this.dirty = true;
        this.useBounds = true;

        if (centerOn)
        {
            this.centerToBounds();
        }
        else
        {
            this.scrollX = this.clampX(this.scrollX);
            this.scrollY = this.clampY(this.scrollY);
        }

        return this;
    }

    /**
     * Sets the `forceComposite` property of this Camera.
     * This property is only used by the WebGL Renderer.
     * If `true` the camera will render via a framebuffer,
     * making it available to other WebGL systems.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setForceComposite
     * @since 4.0.0
     * @webglOnly
     *
     * @param {boolean} value - The value to set the property to.
     *
     * @returns {this} This Camera instance.
     */
    setForceComposite(value)
    {
        this.forceComposite = value;

        return this;
    }

    /**
     * Returns a rectangle containing the bounds of the Camera.
     *
     * If the Camera does not have any bounds the rectangle will be empty.
     *
     * The rectangle is a copy of the bounds, so is safe to modify.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#getBounds
     * @since 3.16.0
     *
     * @param {Phaser.Geom.Rectangle} [out] - An optional Rectangle to store the bounds in. If not given, a new Rectangle will be created.
     *
     * @return {Phaser.Geom.Rectangle} A rectangle containing the bounds of this Camera.
     */
    getBounds(out?)
    {
        if (out === undefined) { out = new Rectangle(); }

        var source = this._bounds;

        out.setTo(source.x, source.y, source.width, source.height);

        return out;
    }

    /**
     * Sets the name of this Camera.
     * This value is for your own use and isn't used internally.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setName
     * @since 3.0.0
     *
     * @param {string} [value=''] - The name of the Camera.
     *
     * @return {this} This Camera instance.
     */
    setName(value?)
    {
        if (value === undefined) { value = ''; }

        this.name = value;

        return this;
    }

    /**
     * Set the position of the Camera viewport within the game.
     *
     * This does not change where the camera is 'looking'. See `setScroll` to control that.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setPosition
     * @since 3.0.0
     *
     * @param {number} x - The top-left x coordinate of the Camera viewport.
     * @param {number} [y=x] - The top-left y coordinate of the Camera viewport.
     *
     * @return {this} This Camera instance.
     */
    setPosition(x, y?)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Set the rotation of this Camera. This causes everything it renders to appear rotated.
     *
     * Rotating a camera does not rotate the viewport itself, it is applied during rendering.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setRotation
     * @since 3.0.0
     *
     * @param {number} [value=0] - The rotation of the Camera, in radians.
     *
     * @return {this} This Camera instance.
     */
    setRotation(value?)
    {
        if (value === undefined) { value = 0; }

        this.rotation = value;

        return this;
    }

    /**
     * Should the Camera round pixel values to whole integers when rendering Game Objects?
     *
     * In some types of game, especially with pixel art, this is required to prevent sub-pixel aliasing.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setRoundPixels
     * @since 3.0.0
     *
     * @param {boolean} value - `true` to round Camera pixels, `false` to not.
     *
     * @return {this} This Camera instance.
     */
    setRoundPixels(value)
    {
        this.roundPixels = value;

        return this;
    }

    /**
     * Sets the Scene the Camera is bound to.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setScene
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene the camera is bound to.
     * @param {boolean} [isSceneCamera=true] - Is this Camera being used for a Scene (true) or a Texture? (false)
     *
     * @return {this} This Camera instance.
     */
    setScene(scene, isSceneCamera?)
    {
        if (isSceneCamera === undefined) { isSceneCamera = true; }

        if (this.scene && this._customViewport)
        {
            this.sceneManager.customViewports--;
        }

        this.scene = scene;
        this.isSceneCamera = isSceneCamera;

        var sys = scene.sys;

        this.sceneManager = sys.game.scene;
        this.scaleManager = sys.scale;
        this.cameraManager = sys.cameras;

        this.updateSystem();

        return this;
    }

    /**
     * Set the position of where the Camera is looking within the game.
     * You can also modify the properties `Camera.scrollX` and `Camera.scrollY` directly.
     * Use this method, or the scroll properties, to move your camera around the game world.
     *
     * This does not change where the camera viewport is placed. See `setPosition` to control that.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setScroll
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the Camera in the game world.
     * @param {number} [y=x] - The y coordinate of the Camera in the game world.
     *
     * @return {this} This Camera instance.
     */
    setScroll(x, y?)
    {
        if (y === undefined) { y = x; }

        this.scrollX = x;
        this.scrollY = y;

        return this;
    }

    /**
     * Set the size of the Camera viewport.
     *
     * By default a Camera is the same size as the game, but can be made smaller via this method,
     * allowing you to create mini-cam style effects by creating and positioning a smaller Camera
     * viewport within your game.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of the Camera viewport.
     * @param {number} [height=width] - The height of the Camera viewport.
     *
     * @return {this} This Camera instance.
     */
    setSize(width, height?)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    }

    /**
     * This method sets the position and size of the Camera viewport in a single call.
     *
     * If you're trying to change where the Camera is looking at in your game, then see
     * the method `Camera.setScroll` instead. This method is for changing the viewport
     * itself, not what the camera can see.
     *
     * By default a Camera is the same size as the game, but can be made smaller via this method,
     * allowing you to create mini-cam style effects by creating and positioning a smaller Camera
     * viewport within your game.
     *
     * Note that this is a limited method, and comes with several caveats:
     *
     * - The viewport is an axis-aligned rectangle, and cannot be rotated.
     * - Filters and masks may appear in the wrong place if the viewport changes.
     *
     * It is more powerful and reliable to use a
     * `RenderTexture` or `DynamicTexture` instead.
     * Point its camera where you want the viewport,
     * set its size, and then draw your game objects to it.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setViewport
     * @since 3.0.0
     *
     * @param {number} x - The top-left x coordinate of the Camera viewport.
     * @param {number} y - The top-left y coordinate of the Camera viewport.
     * @param {number} width - The width of the Camera viewport.
     * @param {number} [height=width] - The height of the Camera viewport.
     *
     * @return {this} This Camera instance.
     */
    setViewport(x, y, width, height?)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = (height === undefined) ? width : height;

        return this;
    }

    /**
     * Set the zoom value of the Camera.
     *
     * Changing to a smaller value, such as 0.5, will cause the camera to 'zoom out'.
     * Changing to a larger value, such as 2, will cause the camera to 'zoom in'.
     *
     * A value of 1 means 'no zoom' and is the default.
     *
     * Changing the zoom does not impact the Camera viewport in any way, it is only applied during rendering.
     *
     * As of Phaser 3.50 you can now set the horizontal and vertical zoom values independently.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setZoom
     * @since 3.0.0
     *
     * @param {number} [x=1] - The horizontal zoom value of the Camera. The minimum it can be is 0.001.
     * @param {number} [y=x] - The vertical zoom value of the Camera. The minimum it can be is 0.001.
     *
     * @return {this} This Camera instance.
     */
    setZoom(x?, y?)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        if (x === 0)
        {
            x = 0.001;
        }

        if (y === 0)
        {
            y = 0.001;
        }

        this.zoomX = x;
        this.zoomY = y;

        return this;
    }

    /**
     * Sets the mask to be applied to this Camera during rendering.
     *
     * The mask must have been previously created and must be a GeometryMask.
     * This only works in the Canvas Renderer.
     * In WebGL, use a Mask filter instead (see {@link Phaser.GameObjects.Components.FilterList#addMask}).
     *
     * If a mask is already set on this Camera it will be immediately replaced.
     *
     * Masks have no impact on physics or input detection. They are purely a rendering component
     * that allows you to limit what is visible during the render pass.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setMask
     * @since 3.17.0
     *
     * @param {Phaser.Display.Masks.GeometryMask} mask - The mask this Camera will use when rendering.
     * @param {boolean} [fixedPosition=true] - Should the mask translate along with the Camera, or be fixed in place and not impacted by the Cameras transform?
     *
     * @return {this} This Camera instance.
     */
    setMask(mask, fixedPosition?)
    {
        if (fixedPosition === undefined) { fixedPosition = true; }

        this.mask = mask;

        this._maskCamera = (fixedPosition) ? this.cameraManager.default : this;

        return this;
    }

    /**
     * Clears the mask that this Camera was using.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#clearMask
     * @since 3.17.0
     *
     * @param {boolean} [destroyMask=false] - Destroy the mask before clearing it?
     *
     * @return {this} This Camera instance.
     */
    clearMask(destroyMask?)
    {
        if (destroyMask === undefined) { destroyMask = false; }

        if (destroyMask && this.mask)
        {
            this.mask.destroy();
        }

        this.mask = null;

        return this;
    }

    /**
     * Returns an Object suitable for JSON storage containing all of the Camera viewport and rendering properties.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Cameras.Scene2D.JSONCamera} A well-formed object suitable for conversion to JSON.
     */
    toJSON()
    {
        var output: any = {
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            zoom: this.zoom,
            rotation: this.rotation,
            roundPixels: this.roundPixels,
            scrollX: this.scrollX,
            scrollY: this.scrollY,
            backgroundColor: this.backgroundColor.rgba
        };

        if (this.useBounds)
        {
            output['bounds'] = {
                x: this._bounds.x,
                y: this._bounds.y,
                width: this._bounds.width,
                height: this._bounds.height
            };
        }

        return output;
    }

    /**
     * Internal method called automatically by the Camera Manager.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#update
     * @protected
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update()
    {
        //  NOOP
    }

    /**
     * Set if this Camera is being used as a Scene Camera, or a Texture
     * Camera.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setIsSceneCamera
     * @since 3.60.0
     *
     * @param {boolean} value - Is this being used as a Scene Camera, or a Texture camera?
     */
    setIsSceneCamera(value)
    {
        this.isSceneCamera = value;

        return this;
    }

    /**
     * Internal method called automatically when the viewport changes.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#updateSystem
     * @private
     * @since 3.12.0
     */
    updateSystem()
    {
        if (!this.scaleManager || !this.isSceneCamera)
        {
            return;
        }

        var custom = (this._x !== 0 || this._y !== 0 || this.scaleManager.width !== this._width || this.scaleManager.height !== this._height);

        var sceneManager = this.sceneManager;

        if (custom && !this._customViewport)
        {
            //  We need a custom viewport for this Camera
            sceneManager.customViewports++;
        }
        else if (!custom && this._customViewport)
        {
            //  We're turning off a custom viewport for this Camera
            sceneManager.customViewports--;
        }

        this.dirty = true;
        this._customViewport = custom;
    }

    /**
     * Destroys this Camera instance and its internal properties and references.
     * Once destroyed you cannot use this Camera again, even if re-added to a Camera Manager.
     *
     * This method is called automatically by `CameraManager.remove` if that methods `runDestroy` argument is `true`, which is the default.
     *
     * Unless you have a specific reason otherwise, always use `CameraManager.remove` and allow it to handle the camera destruction,
     * rather than calling this method directly.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#destroy
     * @fires Phaser.Cameras.Scene2D.Events#DESTROY
     * @since 3.0.0
     */
    destroy()
    {
        this.emit(Events.DESTROY, this);

        this.removeAllListeners();

        this.matrix.destroy();
        this.matrixCombined.destroy();
        this.matrixExternal.destroy();

        this.culledObjects = [];

        if (this._customViewport)
        {
            //  We're turning off a custom viewport for this Camera
            this.sceneManager.customViewports--;
        }

        this.renderList = [];

        this._bounds = null;

        this.scene = null;
        this.scaleManager = null;
        this.sceneManager = null;
        this.cameraManager = null;
    }

    //  Properties

    /**
     * The x position of the Camera viewport, relative to the top-left of the game canvas.
     * The viewport is the area into which the camera renders.
     * To adjust the position the camera is looking at in the game world, see the `scrollX` value.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#x
     * @type {number}
     * @since 3.0.0
     */
    get x()
    {
        return this._x;
    }

    set x(value)
    {
        this._x = value;
        this.updateSystem();
    }

    /**
     * The y position of the Camera viewport, relative to the top-left of the game canvas.
     * The viewport is the area into which the camera renders.
     * To adjust the position the camera is looking at in the game world, see the `scrollY` value.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#y
     * @type {number}
     * @since 3.0.0
     */
    get y()
    {
        return this._y;
    }

    set y(value)
    {
        this._y = value;
        this.updateSystem();
    }

    /**
     * The width of the Camera viewport, in pixels.
     *
     * The viewport is the area into which the Camera renders. Setting the viewport does
     * not restrict where the Camera can scroll to.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#width
     * @type {number}
     * @since 3.0.0
     */
    get width()
    {
        return this._width;
    }

    set width(value)
    {
        this._width = value;
        this.updateSystem();
    }

    /**
     * The height of the Camera viewport, in pixels.
     *
     * The viewport is the area into which the Camera renders. Setting the viewport does
     * not restrict where the Camera can scroll to.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#height
     * @type {number}
     * @since 3.0.0
     */
    get height()
    {
        return this._height;
    }

    set height(value)
    {
        this._height = value;
        this.updateSystem();
    }

    /**
     * The horizontal scroll position of this Camera.
     *
     * Change this value to cause the Camera to scroll around your Scene.
     *
     * Alternatively, setting the Camera to follow a Game Object, via the `startFollow` method,
     * will automatically adjust the Camera scroll values accordingly.
     *
     * You can set the bounds within which the Camera can scroll via the `setBounds` method.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#scrollX
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    get scrollX()
    {
        return this._scrollX;
    }

    set scrollX(value)
    {
        if (value !== this._scrollX)
        {
            this._scrollX = value;
            this.dirty = true;
        }
    }

    /**
     * The vertical scroll position of this Camera.
     *
     * Change this value to cause the Camera to scroll around your Scene.
     *
     * Alternatively, setting the Camera to follow a Game Object, via the `startFollow` method,
     * will automatically adjust the Camera scroll values accordingly.
     *
     * You can set the bounds within which the Camera can scroll via the `setBounds` method.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#scrollY
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    get scrollY()
    {
        return this._scrollY;
    }

    set scrollY(value)
    {
        if (value !== this._scrollY)
        {
            this._scrollY = value;
            this.dirty = true;
        }
    }

    /**
     * The Camera zoom value. Change this value to zoom in, or out of, a Scene.
     *
     * A value of 0.5 would zoom the Camera out, so you can now see twice as much
     * of the Scene as before. A value of 2 would zoom the Camera in, so every pixel
     * now takes up 2 pixels when rendered.
     *
     * Set to 1 to return to the default zoom level.
     *
     * Be careful to never set this value to zero.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#zoom
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    get zoom()
    {
        return (this._zoomX + this._zoomY) / 2;
    }

    set zoom(value)
    {
        this._zoomX = value;
        this._zoomY = value;

        this.dirty = true;
    }

    /**
     * The Camera horizontal zoom value. Change this value to zoom in, or out of, a Scene.
     *
     * A value of 0.5 would zoom the Camera out, so you can now see twice as much
     * of the Scene as before. A value of 2 would zoom the Camera in, so every pixel
     * now takes up 2 pixels when rendered.
     *
     * Set to 1 to return to the default zoom level.
     *
     * Be careful to never set this value to zero.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#zoomX
     * @type {number}
     * @default 1
     * @since 3.50.0
     */
    get zoomX()
    {
        return this._zoomX;
    }

    set zoomX(value)
    {
        this._zoomX = value;
        this.dirty = true;
    }

    /**
     * The Camera vertical zoom value. Change this value to zoom in, or out of, a Scene.
     *
     * A value of 0.5 would zoom the Camera out, so you can now see twice as much
     * of the Scene as before. A value of 2 would zoom the Camera in, so every pixel
     * now takes up 2 pixels when rendered.
     *
     * Set to 1 to return to the default zoom level.
     *
     * Be careful to never set this value to zero.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#zoomY
     * @type {number}
     * @default 1
     * @since 3.50.0
     */
    get zoomY()
    {
        return this._zoomY;
    }

    set zoomY(value)
    {
        this._zoomY = value;
        this.dirty = true;
    }

    /**
     * The rotation of the Camera in radians.
     *
     * Camera rotation always takes place based on the Camera viewport. By default, rotation happens
     * in the center of the viewport. You can adjust this with the `originX` and `originY` properties.
     *
     * Rotation influences the rendering of _all_ Game Objects visible by this Camera. However, it does not
     * rotate the Camera viewport itself, which always remains an axis-aligned rectangle.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#rotation
     * @type {number}
     * @private
     * @default 0
     * @since 3.11.0
     */
    get rotation()
    {
        return this._rotation;
    }

    set rotation(value)
    {
        this._rotation = value;
        this.dirty = true;
    }

    /**
     * The horizontal position of the center of the Camera's viewport, relative to the left of the game canvas.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#centerX
     * @type {number}
     * @readonly
     * @since 3.10.0
     */
    get centerX()
    {
        return this.x + (0.5 * this.width);
    }

    /**
     * The vertical position of the center of the Camera's viewport, relative to the top of the game canvas.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#centerY
     * @type {number}
     * @readonly
     * @since 3.10.0
     */
    get centerY()
    {
        return this.y + (0.5 * this.height);
    }

    /**
     * The displayed width of the camera viewport, factoring in the camera zoom level.
     *
     * If a camera has a viewport width of 800 and a zoom of 0.5 then its display width
     * would be 1600, as it's displaying twice as many pixels as zoom level 1.
     *
     * Equally, a camera with a width of 800 and zoom of 2 would have a display width
     * of 400 pixels.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#displayWidth
     * @type {number}
     * @readonly
     * @since 3.11.0
     */
    get displayWidth()
    {
        return this.width / this.zoomX;
    }

    /**
     * The displayed height of the camera viewport, factoring in the camera zoom level.
     *
     * If a camera has a viewport height of 600 and a zoom of 0.5 then its display height
     * would be 1200, as it's displaying twice as many pixels as zoom level 1.
     *
     * Equally, a camera with a height of 600 and zoom of 2 would have a display height
     * of 300 pixels.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#displayHeight
     * @type {number}
     * @readonly
     * @since 3.11.0
     */
    get displayHeight()
    {
        return this.height / this.zoomY;
    }
}

