import { Scene } from 'phaser'
import SelectionChallengeMenuUI from '../ui/SelectionChallengeMenuUI'
import CONST from '../const'
class ChallengeSelectionScene extends Scene {
    constructor() {
        super({
            key: 'ChallengeSelectionScene',
        })
    }
    create() {
        this.add.image(0, 0, 'bg').setOrigin(0)
        const bricks = this.add.image(0, 0, 'bgbricks').setOrigin(0)
        bricks.setDisplaySize(CONST.WIDTH_SIZE, CONST.HEIGHT_SIZE)

        const selectionChallengeMenu = new SelectionChallengeMenuUI(this)
        selectionChallengeMenu.toggleUI(true)
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
}
export default ChallengeSelectionScene
