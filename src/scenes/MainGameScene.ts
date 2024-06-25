import { Scene } from 'phaser'
import Ball from '../player/Ball'
import Basket from '../basket/Basket'
import EmptyColliderGameObject from '../basket/EmptyColliderGameObject'
class MainGameScene extends Scene {
    private ball: Ball
    private baskets: Basket[]
    private camera: Phaser.Cameras.Scene2D.Camera
    constructor() {
        super({
            key: 'MainGameScene',
        })
    }
    init(): void {
        this.baskets = []
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

        const mainGameBackground = this.add
            .image(window.innerWidth / 4, 0, 'bg')
            .setOrigin(0)
        mainGameBackground.setDisplaySize(
            window.innerWidth / 2,
            window.innerHeight
        )
        // mainGameBackground.setDepth(4)
        const bricks = this.add
            .image(window.innerWidth / 4, 0, 'bgbricks')
            .setOrigin(0)
        bricks.setDisplaySize(window.innerWidth / 2, window.innerHeight)
        // bricks.setDepth(4)

        this.ball = new Ball({
            scene: this,
            x: 400,
            y: 250,
            texture: 'basketball',
        })

        this.baskets.push(
            new Basket({
                scene: this,
                x: 400,
                y: 400,
            })
        )
        this.physics.add.collider(
            this.ball,
            this.baskets[0].getColliders(),
            this.ballHitBasket,
            undefined
        )

        this.baskets.push(
            new Basket({
                scene: this,
                x: 700,
                y: 200,
            })
        )

        this.physics.add.collider(
            this.ball,
            this.baskets[1].getColliders(),
            this.ballHitBasket,
            undefined
        )
        this.camera = this.cameras.main
    }
    update(time: number, delta: number): void {
        console.log(this.ball.parentContainer)
        this.baskets.forEach((basket) => {
            basket.update(delta / 1000)
            if (!this.ball.parentContainer) {
                const distance = Phaser.Math.Distance.Between(
                    this.ball.x,
                    this.ball.y,
                    basket.x,
                    basket.y
                )
                if (distance > 100) {
                    basket.toggleAllColliders(true)
                }
            }
        })
        if (this.ball.parentContainer) {
        } else {
            if (this.ball.y < this.camera.scrollY + this.camera.height / 2) {
                this.camera.scrollY =
                    (this.ball.y - this.camera.height / 2) * 50 * (delta / 1000)
            }
        }
    }

    private ballHitBasket(ball: Ball, other: EmptyColliderGameObject): void {
        if (!other.getIsCenter()) {
            return
        }
        const gameObj = other.parentContainer
        if (gameObj instanceof Basket) {
            gameObj.addBall(ball)
        }
    }
}
export default MainGameScene
