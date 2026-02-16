/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Image } from './image/Image';
import { ImageFactory } from './image/ImageFactory';
import { ImageCreator } from './image/ImageCreator';

import { Shape } from './shape/Shape';
import { Arc } from './shape/arc/Arc';
import { Curve } from './shape/curve/Curve';
import { Ellipse } from './shape/ellipse/Ellipse';
import { Grid } from './shape/grid/Grid';
import { IsoBox } from './shape/isobox/IsoBox';
import { IsoTriangle } from './shape/isotriangle/IsoTriangle';
import { Line } from './shape/line/Line';
import { Polygon } from './shape/polygon/Polygon';
import { Rectangle } from './shape/rectangle/Rectangle';
import { Star } from './shape/star/Star';
import { Triangle } from './shape/triangle/Triangle';

import { ArcFactory } from './shape/arc/ArcFactory';
import { CurveFactory } from './shape/curve/CurveFactory';
import { EllipseFactory } from './shape/ellipse/EllipseFactory';
import { GridFactory } from './shape/grid/GridFactory';
import { IsoBoxFactory } from './shape/isobox/IsoBoxFactory';
import { IsoTriangleFactory } from './shape/isotriangle/IsoTriangleFactory';
import { LineFactory } from './shape/line/LineFactory';
import { PolygonFactory } from './shape/polygon/PolygonFactory';
import { RectangleFactory } from './shape/rectangle/RectangleFactory';
import { StarFactory } from './shape/star/StarFactory';
import { TriangleFactory } from './shape/triangle/TriangleFactory';

/**
 * @namespace Phaser.GameObjects
 */

var GameObjects = {

    Events: require('./events'),

    DisplayList: require('./DisplayList'),
    GameObjectCreator: require('./GameObjectCreator'),
    GameObjectFactory: require('./GameObjectFactory'),
    UpdateList: require('./UpdateList'),

    Components: require('./components'),
    GetCalcMatrix: require('./GetCalcMatrix'),

    BuildGameObject: require('./BuildGameObject'),
    BuildGameObjectAnimation: require('./BuildGameObjectAnimation'),
    GameObject: require('./GameObject'),
    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    Bob: require('./blitter/Bob'),
    Container: require('./container/Container'),
    DOMElement: require('./domelement/DOMElement'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Extern: require('./extern/Extern'),
    Graphics: require('./graphics/Graphics'),
    Group: require('./group/Group'),
    Image: Image,
    Layer: require('./layer/Layer'),
    Particles: require('./particles'),
    PathFollower: require('./pathfollower/PathFollower'),
    RenderTexture: require('./rendertexture/RenderTexture'),
    RetroFont: require('./bitmaptext/RetroFont'),
    Rope: require('./rope/Rope'),
    Sprite: require('./sprite/Sprite'),
    Stamp: require('./stamp/Stamp'),

    Text: require('./text/Text'),
    GetTextSize: require('./text/GetTextSize'),
    MeasureText: require('./text/MeasureText'),
    TextStyle: require('./text/TextStyle'),

    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone'),
    Video: require('./video/Video'),

    //  Shapes

    Shape: Shape,
    Arc: Arc,
    Curve: Curve,
    Ellipse: Ellipse,
    Grid: Grid,
    IsoBox: IsoBox,
    IsoTriangle: IsoTriangle,
    Line: Line,
    Polygon: Polygon,
    Rectangle: Rectangle,
    Star: Star,
    Triangle: Triangle,

    //  Game Object Factories

    Factories: {
        Blitter: require('./blitter/BlitterFactory'),
        Container: require('./container/ContainerFactory'),
        DOMElement: require('./domelement/DOMElementFactory'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextFactory'),
        Extern: require('./extern/ExternFactory'),
        Graphics: require('./graphics/GraphicsFactory'),
        Group: require('./group/GroupFactory'),
        Image: ImageFactory,
        Layer: require('./layer/LayerFactory'),
        Particles: require('./particles/ParticleEmitterFactory'),
        PathFollower: require('./pathfollower/PathFollowerFactory'),
        RenderTexture: require('./rendertexture/RenderTextureFactory'),
        Rope: require('./rope/RopeFactory'),
        Sprite: require('./sprite/SpriteFactory'),
        Stamp: require('./stamp/StampFactory'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextFactory'),
        Text: require('./text/TextFactory'),
        TileSprite: require('./tilesprite/TileSpriteFactory'),
        Zone: require('./zone/ZoneFactory'),
        Video: require('./video/VideoFactory'),

        //  Shapes
        Arc: ArcFactory,
        Curve: CurveFactory,
        Ellipse: EllipseFactory,
        Grid: GridFactory,
        IsoBox: IsoBoxFactory,
        IsoTriangle: IsoTriangleFactory,
        Line: LineFactory,
        Polygon: PolygonFactory,
        Rectangle: RectangleFactory,
        Star: StarFactory,
        Triangle: TriangleFactory
    },

    Creators: {
        Blitter: require('./blitter/BlitterCreator'),
        Container: require('./container/ContainerCreator'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextCreator'),
        Graphics: require('./graphics/GraphicsCreator'),
        Group: require('./group/GroupCreator'),
        Image: ImageCreator,
        Layer: require('./layer/LayerCreator'),
        Particles: require('./particles/ParticleEmitterCreator'),
        RenderTexture: require('./rendertexture/RenderTextureCreator'),
        Rope: require('./rope/RopeCreator'),
        Sprite: require('./sprite/SpriteCreator'),
        Stamp: require('./stamp/StampCreator'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextCreator'),
        Text: require('./text/TextCreator'),
        TileSprite: require('./tilesprite/TileSpriteCreator'),
        Zone: require('./zone/ZoneCreator'),
        Video: require('./video/VideoCreator')
    }

};

//  WebGL only Game Objects
if (typeof WEBGL_RENDERER)
{
    GameObjects.CaptureFrame = require('./captureframe/CaptureFrame');
    GameObjects.Shader = require('./shader/Shader');
    GameObjects.NineSlice = require('./nineslice/NineSlice');
    GameObjects.PointLight = require('./pointlight/PointLight');
    GameObjects.SpriteGPULayer = require('./spritegpulayer/SpriteGPULayer');

    GameObjects.Factories.CaptureFrame = require('./captureframe/CaptureFrameFactory');
    GameObjects.Factories.Shader = require('./shader/ShaderFactory');
    GameObjects.Factories.NineSlice = require('./nineslice/NineSliceFactory');
    GameObjects.Factories.PointLight = require('./pointlight/PointLightFactory');
    GameObjects.Factories.SpriteGPULayer = require('./spritegpulayer/SpriteGPULayerFactory');

    GameObjects.Creators.CaptureFrame = require('./captureframe/CaptureFrameCreator');
    GameObjects.Creators.Shader = require('./shader/ShaderCreator');
    GameObjects.Creators.NineSlice = require('./nineslice/NineSliceCreator');
    GameObjects.Creators.PointLight = require('./pointlight/PointLightCreator');
    GameObjects.Creators.SpriteGPULayer = require('./spritegpulayer/SpriteGPULayerCreator');

    GameObjects.Light = require('./lights/Light');
    GameObjects.LightsManager = require('./lights/LightsManager');
    GameObjects.LightsPlugin = require('./lights/LightsPlugin');
}

module.exports = GameObjects;
