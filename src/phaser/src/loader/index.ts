/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Extend } from '../utils/object/Extend';
import { FILE_CONST } from './const';
import * as Events from './events';
import * as FileTypes from './filetypes';
import { File } from './File';
import { FileTypesManager } from './FileTypesManager';
import { GetURL } from './GetURL';
import { LoaderPlugin } from './LoaderPlugin';
import { MergeXHRSettings } from './MergeXHRSettings';
import { MultiFile } from './MultiFile';
import { XHRLoader } from './XHRLoader';
import { XHRSettings } from './XHRSettings';

/**
 * @namespace Phaser.Loader
 */

let Loader: any = {
    Events: Events,
    FileTypes: FileTypes,
    File: File,
    FileTypesManager: FileTypesManager,
    GetURL: GetURL,
    LoaderPlugin: LoaderPlugin,
    MergeXHRSettings: MergeXHRSettings,
    MultiFile: MultiFile,
    XHRLoader: XHRLoader,
    XHRSettings: XHRSettings
};

//   Merge in the consts
Loader = Extend(false, Loader, FILE_CONST);

export default Loader;
