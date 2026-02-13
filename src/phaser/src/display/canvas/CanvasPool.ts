/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { PHASER_CONST as CONST } from '../../const';
import * as Smoothing from './Smoothing';

// The pool into which the canvas elements are placed.
export const pool: any[] = [];

//  Automatically apply smoothing(false) to created Canvas elements
let _disableContextSmoothing = false;

/**
 * Gets the first free canvas index from the pool.
 *
 * @function Phaser.Display.Canvas.CanvasPool.first
 * @since 3.0.0
 *
 * @param {number} [canvasType=Phaser.CANVAS] - The type of the Canvas. Either `Phaser.CANVAS` or `Phaser.WEBGL`.
 *
 * @return {HTMLCanvasElement} The first free canvas, or `null` if a WebGL canvas was requested or if the pool doesn't have free canvases.
 */
export const first = (canvasType: number = CONST.CANVAS): any | null =>
{
    if (canvasType === CONST.WEBGL)
    {
        return null;
    }

    for (let i = 0; i < pool.length; i++)
    {
        const container = pool[i];

        if (!container.parent && container.type === canvasType)
        {
            return container;
        }
    }

    return null;
};

/**
 * Creates a new Canvas DOM element, or pulls one from the pool if free.
 *
 * @function Phaser.Display.Canvas.CanvasPool.create
 * @since 3.0.0
 *
 * @param {*} parent - The parent of the Canvas object.
 * @param {number} [width=1] - The width of the Canvas.
 * @param {number} [height=1] - The height of the Canvas.
 * @param {number} [canvasType=Phaser.CANVAS] - The type of the Canvas. Either `Phaser.CANVAS` or `Phaser.WEBGL`.
 * @param {boolean} [selfParent=false] - Use the generated Canvas element as the parent?
 *
 * @return {HTMLCanvasElement} The canvas element that was created or pulled from the pool
 */
export const create = (parent: any, width: number = 1, height: number = 1, canvasType: number = CONST.CANVAS, selfParent: boolean = false): HTMLCanvasElement =>
{
    let canvas: HTMLCanvasElement;
    let container = first(canvasType);

    if (container === null)
    {
        container = {
            parent: parent,
            canvas: document.createElement('canvas'),
            type: canvasType
        };

        if (canvasType === CONST.CANVAS)
        {
            pool.push(container);
        }

        canvas = container.canvas;
    }
    else
    {
        container.parent = parent;

        canvas = container.canvas;
    }

    if (selfParent)
    {
        container.parent = canvas;
    }

    canvas.width = width;
    canvas.height = height;

    if (_disableContextSmoothing && canvasType === CONST.CANVAS)
    {
        Smoothing.disable(canvas.getContext('2d', { willReadFrequently: false }));
    }

    return canvas;
};

/**
 * Creates a new Canvas DOM element, or pulls one from the pool if free.
 *
 * @function Phaser.Display.Canvas.CanvasPool.create2D
 * @since 3.0.0
 *
 * @param {*} parent - The parent of the Canvas object.
 * @param {number} [width=1] - The width of the Canvas.
 * @param {number} [height=1] - The height of the Canvas.
 *
 * @return {HTMLCanvasElement} The created canvas.
 */
export const create2D = (parent: any, width?: number, height?: number): HTMLCanvasElement =>
{
    return create(parent, width, height, CONST.CANVAS);
};

/**
 * Creates a new Canvas DOM element, or pulls one from the pool if free.
 *
 * @function Phaser.Display.Canvas.CanvasPool.createWebGL
 * @since 3.0.0
 *
 * @param {*} parent - The parent of the Canvas object.
 * @param {number} [width=1] - The width of the Canvas.
 * @param {number} [height=1] - The height of the Canvas.
 *
 * @return {HTMLCanvasElement} The created WebGL canvas.
 */
export const createWebGL = (parent: any, width?: number, height?: number): HTMLCanvasElement =>
{
    return create(parent, width, height, CONST.WEBGL);
};

/**
 * Looks up a canvas based on its parent, and if found puts it back in the pool, freeing it up for re-use.
 * The canvas has its width and height set to 1, and its parent attribute nulled.
 *
 * @function Phaser.Display.Canvas.CanvasPool.remove
 * @since 3.0.0
 *
 * @param {*} parent - The canvas or the parent of the canvas to free.
 */
export const remove = (parent: any): void =>
{
    //  Check to see if the parent is a canvas object
    const isCanvas = parent instanceof HTMLCanvasElement;

    pool.forEach((container) =>
    {
        if ((isCanvas && container.canvas === parent) || (!isCanvas && container.parent === parent))
        {
            container.parent = null;
            container.canvas.width = 1;
            container.canvas.height = 1;
        }
    });
};

/**
 * Gets the total number of used canvas elements in the pool.
 *
 * @function Phaser.Display.Canvas.CanvasPool.total
 * @since 3.0.0
 *
 * @return {number} The number of used canvases.
 */
export const total = (): number =>
{
    let c = 0;

    pool.forEach((container) =>
    {
        if (container.parent)
        {
            c++;
        }
    });

    return c;
};

/**
 * Gets the total number of free canvas elements in the pool.
 *
 * @function Phaser.Display.Canvas.CanvasPool.free
 * @since 3.0.0
 *
 * @return {number} The number of free canvases.
 */
export const free = (): number =>
{
    return pool.length - total();
};

/**
 * Disable context smoothing on any new Canvas element created.
 *
 * @function Phaser.Display.Canvas.CanvasPool.disableSmoothing
 * @since 3.0.0
 */
export const disableSmoothing = (): void =>
{
    _disableContextSmoothing = true;
};

/**
 * Enable context smoothing on any new Canvas element created.
 *
 * @function Phaser.Display.Canvas.CanvasPool.enableSmoothing
 * @since 3.0.0
 */
export const enableSmoothing = (): void =>
{
    _disableContextSmoothing = false;
};
