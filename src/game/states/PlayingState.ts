import Basket from '../../basket/Basket'
import BasketManager from '../../basket/BasketManager'
import Ball from '../../player/Ball'
import ScoreCalculator from '../../player/ScoreCalculator'
import ChallengeType from '../../types/level/challenge'
import IState from '../../types/state'
import GameController from '../GameController'

class PlayingState implements IState {
    private game: GameController
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera
    private scoreCalculator: ScoreCalculator
    private preBallPosY: number
    private currentTime: number = 0
    constructor(game: GameController) {
        this.game = game
        this.ball = game.getBall()
        this.basketManager = game.getBasketManager()
        this.camera = game.getMainCamera()
        this.scoreCalculator = game.getScoreCalculator()
        Basket.eventEmitter.on('balladded', (amount: number) => {
            const challengeType = this.game
                .getLevelManager()
                .getCurrentChallenge()
            if (
                challengeType == ChallengeType.SCORE ||
                challengeType == ChallengeType.NONE
            )
                this.addScore(amount)
        })
    }
    public enter(): void {
        console.log('start Playing state')
        this.game.getGameUI().setVisible(true)
        this.basketManager.toggleInteractive(true)
    }

    public update(delta: number) {
        this.game.getBall().update(delta)
        this.game.getBasketManager().update(delta)
        this.game.getObstacleManager().update(delta)
        const maxDownBorder =
            this.camera.scrollY + this.camera.height - 200 * devicePixelRatio
        if (!this.ball.parentContainer) {
            if (this.ball.y > this.camera.scrollY + this.camera.height + 100) {
                this.game
                    .getGameMachine()
                    .transitionTo(this.game.getGameMachine().getOverState())
            } else {
                const maxUpBorder =
                    this.camera.scrollY +
                    this.camera.height / 2 +
                    50 * devicePixelRatio

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
        if (
            this.game.getLevelManager().getCurrentChallenge() ==
            ChallengeType.TIME
        ) {
            this.currentTime += delta
            const remainingTime =
                Math.floor(
                    Math.max(
                        this.game.getLevelManager().getDataGame() -
                            this.currentTime,
                        0
                    ) * 100
                ) / 100
            this.game.getGameUI().setDataText(remainingTime)
            if (this.currentTime >= this.game.getLevelManager().getDataGame()) {
                this.currentTime = 0
                this.game
                    .getGameMachine()
                    .transitionTo(this.game.getGameMachine().getOverState())
            }
        }
    }
    public exit(): void {
        console.log('end Playing state')
        this.currentTime = 0
        this.ball.toggleBall(false)
        this.basketManager.toggleInteractive(false)
        this.scoreCalculator.saveHighScore()
        this.game.getGameUI().setVisible(false)
    }

    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.game
            .getGameUI()
            .setDataText(this.scoreCalculator.getCurrentScore())
    }
}
export default PlayingState
