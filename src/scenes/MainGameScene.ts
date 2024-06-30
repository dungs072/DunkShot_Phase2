import { Scene } from 'phaser'
import GameController from '../game/GameController'
import CONST from '../Const'
import ISceneData from '../types/sceneData'
import ChallengeType from '../types/level/challenge'
class MainGameScene extends Scene {
    private gameController: GameController
    constructor() {
        super({
            key: 'MainGameScene',
        })
    }
    init(data: ISceneData) {
        if (data.challengeType || data.challengeType == 0) {
            this.gameController = new GameController(this, data.challengeType)
        } else {
            this.gameController = new GameController(this, ChallengeType.NONE)
        }
    }
    preload() {
        // initialize background
        const mainGameBackground = this.add.image(0, 0, 'bg').setOrigin(0)
        mainGameBackground.setDisplaySize(CONST.WIDTH_SIZE, CONST.HEIGHT_SIZE)
        mainGameBackground.setScrollFactor(0, 0)
        const bricks = this.add.image(0, 0, 'bgbricks').setOrigin(0)
        bricks.setDisplaySize(CONST.WIDTH_SIZE, CONST.HEIGHT_SIZE)
        bricks.setScrollFactor(0, 0)

        this.gameController.initialize()
    }
    create() {
        this.events.on('shutdown', this.handleShutdown, this)
    }
    update(time: number, delta: number) {
        this.gameController.update(delta / 1000)
    }
    private handleShutdown(): void {
        this.gameController.deleteEvents()
    }
}
export default MainGameScene
