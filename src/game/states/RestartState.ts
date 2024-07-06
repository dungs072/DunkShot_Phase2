import GameController from '../GameController'
import IState from '../../types/state'
import Ball from '../../player/Ball'
import BasketManager from '../../basket/BasketManager'
import ScoreCalculator from '../../player/ScoreCalculator'
import ChallengeType from '../../types/level/challenge'
import NextLevelState from './NextLevelState'
import ScoreScene from '../../scenes/ScoreScene'

class RestartState implements IState {
    private game: GameController
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera
    private scoreCalculator: ScoreCalculator
    private scoreScene: ScoreScene
    constructor(game: GameController) {
        this.game = game
        this.ball = game.getBall()
        this.basketManager = game.getBasketManager()
        this.camera = game.getMainCamera()
        this.scoreCalculator = game.getScoreCalculator()
    }
    public enter(): void {
        console.log('restart state')
        this.scoreScene = this.game
            .getScene()
            .scene.get('ScoreScene') as ScoreScene
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
        //this.game.getChallengeManager().resetCurrentLevel()
        this.camera.scrollY = 0
        this.game.currentTime = 0
        this.game.countHoop = 0
        this.basketManager.reset()
        this.game.setCanDrag(true)
        this.game.getObstacleManager().reset()
        this.game.getChallengeManager().resetCurrentLevel()
        let basket
        if (
            this.game.getChallengeManager().getCurrentChallengeType() ==
            ChallengeType.NONE
        ) {
            basket = this.basketManager.createBasket()
        } else {
            basket = this.basketManager.createBasketByLevel()
        }
        this.game.getMenuUI().setFingerPosition(basket.x, basket.y)
        this.ball.x = basket.x
        this.ball.y = basket.y - 75 * devicePixelRatio
        this.ball.resetBall()

        if (this.game.getGameMachine().getPreState() instanceof NextLevelState)
            return
        this.addScore(-this.scoreCalculator.getCurrentScore())
    }
    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.scoreScene.setScoreText(
            this.scoreCalculator.getCurrentScore().toString()
        )
    }
}
export default RestartState
