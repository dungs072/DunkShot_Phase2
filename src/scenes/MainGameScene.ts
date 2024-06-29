import { Scene } from 'phaser'
import GameController from '../game/GameController'
import CONST from '../Const'
class MainGameScene extends Scene {
    private gameController: GameController
    constructor() {
        super({
            key: 'MainGameScene',
        })
    }
    init() {
        this.gameController = new GameController(this)
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
    update(time: number, delta: number) {
        this.gameController.update(delta / 1000)
    }
}
export default MainGameScene
