/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Vector2 } from '../../math/Vector2';
import { TransformMatrix } from './TransformMatrix';

let Camera: any = null; // Lazy loaded.

/**
 * Provides methods used for setting the filters properties of a Game Object.
 * These apply special effects, post-processing and masks to the object.
 * Should be applied as a mixin and not used directly.
 *
 * Filters work by rendering the object to a texture.
 * The texture is then rendered again for each filter, using a shader.
 * See {@link Phaser.GameObjects.Components.FilterList} for more information.
 *
 * Enable filters with `enableFilters()`.
 * Each object with filters enabled, and any filters active,
 * makes a new draw call, plus one or more per active filter.
 * This can be expensive. Use sparingly.
 *
 * ---
 *
 * ## Camera
 *
 * Filters has a `filterCamera` property, which is a Camera.
 * The Camera does most of the hard work, including the filters.
 *
 * The Camera automatically focuses on the Game Object,
 * so you should not need to adjust it manually.
 * If you do want to adjust it, you can use `focusFiltersOverride`.
 *
 * ---
 *
 * ## Framebuffer Coverage
 *
 * Filters are rendered to a framebuffer, which is a texture.
 * Anything outside the bounds of the framebuffer is not rendered.
 * Think of it as a window into another world.
 *
 * To ensure that the game object fits into the framebuffer,
 * the internal camera is transformed to match the object.
 * The object can transform normally, and the camera will follow
 * while `filtersAutoFocus` is enabled.
 *
 * @namespace Phaser.GameObjects.Components.Filters
 * @since 4.0.0
 */

export interface Filters {
    filterCamera: any;
    filters: any;
    renderFilters: boolean;
    maxFilterSize: any;
    filtersAutoFocus: boolean;
    filtersFocusContext: boolean;
    filtersForceComposite: boolean;
    _filtersMatrix: any;
    _filtersViewMatrix: any;
    scene: any;
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    originX: number;
    originY: number;
    width: number;
    height: number;
    type: string;
    flipX: boolean;
    flipY: boolean;
    parentContainer: any;
    scrollFactorX: number;
    scrollFactorY: number;
    willRenderFilters(): boolean;
    enableFilters(): this;
    renderWebGLFilters(renderer: any, gameObject: any, drawingContext: any, parentMatrix?: any, renderStep?: number): void;
    focusFilters(): this;
    focusFiltersOnCamera(camera: any): this;
    focusFiltersOverride(x?: number, y?: number, width?: number, height?: number): this;
    setFilterSize(width: number, height: number): this;
    setFiltersAutoFocus(value: boolean): this;
    setFiltersFocusContext(value: boolean): this;
    setFiltersForceComposite(value: boolean): this;
    setRenderFilters(value: boolean): this;
    getBounds?: any;
    addRenderStep?: any;
    renderWebGLStep?: any;
}

let Filters: any = {};

