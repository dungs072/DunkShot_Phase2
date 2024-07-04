import GameController from '../GameController'
import IState from '../../types/state'
import Ball from '../../player/Ball'
import BasketManager from '../../basket/BasketManager'
import ScoreCalculator from '../../player/ScoreCalculator'
import CONST from '../../Const'
import ChallengeType from '../../types/level/challenge'

class ResetState implements IState {
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
        console.log('reset state')
        this.resetGame()
        this.game
            .getGameMachine()
            .transitionTo(this.game.getGameMachine().getMenuState())
    }
    public update(delta: number): void {}
    public exit(): void {
        console.log('end reset state')
        if (
            this.game.getScene().scene.isActive('ScoreScene') ||
            !this.game.getScene().scene.isSleeping('ScoreScene')
        ) {
            this.game.getScene().scene.sleep('ScoreScene')
        }
    }

    private resetGame(): void {
        this.game.getChallengeManager().resetCurrentLevel()
        this.camera.scrollY = 0
        this.basketManager.reset()
        this.basketManager.toggleInteractive(true)
        this.game.getObstacleManager().reset()
        this.game.getChallengeManager().setChallengeType(ChallengeType.NONE)
        const basket = this.basketManager.createBasket()
        this.game.getMenuUI().setFingerPosition(basket.x, basket.y)
        this.ball.x = basket.x
        this.ball.y = CONST.HEIGHT_SIZE / 2
        this.ball.resetBall()
        this.addScore(-this.scoreCalculator.getCurrentScore())
    }
    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        // this.game
        //     .getGameUI()
        //     .setDataText(this.scoreCalculator.getCurrentScore().toString())
    }
}
export default ResetState
