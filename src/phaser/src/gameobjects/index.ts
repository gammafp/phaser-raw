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
import { PathFollower } from './pathfollower/PathFollower';
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
import { Rope } from './rope/Rope';
import { RopeFactory } from './rope/RopeFactory';
import { RopeCreator } from './rope/RopeCreator';
import { Sprite } from './sprite/Sprite';
import { SpriteFactory } from './sprite/SpriteFactory';
import { SpriteCreator } from './sprite/SpriteCreator';
import { Group } from './group/Group';
import { GroupFactory } from './group/GroupFactory';
import { GroupCreator } from './group/GroupCreator';
import { Zone } from './zone/Zone';
import { ZoneFactory } from './zone/ZoneFactory';
import { ZoneCreator } from './zone/ZoneCreator';
import { PathFollowerFactory } from './pathfollower/PathFollowerFactory';
import { Shader } from './shader/Shader';
import { ShaderFactory } from './shader/ShaderFactory';
import { ShaderCreator } from './shader/ShaderCreator';
import { TileSprite } from './tilesprite/TileSprite';
import { TileSpriteFactory } from './tilesprite/TileSpriteFactory';
import { TileSpriteCreator } from './tilesprite/TileSpriteCreator';
import { Extern } from './extern/Extern';
import { ExternFactory } from './extern/ExternFactory';
import { Stamp } from './stamp/Stamp';
import { StampFactory } from './stamp/StampFactory';
import { StampCreator } from './stamp/StampCreator';

import { DisplayList } from './DisplayList';
import { GameObjectCreator } from './GameObjectCreator';
import { GameObjectFactory } from './GameObjectFactory';
import { UpdateList } from './UpdateList';
import { GetCalcMatrix } from './GetCalcMatrix';
import { BuildGameObject } from './BuildGameObject';
import { BuildGameObjectAnimation } from './BuildGameObjectAnimation';
import { GameObject } from './GameObject';

/**
 * @namespace Phaser.GameObjects
 */

var GameObjects: any = {

    Events: require('./events'),

    DisplayList: DisplayList,
    GameObjectCreator: GameObjectCreator,
    GameObjectFactory: GameObjectFactory,
    UpdateList: UpdateList,

    Components: require('./components'),
    GetCalcMatrix: GetCalcMatrix,

    BuildGameObject: BuildGameObject,
    BuildGameObjectAnimation: BuildGameObjectAnimation,
    GameObject: GameObject,
    BitmapText: BitmapText,
    Blitter: Blitter,
    Bob: Bob,
    Container: require('./container/Container'),
    DOMElement: require('./domelement/DOMElement'),
    DynamicBitmapText: DynamicBitmapText,
    Extern: Extern,
    Graphics: Graphics,
    Group: Group,
    Image: Image,
    Layer: require('./layer/Layer'),
    Particles: require('./particles'),
    PathFollower: PathFollower,
    RenderTexture: require('./rendertexture/RenderTexture'),
    RetroFont: RetroFont,
    Rope: Rope,
    Sprite: Sprite,
    Stamp: Stamp,

    Text: Text,
    GetTextSize: GetTextSize,
    MeasureText: MeasureText,
    TextStyle: TextStyle,

    TileSprite: TileSprite,
    Zone: Zone,
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
        Extern: ExternFactory,
        Graphics: GraphicsFactory,
        Group: GroupFactory,
        Image: ImageFactory,
        Layer: require('./layer/LayerFactory'),
        Particles: require('./particles/ParticleEmitterFactory'),
        PathFollower: PathFollowerFactory,
        RenderTexture: require('./rendertexture/RenderTextureFactory'),
        Rope: RopeFactory,
        Sprite: SpriteFactory,
        Stamp: StampFactory,
        StaticBitmapText: BitmapTextFactory,
        Text: TextFactory,
        TileSprite: TileSpriteFactory,
        Zone: ZoneFactory,
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
        Group: GroupCreator,
        Image: ImageCreator,
        Layer: require('./layer/LayerCreator'),
        Particles: require('./particles/ParticleEmitterCreator'),
        RenderTexture: require('./rendertexture/RenderTextureCreator'),
        Rope: RopeCreator,
        Sprite: SpriteCreator,
        Stamp: StampCreator,
        StaticBitmapText: BitmapTextCreator,
        Text: TextCreator,
        TileSprite: TileSpriteCreator,
        Zone: ZoneCreator,
        Video: VideoCreator
    }

};

//  WebGL only Game Objects
if (typeof WEBGL_RENDERER)
{
    GameObjects.CaptureFrame = CaptureFrame;
    GameObjects.Shader = Shader;
    GameObjects.NineSlice = NineSlice;
    GameObjects.PointLight = PointLight;
    GameObjects.SpriteGPULayer = SpriteGPULayer;

    GameObjects.Factories.CaptureFrame = CaptureFrameFactory;
    GameObjects.Factories.Shader = ShaderFactory;
    GameObjects.Factories.NineSlice = NineSliceFactory;
    GameObjects.Factories.PointLight = PointLightFactory;
    GameObjects.Factories.SpriteGPULayer = SpriteGPULayerFactory;

    GameObjects.Creators.CaptureFrame = CaptureFrameCreator;
    GameObjects.Creators.Shader = ShaderCreator;
    GameObjects.Creators.NineSlice = NineSliceCreator;
    GameObjects.Creators.PointLight = PointLightCreator;
    GameObjects.Creators.SpriteGPULayer = SpriteGPULayerCreator;

    GameObjects.Light = Light;
    GameObjects.LightsManager = LightsManager;
    GameObjects.LightsPlugin = LightsPlugin;
}

module.exports = GameObjects;
