import { Scene } from 'phaser'
import Ball from '../player/Ball'
import BasketManager from '../basket/BasketManager'
import TrajectoryPath from '../trajectory/TrajectoryPath'
import MainMenuUI from '../ui/MainMenuUI'
import MainGameUI from '../ui/MainGameUI'
import OverGameUI from '../ui/OverGameUI'
import ScoreCalculator from '../player/ScoreCalculator'
import Basket from '../basket/Basket'
class MainGameScene extends Scene {
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera
    private preBallPosY: number
    private menu: MainMenuUI
    private overGameUI: OverGameUI
    private gameUI: MainGameUI
    private scoreCalculator: ScoreCalculator
    private isOver: boolean
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
        this.scoreCalculator = new ScoreCalculator()
    }
    preload(): void {}
    create(): void {
        new TrajectoryPath(this, 20)
        this.menu = new MainMenuUI(this, 0, 0)
        this.gameUI = new MainGameUI(this, 0, 0)
        this.overGameUI = new OverGameUI(this, 0, 0)
        this.gameUI.setVisible(false)
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
        this.camera = this.cameras.main
        this.basketManager.setBall(this.ball)
        const basket = this.basketManager.createBasket()
        this.ball.x = basket.x

        this.menu.setFingerPosition(this.ball.x - 100, this.ball.y + 200)
        this.overGameUI.addHitPlayAgainListener(() => {
            this.restartGame()
        })
        this.setUpEvents()
    }
    update(time: number, delta: number): void {
        if (this.isOver) {
            return
        }
        this.basketManager.update(delta)
        const maxDownBorder = this.camera.scrollY + this.camera.height - 150
        if (!this.ball.parentContainer) {
            if (this.ball.y > this.camera.scrollY + this.camera.height + 100) {
                this.ball.toggleBall(false)
                this.overGameUI.toggleUI(true)
                this.basketManager.toggleInteractive(false)
                this.scoreCalculator.saveHighScore()
                this.overGameUI.setHighScoreText(
                    this.scoreCalculator.getHighScore()
                )
                this.isOver = true
            } else {
                const maxUpBorder = this.camera.scrollY + this.camera.height / 2

                if (this.ball.y < maxUpBorder) {
                    this.camera.scrollY -= 200 * (delta / 1000)
                } else if (this.ball.y > maxDownBorder) {
                    this.camera.scrollY += 200 * (delta / 1000)
                }
                this.preBallPosY = this.ball.y
            }
        } else {
            if (this.preBallPosY > maxDownBorder) {
                this.camera.scrollY += 200 * (delta / 1000)
            }
        }
    }
    private setUpEvents(): void {
        this.input.once('pointerdown', () => {
            if (this.menu.getStateMenu()) {
                this.menu.toggleMenu(false)
                this.gameUI.setVisible(true)
            }
        })
        Basket.eventEmitter.on('balladded', (amount: number) => {
            this.addScore(amount)
        })
    }
    private restartGame(): void {
        this.camera.scrollY = 0
        this.basketManager.reset()
        this.basketManager.toggleInteractive(true)
        const basket = this.basketManager.createBasket()
        this.ball.x = basket.x
        this.ball.y = 250
        this.ball.toggleBall(true)
        this.ball.body.setVelocity(0, 0)
        this.menu.setFingerPosition(this.ball.x - 100, this.ball.y + 200)
        this.overGameUI.toggleUI(false)
        this.addScore(-this.scoreCalculator.getCurrentScore())
        this.isOver = false
    }
    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.gameUI.setScoreText(this.scoreCalculator.getCurrentScore())
    }
}
export default MainGameScene
