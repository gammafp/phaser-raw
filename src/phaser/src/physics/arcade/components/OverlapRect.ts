/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const OverlapRect = (world: any, x: number, y: number, width: number, height: number, includeDynamic: boolean = true, includeStatic: boolean = false): any[] =>
{
    var dynamicBodies: any[] = [];
    var staticBodies: any[] = [];

    var minMax = world.treeMinMax;

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
        var bodies = world.bodies;

        var fakeBody =
        {
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

        var intersects = world.intersects;

        bodies.iterate(function (target: any)
        {
            if (intersects(target, fakeBody))
            {
                dynamicBodies.push(target);
            }

        });
    }

    return staticBodies.concat(dynamicBodies);
};
