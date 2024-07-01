import GameController from '../GameController'
import IState from '../../types/state'
import Ball from '../../player/Ball'
import BasketManager from '../../basket/BasketManager'
import ScoreCalculator from '../../player/ScoreCalculator'
import CONST from '../../Const'
import ChallengeType from '../../types/level/challenge'

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
        this.game.getChallengeManager().resetCurrentLevel()
        this.camera.scrollY = 0
        this.basketManager.reset()
        this.basketManager.toggleInteractive(true)
        this.game.getObstacleManager().reset()

        let basket
        if (
            this.game.getChallengeManager().getCurrentChallenge() ==
            ChallengeType.NONE
        ) {
            basket = this.basketManager.createBasket()
        } else {
            basket = this.basketManager.createBasketByLevel()
        }
        this.game.getMenuUI().setFingerPosition(basket.x, basket.y)
        this.ball.x = basket.x
        this.ball.y = CONST.HEIGHT_SIZE / 2
        this.ball.resetBall()

        this.addScore(-this.scoreCalculator.getCurrentScore())
    }
    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.game
            .getGameUI()
            .setDataText(this.scoreCalculator.getCurrentScore().toString())
    }
}
export default RestartState