if (typeof WEBGL_RENDERER !== 'undefined')
{
    Filters =
    {
        /**
         * The Camera used for filters.
         * You can use this to alter the perspective of filters.
         * It is not necessary to use this camera for ordinary rendering.
         *
         * This is only available if you use the `enableFilters` method.
         *
         * @name Phaser.GameObjects.Components.Filters#filterCamera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @default null
         * @since 4.0.0
         * @webglOnly
         */
        filterCamera: null,

        /**
         * Get the filters lists.
         * This is an object with `internal` and `external` properties.
         * Each list is a {@see Phaser.GameObjects.Components.FilterList} object.
         *
         * This is only available if you use the `enableFilters` method.
         *
         * @name Phaser.GameObjects.Components.Filters#filters
         * @type {Phaser.Types.GameObjects.FiltersInternalExternal|null}
         * @readonly
         * @since 4.0.0
         * @webglOnly
         */
        get filters(): any
        {
            if (this.filterCamera)
            {
                return this.filterCamera.filters;
            }
            return null;
        },

        /**
         * Whether any filters should be rendered on this Game Object.
         * This is `true` by default, even if there are no filters yet.
         * Disable this to skip filter rendering.
         *
         * Use `willRenderFilters()` to see if there are any active filters.
         *
         * @name Phaser.GameObjects.Components.Filters#renderFilters
         * @type {boolean}
         * @default true
         * @since 4.0.0
         * @webglOnly
         */
        renderFilters: true,

        /**
         * The maximum size of the base filter texture.
         * Filters may use a larger texture after the base texture is rendered.
         * The maximum texture size is at least 4096 in WebGL, based on the hardware.
         * You may set this lower to save memory or prevent resizing.
         *
         * @name Phaser.GameObjects.Components.Filters#maxFilterSize
         * @type {Phaser.Math.Vector2}
         * @since 4.0.0
         * @webglOnly
         */
        maxFilterSize: null,

        /**
         * Whether `filterCamera` should update every frame
         * to focus on the Game Object.
         * Disable this if you want to manually control the camera.
         *
         * @name Phaser.GameObjects.Components.Filters#filtersAutoFocus
         * @type {boolean}
         * @default true
         * @since 4.0.0
         * @webglOnly
         */
        filtersAutoFocus: true,

        /**
         * Whether the filters should focus on the context,
         * rather than attempt to focus on the Game Object.
         * This is enabled automatically when enabling filters on objects
         * which don't have well-defined bounds.
         *
         * This effectively sets the internal filters to render the same way
         * as the external filters.
         *
         * This is only used if `filtersAutoFocus` is enabled.
         *
         * The "context" is the framebuffer to which the Game Object is rendered.
         * This is usually the main framebuffer, but might be another framebuffer.
         * It can even be several different framebuffers if the Game Object is
         * rendered multiple times.
         *
         * @name Phaser.GameObjects.Components.Filters#filtersFocusContext
         * @type {boolean}
         * @default false
         * @since 4.0.0
         * @webglOnly
         */
        filtersFocusContext: false,

        /**
         * Whether the Filters component should always draw to a framebuffer,
         * even if there are no active filters.
         *
         * @name Phaser.GameObjects.Components.Filters#filtersForceComposite
         * @type {boolean}
         * @default false
         * @since 4.0.0
         * @webglOnly
         */
        filtersForceComposite: false,

        /**
         * A transform matrix used to render the filters.
         * It holds the transform of the Game Object.
         *
         * This is only available if you use the `enableFilters` method.
         *
         * @name Phaser.GameObjects.Components.Filters#_filtersMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 4.0.0
         * @webglOnly
         */
        _filtersMatrix: null,

        /**
         * A transform matrix used to render the filters.
         * It holds the view matrix for the filter camera, adjusted for the Game Object.
         *
         * This is only available if you use the `enableFilters` method.
         *
         * @name Phaser.GameObjects.Components.Filters#_filtersViewMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 4.0.0
         * @webglOnly
         */
        _filtersViewMatrix: null,

        /**
         * Whether this Game Object will render filters.
         * This is true if it has active filters,
         * and if the `renderFilters` property is also true.
         *
         * @method Phaser.GameObjects.Components.Filters#willRenderFilters
         * @since 4.0.0
         * @webglOnly
         * @return {boolean} Whether the Game Object will render filters.
         */
        willRenderFilters(this: any): boolean
        {
            return this.renderFilters &&
                this.filters &&
                (
                    this.filters.internal.getActive().length > 0 ||
                    this.filters.external.getActive().length > 0 ||
                    this.filtersForceComposite
                );
        },

        /**
         * Enable this Game Object to have filters.
         *
         * You need to call this method if you want to use the `filterCamera`
         * and `filters` properties. It sets up the necessary data structures.
         * You may disable filter rendering with the `renderFilters` property.
         *
         * This is a WebGL only feature. It will return early if not available.
         *
         * @method Phaser.GameObjects.Components.Filters#enableFilters
         * @since 4.0.0
         * @webglOnly
         * @returns {this}
         */
        enableFilters(this: any): any
        {
            if (this.filterCamera || !this.scene.renderer.gl)
            {
                return this;
            }

            const scene = this.scene;

            if (!Camera)
            {
                // Lazy load the camera class to avoid circular dependencies.
            }

            this.filterCamera = new Camera(0, 0, 1, 1).setScene(scene, false);

            // Set up the filter camera to compute an inverse matrix for the object.
            this.filterCamera.isObjectInversion = true;

            if (scene.game.config.roundPixels)
            {
                this.filterCamera.roundPixels = true;
            }

            if (!this.maxFilterSize)
            {
                const maxTextureSize = scene.renderer.getMaxTextureSize();
                this.maxFilterSize = new Vector2(maxTextureSize, maxTextureSize);
            }

            this._filtersMatrix = new TransformMatrix();
            this._filtersViewMatrix = new TransformMatrix();

            // Check whether the object is poorly bounded, and needs to focus on the context.
            if (
                !this.getBounds ||
                this.width === undefined ||
                this.height === undefined ||
                this.width === 0 ||
                this.height === 0
            )
            {
                this.filtersFocusContext = true;
            }

            // Add filters as a render step.
            this.addRenderStep(this.renderWebGLFilters, 0);

            return this;
        },

        /**
         * Render this object using filters.
         *
         * This function's scope is not guaranteed, so it doesn't refer to `this`.
         *
         * @method Phaser.GameObjects.Components.Filters#renderWebGLFilters
         * @webglOnly
         * @since 4.0.0
         * @type {Phaser.Types.GameObjects.RenderWebGLStep}
         * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to render with.
         * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered.
         * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
         * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix of the Game Object, if it has one.
         * @param {number} [renderStep=0] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
         */
        renderWebGLFilters(
            renderer: any,
            gameObject: any,
            drawingContext: any,
            parentMatrix?: any,
            renderStep?: number
        ): void
        {
            if (!gameObject.willRenderFilters())
            {
                gameObject.renderWebGLStep(
                    renderer,
                    gameObject,
                    drawingContext,
                    parentMatrix,
                    renderStep + 1
                );
                return;
            }

            const camera = drawingContext.camera;

            // Ordinarily, we would add the game object to the camera's render list here.
            // But because child objects are added to the filter camera's render list,
            // we wait for the object to be rendered,
            // and then take its filter camera's render list
            // and add it to the drawingContext's render list.

            const filtersAutoFocus = gameObject.filtersAutoFocus;
            const filtersFocusContext = gameObject.filtersFocusContext;

            if (filtersAutoFocus)
            {
                if (filtersFocusContext)
                {
                    gameObject.focusFiltersOnCamera(camera);
                }
                else
                {
                    gameObject.focusFilters();
                }
            }

            const filterCamera = gameObject.filterCamera;
            filterCamera.preRender();

            if (filtersAutoFocus && filtersFocusContext)
            {
                const parent = gameObject.parentContainer;
                if (parent)
                {
                    // Apply the game object's parent world transform to the filter camera.
                    const parentWorldMatrix = parent.getWorldTransformMatrix();
                    filterCamera.matrix.multiply(parentWorldMatrix);
                }
            }

            // Get transform.
            const transformMatrix = gameObject._filtersMatrix;
            const cameraMatrix = gameObject._filtersViewMatrix.copyWithScrollFactorFrom(
                camera.getViewMatrix(!drawingContext.useCanvas),
                camera.scrollX, camera.scrollY,
                gameObject.scrollFactorX, gameObject.scrollFactorY
            );

            if (parentMatrix)
            {
                cameraMatrix.multiply(parentMatrix);
            }

            if (filtersFocusContext)
            {
                transformMatrix.loadIdentity();
            }
            else
            {
                if (gameObject.type === 'Layer')
                {
                    transformMatrix.loadIdentity();
                }
                else
                {
                    const flipX = gameObject.flipX ? -1 : 1;
                    const flipY = gameObject.flipY ? -1 : 1;
                    transformMatrix.applyITRS(
                        gameObject.x,
                        gameObject.y,
                        gameObject.rotation,
                        gameObject.scaleX * flipX,
                        gameObject.scaleY * flipY
                    );
                }

                // Offset origin.
                const width = filterCamera.width;
                const height = filterCamera.height;
                transformMatrix.translate(
                    -width * filterCamera.originX,
                    -height * filterCamera.originY
                );

                cameraMatrix.multiply(transformMatrix, transformMatrix);
            }

            // Set object scrollFactor to default.
            // We can't accurately focus the camera on the object if it has a scrollFactor,
            // because the camera needs to be set further away,
            // going to infinity at scrollFactor 0.
            // The scroll factor is baked into the transformMatrix, above.
            const scrollX = gameObject.scrollFactorX;
            const scrollY = gameObject.scrollFactorY;
            gameObject.scrollFactorX = 1;
            gameObject.scrollFactorY = 1;

            // Now we have the transform for the game object.
            // Render game object to framebuffer.
            renderer.cameraRenderNode.run(
                drawingContext,
                [ gameObject ],
                filterCamera,
                transformMatrix,
                true,
                renderStep + 1
            );

            // Restore scrollFactor.
            gameObject.scrollFactorX = scrollX;
            gameObject.scrollFactorY = scrollY;

            // Add the game object's filter camera's render list
            // to the drawingContext's render list.
            const filterRenderListLength = filterCamera.renderList.length;
            for (let i = 0; i < filterRenderListLength; i++)
            {
                camera.addToRenderList(filterCamera.renderList[i]);
            }
        },

        /**
         * Focus the filter camera.
         * This sets the size and position of the filter camera to match the GameObject.
         * This is called automatically on render if `filtersAutoFocus` is enabled.
         *
         * This will focus on the GameObject's raw dimensions if available.
         * If the GameObject has no dimensions, this will focus on the context:
         * the camera belonging to the DrawingContext used to render the GameObject.
         * Context focus occurs during rendering,
         * as the context is not known until then.
         *
         * @method Phaser.GameObjects.Components.Filters#focusFilters
         * @webglOnly
         * @since 4.0.0
         * @returns {this}
         */
        focusFilters(this: any): any
        {
            const posX = this.x;
            const posY = this.y;
            let originX = this.originX;
            let originY = this.originY;
            const width = this.width;
            const height = this.height;

            if (
                this.type === 'Layer' ||
                isNaN(posX) || isNaN(posY) ||
                isNaN(width) || isNaN(height) ||
                isNaN(originX) || isNaN(originY) ||
                width === 0 || height === 0
            )
            {
                this.filtersFocusContext = true;
                return this;
            }

            const rotation = this.rotation;
            let scaleX = this.scaleX;
            let scaleY = this.scaleY;

            // Handle flip.
            if (this.flipX)
            {
                scaleX *= -1;
                originX = 1 - originX;
            }
            if (this.flipY)
            {
                scaleY *= -1;
                originY = 1 - originY;
            }

            const centerX = posX + width * (0.5 - originX);
            const centerY = posY + height * (0.5 - originY);

            // Set the filter camera size to match the object.
            this.setFilterSize(width, height);

            // Set the filter camera to match the object.
            this.filterCamera
                .centerOn(centerX, centerY)
                .setRotation(-rotation)
                .setOrigin(originX, originY)
                .setZoom(1 / scaleX, 1 / scaleY);

            return this;
        },

        /**
         * Focus the filter camera on a specific camera.
         * This is used internally when `filtersFocusContext` is enabled.
         *
         * @method Phaser.GameObjects.Components.Filters#focusFiltersOnCamera
         * @webglOnly
         * @since 4.0.0
         * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to focus on.
         * @returns {this}
         */
        focusFiltersOnCamera(this: any, camera: any): any
        {
            const width = camera.width;
            const height = camera.height;
            const posX = camera.scrollX;
            const posY = camera.scrollY;
            const rotation = camera.rotation;
            const zoomX = camera.zoomX;
            const zoomY = camera.zoomY;

            // Set the filter camera size to match the object.
            this.setFilterSize(width, height);

            this.filterCamera.setScroll(posX, posY);
            this.filterCamera.setRotation(rotation);
            this.filterCamera.setZoom(zoomX, zoomY);

            return this;
        },

        /**
         * Manually override the focus of the filter camera.
         * This allows you to set the size and position of the filter camera manually.
         * It deactivates `filtersAutoFocus` when called.
         *
         * The camera will set scroll to place the game object at the
         * given position within a rectangle of the given width and height.
         * For example, calling `focusFiltersOverride(400, 200, 800, 600)`
         * will focus the camera to place the object's center
         * 100 pixels above the center of the camera (which is at 400x300).
         *
         * @method Phaser.GameObjects.Components.Filters#focusFiltersOverride
         * @webglOnly
         * @since 4.0.0
         * @param {number} [x] - The x-coordinate of the focus point, relative to the filter size. Default is the center.
         * @param {number} [y] - The y-coordinate of the focus point, relative to the filter size. Default is the center.
         * @param {number} [width] - The width of the focus area. Default is the filter width.
         * @param {number} [height] - The height of the focus area. Default is the filter height.
         * @returns {this}
         */
        focusFiltersOverride(this: any, x?: number, y?: number, width?: number, height?: number): any
        {
            const filterCamera = this.filterCamera;

            // Maintain size.
            if (width === undefined)
            {
                width = filterCamera.width;
            }
            if (height === undefined)
            {
                height = filterCamera.height;
            }

            // Default to center.
            if (x === undefined)
            {
                x = width / 2;
            }
            if (y === undefined)
            {
                y = height / 2;
            }

            const objectX = this.x;
            const objectY = this.y;

            this.setFilterSize(width, height);
            filterCamera.setScroll(objectX - x, objectY - y);

            const originX = x / width;
            const originY = y / height;

            filterCamera.setOrigin(originX, originY);

            // Stop automatic focus.
            this.filtersAutoFocus = false;

            return this;
        },

        /**
         * Set the base size of the filter camera.
         * This is the size of the texture that internal filters will be drawn to.
         * External filters are drawn to the size of the context (usually the game canvas).
         *
         * This is typically the size of the GameObject.
         * It is set automatically when the Game Object is rendered
         * and `filtersAutoFocus` is enabled.
         * Turn off auto focus to set it manually.
         *
         * Technically, larger framebuffers may be used to provide padding.
         * This is the size of the final framebuffer used for "internal" rendering.
         *
         * @method Phaser.GameObjects.Components.Filters#setFilterSize
         * @webglOnly
         * @since 4.0.0
         * @param {number} width - Base width of the filter texture.
         * @param {number} height - Base height of the filter texture.
         * @returns {this}
         */
        setFilterSize(this: any, width: number, height: number): any
        {
            // Sanitize inputs.
            width = Math.max(1, Math.min(Math.ceil(width), this.maxFilterSize.x));
            height = Math.max(1, Math.min(Math.ceil(height), this.maxFilterSize.y));

            const filterCamera = this.filterCamera;
            if (!filterCamera)
            {
                return this;
            }
            filterCamera.setSize(width, height);

            return this;
        },

        /**
         * Set whether filters should be updated every frame.
         * Sets the `filtersAutoFocus` property.
         *
         * @method Phaser.GameObjects.Components.Filters#setFiltersAutoFocus
         * @webglOnly
         * @since 4.0.0
         * @param {boolean} value - Whether filters should be updated every frame.
         * @returns {this}
         */
        setFiltersAutoFocus(this: any, value: boolean): any
        {
            this.filtersAutoFocus = value;

            return this;
        },

        /**
         * Set whether the filters should focus on the context.
         * Sets the `filtersFocusContext` property.
         *
         * @method Phaser.GameObjects.Components.Filters#setFiltersFocusContext
         * @webglOnly
         * @since 4.0.0
         * @param {boolean} value - Whether the filters should focus on the context.
         * @returns {this}
         */
        setFiltersFocusContext(this: any, value: boolean): any
        {
            this.filtersFocusContext = value;

            return this;
        },

        /**
         * Set whether the filters should always draw to a framebuffer.
         * Sets the `filtersForceComposite` property.
         *
         * @method Phaser.GameObjects.Components.Filters#setFiltersForceComposite
         * @webglOnly
         * @since 4.0.0
         * @param {boolean} value - Whether the object should always draw to a framebuffer, even if there are no active filters.
         * @returns {this}
         */
        setFiltersForceComposite(this: any, value: boolean): any
        {
            this.filtersForceComposite = value;

            return this;
        },

        /**
         * Set whether the filters should be rendered.
         * Sets the `renderFilters` property.
         *
         * @method Phaser.GameObjects.Components.Filters#setRenderFilters
         * @webglOnly
         * @since 4.0.0
         * @param {boolean} value - Whether the filters should be rendered.
         * @returns {this}
         */
        setRenderFilters(this: any, value: boolean): any
        {
            this.renderFilters = value;

            return this;
        }
    };
}

export { Filters };
