import CONST from '../../Const'
import Basket from '../../basket/Basket'
import BasketManager from '../../basket/BasketManager'
import Ball from '../../player/Ball'
import ScoreCalculator from '../../player/ScoreCalculator'
import ChallengeType from '../../types/level/challenge'
import IState from '../../types/state'
import GameController from '../GameController'
import ResumeState from './ResumeState'

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
            // const challengeType = this.game
            //     .getChallengeManager()
            //     .getCurrentChallengeType()
            // if (
            //     challengeType == ChallengeType.SCORE ||
            //     challengeType == ChallengeType.NO_AIM ||
            //     challengeType == ChallengeType.NONE
            // )

            this.addScore(amount)
        })
        BasketManager.BasketCollided.on('basketcollided', () => {
            this.game.countHoop++
            this.updateHoopsText(this.game.countHoop.toString())
        })
    }
    public enter(): void {
        console.log('start Playing state')
        this.game.getGameUI().toggleUI(true)
        if (
            this.game.getChallengeManager().getCurrentChallengeType() !=
                ChallengeType.NONE &&
            !(this.game.getGameMachine().getPreState() instanceof ResumeState)
        ) {
            this.game.getMainCamera().scrollY = -CONST.HEIGHT_SIZE / 1.5
        }
        this.game
            .getGameUI()
            .toggleChallengePanel(
                this.game.getChallengeManager().getCurrentChallengeType() !=
                    ChallengeType.NONE
            )
        this.setTime()
        this.setUpLevel()
    }
    private setUpLevel(): void {
        if (
            this.game.getChallengeManager().getCurrentChallengeType() ==
            ChallengeType.NO_AIM
        ) {
            this.game.getGameUI().setConditionText('NO AIM')
        }
        const levelManager = this.game
            .getChallengeManager()
            .getCurrentLevelManager()
        this.game
            .getGameUI()
            .setChallengeText(
                'CHALLENGE ' + levelManager?.getCountLevel().toString()
            )
        this.updateHoopsText(this.game.countHoop.toString())
    }
    private updateHoopsText(countStr: string): void {
        const levelManager = this.game
            .getChallengeManager()
            .getCurrentLevelManager()
        this.game
            .getGameUI()
            .setMaxHoopsText(
                countStr +
                    '/' +
                    levelManager?.getCurrentLevel().getMaxHoops().toString() +
                    ' HOOPS'
            )
    }

    public update(delta: number) {
        this.game.getBall().update(delta)
        this.game.getBasketManager().update(delta)
        this.game.getObstacleManager().update(delta)
        const maxDownBorder =
            this.camera.scrollY + this.camera.height - 200 * devicePixelRatio
        const maxUpBorder =
            this.camera.scrollY + this.camera.height / 2 + 50 * devicePixelRatio

        if (!this.ball.parentContainer) {
            if (this.ball.y > this.camera.scrollY + this.camera.height + 100) {
                this.game
                    .getGameMachine()
                    .transitionTo(this.game.getGameMachine().getOverState())
            } else {
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
            // if (this.ball.y < maxUpBorder) {
            //     this.camera.scrollY -= 200 * delta
            // }
        }
        if (
            this.game.getChallengeManager().getCurrentChallengeType() ==
            ChallengeType.TIME
        ) {
            if (!this.game.getBasketManager().isFirstBasket()) return
            this.game.currentTime += delta
            const value = this.game
                .getChallengeManager()
                .getCurrentLevelManager()
                ?.getCurrentLevelData()
            if (!value) return
            const remainingTime = Phaser.Math.RoundTo(
                Math.max(value - this.game.currentTime, 0),
                -1
            )
            let afterDotNum = (remainingTime - Math.floor(remainingTime))
                .toString()
                .substring(2, 4)
            if (afterDotNum.length == 0) {
                afterDotNum = '00'
            }
            if (afterDotNum.length == 1) {
                afterDotNum += '0'
            }

            this.game
                .getGameUI()
                .setConditionText(
                    Math.floor(remainingTime).toString() +
                        ':' +
                        afterDotNum.toString()
                )
            if (
                this.game.currentTime >= value
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
        this.game.getGameUI().toggleUI(false)
    }

    private addScore(amount: number): void {
        this.scoreCalculator.addCurrentScore(amount)
        this.game
            .getGameUI()
            .setDataText(this.scoreCalculator.getCurrentScore().toString())
    }
    private setTime(): void {
        if (
            this.game.getChallengeManager().getCurrentChallengeType() ==
            ChallengeType.TIME
        ) {
            const value = this.game
                .getChallengeManager()
                .getCurrentLevelManager()
                ?.getCurrentLevelData()
            if (!value) return
            this.game
                .getGameUI()
                .setConditionText(value.toString() + ':' + '00')
            this.game.currentTime == 0
        }
    }
}
export default PlayingState
