import { Scene } from 'phaser'
import Ball from '../player/Ball'
import BasketManager from '../basket/BasketManager'
import TrajectoryPath from '../trajectory/TrajectoryPath'
import MainMenuUI from '../ui/MainMenuUI'
import MainGameUI from '../ui/MainGameUI'
class MainGameScene extends Scene {
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera
    private preBallPosY: number
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
    preload(): void {}
    create(): void {
        new TrajectoryPath(this, 20)
        const menu = new MainMenuUI(this, 0, 0)
        const gameUI = new MainGameUI(this, 0, 0)
        gameUI.setVisible(false)
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
        menu.setFingerPosition(this.ball.x - 100, this.ball.y + 200)

        this.input.once('pointerdown', () => {
            if (menu.getStateMenu()) {
                menu.toggleMenu(false)
                gameUI.setVisible(true)
            }
        })
    }
    update(time: number, delta: number): void {
        this.basketManager.update(delta)
        const maxDownBorder = this.camera.scrollY + this.camera.height - 150
        if (!this.ball.parentContainer) {
            const maxUpBorder = this.camera.scrollY + this.camera.height / 2

            if (this.ball.y < maxUpBorder) {
                this.camera.scrollY -= 200 * (delta / 1000)
            } else if (this.ball.y > maxDownBorder) {
                this.camera.scrollY += 200 * (delta / 1000)
            }
            this.preBallPosY = this.ball.y
        } else {
            if (this.preBallPosY > maxDownBorder) {
                this.camera.scrollY += 200 * (delta / 1000)
            }
        }
    }
}
export default MainGameScene
