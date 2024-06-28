import { Scene } from 'phaser'
import Ball from '../player/Ball'
import BasketManager from '../basket/BasketManager'
import MainMenuUI from '../ui/MainMenuUI'
import OverGameUI from '../ui/OverGameUI'
import MainGameUI from '../ui/MainGameUI'
import ScoreCalculator from '../player/ScoreCalculator'
import TrajectoryPath from '../trajectory/TrajectoryPath'
import Basket from '../basket/Basket'

class GameController {
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera
    private preBallPosY: number
    private menu: MainMenuUI
    private overGameUI: OverGameUI
    private gameUI: MainGameUI
    private scoreCalculator: ScoreCalculator
    private isOver: boolean

    private scene: Scene
    constructor(scene: Scene) {
        this.scene = scene
    }

    public initialize(): void {
        this.basketManager = new BasketManager(
            this.scene,
            window.innerWidth / 2,
            window.innerHeight
        )
        this.scoreCalculator = new ScoreCalculator()
        this.create()
    }
    private create(): void {
        new TrajectoryPath(this.scene, 20)
        this.menu = new MainMenuUI(this.scene, 0, 0)
        this.gameUI = new MainGameUI(this.scene, 0, 0)
        this.overGameUI = new OverGameUI(this.scene, 0, 0)
        this.gameUI.setVisible(false)
        this.scene.physics.world.setBounds(
            0,
            0,
            window.innerWidth / 2,
            0,
            true,
            true,
            false,
            false
        )

        this.ball = new Ball({
            scene: this.scene,
            x: 200,
            y: 250,
            texture: 'basketball',
        })
        this.camera = this.scene.cameras.main
        this.basketManager.setBall(this.ball)
        const basket = this.basketManager.createBasket()
        this.ball.x = basket.x

        this.menu.setFingerPosition(this.ball.x - 100, this.ball.y + 200)
        this.overGameUI.addHitPlayAgainListener(() => {
            this.restartGame()
        })
        this.setUpEvents()
    }
    update(delta: number): void {
        this.ball.update()
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
                    this.camera.scrollY -= 200 * delta
                } else if (this.ball.y > maxDownBorder) {
                    this.camera.scrollY += 200 * delta
                }
                this.preBallPosY = this.ball.y
            }
        } else {
            if (this.preBallPosY > maxDownBorder) {
                this.camera.scrollY += 200 * delta
            }
        }
    }
    private setUpEvents(): void {
        this.scene.input.once('pointerdown', () => {
            if (this.menu.getStateMenu()) {
                this.menu.toggleMenu(false)
                this.gameUI.setVisible(true)
            }
        })
        Basket.eventEmitter.on('balladded', (amount: number) => {
            this.addScore(amount)
        })
    }
    public restartGame(): void {
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
    public addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.gameUI.setScoreText(this.scoreCalculator.getCurrentScore())
    }
}
export default GameController
