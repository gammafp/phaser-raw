/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// TODO: Convert this complex export pattern to modern TypeScript
// This file uses Extend to merge LOADER_CONST into the Loader object
// Need to analyze best pattern: namespace, merged exports, or class with static properties

import { Extend } from '../utils/object/Extend';
import { LOADER_CONST } from './const';

/**
 * @namespace Phaser.Loader
 */

import { File } from './File';
import { FileTypesManager } from './FileTypesManager';
import { GetURL } from './GetURL';
import { LoaderPlugin } from './LoaderPlugin';
import { MergeXHRSettings } from './MergeXHRSettings';
import { MultiFile } from './MultiFile';
import { XHRLoader } from './XHRLoader';
import { XHRSettings } from './XHRSettings';

let Loader: any = {

    Events: require('./events'),
    FileTypes: require('./filetypes'),

    File,
    FileTypesManager,
    GetURL,
    LoaderPlugin,
    MergeXHRSettings,
    MultiFile,
    XHRLoader,
    XHRSettings

};

//   Merge in the consts
Loader = Extend(false, Loader, LOADER_CONST);

export default Loader;
