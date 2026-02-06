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

        // ============================================================
        // EJEMPLO: Zone - Áreas invisibles para detección
        // ============================================================
        
        // EJEMPLO 1: Zone rectangular para drag & drop
        const dropZone = this.add.zone(400, 300, 200, 150);
        dropZone.setRectangleDropZone(200, 150);
        
        // Visual debug de la zona
        const dropGraphics = this.add.graphics();
        dropGraphics.lineStyle(2, 0x00ff00);
        dropGraphics.strokeRect(300, 225, 200, 150);
        
        const dropText = this.add.text(400, 300, 'Drop Zone\n(Rectangle)', { 
            fontSize: '14px', 
            color: '#00ff00',
            align: 'center'
        }).setOrigin(0.5);
        
        // EJEMPLO 2: Zone con interacción (hover)
        const interactiveZone = this.add.zone(900, 300, 150, 150)
            .setInteractive();
        
        // Visual debug
        const zoneGraphics = this.add.graphics();
        zoneGraphics.lineStyle(2, 0xff0000);
        zoneGraphics.strokeRect(825, 225, 150, 150);
        
        const zoneText = this.add.text(900, 300, 'Hover me!', { 
            fontSize: '16px', 
            color: '#ffffff' 
        }).setOrigin(0.5);
        
        interactiveZone.on('pointerover', () => {
            zoneGraphics.clear();
            zoneGraphics.lineStyle(2, 0x00ff00);
            zoneGraphics.fillStyle(0x00ff00, 0.2);
            zoneGraphics.fillRect(825, 225, 150, 150);
            zoneGraphics.strokeRect(825, 225, 150, 150);
            zoneText.setText('Inside!');
        });
        
        interactiveZone.on('pointerout', () => {
            zoneGraphics.clear();
            zoneGraphics.lineStyle(2, 0xff0000);
            zoneGraphics.strokeRect(825, 225, 150, 150);
            zoneText.setText('Hover me!');
        });
        
        interactiveZone.on('pointerdown', () => {
            zoneText.setText('Clicked!');
        });
        
        // EJEMPLO 3: Zone circular para drag & drop
        const circularZone = this.add.zone(1100, 500, 100, 100);
        circularZone.setCircleDropZone(50);
        
        // Visual debug círculo
        const circleGraphics = this.add.graphics();
        circleGraphics.lineStyle(2, 0x0000ff);
        circleGraphics.strokeCircle(1100, 500, 50);
        
        const circleText = this.add.text(1100, 500, 'Drop Zone\n(Circle)', { 
            fontSize: '14px', 
            color: '#0000ff',
            align: 'center'
        }).setOrigin(0.5);
        
        // ============================================================
        // EJEMPLO 4: Objetos arrastrables para las drop zones
        // ============================================================
        
        // Crear sprites arrastrables
        const draggable1 = this.add.image(200, 500, 'logo').setScale(0.15);
        const draggable2 = this.add.image(250, 500, 'logo').setScale(0.15).setTint(0xff0000);
        const draggable3 = this.add.image(300, 500, 'logo').setScale(0.15).setTint(0x00ff00);
        
        // Hacer que sean arrastrables
        draggable1.setInteractive({ draggable: true });
        draggable2.setInteractive({ draggable: true });
        draggable3.setInteractive({ draggable: true });
        
        // Texto de instrucciones
        this.add.text(250, 450, 'Arrastra los logos a las zonas!', { 
            fontSize: '16px', 
            color: '#ffffff' 
        }).setOrigin(0.5);
        
        // Eventos de drag
        this.input.on('dragstart', (pointer: any, gameObject: any) => {
            gameObject.setTint(0xffff00); // Amarillo al arrastrar
        });
        
        this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('dragend', (pointer: any, gameObject: any) => {
            // Restaurar tint original
            if (gameObject === draggable1) gameObject.setTint(0xffffff);
            if (gameObject === draggable2) gameObject.setTint(0xff0000);
            if (gameObject === draggable3) gameObject.setTint(0x00ff00);
        });
        
        // Evento cuando se suelta en una drop zone
        this.input.on('drop', (pointer: any, gameObject: any, dropZone: any) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            
            // Feedback visual
            if (dropZone === dropZone) {
                dropGraphics.clear();
                dropGraphics.lineStyle(2, 0x00ff00);
                dropGraphics.fillStyle(0x00ff00, 0.3);
                dropGraphics.fillRect(300, 225, 200, 150);
                dropGraphics.strokeRect(300, 225, 200, 150);
                dropText.setText('Drop Zone\n✓ Dropped!');
                
                this.time.delayedCall(1000, () => {
                    dropGraphics.clear();
                    dropGraphics.lineStyle(2, 0x00ff00);
                    dropGraphics.strokeRect(300, 225, 200, 150);
                    dropText.setText('Drop Zone\n(Rectangle)');
                });
            }
            
            if (dropZone === circularZone) {
                circleGraphics.clear();
                circleGraphics.lineStyle(2, 0x0000ff);
                circleGraphics.fillStyle(0x0000ff, 0.3);
                circleGraphics.fillCircle(1100, 500, 50);
                circleGraphics.strokeCircle(1100, 500, 50);
                circleText.setText('Drop Zone\n✓ Dropped!');
                
                this.time.delayedCall(1000, () => {
                    circleGraphics.clear();
                    circleGraphics.lineStyle(2, 0x0000ff);
                    circleGraphics.strokeCircle(1100, 500, 50);
                    circleText.setText('Drop Zone\n(Circle)');
                });
            }
        });
        
        // NOTA: Zone es útil para:
        // - Áreas de drop (drag and drop) ✓
        // - Trigger zones (detectar cuando el jugador entra/sale) ✓
        // - Áreas de interacción sin sprite visible ✓
        // - Optimización (no renderiza, solo lógica) ✓

        // ============================================================
        // EJEMPLO: PointLight - Luces rápidas sin shader costoso
        // ============================================================
        
        // EJEMPLO 1: PointLight básico estático
        const pointLight1 = this.add.pointlight(200, 600, 0xffffff, 128, 1, 0.1);
        
        // EJEMPLO 2: PointLight de color con mayor intensidad
        const pointLight2 = this.add.pointlight(400, 600, 0xff0000, 150, 2, 0.05);
        
        // EJEMPLO 3: PointLight animado (parpadeando)
        const flickeringLight = this.add.pointlight(600, 600, 0xffaa00, 100, 1.5, 0.1);
        
        this.tweens.add({
            targets: flickeringLight,
            intensity: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
        
        // EJEMPLO 4: PointLight que sigue al cursor
        const cursorLight = this.add.pointlight(0, 0, 0x00ffff, 200, 2, 0.08);
        
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            cursorLight.x = pointer.x;
            cursorLight.y = pointer.y;
        });
        
        // EJEMPLO 5: PointLight animado moviéndose
        const movingLight = this.add.pointlight(800, 600, 0xff00ff, 120, 1.8, 0.1);
        
        this.tweens.add({
            targets: movingLight,
            x: 1000,
            y: 400,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
        
        // EJEMPLO 6: PointLight con cambio de color
        const colorLight = this.add.pointlight(1000, 600, 0xff0000, 130, 1.5, 0.1);
        
        let colorIndex = 0;
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                colorIndex = (colorIndex + 1) % colors.length;
                // colorLight.setColor(colors[colorIndex]);
            },
            loop: true
        });
        
        // Texto informativo
        this.add.text(640, 650, 'PointLights: Estático | Rojo | Parpadeante | Cursor | Móvil | Color cambiante', {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // NOTA: PointLight es ideal para:
        // - Efectos rápidos de luz sin shaders costosos ✓
        // - Antorchas parpadeantes, disparos, explosiones ✓
        // - Mejor rendimiento que Light normal ✓
        // - No afecta otros GameObjects (solo efecto visual) ✓
    
    }

    update() {
        this.background.tilePositionX += 2;
    }
    
}
