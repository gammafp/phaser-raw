/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.GameObjects
 */

import { Image } from './image/Image';
import './image/ImageFactory';
import './image/ImageCreator';

import { Sprite } from './sprite/Sprite';
import './sprite/SpriteFactory';
import './sprite/SpriteCreator';

import { Text } from './text/Text';
import { TextStyle } from './text/TextStyle';
import { GetTextSize } from './text/GetTextSize';
import { MeasureText } from './text/MeasureText';
import './text/TextFactory';
import './text/TextCreator';

import { DisplayList } from './DisplayList';
import { Layer } from './layer/Layer';
import { UpdateList } from './UpdateList';
import { GameObject } from './GameObject';
import { BuildGameObject } from './BuildGameObject';
import { GameObjectCreator } from './GameObjectCreator';
import { GameObjectFactory } from './GameObjectFactory';
import { GetCalcMatrix } from './GetCalcMatrix';
import { PathFollower } from './pathfollower/PathFollower';
import './pathfollower/PathFollowerFactory';
import { Zone } from './zone/Zone';
import './zone/ZoneFactory';
import './zone/ZoneCreator';
import { Mesh } from './mesh/Mesh';
import * as MeshFactory from './mesh/MeshFactory';
import * as MeshCreator from './mesh/MeshCreator';
import { PointLight } from './pointlight/PointLight';
import * as PointLightFactory from './pointlight/PointLightFactory';
import * as PointLightCreator from './pointlight/PointLightCreator';
import { Extern } from './extern/Extern';
import * as ExternFactory from './extern/ExternFactory';
import { Blitter } from './blitter/Blitter';
import * as BlitterFactory from './blitter/BlitterFactory';
import * as BlitterCreator from './blitter/BlitterCreator';
import { Bob } from './blitter/Bob';
import { Container } from './container/Container';
import * as ContainerFactory from './container/ContainerFactory';
import * as ContainerCreator from './container/ContainerCreator';
import { DOMElement } from './domelement/DOMElement';
import * as DOMElementFactory from './domelement/DOMElementFactory';
import { Graphics } from './graphics/Graphics';
import * as GraphicsFactory from './graphics/GraphicsFactory';
import * as GraphicsCreator from './graphics/GraphicsCreator';
import { Group } from './group/Group';
import * as GroupFactory from './group/GroupFactory';
import * as GroupCreator from './group/GroupCreator';
// import { NineSlice } from './nineslice/NineSlice';
// import * as NineSliceFactory from './nineslice/NineSliceFactory';
// import * as NineSliceCreator from './nineslice/NineSliceCreator';
import { Plane } from './plane/Plane';
import * as PlaneFactory from './plane/PlaneFactory';
import * as PlaneCreator from './plane/PlaneCreator';
import { RenderTexture } from './rendertexture/RenderTexture';
import * as RenderTextureFactory from './rendertexture/RenderTextureFactory';
import * as RenderTextureCreator from './rendertexture/RenderTextureCreator';
// import { Rope } from './rope/Rope';
// import * as RopeFactory from './rope/RopeFactory';
// import * as RopeCreator from './rope/RopeCreator';
import { Shader } from './shader/Shader';
import * as ShaderFactory from './shader/ShaderFactory';
import * as ShaderCreator from './shader/ShaderCreator';
import { TileSprite } from './tilesprite/TileSprite';
import * as TileSpriteFactory from './tilesprite/TileSpriteFactory';
import * as TileSpriteCreator from './tilesprite/TileSpriteCreator';
import { Video } from './video/Video';
import * as VideoFactory from './video/VideoFactory';
import * as VideoCreator from './video/VideoCreator';
import { BitmapText } from './bitmaptext/static/BitmapText';
import * as BitmapTextFactory from './bitmaptext/static/BitmapTextFactory';
import * as BitmapTextCreator from './bitmaptext/static/BitmapTextCreator';
import { DynamicBitmapText } from './bitmaptext/dynamic/DynamicBitmapText';
import * as DynamicBitmapTextFactory from './bitmaptext/dynamic/DynamicBitmapTextFactory';
import * as DynamicBitmapTextCreator from './bitmaptext/dynamic/DynamicBitmapTextCreator';
import { RetroFont } from './bitmaptext/RetroFont';
import * as Particles from './particles';
import * as ParticleEmitterFactory from './particles/ParticleEmitterFactory';
import * as ParticleEmitterCreator from './particles/ParticleEmitterCreator';

