import { Scene } from 'phaser'
import Player from '../player/Player'
import Basket from '../basket/Basket'
class MainGameScene extends Scene {
    private player: Player
    private basket: Basket
    constructor() {
        super({
            key: 'MainGameScene',
        })
    }
    init(): void {}
    preload(): void {
        this.load.image('sky', 'assets/sky.png')
        this.load.image('ground', 'assets/platform.png')
        this.load.image('ball', 'assets/balls/babyface.png')
        this.load.image('basketball', 'assets/balls/basketball.png')
        this.load.image('rim01', 'assets/baskets/rim01.png')
        this.load.image('net01', 'assets/baskets/net01.png')
    }
    create(): void {
        const sky = this.add.image(0, 0, 'sky').setOrigin(0)
        sky.setDisplaySize(window.innerWidth, window.innerHeight)
        this.player = new Player({
            scene: this,
            x: 500,
            y: 250,
            texture: 'ball',
        })
        this.basket = new Basket({
            scene: this,
            x: 600,
            y: 300,
            texture: 'net01',
        })

        this.physics.add.collider(this.player, this.basket)
    }
    update(): void {
        this.player.update()
    }
    // preload() {
    //
    //     this.load.spritesheet('dude', 'assets/dude.png', {
    //         frameWidth: 32,
    //         frameHeight: 48,
    //     })
    // }
    // create() {
    //     const sky = this.add.image(0, 0, 'sky').setOrigin(0)
    //     sky.setDisplaySize(window.innerWidth, window.innerHeight)

    //     const platforms = this.physics.add.staticGroup()

    //     platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    //     platforms.create(600, 400, 'ground')
    //     platforms.create(50, 250, 'ground')
    //     platforms.create(750, 220, 'ground')

    //     this.player = this.physics.add.sprite(100, 450, 'dude')
    //     this.player.setBounce(0.2)
    //     this.player.setCollideWorldBounds(true)

    //     this.anims.create({
    //         key: 'left',
    //         frames: this.anims.generateFrameNumbers('dude', {
    //             start: 0,
    //             end: 3,
    //         }),
    //         frameRate: 10,
    //         repeat: -1,
    //     })

    //     this.anims.create({
    //         key: 'turn',
    //         frames: [{ key: 'dude', frame: 4 }],
    //         frameRate: 20,
    //     })

    //     this.anims.create({
    //         key: 'right',
    //         frames: this.anims.generateFrameNumbers('dude', {
    //             start: 5,
    //             end: 8,
    //         }),
    //         frameRate: 10,
    //         repeat: -1,
    //     })
    //     this.player.setGravityY(200)
    //     this.physics.add.collider(this.player, platforms)

    //     const stars = this.physics.add.group({
    //         key:'star',
    //         repeat: 11,
    //         setXY:{x:12, y: 0, stepX: 70}
    //     })
    //     stars.children.iterate((child)=>
    //         child.(Phaser.Math.FloatBetween(0.4, 0.8))
    //     )
    //     this.physics.add.collider(stars, platforms)
    //     this.physics.add.overlap(this.player, stars, collectStar, null, this)

    // }
    // private collectStar(player, star: ){
    //     star.d
    // }
    // update() {
    //     const cursors = this.input.keyboard?.createCursorKeys()
    //     if (cursors?.left.isDown) {
    //         this.player.setVelocityX(-160)
    //         this.player.anims.play('left', true)
    //     } else if (cursors?.right.isDown) {
    //         this.player.setVelocityX(160)
    //         this.player.anims.play('right', true)
    //     } else {
    //         this.player.setVelocityX(0)
    //         this.player.anims.play('turn')
    //     }
    //     if (cursors?.up.isDown && this.player.body.touching.down) {
    //         this.player.setVelocityY(-360)
    //     }
    // }
}
export default MainGameScene
