/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetFastValue } from '../../../utils/object/GetFastValue';
import { CreateGroupLayer } from './CreateGroupLayer';

/**
 * Parses a Tiled JSON object into an array of objects with details about the image layers.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseImageLayers
 * @since 3.0.0
 *
 * @param {object} json - The Tiled JSON object.
 *
 * @return {array} Array of objects that include critical info about the map's image layers
 */
export const ParseImageLayers = function (json: any): any[]
{
    const images: any[] = [];

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
        const curi = curGroupState.layers[curGroupState.i];
        curGroupState.i++;

        if (curi.type !== 'imagelayer')
        {
            if (curi.type === 'group')
            {
                // Compute next state inherited from group
                const nextGroupState = CreateGroupLayer(json, curi, curGroupState);

                // Preserve current state before recursing
                groupStack.push(curGroupState);
                curGroupState = nextGroupState;
            }

            // Skip this layer OR 'recurse' (iterative style) into the group
            continue;
        }

        const layerOffsetX = GetFastValue(curi, 'offsetx', 0) + GetFastValue(curi, 'startx', 0);
        const layerOffsetY = GetFastValue(curi, 'offsety', 0) + GetFastValue(curi, 'starty', 0);
        images.push({
            name: (curGroupState.name + curi.name),
            image: curi.image,
            x: (curGroupState.x + layerOffsetX + curi.x),
            y: (curGroupState.y + layerOffsetY + curi.y),
            alpha: (curGroupState.opacity * curi.opacity),
            visible: (curGroupState.visible && curi.visible),
            properties: GetFastValue(curi, 'properties', {})
        });
    }

    return images;
};
