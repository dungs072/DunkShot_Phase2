import { Scene } from 'phaser'
import SelectionChallengeMenuUI from '../ui/SelectionChallengeMenuUI'
import CONST from '../Const'
class ChallengeSelectionScene extends Scene {
    constructor() {
        super({
            key: 'ChallengeSelectionScene',
        })
    }
    init() {}
    preload() {
        // initialize background
        const mainGameBackground = this.add.image(0, 0, 'bg').setOrigin(0)
        mainGameBackground.setDisplaySize(CONST.WIDTH_SIZE, CONST.HEIGHT_SIZE)
        mainGameBackground.setScrollFactor(0, 0)
        const bricks = this.add.image(0, 0, 'bgbricks').setOrigin(0)
        bricks.setDisplaySize(CONST.WIDTH_SIZE, CONST.HEIGHT_SIZE)
        bricks.setScrollFactor(0, 0)

        const selectionChallengeMenu = new SelectionChallengeMenuUI(this)
        selectionChallengeMenu.toggleUI(true)
    }
}
export default ChallengeSelectionScene
