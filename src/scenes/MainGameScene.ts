import { Scene } from 'phaser'
import Ball from '../player/Ball'
import BasketManager from '../basket/BasketManager'
class MainGameScene extends Scene {
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera
    constructor() {
        super({
            key: 'MainGameScene',
        })
    }
    init(): void {
        this.basketManager = new BasketManager(
            this,
            window.innerWidth / 2,
            window.innerHeight
        )
    }
    preload(): void {
        this.load.image('sky', 'assets/sky.png')
        this.load.image('bg', 'assets/bgs/bg4.png')
        this.load.image('bgbricks', 'assets/bgs/bgWithBricks.png')
        this.load.image('ground', 'assets/platform.png')
        this.load.image('ball', 'assets/balls/babyface.png')
        this.load.image('basketball', 'assets/balls/basketball.png')
        this.load.image('rim01', 'assets/baskets/rim01.png')
        this.load.image('rim02', 'assets/baskets/rim02.png')
        this.load.image('net01', 'assets/baskets/net01.png')
    }
    create(): void {
        // const sky = this.add.image(0, 0, 'sky').setOrigin(0)
        // sky.setDisplaySize(window.innerWidth, window.innerHeight)
        // // sky.setDepth(3)
        this.physics.world.setBounds(
            0,
            0,
            window.innerWidth / 2,
            0,
            true,
            true,
            false,
            false
        )
        const mainGameBackground = this.add.image(0, 0, 'bg').setOrigin(0)
        mainGameBackground.setDisplaySize(
            window.innerWidth / 2,
            window.innerHeight
        )
        mainGameBackground.setScrollFactor(0, 0)
        // mainGameBackground.setDepth(4)
        const bricks = this.add.image(0, 0, 'bgbricks').setOrigin(0)
        bricks.setDisplaySize(window.innerWidth / 2, window.innerHeight)
        bricks.setScrollFactor(0, 0)
        // bricks.setDepth(4)

        this.ball = new Ball({
            scene: this,
            x: 200,
            y: 250,
            texture: 'basketball',
        })
        this.basketManager.setBall(this.ball)
        const basket = this.basketManager.createBasket()
        this.ball.x = basket.x
        this.camera = this.cameras.main
    }
    update(time: number, delta: number): void {
        this.basketManager.update(delta)

        if (!this.ball.parentContainer) {
            const maxUpBorder =
                this.camera.scrollY + this.camera.height / 2 - 100
            if (this.ball.y < maxUpBorder) {
                this.camera.scrollY -= 200 * (delta / 1000)
            }
            const maxDownBorder = this.camera.scrollY + this.camera.height - 150
            if (this.ball.y > maxDownBorder) {
                this.camera.scrollY += 500 * (delta / 1000)
            }
        }
    }
}
export default MainGameScene
