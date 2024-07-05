import { Scene } from 'phaser'
import Ball from '../player/Ball'
import BasketManager from '../basket/BasketManager'
import MainMenuUI from '../ui/MainMenuUI'
import OverGameUI from '../ui/OverGameUI'
import MainGameUI from '../ui/MainGameUI'
import ScoreCalculator from '../player/ScoreCalculator'
import TrajectoryPath from '../trajectory/TrajectoryPath'
import GameStateMachine from './GameStateMachine'
import CONST from '../const/const'
import ObstacleManager from '../obstacle/ObstacleManager'
import LevelManager from '../challenge/LevelManager'
import ChallengeType from '../types/level/challenge'
import NextLevelUI from '../ui/NextLevelUI'
import Basket from '../basket/Basket'
import PauseUI from '../ui/PauseUI'
import ChallengeManager from '../challenge/ChallengeManager'
import UIScene from '../scenes/UIScene'

class GameController {
    private ball: Ball
    private basketManager: BasketManager
    private obstacleManager: ObstacleManager
    private camera: Phaser.Cameras.Scene2D.Camera

    private scoreCalculator: ScoreCalculator

    private gameStateMachine: GameStateMachine

    private challengeManager: ChallengeManager

    private trajectory: TrajectoryPath

    private scene: Scene
    private uiScene: UIScene
    private challengeType: ChallengeType

    public currentTime: number = 0
    public countHoop: number = 0
    constructor(scene: Scene, uiScene: UIScene, challengeType: ChallengeType) {
        this.scene = scene
        this.uiScene = uiScene
        this.challengeType = challengeType
    }
    public getScene(): Scene {
        return this.scene
    }
    public getGameMachine(): GameStateMachine {
        return this.gameStateMachine
    }
    public getBall(): Ball {
        return this.ball
    }
    public getBasketManager(): BasketManager {
        return this.basketManager
    }
    public getObstacleManager(): ObstacleManager {
        return this.obstacleManager
    }
    public getMainCamera(): Phaser.Cameras.Scene2D.Camera {
        return this.camera
    }
    public getMenuUI(): MainMenuUI {
        return this.uiScene.getMenuUI()
    }
    public getOverUI(): OverGameUI {
        return this.uiScene.getOverUI()
    }
    public getGameUI(): MainGameUI {
        return this.uiScene.getGameUI()
    }
    public getNextLevelUI(): NextLevelUI {
        return this.uiScene.getNextLevelUI()
    }
    public getPauseUI(): PauseUI {
        return this.uiScene.getPauseUI()
    }
    public getScoreCalculator(): ScoreCalculator {
        return this.scoreCalculator
    }
    public getChallengeManager(): ChallengeManager {
        return this.challengeManager
    }

    public initialize(): void {
        if (!this.challengeManager) {
            this.challengeManager = new ChallengeManager(this.scene)
            this.challengeManager.setChallengeType(this.challengeType)
        }

        this.basketManager = new BasketManager(
            this.scene,
            CONST.WIDTH_SIZE,
            CONST.HEIGHT_SIZE,
            this.challengeManager
        )

        this.scoreCalculator = new ScoreCalculator()

        this.create()
    }
    private create(): void {
        this.trajectory = new TrajectoryPath(this.scene, 10)

        this.scene.physics.world.setBounds(
            0,
            0,
            CONST.WIDTH_SIZE,
            0,
            true,
            true,
            false,
            false
        )

        this.ball = new Ball({
            scene: this.scene,
            x: CONST.WIDTH_SIZE / 3,
            y: CONST.HEIGHT_SIZE / 2,
            texture: 'basketball',
        })
        this.obstacleManager = new ObstacleManager(
            this.scene,
            this.ball,
            this.challengeManager
        )
        this.camera = this.scene.cameras.main
        this.basketManager.setBall(this.ball)
        let basket
        if (
            this.challengeManager.getCurrentChallengeType() ==
            ChallengeType.NONE
        ) {
            basket = this.basketManager.createBasket()
        } else {
            basket = this.basketManager.createBasketByLevel()
        }

        this.ball.x = basket.x
        this.ball.y = basket.y - 100 * devicePixelRatio
        this.getMenuUI().setFingerPosition(basket.x, basket.y)

        this.setUpEvents()

        this.gameStateMachine = new GameStateMachine(this)
        this.gameStateMachine.initialize(this.gameStateMachine.getMenuState())
        if (this.challengeType != ChallengeType.NONE) {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getPlayingState()
            )
        }
    }
    private setUpEvents(): void {
        this.getMenuUI().addHitChallengeButton(() => {
            this.obstacleManager.clear()
        })
        this.getOverUI().addHitPlayAgainListener(() => {
            this.trajectory.togglePoints(false)
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getRestartState()
            )
        })

        this.getGameUI().addHitPauseListener(() => {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getPauseState()
            )
        })

        this.getPauseUI().addBackMenuListener(() => {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getResetState()
            )
        })
        this.getPauseUI().addResumeListenerListener(() => {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getResumeState()
            )
        })
        this.getPauseUI().addRestartListener(() => {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getRestartState()
            )
        })
        this.getNextLevelUI().addBackMenuListener(() => {
            this.challengeManager.setChallengeType(ChallengeType.NONE)
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getResetState()
            )
        })
        this.getNextLevelUI().addNextLevelListener(() => {
            this.challengeManager.gotoNextLevel()
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getRestartState()
            )
        })
        this.scene.input.on('pointerdown', () => {
            if (
                this.getMenuUI().getStateMenu() &&
                !this.getMenuUI().getIsButtonClick()
            ) {
                this.gameStateMachine.transitionTo(
                    this.gameStateMachine.getPlayingState()
                )
            }
        })

        LevelManager.LevelFinished.on('nextlevel', () => {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getNextLevelState()
            )
        })
        BasketManager.BasketCollided.on('basketcollided', () => {
            this.obstacleManager.createObstacleByLevel()
        })
    }

    public deleteEvents(): void {
        BasketManager.BasketCollided.destroy()
        LevelManager.LevelFinished.destroy()
        Basket.eventEmitter.destroy()
    }
    public toggleForceDownTrajectory(state: boolean) {
        this.trajectory.setForceDown(state)
    }

    update(delta: number): void {
        this.gameStateMachine.update(delta)
    }
}
export default GameController
