import { Scene } from 'phaser'
import GameController from '../game/GameController'
import ISceneData from '../types/sceneData'
import ChallengeType from '../types/level/challenge'
import UIScene from './UIScene'
class MainGameScene extends Scene {
    private gameController: GameController
    private uiScene: UIScene
    public deltaTime: number
    constructor() {
        super({
            key: 'MainGameScene',
        })
    }
    init(data: ISceneData) {
        this.uiScene = this.game.scene.getScene('UIScene') as UIScene
        if (data.challengeType || data.challengeType == 0) {
            this.gameController = new GameController(
                this,
                this.uiScene,
                data.challengeType
            )
        } else {
            this.gameController = new GameController(
                this,
                this.uiScene,
                ChallengeType.NONE
            )
        }
    }
    preload() {
        this.gameController.initialize()
    }
    create() {
        this.events.on('shutdown', this.handleShutdown, this)
        this.resize()
        window.addEventListener('resize', () => {
            this.resize()
        })
    }
    private resize(): void {
        const worldHeight = 846
        const worldWidth = (worldHeight / 846) * 475.875

        let width = window.innerWidth
        let height = window.innerHeight

        const ratio = 475.875 / 846
        if (width / ratio > window.innerHeight) {
            width = height * ratio
        } else {
            height = width / ratio
        }

        this.game.scale.resize(width, height)

        this.game.scene.getScenes().forEach((scene) => {
            scene.cameras.main.setZoom(width / worldWidth)
            scene.cameras.main.centerOn(worldWidth / 2, worldHeight / 2)
        })
        this.cameras.main.setZoom(width / worldWidth)
        this.cameras.main.centerOn(worldWidth / 2, worldHeight / 2)
    }

    update(time: number, delta: number) {
        this.gameController.update(delta / 1000)
        this.deltaTime = delta / 1000
    }
    private handleShutdown(): void {
        this.gameController.deleteEvents()
    }
}

export default MainGameScene
