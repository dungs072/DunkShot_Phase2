import GameController from '../GameController'
import IState from '../../types/state'
import Ball from '../../player/Ball'
import BasketManager from '../../basket/BasketManager'
import ScoreCalculator from '../../player/ScoreCalculator'

class RestartState implements IState {
    private game: GameController
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera
    private scoreCalculator: ScoreCalculator
    constructor(game: GameController) {
        this.game = game
        this.ball = game.getBall()
        this.basketManager = game.getBasketManager()
        this.camera = game.getMainCamera()
        this.scoreCalculator = game.getScoreCalculator()
    }
    public enter(): void {
        console.log('restart state')
        this.restartGame()
        this.game
            .getGameMachine()
            .transitionTo(this.game.getGameMachine().getPlayingState())
    }
    public update(delta: number): void {}
    public exit(): void {
        console.log('end restart state')
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
        // this.game
        //     .getMenuUI()
        //     .setFingerPosition(this.ball.x - 100, this.ball.y + 200)
        this.game.getOverUI().toggleUI(false)
        this.addScore(-this.scoreCalculator.getCurrentScore())
    }
    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.game
            .getGameUI()
            .setScoreText(this.scoreCalculator.getCurrentScore())
    }
}
export default RestartState
