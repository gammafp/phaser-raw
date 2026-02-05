import Phaser from '../../phaser/src/phaser';
// import * as Phaser from 'phaser';
    
export class Start extends Phaser.Scene {

    background!: Phaser.GameObjects.TileSprite;
    logo!: Phaser.GameObjects.Image;
    ship!: Phaser.GameObjects.Sprite;
    bitmapText!: Phaser.GameObjects.BitmapText;

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });

        this.load.audio('music', 'assets/banjo.mp3');

        // ============================================================
        // EJEMPLO FUNCIONAL: Crear fuente bitmap desde el logo
        // ============================================================
        // Usaremos la imagen del logo de Phaser para crear una fuente RetroFont
        // que genera caracteres bitmap de forma programática
    }

    create() {
        // const music = this.sound.add('music');
        // music.play();

        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const logo = this.add.image(640, 200, 'logo');

        // Test Lights - iluminación 2D
        this.lights.enable();
        this.lights.setAmbientColor(0xff0000);
        
        logo.setPipeline('Light2D');

        // Luz que sigue al puntero
        const light = this.lights.addLight(640, 360, 300, 0x0000ff, 2);
        
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            light.x = pointer.x;
            light.y = pointer.y;
        });

        this.tweens.add({
            targets: logo,
            y: 400,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });

        // ============================================================
        // EJEMPLO: BitmapText (COMENTADO - Requiere conversión completa)
        // ============================================================
        // BitmapText.js tiene problemas con instanceof porque usa require()
        // para componentes TypeScript. Requiere convertir BitmapText a TypeScript.
        
        // const textureKey = 'retroFont';
        // const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        // const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!?.,: ';
        // ... código de RetroFont ...
        // this.bitmapText = this.add.bitmapText(640, 550, 'retroFont', 'HELLO', 16);

        // ============================================================
        // EJEMPLO: PathFollower - Objeto que sigue un camino
        // ============================================================
        
        // Crear un path (camino) con curvas
        const path = this.add.path(100, 300);
        
        // Añadir segmentos al path
        path.lineTo(300, 300);
        path.lineTo(300, 500);
        path.lineTo(500, 500);
        path.lineTo(500, 300);
        path.lineTo(700, 300);
        path.lineTo(700, 500);
        path.lineTo(900, 500);
        path.lineTo(900, 300);
        path.lineTo(1100, 300);
        
        // Crear un PathFollower (sprite que sigue el path)
        const follower = this.add.follower(path, 100, 300, 'logo');
        follower.setScale(0.3);
        
        // Hacer que el follower siga el path
        follower.startFollow({
            duration: 8000,        // Duración en milisegundos
            repeat: -1,            // Repetir infinitamente
            rotateToPath: true,    // Rotar el sprite según la dirección del path
            yoyo: false            // No volver hacia atrás
        });
        
        // EJEMPLO 2: PathFollower con curvas suaves
        const curvedPath = this.add.path(640, 100);
        curvedPath.splineTo([
            { x: 740, y: 200 },
            { x: 640, y: 300 },
            { x: 540, y: 200 },
            { x: 640, y: 100 }
        ]);
        
        const curvedFollower = this.add.follower(curvedPath, 640, 100, 'logo');
        curvedFollower.setScale(0.2).setTint(0xff00ff);
        
        curvedFollower.startFollow({
            duration: 3000,
            repeat: -1,
            rotateToPath: false
        });
    
    }

    update() {
        this.background.tilePositionX += 2;
    }
    
}
