import { Scene } from 'phaser'
import Ball from '../player/Ball'
import Basket from '../basket/Basket'
import EmptyColliderGameObject from '../basket/EmptyColliderGameObject'
class MainGameScene extends Scene {
    private ball: Ball
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
        this.load.image('rim02', 'assets/baskets/rim02.png')
        this.load.image('net01', 'assets/baskets/net01.png')
    }
    create(): void {
        const sky = this.add.image(0, 0, 'sky').setOrigin(0)
        sky.setDisplaySize(window.innerWidth, window.innerHeight)
        this.ball = new Ball({
            scene: this,
            x: 300,
            y: 250,
            texture: 'basketball',
        })
        this.basket = new Basket({
            scene: this,
            x: 300,
            y: 400,
        })
        this.physics.add.collider(
            this.ball,
            this.basket.getColliders(),
            this.ballHitBasket,
            undefined
        )

        this.basket = new Basket({
            scene: this,
            x: 700,
            y: 200,
        })

        this.physics.add.collider(
            this.ball,
            this.basket.getColliders(),
            this.ballHitBasket,
            undefined
        )
    }
    update(delta: number): void {
        this.basket.updateRimPosition(delta)
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
