/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * This method will search the given rectangular area and return an array of all physics bodies that
 * overlap with it. It can return either Dynamic, Static bodies or a mixture of both.
 *
 * A body only has to intersect with the search area to be considered, it doesn't have to be fully
 * contained within it.
 *
 * If Arcade Physics is set to use the RTree (which it is by default) then the search is extremely fast,
 * otherwise the search is O(N) for Dynamic Bodies.
 */
export const OverlapRect = function (world: any, x: number, y: number, width: number, height: number, includeDynamic?: boolean, includeStatic?: boolean): any[]
{
    if (includeDynamic === undefined) { includeDynamic = true; }
    if (includeStatic === undefined) { includeStatic = false; }

    let dynamicBodies: any[] = [];
    let staticBodies: any[] = [];

    const minMax = world.treeMinMax;

    minMax.minX = x;
    minMax.minY = y;
    minMax.maxX = x + width;
    minMax.maxY = y + height;

    if (includeStatic)
    {
        staticBodies = world.staticTree.search(minMax);
    }

    if (includeDynamic && world.useTree)
    {
        dynamicBodies = world.tree.search(minMax);
    }
    else if (includeDynamic)
    {
        const bodies = Array.from(world.bodies) as any[];

        const fakeBody = {
            position: {
                x: x,
                y: y
            },
            left: x,
            top: y,
            right: x + width,
            bottom: y + height,
            isCircle: false
        };

        const intersects = world.intersects;

        for (let i = 0; i < bodies.length; i++)
        {
            const target = bodies[i];

            if (intersects(target, fakeBody))
            {
                dynamicBodies.push(target);
            }
        }
    }

    return staticBodies.concat(dynamicBodies);
};