var GameObjects = {

    Events: require('./events'),

    DisplayList: DisplayList,
    GameObjectCreator: GameObjectCreator,
    GameObjectFactory: GameObjectFactory,
    UpdateList: UpdateList,

    Components: require('./components'),
    GetCalcMatrix: GetCalcMatrix,

    BuildGameObject: BuildGameObject,
    BuildGameObjectAnimation: require('./BuildGameObjectAnimation'),
    GameObject: GameObject,
    BitmapText: BitmapText,
    Blitter: Blitter,
    Bob: Bob,
    Container: Container,
    DOMElement: DOMElement,
    DynamicBitmapText: DynamicBitmapText,
    Extern: Extern,
    Graphics: Graphics,
    Group: Group,
    Image: Image,
    Layer: Layer,
    Particles: Particles,
    PathFollower: PathFollower,
    RenderTexture: RenderTexture,
    RetroFont: RetroFont,
    // Rope: Rope, // COMENTADO - Problema de inicialización con Mixin
    Sprite: Sprite,

    Text: Text,
    GetTextSize: GetTextSize,
    MeasureText: MeasureText,
    TextStyle: TextStyle,

    TileSprite: TileSprite,
    Zone: Zone,
    Video: Video,

    //  Shapes (COMENTADOS - Usan Class.js que no es compatible con GameObject.ts)
    // Shape: require('./shape/Shape'),
    // Arc: require('./shape/arc/Arc'),
    // Curve: require('./shape/curve/Curve'),
    // Ellipse: require('./shape/ellipse/Ellipse'),
    // Grid: require('./shape/grid/Grid'),
    // IsoBox: require('./shape/isobox/IsoBox'),
    // IsoTriangle: require('./shape/isotriangle/IsoTriangle'),
    // Line: require('./shape/line/Line'),
    // Polygon: require('./shape/polygon/Polygon'),
    // Rectangle: require('./shape/rectangle/Rectangle'),
    // Star: require('./shape/star/Star'),
    // Triangle: require('./shape/triangle/Triangle'),

    //  Game Object Factories

    Factories: {
        Blitter: BlitterFactory,
        Container: ContainerFactory,
        DOMElement: DOMElementFactory,
        DynamicBitmapText: DynamicBitmapTextFactory,
        Extern: ExternFactory,
        Graphics: GraphicsFactory,
        Group: GroupFactory,
        Image,
        Layer: require('./layer/LayerFactory'),
        Particles: ParticleEmitterFactory,
        PathFollower: PathFollower,
        RenderTexture: RenderTextureFactory,
        // Rope: RopeFactory,
        Sprite: function () {},
        StaticBitmapText: BitmapTextFactory,
        Text: function () {},
        TileSprite: TileSpriteFactory,
        Zone: Zone,
        Video: VideoFactory,

        //  Shapes (COMENTADOS - Usan Class.js)
        // Arc: require('./shape/arc/ArcFactory'),
        // Curve: require('./shape/curve/CurveFactory'),
        // Ellipse: require('./shape/ellipse/EllipseFactory'),
        // Grid: require('./shape/grid/GridFactory'),
        // IsoBox: require('./shape/isobox/IsoBoxFactory'),
        // IsoTriangle: require('./shape/isotriangle/IsoTriangleFactory'),
        // Line: require('./shape/line/LineFactory'),
        // Polygon: require('./shape/polygon/PolygonFactory'),
        // Rectangle: require('./shape/rectangle/RectangleFactory'),
        // Star: require('./shape/star/StarFactory'),
        // Triangle: require('./shape/triangle/TriangleFactory')
    },

    Creators: {
        Blitter: BlitterCreator,
        Container: ContainerCreator,
        DynamicBitmapText: DynamicBitmapTextCreator,
        Graphics: GraphicsCreator,
        Group: GroupCreator,
        Image,
        Layer: require('./layer/LayerCreator'),
        Particles: ParticleEmitterCreator,
        RenderTexture: RenderTextureCreator,
        // Rope: RopeCreator,
        Sprite: function () {},
        StaticBitmapText: BitmapTextCreator,
        Text: function () {},
        TileSprite: TileSpriteCreator,
        Zone: Zone,
        Video: VideoCreator
    }

};

//  WebGL only Game Objects
if (typeof WEBGL_RENDERER)
{
    GameObjects.Shader = Shader;
    GameObjects.Mesh = Mesh;
    // GameObjects.NineSlice = NineSlice; // COMENTADO - Problema de inicialización con Mixin
    GameObjects.PointLight = PointLight;
    GameObjects.Plane = Plane;

    GameObjects.Factories.Shader = ShaderFactory;
    GameObjects.Factories.Mesh = MeshFactory;
    // GameObjects.Factories.NineSlice = NineSliceFactory;
    GameObjects.Factories.PointLight = PointLightFactory;
    GameObjects.Factories.Plane = PlaneFactory;

    GameObjects.Creators.Shader = ShaderCreator;
    GameObjects.Creators.Mesh = MeshCreator;
    // GameObjects.Creators.NineSlice = NineSliceCreator;
    GameObjects.Creators.PointLight = PointLightCreator;
    GameObjects.Creators.Plane = PlaneCreator;

    GameObjects.Light = require('./lights/Light');
    GameObjects.LightsManager = require('./lights/LightsManager');
    GameObjects.LightsPlugin = require('./lights/LightsPlugin');
}

module.exports = GameObjects;
