/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Earcut } from '../../../geom/polygon/Earcut';

import { RenderNode } from './RenderNode';

/**
 * @classdesc
 * A RenderNode which fills a path.
 *
 * It works by taking the array of path data and then passing it through
 * Earcut, which creates a list of polygons.
 * Each polygon is then added to the batch.
 * The polygons are triangles, but they're rendered as quads
 * to be compatible with other batched quads.
 *
 * @class FillPath
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
export class FillPath extends RenderNode {

    constructor(manager: any)
    {
        super('FillPath', manager);
    }

    run(
        drawingContext: any,
        currentMatrix: any,
        submitterNode: any,
        path: any[],
        tintTL: number,
        tintTR: number,
        tintBL: number,
        detail?: number,
        lighting?: boolean
    ): void
    {
        this.onRunBegin(drawingContext);

        if (detail === undefined) { detail = 0; }

        const length = path.length;
        let index: number;
        let pathIndex: number;
        let point: any;
        let polygonIndexArray: number[];
        let x: number;
        let y: number;

        let polygonCacheIndex = 0;
        let indexedTrianglesIndex = 0;

        const polygonCache: number[] = [];
        const colors: number[] = [];
        let colorsIndex = 0;

        for (pathIndex = 0; pathIndex < length; pathIndex++)
        {
            point = path[pathIndex];

            x = currentMatrix.getX(point.x, point.y);
            y = currentMatrix.getY(point.x, point.y);

            if (
                pathIndex > 0 &&
                pathIndex < length - 1 &&
                Math.abs(x - polygonCache[polygonCacheIndex - 2]) <= detail &&
                Math.abs(y - polygonCache[polygonCacheIndex - 1]) <= detail
            )
            {
                continue;
            }

            polygonCache[polygonCacheIndex++] = x;
            polygonCache[polygonCacheIndex++] = y;
        }

        polygonIndexArray = Earcut(polygonCache);

        if (tintTL === tintTR && tintTL === tintBL)
        {
            const polygonCacheLength = polygonCache.length;

            for (index = 0; index < polygonCacheLength; index += 2)
            {
                colors[colorsIndex++] = tintTL;
            }

            submitterNode.batch(drawingContext, polygonIndexArray, polygonCache, colors, lighting);
        }
        else
        {
            const indexLength = polygonIndexArray.length;

            const indexedTriangles = Array(indexLength);
            const vertices = Array(indexLength * 2);
            let verticesIndex = 0;

            for (index = 0; index < indexLength; index += 3)
            {
                let p = polygonIndexArray[index] * 2;
                x = polygonCache[p + 0];
                y = polygonCache[p + 1];

                vertices[verticesIndex++] = x;
                vertices[verticesIndex++] = y;

                p = polygonIndexArray[index + 1] * 2;
                x = polygonCache[p + 0];
                y = polygonCache[p + 1];

                vertices[verticesIndex++] = x;
                vertices[verticesIndex++] = y;

                p = polygonIndexArray[index + 2] * 2;
                x = polygonCache[p + 0];
                y = polygonCache[p + 1];

                vertices[verticesIndex++] = x;
                vertices[verticesIndex++] = y;

                colors[colorsIndex++] = tintTL;
                colors[colorsIndex++] = tintTR;
                colors[colorsIndex++] = tintBL;

                indexedTriangles[indexedTrianglesIndex++] = index + 0;
                indexedTriangles[indexedTrianglesIndex++] = index + 1;
                indexedTriangles[indexedTrianglesIndex++] = index + 2;
            }

            submitterNode.batch(drawingContext, indexedTriangles, vertices, colors, lighting);
        }

        this.onRunEnd(drawingContext);
    }
}
