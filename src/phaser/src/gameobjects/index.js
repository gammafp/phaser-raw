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

import { BitmapText } from './bitmaptext/static/BitmapText';
import { BitmapTextFactory } from './bitmaptext/static/BitmapTextFactory';
import { BitmapTextCreator } from './bitmaptext/static/BitmapTextCreator';
import { DynamicBitmapText } from './bitmaptext/dynamic/DynamicBitmapText';
import { DynamicBitmapTextFactory } from './bitmaptext/dynamic/DynamicBitmapTextFactory';
import { DynamicBitmapTextCreator } from './bitmaptext/dynamic/DynamicBitmapTextCreator';
import { RetroFont } from './bitmaptext/RetroFont';

import { Text } from './text/Text';
import { GetTextSize } from './text/GetTextSize';
import { MeasureText } from './text/MeasureText';
import { TextStyle } from './text/TextStyle';
import { TextFactory } from './text/TextFactory';
import { TextCreator } from './text/TextCreator';

import { SpriteGPULayer } from './spritegpulayer/SpriteGPULayer';
import { SpriteGPULayerFactory } from './spritegpulayer/SpriteGPULayerFactory';
import { SpriteGPULayerCreator } from './spritegpulayer/SpriteGPULayerCreator';

import { Video } from './video/Video';
import { VideoFactory } from './video/VideoFactory';
import { VideoCreator } from './video/VideoCreator';
import { Graphics } from './graphics/Graphics';
import { GraphicsFactory } from './graphics/GraphicsFactory';
import { GraphicsCreator } from './graphics/GraphicsCreator';
import { Blitter } from './blitter/Blitter';
import { Bob } from './blitter/Bob';
import { BlitterFactory } from './blitter/BlitterFactory';
import { BlitterCreator } from './blitter/BlitterCreator';
import { NineSlice } from './nineslice/NineSlice';
import { NineSliceFactory } from './nineslice/NineSliceFactory';
import { NineSliceCreator } from './nineslice/NineSliceCreator';
import { Light } from './lights/Light';
import { LightsManager } from './lights/LightsManager';
import { LightsPlugin } from './lights/LightsPlugin';
import { CaptureFrame } from './captureframe/CaptureFrame';
import { CaptureFrameFactory } from './captureframe/CaptureFrameFactory';
import { CaptureFrameCreator } from './captureframe/CaptureFrameCreator';
import { PointLight } from './pointlight/PointLight';
import { PointLightFactory } from './pointlight/PointLightFactory';
import { PointLightCreator } from './pointlight/PointLightCreator';

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
    BitmapText: BitmapText,
    Blitter: Blitter,
    Bob: Bob,
    Container: require('./container/Container'),
    DOMElement: require('./domelement/DOMElement'),
    DynamicBitmapText: DynamicBitmapText,
    Extern: require('./extern/Extern'),
    Graphics: Graphics,
    Group: require('./group/Group'),
    Image: Image,
    Layer: require('./layer/Layer'),
    Particles: require('./particles'),
    PathFollower: require('./pathfollower/PathFollower'),
    RenderTexture: require('./rendertexture/RenderTexture'),
    RetroFont: RetroFont,
    Rope: require('./rope/Rope'),
    Sprite: require('./sprite/Sprite'),
    Stamp: require('./stamp/Stamp'),

    Text: Text,
    GetTextSize: GetTextSize,
    MeasureText: MeasureText,
    TextStyle: TextStyle,

    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone'),
    Video: Video,

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
        Blitter: BlitterFactory,
        Container: require('./container/ContainerFactory'),
        DOMElement: require('./domelement/DOMElementFactory'),
        DynamicBitmapText: DynamicBitmapTextFactory,
        Extern: require('./extern/ExternFactory'),
        Graphics: GraphicsFactory,
        Group: require('./group/GroupFactory'),
        Image: ImageFactory,
        Layer: require('./layer/LayerFactory'),
        Particles: require('./particles/ParticleEmitterFactory'),
        PathFollower: require('./pathfollower/PathFollowerFactory'),
        RenderTexture: require('./rendertexture/RenderTextureFactory'),
        Rope: require('./rope/RopeFactory'),
        Sprite: require('./sprite/SpriteFactory'),
        Stamp: require('./stamp/StampFactory'),
        StaticBitmapText: BitmapTextFactory,
        Text: TextFactory,
        TileSprite: require('./tilesprite/TileSpriteFactory'),
        Zone: require('./zone/ZoneFactory'),
        Video: VideoFactory,

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
        Blitter: BlitterCreator,
        Container: require('./container/ContainerCreator'),
        DynamicBitmapText: DynamicBitmapTextCreator,
        Graphics: GraphicsCreator,
        Group: require('./group/GroupCreator'),
        Image: ImageCreator,
        Layer: require('./layer/LayerCreator'),
        Particles: require('./particles/ParticleEmitterCreator'),
        RenderTexture: require('./rendertexture/RenderTextureCreator'),
        Rope: require('./rope/RopeCreator'),
        Sprite: require('./sprite/SpriteCreator'),
        Stamp: require('./stamp/StampCreator'),
        StaticBitmapText: BitmapTextCreator,
        Text: TextCreator,
        TileSprite: require('./tilesprite/TileSpriteCreator'),
        Zone: require('./zone/ZoneCreator'),
        Video: VideoCreator
    }

};

//  WebGL only Game Objects
if (typeof WEBGL_RENDERER)
{
    GameObjects.CaptureFrame = CaptureFrame;
    GameObjects.Shader = require('./shader/Shader');
    GameObjects.NineSlice = NineSlice;
    GameObjects.PointLight = PointLight;
    GameObjects.SpriteGPULayer = SpriteGPULayer;

    GameObjects.Factories.CaptureFrame = CaptureFrameFactory;
    GameObjects.Factories.Shader = require('./shader/ShaderFactory');
    GameObjects.Factories.NineSlice = NineSliceFactory;
    GameObjects.Factories.PointLight = PointLightFactory;
    GameObjects.Factories.SpriteGPULayer = SpriteGPULayerFactory;

    GameObjects.Creators.CaptureFrame = CaptureFrameCreator;
    GameObjects.Creators.Shader = require('./shader/ShaderCreator');
    GameObjects.Creators.NineSlice = NineSliceCreator;
    GameObjects.Creators.PointLight = PointLightCreator;
    GameObjects.Creators.SpriteGPULayer = SpriteGPULayerCreator;

    GameObjects.Light = Light;
    GameObjects.LightsManager = LightsManager;
    GameObjects.LightsPlugin = LightsPlugin;
}

module.exports = GameObjects;
