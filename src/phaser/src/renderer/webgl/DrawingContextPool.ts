/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { DrawingContext } from './DrawingContext';

/**
 * @classdesc
 * A pool of DrawingContexts.
 *
 * This class is used internally by the WebGLRenderer to manage DrawingContexts.
 * It attempts to reuse DrawingContexts efficiently. When `get` is called,
 * it will return a DrawingContext of the given dimensions,
 * using the following priority:
 *
 * 1. A spare DrawingContext that has the same dimensions.
 * 2. A spare DrawingContext that has not been used recently, resized.
 * 3. A new DrawingContext, within the maximum pool size.
 * 4. The oldest spare DrawingContext, resized.
 * 5. A new DrawingContext, exceeding the maximum pool size.
 *
 * We assume that DrawingContexts of a given size are likely to be reused
 * from frame to frame, so we try to preserve them for greater efficiency.
 *
 * @class DrawingContextPool
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this DrawingContextPool.
 */
export class DrawingContextPool {
    renderer: any;
    maxAge: number;
    maxPoolSize: number;
    agePool: DrawingContext[];
    sizePool: Record<string, DrawingContext[]>;

    constructor(renderer: any, maxAge: number, maxPoolSize: number)
    {
        this.renderer = renderer;
        this.maxAge = maxAge;
        this.maxPoolSize = maxPoolSize;
        this.agePool = [];
        this.sizePool = {};
    }

    add(drawingContext: DrawingContext): void
    {
        if (this.agePool.indexOf(drawingContext) !== -1)
        {
            return;
        }

        const key = drawingContext.width + 'x' + drawingContext.height;

        if (this.sizePool[key])
        {
            this.sizePool[key].push(drawingContext);
        }
        else
        {
            this.sizePool[key] = [ drawingContext ];
        }

        this.agePool.push(drawingContext);
    }

    get(width?: number, height?: number): DrawingContext
    {
        let drawingContext: DrawingContext;
        let index: number;

        const renderer = this.renderer;
        if (width === undefined) { width = renderer.width; }
        if (height === undefined) { height = renderer.height; }
        const maxTextureSize = renderer.getMaxTextureSize();
        if (width > maxTextureSize) { width = maxTextureSize; }
        if (height > maxTextureSize) { height = maxTextureSize; }

        const key = width + 'x' + height;
        let sizePool = this.sizePool[key];

        if (sizePool && sizePool.length > 0)
        {
            drawingContext = sizePool.pop()!;
            index = this.agePool.indexOf(drawingContext);
            this.agePool.splice(index, 1);
            return drawingContext;
        }

        if (this.agePool.length > 0)
        {
            const now = Date.now();
            const maxAge = this.maxAge;
            drawingContext = this.agePool[0];
            if (now - drawingContext.lastUsed > maxAge)
            {
                this.agePool.shift();
                const oldKey = drawingContext.width + 'x' + drawingContext.height;
                sizePool = this.sizePool[oldKey];
                index = sizePool.indexOf(drawingContext);
                sizePool.splice(index, 1);
                drawingContext.resize(width, height);
                return drawingContext;
            }
        }

        if (this.agePool.length < this.maxPoolSize)
        {
            drawingContext = new DrawingContext(renderer, {
                autoClear: true,
                pool: this,
                width: width,
                height: height
            });
            return drawingContext;
        }

        drawingContext = this.agePool.shift()!;
        if (drawingContext)
        {
            const oldKey = drawingContext.width + 'x' + drawingContext.height;
            sizePool = this.sizePool[oldKey];
            index = sizePool.indexOf(drawingContext);
            sizePool.splice(index, 1);
            drawingContext.resize(width, height);
            return drawingContext;
        }

        drawingContext = new DrawingContext(renderer, {
            autoClear: true,
            pool: this,
            width: width,
            height: height
        });
        return drawingContext;
    }

    setMaxAge(maxAge: number): void
    {
        this.maxAge = maxAge;
    }

    setMaxPoolSize(maxPoolSize: number): void
    {
        this.maxPoolSize = maxPoolSize;
    }

    clear(): void
    {
        for (let i = 0; i < this.agePool.length; i++)
        {
            this.agePool[i].destroy();
        }

        this.sizePool = {};
        this.agePool.length = 0;
    }

    prune(): void
    {
        const sizePool = this.sizePool;
        const agePool = this.agePool;

        const excess = agePool.length - this.maxPoolSize;
        if (excess > 0)
        {
            const excessAgePool = agePool.splice(0, excess);
            for (let i = 0; i < excess; i++)
            {
                const drawingContext = excessAgePool[i];
                const key = drawingContext.width + 'x' + drawingContext.height;
                const sizePoolKey = sizePool[key];
                const index = sizePoolKey.indexOf(drawingContext);
                sizePoolKey.splice(index, 1);
                drawingContext.destroy();
            }
        }
    }
}
