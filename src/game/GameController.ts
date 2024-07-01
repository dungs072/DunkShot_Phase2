import { Scene } from 'phaser'
import Ball from '../player/Ball'
import BasketManager from '../basket/BasketManager'
import MainMenuUI from '../ui/MainMenuUI'
import OverGameUI from '../ui/OverGameUI'
import MainGameUI from '../ui/MainGameUI'
import ScoreCalculator from '../player/ScoreCalculator'
import TrajectoryPath from '../trajectory/TrajectoryPath'
import GameStateMachine from './GameStateMachine'
import CONST from '../Const'
import ObstacleManager from '../obstacle/ObstacleManager'
import LevelManager from '../level/LevelManager'
import ChallengeType from '../types/level/challenge'
import NextLevelUI from '../ui/NextLevelUI'
import Basket from '../basket/Basket'
import PauseUI from '../ui/PauseUI'

class GameController {
    private ball: Ball
    private basketManager: BasketManager
    private obstacleManager: ObstacleManager
    private camera: Phaser.Cameras.Scene2D.Camera

    private menu: MainMenuUI
    private overGameUI: OverGameUI
    private gameUI: MainGameUI
    private nextLevelUI: NextLevelUI
    private pauseUI: PauseUI
    private scoreCalculator: ScoreCalculator

    private gameStateMachine: GameStateMachine

    private levelManager: LevelManager

    private trajectory: TrajectoryPath

    private scene: Scene
    private challengeType: ChallengeType
    constructor(scene: Scene, challengeType: ChallengeType) {
        this.scene = scene
        this.challengeType = challengeType
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
        return this.menu
    }
    public getOverUI(): OverGameUI {
        return this.overGameUI
    }
    public getGameUI(): MainGameUI {
        return this.gameUI
    }
    public getNextLevelUI(): NextLevelUI {
        return this.nextLevelUI
    }
    public getPauseUI(): PauseUI {
        return this.pauseUI
    }
    public getScoreCalculator(): ScoreCalculator {
        return this.scoreCalculator
    }
    public getLevelManager(): LevelManager {
        return this.levelManager
    }

    public initialize(): void {
        this.levelManager = new LevelManager(this.scene, this.challengeType)
        this.basketManager = new BasketManager(
            this.scene,
            CONST.WIDTH_SIZE,
            CONST.HEIGHT_SIZE,
            this.levelManager
        )

        this.scoreCalculator = new ScoreCalculator()

        this.create()
    }
    private create(): void {
        this.trajectory = new TrajectoryPath(this.scene, 20)
        this.menu = new MainMenuUI(this.scene, 0, 0)
        this.gameUI = new MainGameUI(this.scene, 0, 0)
        this.overGameUI = new OverGameUI(this.scene, 0, 0)
        this.pauseUI = new PauseUI(this.scene)
        this.nextLevelUI = new NextLevelUI(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            CONST.HEIGHT_SIZE / 2
        )
        this.gameUI.setVisible(false)
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
            this.levelManager
        )
        this.camera = this.scene.cameras.main
        this.basketManager.setBall(this.ball)
        let basket
        if (this.levelManager.getCurrentChallenge() == ChallengeType.NONE) {
            basket = this.basketManager.createBasket()
        } else {
            basket = this.basketManager.createBasketByLevel()
        }

        this.ball.x = basket.x

        this.menu.setFingerPosition(basket.x, basket.y)

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
        this.menu.addHitChallengeButton(() => {
            this.obstacleManager.clear()
        })
        this.overGameUI.addHitPlayAgainListener(() => {
            this.trajectory.togglePoints(false)
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getRestartState()
            )
        })

        this.gameUI.addHitPauseListener(() => {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getPauseState()
            )
        })

        this.pauseUI.addBackMenuListener(() => {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getResetState()
            )
        })
        this.pauseUI.addResumeListenerListener(() => {
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getResumeState()
            )
        })
        this.nextLevelUI.addBackMenuListener(() => {
            this.levelManager.setChallengeType(ChallengeType.NONE)
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getResetState()
            )
        })
        this.nextLevelUI.addNextLevelListener(() => {
            this.levelManager.gotoNextLevel()
            this.gameStateMachine.transitionTo(
                this.gameStateMachine.getRestartState()
            )
        })
        this.scene.input.on('pointerdown', () => {
            if (this.menu.getStateMenu() && !this.menu.getIsButtonClick()) {
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

    update(delta: number): void {
        this.gameStateMachine.update(delta)
    }
}
export default GameController
