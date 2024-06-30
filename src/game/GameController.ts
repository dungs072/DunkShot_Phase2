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
import ChallengeType from '../types/challenge'

class GameController {
    private ball: Ball
    private basketManager: BasketManager
    private obstacleManager: ObstacleManager
    private camera: Phaser.Cameras.Scene2D.Camera

    private menu: MainMenuUI
    private overGameUI: OverGameUI
    private gameUI: MainGameUI
    private scoreCalculator: ScoreCalculator

    private gameStateMachine: GameStateMachine

    private levelManager: LevelManager

    private scene: Scene
    constructor(scene: Scene) {
        this.scene = scene
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
    public getScoreCalculator(): ScoreCalculator {
        return this.scoreCalculator
    }

    public initialize(): void {
        this.basketManager = new BasketManager(
            this.scene,
            CONST.WIDTH_SIZE,
            CONST.HEIGHT_SIZE
        )

        this.scoreCalculator = new ScoreCalculator()
        this.levelManager = new LevelManager(this.scene, ChallengeType.TIME)
        this.create()
    }
    private create(): void {
        new TrajectoryPath(this.scene, 10)
        this.menu = new MainMenuUI(this.scene, 0, 0)
        this.gameUI = new MainGameUI(this.scene, 0, 0)
        this.overGameUI = new OverGameUI(this.scene, 0, 0)
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
        this.obstacleManager = new ObstacleManager(this.scene, this.ball)
        this.camera = this.scene.cameras.main
        this.basketManager.setBall(this.ball)
        const basket = this.basketManager.createBasket()
        this.ball.x = basket.x

        this.menu.setFingerPosition(basket.x, basket.y)

        this.setUpEvents()

        this.gameStateMachine = new GameStateMachine(this)
        this.gameStateMachine.initialize(this.gameStateMachine.getMenuState())
    }
    private setUpEvents(): void {
        this.overGameUI.addHitPlayAgainListener(() => {
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
    }

    update(delta: number): void {
        this.gameStateMachine.update(delta)
        this.obstacleManager.update(delta)
    }
}
export default GameController
