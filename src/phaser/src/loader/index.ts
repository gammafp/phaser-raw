/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
