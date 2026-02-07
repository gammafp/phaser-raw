/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Mixin } from '../../utils/MixinTS';
import type { Alpha } from '../components/Alpha';
import type { BlendMode } from '../components/BlendMode';
import type { Depth } from '../components/Depth';
import type { Flip } from '../components/Flip';
import type { Origin } from '../components/Origin';
import type { ScrollFactor } from '../components/ScrollFactor';
import type { Size } from '../components/Size';
import type { Texture } from '../components/Texture';
import type { Tint } from '../components/Tint';
import type { Transform } from '../components/Transform';
import type { Visible } from '../components/Visible';

const Components = require('../components');
import { GameObject } from '../GameObject';
import { ExternRender } from './ExternRender';

export interface Extern extends Alpha, BlendMode, Depth, Flip, Origin, ScrollFactor, Size, Texture, Tint, Transform, Visible {}

/**
 * @classdesc
 * An Extern Game Object is a special type of Game Object that allows you to pass
 * rendering off to a 3rd party.
 *
 * When you create an Extern and place it in the display list of a Scene, the renderer will
 * process the list as usual. When it finds an Extern it will flush the current batch,
 * clear down the pipeline and prepare a transform matrix which your render function can
 * take advantage of, if required.
 *
 * The WebGL context is then left in a 'clean' state, ready for you to bind your own shaders,
 * or draw to it, whatever you wish to do. This should all take place in the `render` method.
 * The correct way to deploy an Extern object is to create a class that extends it, then
 * override the `render` (and optionally `preUpdate`) methods and pass off control to your
 * 3rd party libraries or custom WebGL code there.
 *
 * Once you've finished, you should free-up any of your resources.
 * The Extern will then rebind the Phaser pipeline and carry on rendering the display list.
 *
 * Although this object has lots of properties such as Alpha, Blend Mode and Tint, none of
 * them are used during rendering unless you take advantage of them in your own render code.
 *
 * @class Extern
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.16.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 */
export class Extern extends GameObject {

    static
    {
        Mixin(this, [
            Components.Alpha,
            Components.BlendMode,
            Components.Depth,
            Components.Flip,
            Components.Origin,
            Components.ScrollFactor,
            Components.Size,
            Components.Texture,
            Components.Tint,
            Components.Transform,
            Components.Visible,
            ExternRender
        ]);
    }

    constructor(scene)
    {
        super(scene, 'Extern');
    }

    //  Overrides Game Object method
    addedToScene()
    {
        this.scene.sys.updateList.add(this);
    }

    //  Overrides Game Object method
    removedFromScene()
    {
        this.scene.sys.updateList.remove(this);
    }

    preUpdate()
    {
        //  override this!
        //  Arguments: time, delta
    }

    render()
    {
        //  override this!
        //  Arguments: renderer, camera, calcMatrix
    }

};


