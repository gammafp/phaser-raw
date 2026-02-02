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

const File = require('./File');
const FileTypesManager = require('./FileTypesManager');
const GetURL = require('./GetURL');
const LoaderPlugin = require('./LoaderPlugin');
const MergeXHRSettings = require('./MergeXHRSettings');
const MultiFile = require('./MultiFile');
const XHRLoader = require('./XHRLoader');
const XHRSettings = require('./XHRSettings');

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
