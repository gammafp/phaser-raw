/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { ObjectLayer } from '../../mapdata/ObjectLayer';
import { GetFastValue } from '../../../utils/object/GetFastValue';
import { ParseObject } from './ParseObject';
import { CreateGroupLayer } from './CreateGroupLayer';

/**
 * Parses a Tiled JSON object into an array of ObjectLayer objects.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseObjectLayers
 * @since 3.0.0
 *
 * @param {object} json - The Tiled JSON object.
 *
 * @return {array} An array of all object layers in the tilemap as `ObjectLayer`s.
 */
export const ParseObjectLayers = function (json: any): ObjectLayer[]
{
    const objectLayers: ObjectLayer[] = [];

    // State inherited from a parent group
    const groupStack: any[] = [];
    let curGroupState = CreateGroupLayer(json);

    while (curGroupState.i < curGroupState.layers.length || groupStack.length > 0)
    {
        if (curGroupState.i >= curGroupState.layers.length)
        {
            // Ensure recursion stack is not empty first
            if (groupStack.length < 1)
            {
                console.warn(
                    'TilemapParser.parseTiledJSON - Invalid layer group hierarchy'
                );
                break;
            }

            // Return to previous recursive state
            curGroupState = groupStack.pop();
            continue;
        }

        // Get current layer and advance iterator
        const curo = curGroupState.layers[curGroupState.i];
        curGroupState.i++;

        // Modify inherited properties
        curo.opacity *= curGroupState.opacity;
        curo.visible = curGroupState.visible && curo.visible;

        if (curo.type !== 'objectgroup')
        {
            if (curo.type === 'group')
            {
                // Compute next state inherited from group
                const nextGroupState = CreateGroupLayer(json, curo, curGroupState);

                // Preserve current state before recursing
                groupStack.push(curGroupState);
                curGroupState = nextGroupState;
            }

            // Skip this layer OR 'recurse' (iterative style) into the group
            continue;
        }

        curo.name = curGroupState.name + curo.name;
        const offsetX = curGroupState.x + GetFastValue(curo, 'startx', 0) + GetFastValue(curo, 'offsetx', 0);
        const offsetY = curGroupState.y + GetFastValue(curo, 'starty', 0) + GetFastValue(curo, 'offsety', 0);

        const objects: any[] = [];
        for (let j = 0; j < curo.objects.length; j++)
        {
            const parsedObject = ParseObject(curo.objects[j], offsetX, offsetY);

            objects.push(parsedObject);
        }

        const objectLayer = new ObjectLayer(curo);
        objectLayer.objects = objects;

        objectLayers.push(objectLayer);
    }

    return objectLayers;
};
