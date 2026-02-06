/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { GetAdvancedValue } from '../../utils/object/GetAdvancedValue';
import { GetValue } from '../../utils/object/GetValue';
import { BuildGameObject } from '../BuildGameObject';
import { GameObjectCreator } from '../GameObjectCreator';
import { Mesh } from './Mesh';

/**
 * Creates a new Mesh Game Object and returns it.
 *
 * Note: This method will only be available if the Mesh Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#mesh
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Mesh.MeshConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Mesh} The Game Object that was created.
 */
GameObjectCreator.register('mesh', function (this: any, config?: any, addToScene?: boolean): Mesh
{
    if (config === undefined) { config = {}; }

    const key = GetAdvancedValue(config, 'key', null);
    const frame = GetAdvancedValue(config, 'frame', null);
    const vertices = GetValue(config, 'vertices', []);
    const uvs = GetValue(config, 'uvs', []);
    const indicies = GetValue(config, 'indicies', []);
    const containsZ = GetValue(config, 'containsZ', false);
    const normals = GetValue(config, 'normals', []);
    const colors = GetValue(config, 'colors', 0xffffff);
    const alphas = GetValue(config, 'alphas', 1);

    const mesh = new Mesh(this.scene, 0, 0, key, frame, vertices, uvs, indicies, containsZ, normals, colors, alphas);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, mesh, config);

    return mesh;
});


