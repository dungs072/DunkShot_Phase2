import { Scene } from 'phaser'
import Ball from '../player/Ball'
import BasketManager from '../basket/BasketManager'
import MainMenuUI from '../ui/MainMenuUI'
import OverGameUI from '../ui/OverGameUI'
import MainGameUI from '../ui/MainGameUI'
import ScoreCalculator from '../player/ScoreCalculator'
import TrajectoryPath from '../trajectory/TrajectoryPath'
import Basket from '../basket/Basket'
import GameStateMachine from './GameStateMachine'

class GameController {
    private ball: Ball
    private basketManager: BasketManager
    private camera: Phaser.Cameras.Scene2D.Camera

    private menu: MainMenuUI
    private overGameUI: OverGameUI
    private gameUI: MainGameUI
    private scoreCalculator: ScoreCalculator

    private gameStateMachine: GameStateMachine

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
            window.innerWidth / 2,
            window.innerHeight
        )
        this.scoreCalculator = new ScoreCalculator()
        this.create()
    }
    private create(): void {
        new TrajectoryPath(this.scene, 20)
        this.menu = new MainMenuUI(this.scene, 0, 0)
        this.gameUI = new MainGameUI(this.scene, 0, 0)
        this.overGameUI = new OverGameUI(this.scene, 0, 0)
        this.gameUI.setVisible(false)
        this.scene.physics.world.setBounds(
            0,
            0,
            window.innerWidth / 2,
            0,
            true,
            true,
            false,
            false
        )

        this.ball = new Ball({
            scene: this.scene,
            x: 200,
            y: 250,
            texture: 'basketball',
        })
        this.camera = this.scene.cameras.main
        this.basketManager.setBall(this.ball)
        const basket = this.basketManager.createBasket()
        this.ball.x = basket.x

        this.menu.setFingerPosition(this.ball.x - 100, this.ball.y + 200)

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
            if (this.menu.getStateMenu()) {
                this.gameStateMachine.transitionTo(
                    this.gameStateMachine.getPlayingState()
                )
            }
        })
    }

    update(delta: number): void {
        this.gameStateMachine.update(delta)
    }
}
export default GameController
