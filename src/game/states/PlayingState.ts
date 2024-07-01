import Basket from '../../basket/Basket'
import Ball from '../../player/Ball'
import ScoreCalculator from '../../player/ScoreCalculator'
import ChallengeType from '../../types/level/challenge'
import IState from '../../types/state'
import GameController from '../GameController'

class PlayingState implements IState {
    private game: GameController
    private ball: Ball
    private camera: Phaser.Cameras.Scene2D.Camera
    private scoreCalculator: ScoreCalculator
    private preBallPosY: number

    constructor(game: GameController) {
        this.game = game
        this.ball = game.getBall()
        this.camera = game.getMainCamera()
        this.scoreCalculator = game.getScoreCalculator()
        Basket.eventEmitter.on('balladded', (amount: number) => {
            const challengeType = this.game
                .getChallengeManager()
                .getCurrentChallengeType()
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
            this.game.getChallengeManager().getCurrentChallengeType() ==
            ChallengeType.TIME
        ) {
            this.game.currentTime += delta
            const remainingTime = Phaser.Math.RoundTo(
                Math.max(
                    // this.game.getChallengeManager().getDataGame() -
                    this.game.currentTime,
                    0
                ),
                -1
            )
            this.game.getGameUI().setDataText(remainingTime.toString() + ' s')
            if (
                this.game.currentTime >= 5000000000000000
                // this.game.getChallengeManager().getDataGame()
            ) {
                this.game.currentTime = 0
                this.game
                    .getGameMachine()
                    .transitionTo(this.game.getGameMachine().getOverState())
            }
        }
    }
    public exit(): void {
        console.log('end Playing state')
        this.scoreCalculator.saveHighScore()
        this.game.getGameUI().setVisible(false)
    }

    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.game
            .getGameUI()
            .setDataText(this.scoreCalculator.getCurrentScore().toString())
    }
}
export default PlayingState
