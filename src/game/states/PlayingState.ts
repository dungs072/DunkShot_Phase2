import Basket from '../../basket/Basket'
import BasketManager from '../../basket/BasketManager'
import Ball from '../../player/Ball'
import ScoreCalculator from '../../player/ScoreCalculator'
import IState from '../../types/state'
import GameController from '../GameController'

class PlayingState implements IState {
    private game: GameController
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera
    private scoreCalculator: ScoreCalculator
    private preBallPosY: number
    constructor(game: GameController) {
        this.game = game
        this.ball = game.getBall()
        this.basketManager = game.getBasketManager()
        this.camera = game.getMainCamera()
        this.scoreCalculator = game.getScoreCalculator()
        Basket.eventEmitter.on('balladded', (amount: number) => {
            this.addScore(amount)
        })
    }
    public enter(): void {
        console.log('start Playing state')
        this.game.getGameUI().setVisible(true)
    }

    public update(delta: number) {
        this.game.getBall().update()
        this.game.getBasketManager().update(delta)
        const maxDownBorder = this.camera.scrollY + this.camera.height - 150
        if (!this.ball.parentContainer) {
            if (this.ball.y > this.camera.scrollY + this.camera.height + 100) {
                this.game
                    .getGameMachine()
                    .transitionTo(this.game.getGameMachine().getOverState())
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
    public exit(): void {
        console.log('end Playing state')
        this.ball.toggleBall(false)
        this.basketManager.toggleInteractive(false)
        this.scoreCalculator.saveHighScore()
    }

    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.game
            .getGameUI()
            .setScoreText(this.scoreCalculator.getCurrentScore())
    }
}
export default PlayingState
